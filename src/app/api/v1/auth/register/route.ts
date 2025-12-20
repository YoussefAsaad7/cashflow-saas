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
        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        if (error.message === "User already exists") {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }
        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
