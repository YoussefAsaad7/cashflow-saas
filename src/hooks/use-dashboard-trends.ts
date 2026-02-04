"use client";

import { differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";

import { TrendData, Interval } from "@/types/analytics";

const determineInterval = (dateRange: DateRange | undefined): Interval => {
    if (!dateRange?.from || !dateRange?.to) {
        return 'day';
    }
    const diffInDays = differenceInDays(dateRange.to, dateRange.from);
    if (diffInDays <= 60) {
        return 'day';
    } else if (diffInDays <= 180) {
        return 'week';
    } else if (diffInDays <= 1825) {
        return 'month';
    } else {
        return 'year';
    }
}
export function useDashboardTrends(dateRange: DateRange | undefined) {
    const interval = determineInterval(dateRange);
    const fromISO = dateRange?.from?.toISOString() ?? '';
    const toISO = dateRange?.to?.toISOString() ?? '';
    const { data: trends, isPending, isError } = useQuery<TrendData[]>({
        queryKey: ['dashboard-trends', fromISO, toISO, interval],
        enabled: Boolean(dateRange?.from && dateRange?.to),
        queryFn: async () => {
            const res = await fetch(`/api/v1/analytics/trends?from=${fromISO}&to=${toISO}&interval=${interval}`);
            if (!res.ok) {
                throw new Error('Failed to fetch analytics trends');
            }
            return res.json();
        },
    });
    return { trends, isPending, isError, interval };
}