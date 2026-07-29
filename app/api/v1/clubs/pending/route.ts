import pool from "@/lib/db";
import { catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllPendingClubs = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const clubs = (await pool.query("SELECT club_id, name, created_at FROM club WHERE club_approved = 'PENDING';")).rows;

    return NextResponse.json({status: 'success', data: {clubs}}, {status: 200});
});

export const GET = getAllPendingClubs;