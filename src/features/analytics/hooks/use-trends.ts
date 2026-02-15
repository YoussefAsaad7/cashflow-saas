"use client";

import { differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";
import { Interval, TrendsResponse } from "@/shared/contracts/analytics/trends.contract";

type NormalizedRange = {
    from: Date;
    to: Date;
};

const normalizeRange = (range?: DateRange): NormalizedRange | null => {
    if (!range?.from || !range?.to) return null;
    return {
        from: range.from,
        to: range.to,
    }
}

const determineInterval = (range: NormalizedRange): Interval => {
    const diffInDays = differenceInDays(range.to, range.from);

    if (diffInDays <= 60) return "day";
    if (diffInDays <= 180) return "week";
    if (diffInDays <= 1825) return "month";
    return "year";
};

export function useTrends(dateRange?: DateRange) {
    const range = normalizeRange(dateRange);
    const interval = range ? determineInterval(range) : 'day';

    const { data: trends, isPending, isError } = useQuery<TrendsResponse>({
        queryKey: [
            "dashboard-trends",
            range?.from.toISOString(),
            range?.to.toISOString(),
            interval,
        ],
        enabled: !!range,
        queryFn: async () => {
            const res = await fetch(`/api/v1/analytics/trends?from=${range!.from.toISOString()}&to=${range!.to.toISOString()}&interval=${interval}`);
            if (!res.ok) {
                throw new Error('Failed to fetch analytics trends');
            }
            return res.json();
        },
    });
    return { trends, isPending, isError, interval };
}