import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllBuyablePlayers = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const page = request.nextUrl.searchParams.get("page") ?? 1;
    const position = request.nextUrl.searchParams.get("position");

    if(position && !['GOALKEEPER', 'DEFENDER', 'ATTACKER', 'MIDFIELDER'].includes(position))
        throw new AppError("Invalid position.", 400);

    let players = [];

    if(!position)
        players = (await pool.query(`
            SELECT 
            (
                SELECT json_agg(c) FROM (SELECT club_id, money_left FROM club WHERE manager_id = $2) c
            ) AS club_data,
            (
                SELECT COUNT(*) FROM player WHERE club_id IS NULL OR contract_end_date < NOW()
            ) AS total_players,
            (
                SELECT json_agg(p) FROM (SELECT player_id, name, age, position, rating, price FROM player WHERE club_id IS NULL OR contract_end_date < NOW() LIMIT 10 OFFSET $1) p
            ) AS players;
        `, [(+page - 1) * 10, user.id])).rows[0];
    else
        players = (await pool.query(`
            SELECT 
            (
                SELECT json_agg(c) FROM (SELECT club_id, money_left FROM club WHERE manager_id = $3) c
            ) AS club_data,
            (
                SELECT COUNT(*) FROM player WHERE (club_id IS NULL OR contract_end_date < NOW()) AND position = $1 
            ) AS total_players,
            (
                SELECT json_agg(p) FROM (SELECT player_id, name, age, position, rating, price FROM player WHERE (club_id IS NULL OR contract_end_date < NOW()) AND position = $1 LIMIT 10 OFFSET $2) p
            ) AS players;
        `, [position, (+page - 1) * 10, user.id])).rows[0];

        players.total_players = +players.total_players;
        players.players = players.players ?? [];
        players = {...players, ...Object.assign({}, ...players.club_data)};
        delete players["club_data"];

    return NextResponse.json(
        {
            status: 'success',
            data: {
                ...players
            }
        },
        { status: 200 }
    );
});

export const GET = getAllBuyablePlayers;