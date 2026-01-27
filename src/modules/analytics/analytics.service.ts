import { analyticsRepository } from "./analytics.repository";
import { expenseRepository } from "@/modules/expenses/expense.repository";
import { incomeRepository } from "@/modules/income/income.repository";
import { differenceInDays, subDays } from "date-fns";

export const analyticsService = {
    async getFinancialSummary(userId: string, from: Date, to: Date) {
        const diffDays = differenceInDays(to, from) + 1; // +1 to include start day impact if needed, or just standard difference. Usually differenceInDays(to, from) is fine for "period length".
        // If from=Jan 1 and to=Jan 31, diff is 30? No, usually we want inclusive range.
        // Let's stick seamlessly to logic: Period B ends at 'from'. Period B starts 'diff' days before.

        const previousTo = new Date(from);
        const previousFrom = subDays(from, diffDays);

        const [
            totalIncome,
            totalExpenses,
            lastPeriodIncome,
            lastPeriodExpenses
        ] = await Promise.all([
            analyticsRepository.aggregateIncome(userId, from, to),
            analyticsRepository.aggregateExpenses(userId, from, to),
            analyticsRepository.aggregateIncome(userId, previousFrom, previousTo),
            analyticsRepository.aggregateExpenses(userId, previousFrom, previousTo)
        ]);

        const incomeVal = Number(totalIncome);
        const expenseVal = Number(totalExpenses);
        const lastPeriodIncomeVal = Number(lastPeriodIncome);
        const lastPeriodExpenseVal = Number(lastPeriodExpenses);

        const netCashFlow = incomeVal - expenseVal;
        const lastPeriodNetCashFlow = lastPeriodIncomeVal - lastPeriodExpenseVal;

        const savingsRate = incomeVal > 0 ? ((incomeVal - expenseVal) / incomeVal) * 100 : 0;
        const lastPeriodSavingsRate = lastPeriodIncomeVal > 0 ? ((lastPeriodIncomeVal - lastPeriodExpenseVal) / lastPeriodIncomeVal) * 100 : 0;

        return {
            totalIncome: {
                value: incomeVal,
                trend: this.calculateTrend(incomeVal, lastPeriodIncomeVal)
            },
            totalExpenses: {
                value: expenseVal,
                trend: this.calculateTrend(expenseVal, lastPeriodExpenseVal)
            },
            netCashFlow: {
                value: netCashFlow,
                trend: this.calculateTrend(netCashFlow, lastPeriodNetCashFlow)
            },
            savingsRate: {
                value: savingsRate,
                trend: savingsRate - lastPeriodSavingsRate // Percentage point difference for rates, or standard trend? usually trend for rates is just diff.
            }
        };
    },

    calculateTrend(current: number, previous: number): number {
        if (previous === 0) {
            return current === 0 ? 0 : 100;
        }
        return ((current - previous) / Math.abs(previous)) * 100;
    },

    async getExpenseCategoryBreakdown(userId: string, from: Date, to: Date) {
        const grouped = await analyticsRepository.groupExpensesByCategory(userId, from, to);
        const categories = await expenseRepository.listCategories(userId);

        const categoryMap = new Map(categories.map(c => [c.id, c]));

        const totalExpense = grouped.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);

        return grouped.map(item => {
            const category = categoryMap.get(item.categoryId);
            const amount = Number(item._sum.amount || 0);
            return {
                id: item.categoryId,
                name: category?.name || 'Unknown',
                value: amount,
                color: category?.type === 'FIXED' ? '#ef4444' : '#f59e0b', // Example Logic
                percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
            };
        }).sort((a, b) => b.value - a.value);
    },

    async getIncomeSourceBreakdown(userId: string, from: Date, to: Date) {
        const grouped = await analyticsRepository.groupIncomeBySource(userId, from, to);
        const sources = await incomeRepository.listSources(userId);

        const sourceMap = new Map(sources.map(s => [s.id, s]));

        const totalIncome = grouped.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);

        return grouped.map(item => {
            const source = sourceMap.get(item.sourceId);
            const amount = Number(item._sum.amount || 0);
            return {
                id: item.sourceId,
                name: source?.name || 'Unknown',
                value: amount,
                color: '#10b981', // Green for income
                percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
            };
        }).sort((a, b) => b.value - a.value);
    },

    async getTrends(userId: string, from: Date, to: Date, interval: 'day' | 'month' = 'day') {
        const incomeData = await analyticsRepository.getIncomeTrendData(userId, from, to);
        const expenseData = await analyticsRepository.getExpenseTrendData(userId, from, to);

        // Helper to format date key based on interval
        const getDateKey = (date: Date) => {
            const d = new Date(date);
            if (interval === 'month') {
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const trendMap = new Map<string, { date: string, income: number, expenses: number }>();

        // Initialize map ? (Optional: fill gaps if needed, skipping for now to show actual data)

        // Process Income
        incomeData.forEach(entry => {
            const key = getDateKey(entry.date);
            const current = trendMap.get(key) || { date: key, income: 0, expenses: 0 };
            current.income += Number(entry.amount);
            trendMap.set(key, current);
        });

        // Process Expense
        expenseData.forEach(entry => {
            const key = getDateKey(entry.date);
            const current = trendMap.get(key) || { date: key, income: 0, expenses: 0 };
            current.expenses += Number(entry.amount);
            trendMap.set(key, current);
        });

        return Array.from(trendMap.values())
            .map(item => ({ ...item, net: item.income - item.expenses }))
            .sort((a, b) => a.date.localeCompare(b.date));
    },
};
