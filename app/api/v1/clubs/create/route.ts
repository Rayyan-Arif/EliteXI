import pool from "@/lib/db";
import { AppError, catchAsync, validateFormation } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const createClub = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);
    const {name, formation} = await request.json();

    if(!name || !formation)
        throw new AppError("Please provide complete details for club creation.", 400);

    if(!validateFormation(formation))
        throw new AppError("Formation is either invalid or not part of this app.", 400);

    const club = (await pool.query("SELECT 1 FROM club WHERE manager_id = $1;", [user?.id])).rows[0];

    if(club)
        throw new AppError("You have already created a club. You cannot create more.", 403);

    await pool.query("INSERT INTO club(name, manager_id, formation) VALUES ($1, $2, $3);", [name, user?.id, formation]);

    return NextResponse.json(
        {
            status: 'success'
        },
        {
            status: 201
        }
    );
});

export const POST = createClub;