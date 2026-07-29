import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const createTournament = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    const {name, no_of_teams} = await request.json();

    if(!name || !no_of_teams)
        throw new AppError("Please provide complete details to create a tournament.", 400);

    await pool.query("INSERT INTO tournament(name, no_of_teams) VALUES ($1, $2);", [name, no_of_teams]);

    return NextResponse.json({status: 'success'}, {status: 201});
});

export const POST = createTournament;