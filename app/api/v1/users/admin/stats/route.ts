import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isAdmin, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAdminDashboardStats = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    await isAdmin(user.id);

    let stats = (await pool.query(`
        SELECT
        (
            SELECT COUNT(*) FROM player
        ) AS players_created,
        (
            SELECT COUNT(*) FROM game
        ) AS matches_scheduled,
        (
            SELECT COUNT(*) FROM tournament
        ) AS tournaments_held,
        (
            SELECT json_agg(c)
            FROM (
                SELECT COUNT(*) AS no_of_clubs, club_approved AS status FROM club GROUP BY club_approved
            ) c 
        ) AS clubs_created;
    `)).rows[0];

    stats.clubs_created = Object.assign({}, ...stats.clubs_created.map((stat: any) => stat.status === 'APPROVED' ? {approved_clubs: stat.no_of_clubs} : {pending_clubs: stat.no_of_clubs}))

    return NextResponse.json(
        {
            status: 'success',
            data: {
                stats
            }
        },
        {
            status: 200
        }
    );
});

export const GET = getAdminDashboardStats;