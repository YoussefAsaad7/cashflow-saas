import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/modules/auth/auth.service";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation Error", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const loginResult = await authService.login(result.data);

        // Create response with user data and token
        const response = NextResponse.json({
            user: loginResult.user,
            token: loginResult.token, // For mobile apps
        });

        // Set session cookie for web clients
        response.cookies.set("next-auth.session-token", loginResult.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return response;
    } catch (error: any) {
        if (error.message === "Invalid credentials") {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
