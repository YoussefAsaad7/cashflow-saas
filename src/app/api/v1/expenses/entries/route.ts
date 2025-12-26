import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { expenseService } from '@/modules/expenses/expense.service';
import { getCurrentUser } from '@/lib/session';

const logExpenseEntrySchema = z.object({
    categoryId: z.string().cuid(),
    amount: z.number().positive(),
    currency: z.string().length(3),
    date: z.string().datetime(),
    metadata: z.any().optional().default({}),
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = logExpenseEntrySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;
        const entry = await expenseService.logExpense({
            userId: user.id,
            categoryId: data.categoryId,
            amount: data.amount.toString(),
            currency: data.currency,
            date: new Date(data.date),
            metadata: data.metadata,
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
    const user = await getCurrentUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing 'from' or 'to' query parameters" },
            { status: 400 }
        );
    }

    try {
        const history = await expenseService.getExpenseHistory(
            user.id,
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
