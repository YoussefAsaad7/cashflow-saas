import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { incomeService } from '@/modules/income/income.service';

vi.mock('@/modules/income/income.service', () => ({
    incomeService: {
        logIncomeEntry: vi.fn(),
        getIncomeHistory: vi.fn(),
    },
}));

describe('/api/v1/incomes/entries', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should log income entry', async () => {
            const body = {
                sourceId: 'clh1234567890abcdefghijkl',
                amount: 500,
                currency: 'USD',
                date: '2024-05-20T00:00:00.000Z',
                type: 'MANUAL',
                metadata: { note: "Bonus" }
            };

            const req = new NextRequest('http://localhost/api/v1/incomes/entries', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            vi.mocked(incomeService.logIncomeEntry).mockResolvedValue({ id: '1', ...body } as any);

            const res = await POST(req);
            expect(res.status).toBe(201);
            expect(incomeService.logIncomeEntry).toHaveBeenCalledWith(
                expect.objectContaining({
                    amount: "500",
                    currency: 'USD',
                    metadata: { note: "Bonus" }
                })
            );
        });
    });

    describe('GET', () => {
        it('should list history', async () => {
            const req = new NextRequest('http://localhost/api/v1/incomes/entries?from=2024-01-01&to=2024-01-31', { method: 'GET' });
            vi.mocked(incomeService.getIncomeHistory).mockResolvedValue([]);
            const res = await GET(req);
            expect(res.status).toBe(200);
        });
    });
});
