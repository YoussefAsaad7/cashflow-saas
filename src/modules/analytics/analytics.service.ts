import { analyticsRepository } from "./analytics.repository";
import { expenseRepository } from "@/modules/expenses/expense.repository";
import { incomeRepository } from "@/modules/income/income.repository";
import { differenceInDays, subDays } from "date-fns";
import {
    eachDayOfInterval,
    eachWeekOfInterval,
    eachMonthOfInterval,
    eachYearOfInterval,
    format,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
} from "date-fns";
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

    async getTrends(userId: string, from: Date, to: Date, interval: 'day' | 'month' | 'week' | 'year') {
        const [incomeData, expenseData] = await Promise.all([
            analyticsRepository.getIncomeTrendData(userId, from, to),
            analyticsRepository.getExpenseTrendData(userId, from, to),
        ])
        // create empty timeline (gap filling backbone)
        const timeline = this.getIntervalDates(from, to, interval);

        const trendMap = new Map<string, {
            date: string,
            income: number,
            expenses: number,
        }>();

        timeline.forEach((date) => {
            const key = this.formatKey(date, interval);
            trendMap.set(key, {
                date: key,
                income: 0,
                expenses: 0,
            });
        });

        // Aggregate income
        for (const entry of incomeData) {
            const bucketDate = this.normalizeDate(entry.date, interval);
            const key = this.formatKey(bucketDate, interval);
            const bucket = trendMap.get(key);
            if (bucket) {
                bucket.income += Number(entry.amount);
            }
        }
        // Aggregate expenses
        for (const entry of expenseData) {
            const bucketDate = this.normalizeDate(entry.date, interval);
            const key = this.formatKey(bucketDate, interval);
            const bucket = trendMap.get(key);
            if (bucket) {
                bucket.expenses += Number(entry.amount);
            }
        }

        // compute derived values
        return Array.from(trendMap.values()).map((item) => {
            return {
                ...item,
                net: item.income - item.expenses,
            }
        });
    },


    //helpers
    getIntervalDates(from: Date, to: Date, interval: 'day' | 'week' | 'month' | 'year') {
        switch (interval) {
            case 'day':
                return eachDayOfInterval({ start: from, end: to })
            case 'week':
                return eachWeekOfInterval({ start: from, end: to })
            case 'month':
                return eachMonthOfInterval({ start: from, end: to })
            case 'year':
                return eachYearOfInterval({ start: from, end: to })
        }
    },
    normalizeDate(date: Date, interval: 'day' | 'week' | 'month' | 'year') {
        switch (interval) {
            case 'day':
                return startOfDay(date);
            case 'week':
                return startOfWeek(date);
            case 'month':
                return startOfMonth(date);
            case 'year':
                return startOfYear(date);
        }
    },
    formatKey(date: Date, interval: 'day' | 'week' | 'month' | 'year') {
        switch (interval) {
            case 'day':
            case 'week':
                return format(date, 'yyyy-MM-dd');
            case 'month':
                return format(date, 'yyyy-MM');
            case 'year':
                return format(date, 'yyyy');
        }
    },
};
