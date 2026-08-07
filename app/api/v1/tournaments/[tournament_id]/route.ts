import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getTournamentDetails = catchAsync(async(request: NextRequest, context: RouteContext<"/api/v1/tournaments/[tournament_id]">) => {
    await protect(request);

    const {tournament_id} = await context.params;
    
    if(!tournament_id)
        throw new AppError("Please provide tournament id to get details.", 400);

    const details = (await pool.query(
        `
        SELECT 
        (
            SELECT json_agg(t)
            FROM tournament t where t.tournament_id = $1 
        ) AS tournament_details,
        (
            SELECT json_agg(
                json_build_object(
                    'club_id', c.club_id,
                    'club_name', c.name,
                    'tournament_rank', t.ranking
                )
                ORDER BY t.ranking
            )
            FROM club c JOIN 
            (SELECT * FROM tournament_rankings WHERE tournament_id = $1) t 
            ON t.club_id = c.club_id
        ) AS tournament_rankings,
        (
            SELECT json_agg(
                json_build_object(
                    'game_id', g.game_id,
                    'game_name', g.game_name,
                    'club1_name', c1.name,
                    'club2_name', c2.name,
                    'goals_club1', g.goals_club_1,
                    'goals_club2', g.goals_club_2,
                    'game_date', g.game_date
                )
            ) 
            FROM (SELECT * FROM game WHERE tournament_id = $1 ORDER BY game_date) g 
            JOIN club c1 ON c1.club_id = g.club1_id
            JOIN club c2 ON c2.club_id = g.club2_id
        ) AS tournament_matches
        `, [tournament_id]
    )).rows[0];

    details.tournament_rankings = details.tournament_rankings ?? [];
    details.tournament_matches = details.tournament_matches ?? [];
    details.tournament_details = Object.assign({}, ...details.tournament_details);

    return NextResponse.json(
        {
            status: 'success',
            data: {
                details
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getTournamentDetails;