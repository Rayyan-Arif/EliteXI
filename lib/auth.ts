import { User } from "@/types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const signToken = (email: string) => {
    return jwt.sign({email}, process.env.JWT_SECRET!, {
        expiresIn: '40d'
    });
}

export const signCookie = (response: NextResponse, data: string) => {
    response.cookies.set("elite-xi-token", data, {
        httpOnly: true,
        maxAge: 3600 * 24 * 40 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        path: '/'
    });
}

export const createFreshUser = (user: User, status: number) => {
    const token = signToken(user.email);

    const response = NextResponse.json(
        {
            status: "success",
            data: {
                user
            }
        },
        {
            status: status
        }
    );

    signCookie(response, token);

    return response;
}