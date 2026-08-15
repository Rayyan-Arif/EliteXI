import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const approveTransfer = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    const {club1_id, club2_id, player_id, transfer_amount} = await request.json();
    
    if(!club1_id || !club2_id || !player_id || !transfer_amount)
        throw new AppError("Please provide complete details to request a transfer.", 400);

    await isClubManager(user?.id, club2_id);

    const isPlayerPartOfClub = (await pool.query("SELECT 1 FROM player WHERE player_id = $1 AND club_id = $2 AND contract_end_date >= NOW();", [player_id, club2_id])).rowCount;

    if(!isPlayerPartOfClub)
        throw new AppError("Player is not a part of club.", 404);

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        //CASE: a club requested transfer of 2 players with funds sufficient for only 1 player and both selling clubs try to approve the transfer.
        //FOR UPDATE locks the row for club which requested the transfer, now when 2 selling club try to approve the request, first selling club will be dealt first and other selling one has to wait
        //This is case if both clubs approve at the same time but if one after another then there is no problem as 1 will be rejected.
        const moneyLeft = (await client.query("SELECT money_left FROM club WHERE club_id = $1 FOR UPDATE;", [club1_id])).rows[0];

        if(moneyLeft < transfer_amount)
            throw new AppError("Club has no sufficient funds to buy the player.", 400);

        await client.query("UPDATE club SET money_left = money_left - $1, no_of_players = no_of_players + 1 WHERE club_id = $2;",[transfer_amount, club1_id]);

        await client.query("UPDATE club SET money_left = money_left + $1, no_of_players = no_of_players - 1 WHERE club_id = $2;",[transfer_amount, club2_id]);

        await client.query("UPDATE player SET club_id = $1 WHERE player_id = $2;", [club1_id, player_id]);
        
        await client.query("UPDATE transfer SET transfer_status = 'APPROVED' WHERE club1_id = $1 AND club2_id = $2 AND player_id = $3;", [club1_id, club2_id, player_id]);

        await client.query("COMMIT");
    } catch(err){
        await client.query("ROLLBACK");
    }

    return NextResponse.json({status: 'success'}, {status: 200});
});

export const PATCH = approveTransfer;