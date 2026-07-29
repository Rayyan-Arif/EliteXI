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
        players = (await pool.query("SELECT p.player_id, p.name AS player_name, p.position, p.age, p.price, p.rating, p.contract_end_date, c.club_id, c.name AS club_name FROM player p JOIN club c ON p.club_id = c.club_id WHERE c.club_id != $1 AND p.contract_end_date >= NOW() AND p.position = $2 LIMIT 10 OFFSET $3;", [club_id, position, (+page - 1) * 10])).rows;
    else
        players = (await pool.query("SELECT p.player_id, p.name AS player_name, p.position, p.age, p.price, p.rating, p.contract_end_date, c.club_id, c.name AS club_name FROM player p JOIN club c ON p.club_id = c.club_id WHERE c.club_id != $1 AND p.contract_end_date >= NOW() LIMIT 10 OFFSET $2;", [club_id, (+page - 1) * 10])).rows;

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