import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const createMatch = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {game_name, club1_id, club2_id, game_date, winning_price, tournament_id} = await request.json();

    if(!game_name || !club1_id || !club2_id || !game_date || !winning_price)
        throw new AppError("Please provide complete details for creating a match.", 400);

    await pool.query("INSERT INTO game(game_name, club1_id, club2_id, game_date, winning_price, tournament_id) VALUES ($1, $2, $3, $4, $5, $6);", [game_name, club1_id, club2_id, new Date(game_date), winning_price, tournament_id]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = createMatch;