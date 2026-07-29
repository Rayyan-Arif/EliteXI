import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const makeCaptain = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const {captain_id} = await request.json();
    
    if(!captain_id)
        throw new AppError("Please provide a captain.", 400);

    await pool.query("UPDATE club SET captain_id = $1 WHERE manager_id = $2;", [captain_id, user.id]);

    return NextResponse.json({status: 'success'}, {status: 200});
});

export const PATCH = makeCaptain;