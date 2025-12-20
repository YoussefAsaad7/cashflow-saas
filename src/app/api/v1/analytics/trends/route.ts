import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/session';

const intervalSchema = z.enum(['day', 'month']).default('day');

export async function GET(request: NextRequest) {
    const user = await getCurrentUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const intervalParam = searchParams.get('interval') || 'day';

    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing 'from' or 'to' query parameters" },
            { status: 400 }
        );
    }

    try {
        const parseResult = intervalSchema.safeParse(intervalParam);
        const interval = parseResult.success ? parseResult.data : 'day';

        const trends = await analyticsService.getTrends(
            user.id,
            new Date(from),
            new Date(to),
            interval
        );
        return NextResponse.json(trends, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
