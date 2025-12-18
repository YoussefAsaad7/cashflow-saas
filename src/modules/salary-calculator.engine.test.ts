
import { describe, it, expect } from 'vitest';
import { SalaryCalculator, SalaryRuleDomain } from './salary-calculator.engine';
import Decimal from 'decimal.js';

describe('SalaryCalculator Engine', () => {
    // Helper to create a base rule
    const createRule = (overrides: Partial<SalaryRuleDomain> = {}): SalaryRuleDomain => ({
        baseType: 'MONTHLY',
        baseAmount: 5000, // Monthly salary
        standardHoursPerDay: 8,
        workingDaysPerMonth: 22,
        overtimeEnabled: true,
        overtimeMultiplier: 1.5,
        holidayPaid: true,
        holidayMultiplier: 2.0,
        ...overrides
    });

    describe('MONTHLY Salary', () => {
        const monthlyRule = createRule({ baseType: 'MONTHLY', baseAmount: 2200, workingDaysPerMonth: 22, standardHoursPerDay: 8 });
        // Daily Rate = 2200 / 22 = 100
        // Hourly Rate = 100 / 8 = 12.5

        it('should calculate standard worked day correctly', () => {
            const result = SalaryCalculator.calculateDailyEarnings(monthlyRule, 'WORKED');
            expect(result.toNumber()).toBe(100);
        });

        it('should throw validation error if workingDaysPerMonth is missing', () => {
            const invalidRule = { ...monthlyRule, workingDaysPerMonth: null };
            expect(() => SalaryCalculator.calculateDailyEarnings(invalidRule, 'WORKED'))
                .toThrow("Validation Error: 'workingDaysPerMonth' is required for MONTHLY salary rules.");
        });

        it('should return 0 for SICK or UNPAID_LEAVE', () => {
            expect(SalaryCalculator.calculateDailyEarnings(monthlyRule, 'SICK').toNumber()).toBe(0);
            expect(SalaryCalculator.calculateDailyEarnings(monthlyRule, 'UNPAID_LEAVE').toNumber()).toBe(0);
        });

        it('should pay Daily Rate for HOLIDAY if paid', () => {
            expect(SalaryCalculator.calculateDailyEarnings(monthlyRule, 'HOLIDAY').toNumber()).toBe(100);
        });

        it('should pay 0 for HOLIDAY if unpaid', () => {
            const unpaidHolidayRule = createRule({ ...monthlyRule, holidayPaid: false });
            expect(SalaryCalculator.calculateDailyEarnings(unpaidHolidayRule, 'HOLIDAY').toNumber()).toBe(0);
        });

        it('should apply Holiday Multiplier for WORKED_HOLIDAY', () => {
            // Multiplier 2.0 -> 100 * 2 = 200
            expect(SalaryCalculator.calculateDailyEarnings(monthlyRule, 'WORKED_HOLIDAY').toNumber()).toBe(200);
        });

        it('should calculate Overtime correctly', () => {
            // Worked 10 hours (2 hours OT)
            // OT Rate = 12.5 * 1.5 = 18.75
            // Base (100) + OT (2 * 18.75 = 37.5) = 137.5
            const result = SalaryCalculator.calculateDailyEarnings(monthlyRule, 'WORKED', { totalHours: 10 });
            expect(result.toNumber()).toBe(137.5);
        });

        it('should deduct strictly for undertime', () => {
            // Worked 4 hours (-4 hours)
            // Deduction = -4 * 12.5 = -50
            // Pay = 100 - 50 = 50
            const result = SalaryCalculator.calculateDailyEarnings(monthlyRule, 'WORKED', { totalHours: 4 });
            expect(result.toNumber()).toBe(50);
        });

        it('should pay only for hours worked on WORKED_HOLIDAY (Partial Day)', () => {
            // Worked 4 hours on Holiday (Standard 8)
            // Hourly Rate = 12.5
            // Holiday Multiplier = 2.0
            // Expected Pay = 4 * 12.5 * 2.0 = 100
            // Current Buggy Logic: (StandardDay * HolMul) + Undertime
            // = (100 * 2) + (-4 * 12.5) = 200 - 50 = 150 (WRONG)

            const result = SalaryCalculator.calculateDailyEarnings(monthlyRule, 'WORKED_HOLIDAY', { totalHours: 4 });
            expect(result.toNumber()).toBe(100);
        });
    });

    describe('HOURLY Salary', () => {
        const hourlyRule = createRule({
            baseType: 'HOURLY',
            baseAmount: 20, // Hourly Rate
            standardHoursPerDay: 8,
            workingDaysPerMonth: null // Not needed
        });
        // Daily Rate = 20 * 8 = 160

        it('should pay exactly hours worked', () => {
            // 8 hours -> 160
            expect(SalaryCalculator.calculateDailyEarnings(hourlyRule, 'WORKED', { totalHours: 8 }).toNumber()).toBe(160);

            // 10 hours -> 8 * 20 (160) + 2 * 20 * 1.5 (60) = 220
            expect(SalaryCalculator.calculateDailyEarnings(hourlyRule, 'WORKED', { totalHours: 10 }).toNumber()).toBe(220);
        });

        it('should pay straight rate for undertime', () => {
            // 4 hours -> 4 * 20 = 80
            expect(SalaryCalculator.calculateDailyEarnings(hourlyRule, 'WORKED', { totalHours: 4 }).toNumber()).toBe(80);
        });
    });

    describe('Edge Cases & Decoupling', () => {
        it('should accept string inputs from API/Forms', () => {
            const stringRule = createRule({
                baseType: 'DAILY',
                baseAmount: "100",
                standardHoursPerDay: "8",
                overtimeMultiplier: "1.5"
            });
            // Worked 10 hours. Rate 100. Hourly 12.5.
            // Base 100. OT: 2 * 12.5 * 1.5 = 37.5. Total 137.5
            const result = SalaryCalculator.calculateDailyEarnings(stringRule, 'WORKED', { totalHours: 10 });
            expect(result.toNumber()).toBe(137.5);
        });

        it('should throw for unknown status', () => {
            // @ts-ignore
            expect(() => SalaryCalculator.calculateDailyEarnings(createRule(), 'UNKNOWN_STATUS'))
                .toThrow("Unknown WorkDayStatus: UNKNOWN_STATUS");
        });
    });
});
