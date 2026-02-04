"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { subMonths } from "date-fns";
import { Percent, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";


export default function Dashboard() {

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subMonths(new Date(), 6),
        to: new Date()
    });
    const { stats, isPending, isError } = useDashboardStats(dateRange);

    return <>
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 max-w-400 mx-auto">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Financial Overview</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            Track your income, expenses, and savings performance
                        </p>
                    </div>
                    <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                </div>

                {/* KPI's */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    
                            <KpiCard
                                title="Total Income"
                                value={stats?.totalIncome.value != null ? `$${stats.totalIncome.value.toLocaleString()}` : undefined}
                                trend={stats?.totalIncome.trend}
                                icon={TrendingUp}
                                isLoading={isPending}
                                isError={isError}
                                color="#00aa00"
                            />
                            <KpiCard
                                title="Total Expenses"
                                value={stats?.totalExpenses.value != null ? `$${stats.totalExpenses.value.toLocaleString()}` : undefined}
                                trend={stats?.totalExpenses.trend}
                                icon={TrendingDown}
                                isLoading={isPending}
                                isError={isError}
                                color="#aa0000"
                            />
                            <KpiCard
                                title="Net Savings"
                                value={stats?.netCashFlow.value != null ? `$${stats.netCashFlow.value.toLocaleString()}` : undefined}
                                trend={stats?.netCashFlow.trend}
                                isLoading={isPending}
                                isError={isError}
                                icon={PiggyBank}
                            />
                            <KpiCard
                                title="Savings Rate"
                                value={stats?.savingsRate.value != null ? `${stats.savingsRate.value.toFixed(1)}%` : undefined}
                                trend={stats?.savingsRate.trend}
                                isLoading={isPending}
                                isError={isError}
                                icon={Percent}
                                color="#0000aa"
                            />
                </div>
                {/* income vs expenses and comulative saving charts*/}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <IncomeExpenseChart dateRange={dateRange} />
                </div>
            </div>
        </main>
    </>;
}