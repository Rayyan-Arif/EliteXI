import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const cancelTournament = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {tournament_id} = await request.json();

    if(!tournament_id)
        throw new AppError("Please provide complete details to cancel a tournament.", 400);

    await pool.query("DELETE FROM tournament WHERE tournament_id = $1;", [tournament_id]);

    return new NextResponse(null, {status: 204});
});

export const DELETE = cancelTournament;