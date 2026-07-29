import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const requestTransfer = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const {club1_id, club2_id, player_id, transfer_amount} = await request.json();

    if(!club1_id || !club2_id || !player_id || !transfer_amount)
        throw new AppError("Please provide complete details to request a transfer.", 400);

    const club = await isClubManager(user?.id, club1_id);

    if(club.no_of_players === 22)
        throw new AppError("You cannot buy more players, you already have 22 players.", 403);

    const isPlayerPartOfClub = (await pool.query("SELECT 1 FROM player WHERE player_id = $1 AND club_id = $2 AND contract_end_date >= NOW();", [player_id, club2_id])).rowCount;

    if(!isPlayerPartOfClub)
        throw new AppError("Player is not a part of club.", 404);

    const hasMoney = (await pool.query("SELECT 1 FROM club WHERE club_id = $1 AND money_left >= $2;", [club1_id, transfer_amount])).rowCount;

    if(!hasMoney)
        throw new AppError("Transfer amount cannot be greater than club funds.", 400);

    await pool.query("INSERT INTO transfer(club1_id, club2_id, player_id, transfer_amount) VALUES ($1, $2, $3, $4);", [club1_id, club2_id, player_id, transfer_amount]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = requestTransfer;