import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const cancelMatch = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {game_id} = await request.json();

    if(!game_id)
        throw new AppError("Please provide a game to cancel.", 400);

    const isGameDeleted = (await pool.query("DELETE FROM game WHERE game_id = $1;", [game_id])).rowCount;

    if(!isGameDeleted)
        throw new AppError("Game not found.", 404);

    return new NextResponse(null,{status: 204});
});

export const DELETE = cancelMatch;