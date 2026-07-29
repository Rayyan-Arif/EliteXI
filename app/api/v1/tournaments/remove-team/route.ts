import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const removeTeamFromTournament = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {tournament_id, club_id} = await request.json();
    
    if(!tournament_id || !club_id)
        throw new AppError("Please provide complete details to remove team.", 400);

    const isTeamExist = (await pool.query("SELECT 1 FROM club WHERE club_id = $1;", [club_id])).rowCount;

    if(!isTeamExist)
        throw new AppError("Club does not exist.", 404);

    const isClubRemoved = (await pool.query("DELETE FROM tournament_rankings WHERE tournament_id = $1 AND club_id = $2;", [tournament_id, club_id])).rowCount;

    if(!isClubRemoved)
        throw new AppError("Club was not part of the tournament.", 404);

    return new NextResponse(null, {status: 204});
});

export const DELETE = removeTeamFromTournament;