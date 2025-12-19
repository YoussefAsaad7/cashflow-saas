import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { z } from 'zod';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const userId = "user-123"; // TODO: Auth

    if (!from || !to) {
        return NextResponse.json(
            { error: "Missing 'from' or 'to' query parameters" },
            { status: 400 }
        );
    }

    try {
        const summary = await analyticsService.getFinancialSummary(
            userId,
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
