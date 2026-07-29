import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const releasePlayer = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    const {club_id, player_id} = await request.json();

    if(!club_id || !player_id)
        throw new AppError("Please provide a club and player to release.", 400);

    await isClubManager(user?.id, club_id);

    const isPlayerPartOfClub = (await pool.query("SELECT 1 FROM player WHERE player_id = $1 AND club_id = $2 AND contract_end_date >= NOW();", [player_id, club_id]));

    if(!isPlayerPartOfClub)
        throw new AppError("Player is not part of club", 404);

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        await client.query("UPDATE player SET club_id = NULL, contract_end_date = NULL WHERE player_id = $1;", [player_id]);

        await client.query("UPDATE club SET no_of_players = no_of_players - 1 WHERE club_id = $1;", [club_id]);
        
        await client.query("COMMIT");
    } catch(err){
        await client.query("ROLLBACK");
    }

    return NextResponse.json({status: 'success'}, {status: 200});
});

export const PATCH = releasePlayer;