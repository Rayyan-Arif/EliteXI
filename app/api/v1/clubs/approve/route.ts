import pool from "@/lib/db"
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const approveClub = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user?.id);

    const {club_id} = await request.json();

    if(!club_id)
        throw new AppError("Please provide a club.", 400);

    const isClubApproved = (await pool.query("UPDATE club SET club_approved = 'APPROVED', ranking = (SELECT COUNT(*) FROM club WHERE club_approved = 'APPROVED') + 1 WHERE club_id = $1;", [club_id])).rowCount;

    if(!isClubApproved)
        throw new AppError("Club not found.", 404);

    return NextResponse.json(
        {
            status: "success",
        },
        {
            status: 200
        }
    );
});

export const PATCH = approveClub;