import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getTournamentRankings = catchAsync(async(request: NextRequest, context: RouteContext<"/api/v1/tournaments/[tournament_id]">) => {
    await protect(request);

    const {tournament_id} = await context.params;
    
    if(!tournament_id)
        throw new AppError("Please provide tournament id to get rankings.", 400);

    const rankings = (await pool.query(
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
        ) AS tournament_rankings;
        `, [tournament_id]
    )).rows[0];

    return NextResponse.json(
        {
            status: 'success',
            data: {
                rankings
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getTournamentRankings;