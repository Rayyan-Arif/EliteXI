import { NextRequest, NextResponse } from "next/server";
import { protect } from "./services/auth.service"
import {Redis} from "@upstash/redis";
import {Ratelimit} from "@upstash/ratelimit";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m")
});

export const proxy = async (request: NextRequest) => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const {success} = await ratelimit.limit(ip);

    if(!success){
        return NextResponse.json(
            {error: 'Too many requests'},
            {status: 429}
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*'
}