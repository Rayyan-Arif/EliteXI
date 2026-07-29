import { catchAsync } from "@/lib/helper";
import { protect } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = catchAsync(async(request: NextRequest) => {
    const user = await protect(request);

    return NextResponse.json(
        {
            status: 'success',
            data: user
        },
        {
            status: 200
        }
    );
});