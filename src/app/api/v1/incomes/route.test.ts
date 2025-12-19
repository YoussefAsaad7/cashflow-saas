import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { incomeService } from '@/modules/income/income.service';

vi.mock('@/modules/income/income.service', () => ({
    incomeService: {
        createIncomeSource: vi.fn(),
        getIncomeSources: vi.fn(),
    },
}));

describe('/api/v1/incomes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should create income source', async () => {
            const body = { name: 'Job', type: 'FULL_TIME' };
            const req = new NextRequest('http://localhost/api/v1/incomes', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            vi.mocked(incomeService.createIncomeSource).mockResolvedValue({ id: '1', ...body } as any);

            const res = await POST(req);
            expect(res.status).toBe(201);
            expect(incomeService.createIncomeSource).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Job', type: 'FULL_TIME' })
            );
        });

        it('should validate input', async () => {
            const req = new NextRequest('http://localhost/api/v1/incomes', {
                method: 'POST',
                body: JSON.stringify({}) // Empty body
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });

    describe('GET', () => {
        it('should list sources', async () => {
            const req = new NextRequest('http://localhost/api/v1/incomes', { method: 'GET' });
            vi.mocked(incomeService.getIncomeSources).mockResolvedValue([]);
            const res = await GET(req);
            expect(res.status).toBe(200);
        });
    });
});
