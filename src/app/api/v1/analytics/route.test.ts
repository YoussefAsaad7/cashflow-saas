import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getSummary } from './summary/route';
import { GET as getExpenseBreakdown } from './breakdown/expenses/route';
import { GET as getIncomeBreakdown } from './breakdown/incomes/route';
import { GET as getTrends } from './trends/route';
import { NextRequest } from 'next/server';
import { analyticsService } from '@/modules/analytics/analytics.service';

vi.mock('@/modules/analytics/analytics.service', () => ({
    analyticsService: {
        getFinancialSummary: vi.fn(),
        getExpenseCategoryBreakdown: vi.fn(),
        getIncomeSourceBreakdown: vi.fn(),
        getTrends: vi.fn(),
    },
}));

describe('Analytics API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /summary', () => {
        it('should return financial summary', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/summary?from=2024-01-01&to=2024-01-31', { method: 'GET' });

            vi.mocked(analyticsService.getFinancialSummary).mockResolvedValue({
                totalIncome: 1000,
                totalExpenses: 500,
                netCashFlow: 500,
                savingsRate: 50
            });

            const res = await getSummary(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.netCashFlow).toBe(500);
            expect(analyticsService.getFinancialSummary).toHaveBeenCalled();
        });

        it('should return 400 if params missing', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/summary', { method: 'GET' });
            const res = await getSummary(req);
            expect(res.status).toBe(400);
        });
    });

    describe('GET /breakdown/expenses', () => {
        it('should return expense breakdown', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/breakdown/expenses?from=2024-01-01&to=2024-01-31', { method: 'GET' });

            vi.mocked(analyticsService.getExpenseCategoryBreakdown).mockResolvedValue([
                { id: '1', name: 'Food', value: 200, color: 'red', percentage: 40 }
            ]);

            const res = await getExpenseBreakdown(req);
            expect(res.status).toBe(200);
            expect(analyticsService.getExpenseCategoryBreakdown).toHaveBeenCalled();
        });
    });

    describe('GET /breakdown/incomes', () => {
        it('should return income breakdown', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/breakdown/incomes?from=2024-01-01&to=2024-01-31', { method: 'GET' });

            vi.mocked(analyticsService.getIncomeSourceBreakdown).mockResolvedValue([
                { id: '1', name: 'Salary', value: 1000, color: 'green', percentage: 100 }
            ]);

            const res = await getIncomeBreakdown(req);
            expect(res.status).toBe(200);
            expect(analyticsService.getIncomeSourceBreakdown).toHaveBeenCalled();
        });
    });

    describe('GET /trends', () => {
        it('should return trends data', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/trends?from=2024-01-01&to=2024-01-31&interval=day', { method: 'GET' });

            vi.mocked(analyticsService.getTrends).mockResolvedValue([
                { date: '2024-01-01', income: 100, expenses: 50, net: 50 }
            ]);

            const res = await getTrends(req);
            expect(res.status).toBe(200);
            expect(analyticsService.getTrends).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Date),
                expect.any(Date),
                'day'
            );
        });

        it('should succeed with default interval', async () => {
            const req = new NextRequest('http://localhost/api/v1/analytics/trends?from=2024-01-01&to=2024-01-31', { method: 'GET' });
            vi.mocked(analyticsService.getTrends).mockResolvedValue([]);
            const res = await getTrends(req);
            expect(res.status).toBe(200);
        });
    });
});
