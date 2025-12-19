import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { incomeService } from '@/modules/income/income.service';
import { IncomeSourceType } from '@/generated/prisma/client';

const createIncomeSourceSchema = z.object({
    name: z.string().min(1),
    type: z.nativeEnum(IncomeSourceType),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = createIncomeSourceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, type } = result.data;
        const userId = "user-123"; // TODO: Auth

        const source = await incomeService.createIncomeSource({ userId, name, type });
        return NextResponse.json(source, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const userId = "user-123"; // TODO: Auth
    try {
        const sources = await incomeService.getIncomeSources(userId);
        return NextResponse.json(sources, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
