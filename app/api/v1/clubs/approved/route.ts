import pool from "@/lib/db";
import { catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllApprovedClubs = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const search = request.nextUrl.searchParams.get("search");

    const clubs = (await pool.query("SELECT club_id, name FROM club WHERE name ILIKE '%' || $1 || '%' AND club_approved = 'APPROVED';", [search])).rows;

    return NextResponse.json({status: 'success', data: {clubs}}, {status: 200});
});

export const GET = getAllApprovedClubs;