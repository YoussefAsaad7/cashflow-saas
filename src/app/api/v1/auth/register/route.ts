import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/domain/auth/auth.schemas";
import { authService } from "@/modules/auth/auth.service";


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

        // Set session cookie for web clients - REMOVED: Managed by NextAuth now.
        // response.cookies.set("next-auth.session-token", loginResult.token, { ... });

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
