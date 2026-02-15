"use client";
import { DateRangePicker } from "@/components/date-range-picker";
import { IncomeExpenseChart } from "./components/income-expense-chart";
import { useSummary } from "./hooks/use-summary";
import { subMonths } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { SummarySection } from "./components/summary-section";
import { useTrends } from "./hooks/use-trends";

const AnalyticsPage = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subMonths(new Date(), 6),
        to: new Date()
    });
    const summaryQuery = useSummary(dateRange);
    const trendsQuery = useTrends(dateRange);

    return (
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
                    <DateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange} />
                </div>

                {/* KPI's */}
                <SummarySection
                    data={summaryQuery.data}
                    isLoading={summaryQuery.isPending}
                    isError={summaryQuery.isError}
                />
                {/* income vs expenses and comulative saving charts*/}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <IncomeExpenseChart
                        data={trendsQuery.data}
                        isLoading={trendsQuery.isPending}
                        isError={trendsQuery.isError}
                        interval={trendsQuery.interval}
                    />
                </div>
            </div>
        </main>
    );
};

export default AnalyticsPage;