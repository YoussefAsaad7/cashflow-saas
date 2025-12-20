import { NextResponse } from "next/server";
import { getToken, decode } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Paths that do NOT require authentication
const publicPaths = [
    "/api/auth", // NextAuth routes (signin, callback, etc)
    "/api/v1/auth/register", // Registration
    "/api/v1/auth/login", // Custom login
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Check if public
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Check for Session Cookie (Standard Web)
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (session) {
        return NextResponse.next();
    }

    // 3. Check for Bearer Token (Mobile / API Client)
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = await decode({
                token,
                secret: process.env.NEXTAUTH_SECRET || "super_secret_for_dev_env",
            });

            if (decoded) {
                return NextResponse.next();
            }
        } catch (error) {
            console.error("Bearer token decode error:", error);
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Apply to all API routes
export const config = {
    matcher: ["/api/v1/:path*"],
};
