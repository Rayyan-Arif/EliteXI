import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllLiveTournaments = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const tournaments = (await pool.query(`
        SELECT t.tournament_id, t.name, t.no_of_teams FROM tournament t WHERE EXISTS 
        (
            SELECT g.tournament_id FROM game g WHERE g.tournament_id = t.tournament_id AND g.game_date >= NOW()
        ) OR NOT EXISTS 
        (
            SELECT g.tournament_id FROM game g WHERE g.tournament_id = t.tournament_id
        );    
    `)).rows;

    return NextResponse.json(
        {
            status: 'success',
            data: {
                tournaments
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getAllLiveTournaments;