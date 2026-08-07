import pool from "@/lib/db";
import { AppError, catchAsync } from "@/lib/helper";
import { isClubManager, protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const getAllTransferRequest = catchAsync(async(request: NextRequest, context: RouteContext<"/api/v1/players/transfer/[club_id]">) => {
    const user = await protect(request);

    const {club_id} = await context.params;

    if(!club_id)
        throw new AppError("Please provide a club ID.", 400);

    await isClubManager(user.id, +club_id);
    
    const requests = (await pool.query(`
        SELECT
        (
            SELECT json_agg(
                json_build_object(
                    'requested_club_id', t.club1_id,
                    'requested_club_name', c.name,
                    'player_id', t.player_id,
                    'player_name', p.name,
                    'transfer_amount', t.transfer_amount,
                    'transfer_status', t.transfer_status,
                    'requested_at', t.transfer_at
                )
            )
            FROM (SELECT * FROM transfer WHERE club2_id = $1 AND transfer_status = 'PENDING') t
            JOIN club c ON c.club_id = t.club1_id
            JOIN player p ON p.player_id = t.player_id
        ) AS requested_to_you,
        (
            SELECT json_agg(
                json_build_object(
                    'requested_club_id', t.club2_id,
                    'requested_club_name', c.name,
                    'player_id', t.player_id,
                    'player_name', p.name,
                    'transfer_amount', t.transfer_amount,
                    'transfer_status', t.transfer_status,
                    'requested_at', t.transfer_at
                )
            )
            FROM (
                SELECT * FROM transfer
                WHERE club1_id = $1 AND transfer_status IN ('APPROVED', 'REJECTED')
                ORDER BY transfer_at DESC
                LIMIT 3
            ) t
            JOIN club c ON c.club_id = t.club2_id
            JOIN player p ON p.player_id = t.player_id
        ) AS requested_by_you
    `, [club_id])).rows[0];

    requests.requested_to_you = requests.requested_to_you ?? [];
    requests.requested_by_you = requests.requested_by_you ?? [];

    return NextResponse.json({status: 'success', data: {requests}}, {status: 200});
});

export const GET = getAllTransferRequest;