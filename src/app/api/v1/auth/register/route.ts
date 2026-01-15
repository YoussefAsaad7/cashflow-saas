import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
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

        const registeredUser = await authService.register(result.data);
        const user = await authService.login(result.data);

        // Generate JWT token for mobile/external access
        const secret = process.env.NEXTAUTH_SECRET || "super_secret_for_dev_env";
        const token = await encode({
            token: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            secret,
        });

        // Create response with user data and token
        const response = NextResponse.json({
            user,
            token, // For mobile apps
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
