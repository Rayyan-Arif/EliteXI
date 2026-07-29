import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const rejectClub = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user?.id);
    const {club_id} = await request.json();

    if(!club_id)
        throw new AppError("Please provide a club.", 400);

    const isClubDeleted = (await pool.query("DELETE FROM club WHERE club_id = $1;", [club_id])).rowCount;

    if(!isClubDeleted)
        throw new AppError("Club not found.", 404);

    return new NextResponse(null, {status: 204});
});

export const DELETE = rejectClub;