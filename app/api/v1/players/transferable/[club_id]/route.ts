import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getTransferablePlayers = catchAsync(async(request: NextRequest, context: RouteContext<"/api/v1/players/transferable/[club_id]">) => {
    await protect(request);

    const {club_id} = await context.params;

    if(!club_id)
        throw new AppError("Please provide a club_id.", 400);

    const page = request.nextUrl.searchParams.get("page") ?? 1;
    const position = request.nextUrl.searchParams.get("position");

    if(position && !['GOALKEEPER', 'DEFENDER', 'ATTACKER', 'MIDFIELDER'].includes(position))
        throw new AppError("Invalid position.", 400);

    let players = [];

    if(position)
        players = (await pool.query(`
            SELECT
            (
                SELECT COUNT(*) FROM player WHERE club_id IS NOT NULL AND club_id != $1 AND contract_end_date >= NOW() AND position = $2
            ) AS transferable_count,
            (   
                SELECT json_agg(
                    json_build_object(
                        'player_id', p.player_id,
                        'player_name', p.name,
                        'position', p.position,
                        'age', p.age,
                        'price', p.price,
                        'rating', p.rating,
                        'contract_end_date', p.contract_end_date, 
                        'club_id', c.club_id, 
                        'club_name', c.name 
                    )
                )
                FROM (SELECT * FROM player WHERE club_id IS NOT NULL AND club_id != $1 AND position = $2 AND contract_end_date >= NOW() LIMIT 9 OFFSET $3) p
                JOIN club c ON c.club_id = p.club_id 
            ) AS transferable_players
        `, [club_id, position, (+page - 1) * 9])).rows[0];
    else
        players = (await pool.query(`
        SELECT
        (
            SELECT COUNT(*) FROM player WHERE club_id IS NOT NULL AND club_id != $1 AND contract_end_date >= NOW()
        ) AS transferable_count,
        (   
            SELECT json_agg(
                json_build_object(
                    'player_id', p.player_id,
                    'player_name', p.name,
                    'position', p.position,
                    'age', p.age,
                    'price', p.price,
                    'rating', p.rating,
                    'contract_end_date', p.contract_end_date, 
                    'club_id', c.club_id, 
                    'club_name', c.name 
                )
            )
            FROM (SELECT * FROM player WHERE club_id IS NOT NULL AND club_id != $1 AND contract_end_date >= NOW() LIMIT 9 OFFSET $2) p
            JOIN club c ON c.club_id = p.club_id
        ) AS transferable_players
    `, [club_id, (+page - 1) * 9])).rows[0];

    players.transferable_count = +players.transferable_count;
    players.transferable_players = players.transferable_players ?? [];

    return NextResponse.json(
        {
            status: 'success',
            data: {
                players
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getTransferablePlayers;