import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { salaryRuleService } from '@/modules/salary-rules/salary-rule.service';
import { SalaryBaseType } from '@/generated/prisma/client';
import { getCurrentUser } from '@/lib/session';

const createSalaryRuleSchema = z.object({
    name: z.string().min(1),
    currency: z.string().min(3).max(3),
    baseType: z.nativeEnum(SalaryBaseType),
    baseAmount: z.number().positive(),
    standardHoursPerDay: z.number().positive().max(24),
    workingDaysPerMonth: z.number().int().min(1).max(31).nullable().optional(),
    overtimeEnabled: z.boolean(),
    overtimeMultiplier: z.number().positive().nullable().optional(),
    holidayPaid: z.boolean(),
    holidayMultiplier: z.number().positive().nullable().optional(),
    validFrom: z.string().datetime(), // ISO Date
});

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = createSalaryRuleSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;
        const rule = await salaryRuleService.create({
            userId: user.id,
            ...data,
            validFrom: new Date(data.validFrom),
        });

        return NextResponse.json(rule, { status: 201 });
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
        const activeRule = await salaryRuleService.getActive(user.id);
        return NextResponse.json({ active: activeRule }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
