import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTokenFromHeader } from "@/lib/token";
import { NextRequest } from "next/server";

export async function getCurrentUser(req: NextRequest) {
    // 1. Try Session (Cookies)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        return session.user;
    }

    // 2. Try Bearer Token (Headers)
    const token = await getTokenFromHeader(req);
    if (token?.id) {
        // Construct a user-like object from the token
        return {
            id: token.id as string,
            name: token.name,
            email: token.email,
            image: token.picture,
        };
    }

    return null;
}
