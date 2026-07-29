import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getClubDetails = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const club = (await pool.query("SELECT * FROM club WHERE manager_id = $1;", [user?.id])).rows[0];

    const players = (await pool.query("SELECT * FROM player WHERE club_id = $1;", [club?.club_id])).rows;

    return NextResponse.json(
        {status: 'success', data: {club: {...club, players}}},
        {status: 200}
    );
});

export const GET = getClubDetails;