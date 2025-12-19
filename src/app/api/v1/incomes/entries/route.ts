import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { incomeService } from '@/modules/income/income.service';
import { IncomeEntryType } from '@/generated/prisma/client';

const logIncomeEntrySchema = z.object({
    sourceId: z.string().cuid(),
    amount: z.number().positive(),
    currency: z.string().length(3),
    date: z.string().datetime(),
    type: z.nativeEnum(IncomeEntryType),
    metadata: z.any().optional().default({}),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = logIncomeEntrySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;
        const userId = "user-123";

        // data.metadata is now strictly typed as Json, which is compatible with Prisma.InputJsonValue
        const entry = await incomeService.logIncomeEntry({
            userId,
            sourceId: data.sourceId,
            amount: data.amount.toString(),
            currency: data.currency,
            date: new Date(data.date),
            type: data.type,
            metadata: data.metadata, // No 'as any' needed
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const userId = "user-123";

    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing 'from' or 'to' query parameters" },
            { status: 400 }
        );
    }

    try {
        const history = await incomeService.getIncomeHistory(
            userId,
            new Date(from),
            new Date(to)
        );
        return NextResponse.json(history, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
