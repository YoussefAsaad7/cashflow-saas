import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { workdayService } from '@/modules/workday/workday.service';

// Mock the Service
vi.mock('@/modules/workday/workday.service', () => ({
    workdayService: {
        logWorkDay: vi.fn(),
        getWorkDaysInRange: vi.fn(),
    },
}));

describe('/api/v1/workdays', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should validate input and call service', async () => {
            const body = {
                date: '2024-05-20T00:00:00.000Z',
                status: 'WORKED',
                hoursWorked: 8.5
            };

            const req = new NextRequest('http://localhost/api/v1/workdays', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            // Mock Service Return
            vi.mocked(workdayService.logWorkDay).mockResolvedValue({ id: 'wd-1', amount: "100" } as any);

            const res = await POST(req);

            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.id).toBe('wd-1');

            expect(workdayService.logWorkDay).toHaveBeenCalledWith(
                'user-123',
                new Date(body.date),
                'WORKED',
                8.5
            );
        });

        it('should return 400 for invalid schema', async () => {
            const body = {
                date: 'invalid-date', // Invalid
                // status missing
            };

            const req = new NextRequest('http://localhost/api/v1/workdays', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            const res = await POST(req);
            expect(res.status).toBe(400);
            const json = await res.json();
            expect(json.error).toBe('Validation Error');
        });
    });

    describe('GET', () => {
        it('should return workdays for range', async () => {
            const from = '2024-01-01';
            const to = '2024-01-31';
            const req = new NextRequest(`http://localhost/api/v1/workdays?from=${from}&to=${to}`, {
                method: 'GET'
            });

            const mockData = [{ id: '1', date: new Date('2024-01-15') }];
            // @ts-ignore
            vi.mocked(workdayService.getWorkDaysInRange).mockResolvedValue(mockData);

            const res = await GET(req);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1' })]));

            expect(workdayService.getWorkDaysInRange).toHaveBeenCalledWith(
                'user-123',
                new Date(from),
                new Date(to)
            );
        });

        it('should return 400 if missing query params', async () => {
            const req = new NextRequest('http://localhost/api/v1/workdays?from=2024-01-01', { method: 'GET' });
            // Missing 'to'
            const res = await GET(req);
            expect(res.status).toBe(400);
        });
    });
});
