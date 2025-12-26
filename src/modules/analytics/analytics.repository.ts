import prisma from "@/lib/prisma";
import { DateUtils } from "@/lib/date-utils";

export const analyticsRepository = {
    // --- Aggregations (Sums) ---
    async aggregateIncome(userId: string, from: Date, to: Date) {
        const result = await prisma.incomeEntry.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
        });
        return result._sum.amount || 0;
    },

    async aggregateExpenses(userId: string, from: Date, to: Date) {
        const result = await prisma.expenseEntry.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
        });
        return result._sum.amount || 0;
    },

    // --- Breakdowns (Grouping) ---
    async groupExpensesByCategory(userId: string, from: Date, to: Date) {
        return prisma.expenseEntry.groupBy({
            by: ['categoryId'],
            _sum: { amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
        });
    },

    async groupIncomeBySource(userId: string, from: Date, to: Date) {
        return prisma.incomeEntry.groupBy({
            by: ['sourceId'],
            _sum: { amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
        });
    },

    // --- Trends (Raw Data for Service Aggregation) ---
    // We fetch raw data here because Prisma's groupBy(date) is limited without raw SQL.
    // For a "Start" scale, fetching relevant fields is performant enough.
    async getIncomeTrendData(userId: string, from: Date, to: Date) {
        return prisma.incomeEntry.findMany({
            select: { date: true, amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
            orderBy: { date: 'asc' },
        });
    },

    async getExpenseTrendData(userId: string, from: Date, to: Date) {
        return prisma.expenseEntry.findMany({
            select: { date: true, amount: true },
            where: {
                userId,
                date: {
                    gte: DateUtils.normalizeDate(from),
                    lte: DateUtils.normalizeDate(to),
                },
            },
            orderBy: { date: 'asc' },
        });
    },
};
