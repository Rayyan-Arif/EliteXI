import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllBuyablePlayers = catchAsync(async(request: NextRequest) => {
    await protect(request);

    const page = request.nextUrl.searchParams.get("page") ?? 1;
    const position = request.nextUrl.searchParams.get("position");

    if(position && !['GOALKEEPER', 'DEFENDER', 'ATTACKER', 'MIDFIELDER'].includes(position))
        throw new AppError("Invalid position.", 400);

    let players = [];

    if(!position)
        players = (await pool.query("SELECT player_id, name, position, age, rating, price FROM player WHERE club_id IS NULL OR contract_end_date < NOW() LIMIT 10 OFFSET $1;", [(+page - 1) * 10])).rows;
    else
        players = (await pool.query("SELECT player_id, name, position, age, rating, price FROM player WHERE (club_id IS NULL OR contract_end_date < NOW()) AND position = $1 LIMIT 10 OFFSET $2;", [position, (+page - 1) * 10])).rows;

    return NextResponse.json(
        {
            status: 'success',
            data: {
                results: players.length,
                players
            }
        },
        { status: 200 }
    );
});

export const GET = getAllBuyablePlayers;