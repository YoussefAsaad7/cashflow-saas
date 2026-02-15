"use client";
import { format, parseISO } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, type TooltipProps, XAxis, YAxis } from "recharts";
import { useDashboardTrends } from "@/features/analytics/hooks/use-dashboard-trends";
import { DateRange } from "react-day-picker";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type ChartInterval = 'day' | 'week' | 'month' | 'year';
type TooltipEntry = {
    name: string
    value: number
    color: string
}

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
    interval: ChartInterval;
    payload: TooltipEntry[];
    label: string;
};

const incomeColor = "var(--chart-5)";
const expensesColor = "var(--chart-2)";
const formatInterval = (value: string, interval: ChartInterval) => {
    if (!value) return "";
    switch (interval) {
        case "day":
            return format(parseISO(value), "d MMM");
        case "week":
            return format(parseISO(value), "d MMM");
        case "month":
            return format(parseISO(value), "MMM yy");
        case "year":
            return format(parseISO(value), "yyyy");
    }

}

const CustomTooltip = ({ active, payload, label, interval }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-foreground mb-2">{formatInterval(label, interval)}</p>
            {payload.map((entry: TooltipEntry, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.name}
                    </span>
                    <span className="font-mono font-medium text-foreground">${entry.value.toLocaleString()}</span>
                </div>
            ))}
            {payload.length === 2 && (
                <div className="flex items-center justify-between gap-4 text-sm mt-2 pt-2 border-t border-border">
                    <span className="text-muted-foreground">Net</span>
                    <span
                        className={`font-mono font-medium ${payload[0].value - payload[1].value >= 0 ? "text-success" : "text-destructive"}`}
                    >
                        ${(payload[0].value - payload[1].value).toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
};

export function IncomeExpenseChart({ dateRange }: { dateRange: DateRange | undefined }) {
    const { trends, isPending, isError, interval } = useDashboardTrends(dateRange);

    return (
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-sm font-medium text-foreground">Income vs Expenses</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className={`rounded-full w-2 h-2 bg-chart-5`}></span>
                        <span className="text-muted-foreground">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`rounded-full w-2 h-2 bg-chart-2`}></span>
                        <span className="text-muted-foreground">Expenses</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%" className="relative">
                        {trends?.length == 0 || isPending || isError ? (
                            <div className="absolute inset-0 bg-card/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                                {isError ? (
                                    <span className="text-xs text-destructive font-medium bg-background/80 px-2 py-1 rounded shadow-sm border border-destructive/20">
                                        Error loading data
                                    </span>
                                ) : isPending ? (
                                    <span className="text-xs text-muted-foreground font-medium bg-background/80 px-2 py-1 rounded shadow-sm border border-muted-foreground/20">
                                        Loading data...
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground font-medium bg-background/80 px-2 py-1 rounded shadow-sm border border-muted-foreground/20">
                                        No data available
                                    </span>
                                )}
                            </div>
                        ) : (
                            <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatInterval(value, interval)}
                                />
                                <YAxis
                                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                {/* @ts-expect-error custom tooltip*/}
                                <Tooltip content={<CustomTooltip interval={interval} />} cursor={{ fill: "oklch(0.22 0.01 260)", opacity: 0.5 }} />
                                <Bar dataKey="income" name="Income" fill={incomeColor} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill={expensesColor} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}