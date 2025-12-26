import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { expenseService } from '@/modules/expenses/expense.service';
import { ExpenseType } from '@/generated/prisma/client';
import { getCurrentUser } from '@/lib/session';

const createExpenseCategorySchema = z.object({
    name: z.string().min(1),
    type: z.nativeEnum(ExpenseType),
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = createExpenseCategorySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, type } = result.data;
        const category = await expenseService.createCategory({ userId: user.id, name, type });
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
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

    try {
        const categories = await expenseService.getCategories(user.id);
        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
