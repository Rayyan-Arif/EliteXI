import { createFreshUser, signCookie, signToken } from "@/lib/auth";
import pool from "@/lib/db"
import { AppError, catchAsync } from "@/lib/helper";
import { SignUpBody, TokenPayLoad, User } from "@/types/user"
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export const signup = async (request: NextRequest) => {
    const {name, email, password, confirm_password, nationality}: SignUpBody = await request.json();

    if(!name || !email || !password || !confirm_password || !nationality)
        throw new AppError("Please provide all details for creating an account.", 400);

    if(password !== confirm_password)
        throw new AppError("Password and confirm password are not same.", 400);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = (await pool.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at;", [name, email, hashedPassword])).rows[0];

    const manager = (await pool.query("INSERT INTO manager(manager_id, nationality) VALUES ($1, $2) RETURNING nationality, rating, reputation;", [user.id, nationality])).rows[0];

    return createFreshUser(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            nationality: manager.nationality,
            rating: manager.rating,
            reputation: manager.reputation
        }, 
        201
    );
}

export const login = async(request: NextRequest) => {
    const {email, password} = await request.json();

    if(!email || !password)
        throw new AppError("Please provide both email or password.", 400);

    let user = (await pool.query("SELECT * FROM users WHERE email = $1;", [email])).rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user?.password ?? "");

    if(!user || !isPasswordCorrect)
        throw new AppError("Incorrect email or password.", 401);

    let manager = {};
    if(user.role === 'MANAGER')
        manager = (await pool.query("SELECT nationality, reputation, rating FROM manager WHERE manager_id = $1;", [user.id])).rows[0];

    user = {...user, ...manager};
    delete user["password"];

    return createFreshUser(user, 200);
}

export const logout = () => {
    const response = NextResponse.json(
        {
            status: 'success'
        },
        {
            status: 200
        }
    );

    response.cookies.delete("elite-xi-token");

    return response;
}

export const protect = async(request: NextRequest): Promise<User> => {
    const token: string | undefined = request.cookies.get("elite-xi-token")?.value;

    if(!token)
        throw new AppError("You are not logged in.", 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayLoad;

    let user = (await pool.query("SELECT id,name,email,role,created_at,password_changed_at FROM users WHERE email = $1;", [payload.email])).rows[0];

    if(!user)
        throw new AppError("User not found!", 404);

    let manager = {};
    if(user.role === 'MANAGER')
        manager = (await pool.query("SELECT nationality, reputation, rating FROM manager WHERE manager_id = $1;", [user.id])).rows[0];

    user = {...user, ...manager};

    const jwtAssignedAt = payload.iat * 1000;
    const passwordChangedAt = new Date(user.password_changed_at).getTime();

    if(passwordChangedAt > jwtAssignedAt)
        throw new AppError("Password changed. Please log in again.", 401);

    delete user["password_changed_at"];

    return user;
}

export const forgotPassword = async(request: NextResponse) => {
    const {email} = await request.json();

    if(!email)
        throw new AppError("Please provide a email.", 400);

    const user = (await pool.query("SELECT name FROM users WHERE email = $1;", [email])).rows[0];

    if(!user)
        throw new AppError("User not found.", 404);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await pool.query("UPDATE users SET password_reset_token = $1, password_reset_token_expires = $2 WHERE email = $3;", [hashedToken, new Date(Date.now() + 3600 * 24 * 10000), email]);

    const resetLink = `${process.env.APP_URL}/reset-password/${rawToken}`;

    const html = `
        <div style="margin:0;padding:40px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

            <div style="background:#2563eb;padding:32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:30px;">
                EliteXI
            </h1>
            </div>

            <div style="padding:40px;">

            <h2 style="margin-top:0;color:#222;font-size:28px;">
                Reset Your Password
            </h2>

            <p style="font-size:16px;color:#555;line-height:1.7;">
                Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:16px;color:#555;line-height:1.7;">
                We received a request to reset your password for your EliteXI account.
                If you made this request, click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:40px 0;">
                <a
                href="${resetLink}"
                style="
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 35px;
                    border-radius:8px;
                    font-size:16px;
                    font-weight:bold;
                    display:inline-block;
                "
                >
                Reset Password
                </a>
            </div>

            <p style="font-size:15px;color:#555;line-height:1.7;">
                This link will expire in <strong>10 minutes</strong>.
            </p>

            <p style="font-size:15px;color:#555;">
                If the button doesn't work, copy and paste this link into your browser:
            </p>

            <div
                style="
                background:#f5f5f5;
                border-radius:6px;
                padding:12px;
                word-break:break-all;
                font-size:14px;
                color:#2563eb;
                "
            >
                ${resetLink}
            </div>

            <hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

            <p style="font-size:15px;color:#666;line-height:1.7;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will remain unchanged.
            </p>

            </div>

            <div
            style="
                background:#fafafa;
                padding:25px;
                text-align:center;
                color:#777;
                font-size:13px;
            "
            >
            <strong>EliteXI</strong><br>
            Football Club Management Platform
            <br><br>
            This is an automated email. Please do not reply.
            </div>

        </div>
        </div>
        `

    await sendEmail(email, 'Reset your password.', html);

    return NextResponse.json(
        {
            status: 'success',
        }, 
        {
            status: 200
        }
    );
};

export const resetPassword = async(request: NextRequest, context: RouteContext<"/api/v1/users/reset-password/[token]">) => {
    const {token} = await context.params;
    const {password} = await request.json();

    if(!token)
        throw new AppError("Please provide a reset password token.", 400);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = (await pool.query("SELECT email FROM users WHERE password_reset_token = $1 AND password_reset_token_expires > NOW();", [hashedToken])).rows[0];

    console.log(hashedToken);

    if(!user?.email)
        throw new AppError("Token not found or expired.", 404);

    const hashedPassword = await bcrypt.hash(password, 12);
    
    await pool.query("UPDATE users SET password = $1, password_changed_at = NOW() - INTERVAL '1 second';", [hashedPassword]);

    const jwtToken = signToken(user.email);

    const response = NextResponse.json(
        {
            status: "success",
        },
        {
            status: 200
        }
    );

    signCookie(response, jwtToken);

    return response;
} 

export const isAdmin = async(id: number = 0): Promise<boolean> => {
    const admin = (await pool.query("SELECT 1 FROM users WHERE role = 'ADMIN' AND id = $1;", [id])).rows[0];

    if(!admin)
        throw new AppError("You are not allowed to perform this operation.", 403);

    return admin;
}

export const isClubManager = async(userID: number = 0, clubID: number = 0) => {
    const club = (await pool.query("SELECT club_id, no_of_players FROM club WHERE manager_id = $1 AND club_id = $2 AND club_approved = 'APPROVED';", [userID, clubID])).rows[0];

    if(!club)
        throw new AppError("You are not manager of this club or club has not been recognized yet so can't perform this operation.", 403);

    return club;
}