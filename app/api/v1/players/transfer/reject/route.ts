import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const rejectTransfer = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const {club1_id, club2_id, player_id, transfer_amount} = await request.json();
        
    if(!club1_id || !club2_id || !player_id || !transfer_amount)
        throw new AppError("Please provide complete details to request a transfer.", 400);

    await isClubManager(user?.id, club2_id);

    const isPlayerPartOfClub = (await pool.query("SELECT 1 FROM player WHERE player_id = $1 AND club_id = $2 AND contract_end_date >= NOW();", [player_id, club2_id])).rowCount;

    if(!isPlayerPartOfClub)
        throw new AppError("Player is not a part of club.", 404);
    
    await pool.query("UPDATE transfer SET transfer_status = 'REJECTED' WHERE club1_id = $1 AND club2_id = $2 AND player_id = $3;", [club1_id, club2_id, player_id]);

    return NextResponse.json({status: 'success'}, {status: 200});
});

export const PATCH = rejectTransfer;