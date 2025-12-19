import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { expenseService } from '@/modules/expenses/expense.service';

vi.mock('@/modules/expenses/expense.service', () => ({
    expenseService: {
        logExpense: vi.fn(),
        getExpenseHistory: vi.fn(),
    },
}));

describe('/api/v1/expenses/entries', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should log expense entry', async () => {
            const body = {
                categoryId: 'clh1234567890abcdefghijkl',
                amount: 150.50,
                currency: 'USD',
                date: '2024-05-20T00:00:00.000Z',
                metadata: { note: "Lunch" }
            };

            const req = new NextRequest('http://localhost/api/v1/expenses/entries', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            vi.mocked(expenseService.logExpense).mockResolvedValue({ id: '1', ...body } as any);

            const res = await POST(req);
            expect(res.status).toBe(201);
            expect(expenseService.logExpense).toHaveBeenCalledWith(
                expect.objectContaining({
                    amount: "150.5",
                    currency: 'USD',
                })
            );
        });
    });

    describe('GET', () => {
        it('should list history', async () => {
            const req = new NextRequest('http://localhost/api/v1/expenses/entries?from=2024-01-01&to=2024-01-31', { method: 'GET' });
            vi.mocked(expenseService.getExpenseHistory).mockResolvedValue([]);
            const res = await GET(req);
            expect(res.status).toBe(200);
        });

        it('should return 400 if query params missing', async () => {
            const req = new NextRequest('http://localhost/api/v1/expenses/entries', { method: 'GET' });
            const res = await GET(req);
            expect(res.status).toBe(400);
        });
    });
});
