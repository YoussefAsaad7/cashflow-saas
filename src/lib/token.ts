import { decode } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getTokenFromHeader(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await decode({
            token,
            secret: process.env.NEXTAUTH_SECRET || "super_secret_for_dev_env",
        });

        return decoded;
    } catch (error) {
        console.error("JWT Decode Error:", error);
        return null;
    }
}
