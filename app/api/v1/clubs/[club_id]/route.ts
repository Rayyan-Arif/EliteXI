import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const removeClub = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const isClubDeleted = (await pool.query("DELETE FROM club WHERE manager_id = $1;", [user?.id])).rowCount;

    if(!isClubDeleted)
        throw new AppError("Club not found.", 404);

    return NextResponse.json(
        {status: 204}
    );
});

export const DELETE = removeClub;