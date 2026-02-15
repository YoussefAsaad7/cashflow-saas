import { KpiCard } from "@/components/kpi-card";
import { Percent, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { SummaryResponse } from "@/shared/contracts/analytics";

type SummarySectionProps = {
    data?: SummaryResponse;
    isLoading: boolean;
    isError: boolean;
}

export const SummarySection = ({data, isLoading, isError}: SummarySectionProps) => {
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <KpiCard
                        title="Total Income"
                        value={data?.totalIncome.value != null ? `$${data.totalIncome.value.toLocaleString()}` : undefined}
                        trend={data?.totalIncome.trend}
                        icon={TrendingUp}
                        isLoading={isLoading}
                        isError={isError}
                        color="#00aa00"
                    />
                    <KpiCard
                        title="Total Expenses"
                        value={data?.totalExpenses.value != null ? `$${data.totalExpenses.value.toLocaleString()}` : undefined}
                        trend={data?.totalExpenses.trend}
                        icon={TrendingDown}
                        isLoading={isLoading}
                        isError={isError}
                        color="#aa0000"
                    />
                    <KpiCard
                        title="Net Savings"
                        value={data?.netCashFlow.value != null ? `$${data.netCashFlow.value.toLocaleString()}` : undefined}
                        trend={data?.netCashFlow.trend}
                        isLoading={isLoading}
                        isError={isError}
                        icon={PiggyBank}
                    />
                    <KpiCard
                        title="Savings Rate"
                        value={data?.savingsRate.value != null ? `${data.savingsRate.value.toFixed(1)}%` : undefined}
                        trend={data?.savingsRate.trend}
                        isLoading={isLoading}
                        isError={isError}
                        icon={Percent}
                        color="#0000aa"
                    />
                </div>
    )
}