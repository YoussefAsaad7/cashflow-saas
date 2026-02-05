import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { getCurrentUser } from '@/lib/session';
import { TrendsResponse } from '@/shared/contracts';
import { trendsQuerySchema } from '@/shared/schemas';


export async function GET(request: NextRequest) {
    const user = await getCurrentUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const rawQuery = Object.fromEntries(
        new URL(request.url).searchParams.entries()
    );
    const parsed = trendsQuerySchema.safeParse(rawQuery);
    if (!parsed.success){
        return NextResponse.json(
            {error: parsed.error.flatten()},
            {status: 400}
        );
    }
    
    const {from, to, interval} = parsed.data;

    try {
        const trends = await analyticsService.getTrends(
            user.id,
            new Date(from),
            new Date(to),
            interval
        );
        return NextResponse.json<TrendsResponse>(trends, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
