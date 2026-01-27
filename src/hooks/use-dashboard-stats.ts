"use client";
import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";

type FinancialSummary = {
    totalIncome: { value: number, trend: number };
    totalExpenses: { value: number, trend: number };
    netCashFlow: { value: number, trend: number };
    savingsRate: { value: number, trend: number };
}

export function useDashboardStats(dateRange?: DateRange) {
    const fromISO = dateRange?.from?.toISOString();
    const toISO = dateRange?.to?.toISOString();
    const { data: stats, isPending, isError } = useQuery<FinancialSummary>({
        queryKey: ['dashboard-stats', fromISO, toISO],
        enabled: Boolean(dateRange?.from && dateRange?.to),
        queryFn: async () => {
            const res = await fetch(`/api/v1/analytics/summary?from=${fromISO}&to=${toISO}`);
            if (!res.ok) {
                throw new Error('Failed to fetch analytics summary');
            }
            return res.json();
        },
    });
    return { stats, isPending, isError };
}