import pool from "@/lib/db";
import { catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getClubRankings = catchAsync(async(request: NextRequest) => {
    await protect(request);

    const clubs = (await pool.query("SELECT club_id, name, ranking FROM club WHERE club_approved = 'APPROVED';")).rows;

    return NextResponse.json({status: 'success', data: {clubs}});
});

export const GET = getClubRankings;