import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { getCurrentUser } from '@/lib/session';

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
        const summary = await analyticsService.getFinancialSummary(
            user.id,
            new Date(from),
            new Date(to)
        );
        return NextResponse.json(summary, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
