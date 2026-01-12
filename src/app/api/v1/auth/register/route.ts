import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/modules/auth/auth.service";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation Error", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const user = await authService.register(result.data);
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "User already exists") {
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 409 }
                );
            }
        }

        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
