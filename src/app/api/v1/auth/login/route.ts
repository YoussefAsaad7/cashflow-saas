import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/domain/auth/auth.schemas";
import { authService } from "@/modules/auth/auth.service";


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

        // Set session cookie for web clients - REMOVED: Managed by NextAuth now.
        // response.cookies.set("next-auth.session-token", loginResult.token, { ... });

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
