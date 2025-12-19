import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { expenseService } from '@/modules/expenses/expense.service';
import { ExpenseType } from '@/generated/prisma/client';

const createExpenseCategorySchema = z.object({
    name: z.string().min(1),
    type: z.nativeEnum(ExpenseType),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = createExpenseCategorySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, type } = result.data;
        const userId = "user-123"; // TODO: Auth

        const category = await expenseService.createCategory({ userId, name, type });
        return NextResponse.json(category, { status: 201 });
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
        const categories = await expenseService.getCategories(userId);
        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
