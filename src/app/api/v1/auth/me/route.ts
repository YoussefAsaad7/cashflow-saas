import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("next-auth.session-token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const secret = process.env.NEXTAUTH_SECRET || "super_secret_for_dev_env";
        const decoded = await decode({
            token,
            secret,
        });

        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // The decoded token structure depends on how it was encoded in auth.service.ts
        // In auth.service.ts:
        // token: { id, name, email, picture }

        return NextResponse.json({
            user: {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                image: decoded.picture,
            },
        });
    } catch (error) {
        console.error("Session verification error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
