export type Interval = 'day' | 'week' | 'month' | 'year';

export type TrendData = {
    date: string;
    income: number;
    expenses: number;
    net: number;
};

export type FinancialSummary = {
    totalIncome: { value: number; trend: number };
    totalExpenses: { value: number; trend: number };
    netCashFlow: { value: number; trend: number };
    savingsRate: { value: number; trend: number };
};
