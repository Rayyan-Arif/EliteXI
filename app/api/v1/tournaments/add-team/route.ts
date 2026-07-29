import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const addTeamToTournament = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {tournament_id, club_id} = await request.json();
    
    if(!tournament_id || !club_id)
        throw new AppError("Please provide complete details to add team.", 400);

    const isTeamExist = (await pool.query("SELECT 1 FROM club WHERE club_id = $1;", [club_id])).rowCount;

    if(!isTeamExist)
        throw new AppError("Club does not exist.", 404);

    await pool.query("INSERT INTO tournament_rankings VALUES ($1, $2, 1);", [tournament_id, club_id]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = addTeamToTournament;