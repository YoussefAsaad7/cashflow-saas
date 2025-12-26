
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { workdayService } from '@/modules/workday/workday.service';
import { WorkDayStatus } from '@/generated/prisma/client';
import { getCurrentUser } from '@/lib/session';

// Schema for Validation
const logWorkDaySchema = z.object({
    date: z.string().datetime(), // Expects ISO string
    status: z.nativeEnum(WorkDayStatus),
    hoursWorked: z.number().min(0).max(24).optional(),
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // 1. Validate Input
        const result = logWorkDaySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { date, status, hoursWorked } = result.data;

        // 3. Call Service (Service normalized date)
        const workDay = await workdayService.logWorkDay(
            user.id,
            new Date(date),
            status,
            hoursWorked
        );

        return NextResponse.json(workDay, { status: 201 });

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

    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        if (!from || !to) {
            return NextResponse.json(
                { error: "Missing 'from' or 'to' query parameters" },
                { status: 400 }
            );
        }

        const data = await workdayService.getWorkDaysInRange(
            user.id,
            new Date(from),
            new Date(to)
        );

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
