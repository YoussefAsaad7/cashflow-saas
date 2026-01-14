import { NextResponse } from "next/server";
import { getToken, decode } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Paths that do NOT require authentication
const publicApiPaths = [
    "/api/v1/auth/register", // Registration
    "/api/v1/auth/login", // Custom login
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. API Public Paths - Fast exit, NO session check needed
    // This strictly ensures Bearer token logic validates ONLY on protected routes
    if (publicApiPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Get Session (Used for both page protection and login redirection)
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 3. Handle Login Page - Redirect to dashboard if already logged in
    if (pathname === "/login") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next(); // Allow access to login page if not authenticated
    }

    // 4. Check for Bearer Token (Mobile / API Client) - ONLY for API routes
    // This runs only if we are on a protected API route and have no session yet
    if (pathname.startsWith("/api/")) {
        // If we already have a session, we are good
        if (session) return NextResponse.next();

        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                // Ensure secret is present (NextAuth requires it)
                if (!process.env.NEXTAUTH_SECRET) {
                    throw new Error("NEXTAUTH_SECRET not set");
                }

                const decoded = await decode({
                    token,
                    secret: process.env.NEXTAUTH_SECRET,
                });

                if (decoded) {
                    return NextResponse.next();
                }
            } catch (error) {
                console.error("Bearer token decode error:", error);
            }
        }

        // API Route + Neither Session nor Bearer -> 401
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 5. Protected Page Routes (e.g. /dashboard)
    if (session) {
        return NextResponse.next();
    }

    // 6. Page Routes + No Session -> Redirect to Login
    return NextResponse.redirect(new URL("/login", req.url));
}

// Apply to protected pages and API routes
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/api/v1/:path*"
    ],
};
