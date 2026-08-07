import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllTournaments = catchAsync(async(request: NextRequest) => {
    await protect(request);

    const tournaments = (await pool.query("SELECT * FROM tournament;")).rows;

    return NextResponse.json(
        {
            status: 'success',
            data: {
                tournaments
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getAllTournaments;