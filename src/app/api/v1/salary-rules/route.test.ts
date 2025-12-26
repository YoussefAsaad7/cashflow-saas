import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { salaryRuleService } from '@/modules/salary-rules/salary-rule.service';

vi.mock('@/modules/salary-rules/salary-rule.service', () => ({
    salaryRuleService: {
        create: vi.fn(),
        getActive: vi.fn(),
    },
}));

describe('/api/v1/salary-rules', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should create salary rule', async () => {
            const body = {
                name: 'Rule 1',
                currency: 'USD',
                baseType: 'MONTHLY',
                baseAmount: 3000,
                standardHoursPerDay: 8,
                workingDaysPerMonth: 22,
                overtimeEnabled: true,
                overtimeMultiplier: 1.5,
                holidayPaid: true,
                holidayMultiplier: 1,
                validFrom: '2024-01-01T00:00:00.000Z'
            };

            const req = new NextRequest('http://localhost/api/v1/salary-rules', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            vi.mocked(salaryRuleService.create).mockResolvedValue({ id: '1', ...body } as any);

            const res = await POST(req);
            expect(res.status).toBe(201);
            expect(salaryRuleService.create).toHaveBeenCalled();
        });

        it('should validate input', async () => {
            const req = new NextRequest('http://localhost/api/v1/salary-rules', {
                method: 'POST',
                body: JSON.stringify({})
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });

    describe('GET', () => {
        it('should list active rule', async () => {
            const req = new NextRequest('http://localhost/api/v1/salary-rules', { method: 'GET' });
            vi.mocked(salaryRuleService.getActive).mockResolvedValue({ id: '1' } as any);
            const res = await GET(req);
            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.active).toBeDefined();
        });
    });
});
