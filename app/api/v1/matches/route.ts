import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getMatches = catchAsync(async(request: NextRequest) => {
    await protect(request);
    const status = request.nextUrl.searchParams.get("status") ?? 3;
    const page = request.nextUrl.searchParams.get("page") ?? 1;

    if(![0, 1, 2, 3].includes(+status))
        throw new AppError("Invalid status.", 400);

    const para = +status !== 3 ? [(+page - 1) * 5, +status] : [(+page - 1) * 5];

    let matches = [];

    if(+status > 1)
        matches = (await pool.query(`SELECT g.game_id, g.game_name, g.club1_id, g.club2_id, g.game_date, g.winning_price, g.has_game_started, g.goals_club_1, g.goals_club_2, t.name AS tournament_name, c1.name AS club1_name, c2.name AS club2_name FROM (SELECT * FROM game ${status !== 3 ? 'WHERE has_game_started = $2' : ''} ORDER BY game_date) g LEFT JOIN tournament t ON g.tournament_id = t.tournament_id JOIN club c1 ON c1.club_id = g.club1_id JOIN club c2 ON c2.club_id = g.club2_id LIMIT 10 OFFSET $1;`, para)).rows; 
    else
        matches = (await pool.query(`SELECT g.game_id, g.game_name, g.club1_id, g.club2_id, g.game_date, g.winning_price, g.has_game_started, g.goals_club_1, g.goals_club_2, t.name AS tournament_name, c1.name AS club1_name, c2.name AS club2_name FROM (SELECT * FROM game WHERE has_game_started = $1 ORDER BY game_date) g LEFT JOIN tournament t ON g.tournament_id = t.tournament_id JOIN club c1 ON c1.club_id = g.club1_id JOIN club c2 ON c2.club_id = g.club2_id;`, [+status])).rows;  

    return NextResponse.json(
        {status: 'success', data: {matches}},
        {status: 200}
    );
});

export const GET = getMatches;