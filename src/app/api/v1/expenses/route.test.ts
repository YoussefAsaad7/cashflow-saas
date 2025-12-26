import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { expenseService } from '@/modules/expenses/expense.service';

vi.mock('@/modules/expenses/expense.service', () => ({
    expenseService: {
        createCategory: vi.fn(),
        getCategories: vi.fn(),
    },
}));

describe('/api/v1/expenses', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should create expense category', async () => {
            const body = { name: 'Food', type: 'VARIABLE' };
            const req = new NextRequest('http://localhost/api/v1/expenses', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            vi.mocked(expenseService.createCategory).mockResolvedValue({ id: '1', ...body } as any);

            const res = await POST(req);
            expect(res.status).toBe(201);
            expect(expenseService.createCategory).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Food', type: 'VARIABLE' })
            );
        });

        it('should validate input', async () => {
            const req = new NextRequest('http://localhost/api/v1/expenses', {
                method: 'POST',
                body: JSON.stringify({}) // Empty body
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });

    describe('GET', () => {
        it('should list categories', async () => {
            const req = new NextRequest('http://localhost/api/v1/expenses', { method: 'GET' });
            vi.mocked(expenseService.getCategories).mockResolvedValue([]);
            const res = await GET(req);
            expect(res.status).toBe(200);
        });
    });
});
