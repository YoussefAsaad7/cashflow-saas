import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { getCurrentUser } from '@/lib/session';
import { summaryQuerySchema } from '@/shared/schemas/analytics';
import { SummaryResponse } from '@/shared/contracts/analytics';

export async function GET(request: NextRequest) {
    const user = await getCurrentUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawQuery = Object.fromEntries(
        new URL(request.url).searchParams.entries()
    );
    const parsed = summaryQuerySchema.safeParse(rawQuery);
    if (!parsed.success){
        return NextResponse.json(
            {error: parsed.error.flatten()},
            {status: 400}
        );
    }
    const {from, to} = parsed.data;

    try {
        const summary = await analyticsService.getFinancialSummary(
            user.id,
            new Date(from),
            new Date(to)
        );
        return NextResponse.json<SummaryResponse>(summary, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
