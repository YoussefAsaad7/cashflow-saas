import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workdayService } from './workday.service';
import { salaryRuleService } from '../salary-rules/salary-rule.service';
import { WorkDayRepository } from './workday.repository';
import { SalaryCalculator } from '../salary-calculator.engine';
import Decimal from 'decimal.js';

// Mocks
vi.mock('../salary-rules/salary-rule.service', () => ({
    salaryRuleService: {
        getForDate: vi.fn(),
    },
}));

vi.mock('./workday.repository', () => ({
    WorkDayRepository: {
        upsert: vi.fn(),
    },
}));

vi.mock('../salary-calculator.engine', () => ({
    SalaryCalculator: {
        calculateDailyEarnings: vi.fn(),
    },
}));

describe('WorkDay Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockDate = new Date('2024-01-15');
    const mockUserId = 'user-123';

    it('should throw error if no active rule found', async () => {
        vi.mocked(salaryRuleService.getForDate).mockResolvedValue(null);

        await expect(workdayService.logWorkDay(mockUserId, mockDate, 'WORKED'))
            .rejects.toThrow("No active salary rule found");
    });

    it('should calculate and persist earnings', async () => {
        // 1. Mock Rule
        const mockRule = {
            id: 'rule-1',
            baseType: 'MONTHLY',
            baseAmount: 1000,
            standardHoursPerDay: 8,
            workingDaysPerMonth: 20,
            overtimeEnabled: false,
            holidayPaid: true,
        };
        // @ts-ignore - Partial mock is enough
        vi.mocked(salaryRuleService.getForDate).mockResolvedValue(mockRule);

        // 2. Mock Calculator
        vi.mocked(SalaryCalculator.calculateDailyEarnings).mockReturnValue(new Decimal(50));

        // 3. Mock Repository
        vi.mocked(WorkDayRepository.upsert).mockResolvedValue({ id: 'wd-1' } as any);

        // Execute
        await workdayService.logWorkDay(mockUserId, mockDate, 'WORKED', 8);

        // Verify
        expect(salaryRuleService.getForDate).toHaveBeenCalledWith(mockUserId, mockDate);

        expect(SalaryCalculator.calculateDailyEarnings).toHaveBeenCalledWith(
            expect.objectContaining({
                baseType: 'MONTHLY',
                baseAmount: expect.any(Decimal) // Check if mapped correctly
            }),
            'WORKED',
            { totalHours: 8 }
        );

        expect(WorkDayRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
            userId: mockUserId,
            date: mockDate,
            amount: "50",
            salaryRuleId: 'rule-1',
            metadata: expect.objectContaining({
                hoursWorked: 8
            })
        }));
    });
});
