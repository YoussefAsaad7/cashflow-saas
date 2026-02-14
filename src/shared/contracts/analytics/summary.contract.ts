export type KPI = {
    value: number;
    trend: number;
};
export type FinancialSummary = {
    totalIncome: KPI;
    totalExpenses: KPI;
    netCashFlow: KPI;
    savingsRate: KPI;
}

export type SummaryResponse = FinancialSummary;