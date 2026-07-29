import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const buyPlayer = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    const {club_id, player_id, money_left, player_price, contract_end_date} = await request.json();

    if(!club_id || !player_id || !money_left || !player_price || !contract_end_date)
        throw new AppError("Please provide complete details to buy a player.", 400);

    await isClubManager(user?.id, club_id);

    if(player_price > money_left)
        throw new AppError("Not enough money to buy this player.", 403);

    const isPlayerPartOfClub = (await pool.query("SELECT 1 FROM player WHERE player_id = $1 AND contract_end_date >= NOW();", [player_id])).rowCount;

    if(isPlayerPartOfClub)
        throw new AppError("Player is already a member of a club.", 403);

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        await client.query("UPDATE player SET club_id = $1, contract_end_date = $2 WHERE player_id = $3;", [club_id, new Date(contract_end_date), player_id]);

        await client.query("UPDATE club SET money_left = money_left - $1, no_of_players = no_of_players + 1 WHERE club_id = $2;", [player_price, club_id]);

        await client.query("COMMIT");
    } catch(err){
        await client.query("ROLLBACK");
    }

    return NextResponse.json({status: 'success'}, {status: 200});
});

export const PATCH = buyPlayer;