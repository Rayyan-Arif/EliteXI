import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getMatchDetails = catchAsync(async(request: NextRequest, context: RouteContext<"/api/v1/matches/[match_id]">) => {
    await protect(request);

    const {match_id} = await context.params;

    if(!match_id)
        throw new AppError("Please provide a match ID.", 400);

    const match = (await pool.query("SELECT has_game_started FROM game WHERE game_id = $1;", [match_id])).rows[0].has_game_started;

    return NextResponse.json(
        {
            status: 'success',
            data: {
                match
            }
        },
        {status: 200}
    );
});

export const GET = getMatchDetails;