import pool from "@/lib/db";
import { catchAsync } from "@/lib/helper";
import { signup } from "@/services/auth.service";
import { NextResponse } from "next/server";

export const POST = catchAsync(signup);