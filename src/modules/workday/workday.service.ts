import { WorkDayRepository } from './workday.repository';
import { salaryRuleService } from '../salary-rules/salary-rule.service';
import { SalaryCalculator, SalaryRuleDomain } from '../salary-calculator.engine';
import { WorkDayStatus } from '@/generated/prisma/client';
import { DateUtils } from '@/lib/date-utils';
import Decimal from 'decimal.js';

export const workdayService = {
    /**
     * Logs a work day by calculating earnings based on the active salary rule
     * and persisting the result.
     */
    async logWorkDay(
        userId: string,
        date: Date,
        status: WorkDayStatus,
        hoursWorked?: number
    ) {
        // Normalize Date to Midnight UTC
        const normalizedDate = DateUtils.normalizeDate(date);

        // 1. Get the Salary Rule active for this date
        const rule = await salaryRuleService.getForDate(userId, normalizedDate);

        if (!rule) {
            throw new Error(`No active salary rule found for date: ${date.toISOString()}`);
        }

        // 2. Map Prisma Rule to Domain Rule
        // We need to map explicitly because our Engine is decoupled from Prisma
        const domainRule: SalaryRuleDomain = {
            baseType: rule.baseType,
            baseAmount: new Decimal(rule.baseAmount),
            standardHoursPerDay: new Decimal(rule.standardHoursPerDay),
            workingDaysPerMonth: rule.workingDaysPerMonth,
            overtimeEnabled: rule.overtimeEnabled,
            overtimeMultiplier: rule.overtimeMultiplier ? new Decimal(rule.overtimeMultiplier) : null,
            holidayPaid: rule.holidayPaid,
            holidayMultiplier: rule.holidayMultiplier ? new Decimal(rule.holidayMultiplier) : null,
        };

        // 3. Calculate Earnings
        const earnings = SalaryCalculator.calculateDailyEarnings(
            domainRule,
            status,
            { totalHours: hoursWorked }
        );

        // 4. Persist
        return WorkDayRepository.upsert({
            userId,
            date: normalizedDate,
            status,
            amount: earnings.toString(), // Store as string/decimal in DB
            salaryRuleId: rule.id,
            metadata: {
                calculatedAt: new Date(),
                hoursWorked,
                ruleSnapshot: {
                    name: rule.name,
                    baseType: rule.baseType
                }
            }
        });
    },

    /**
     * Retrieves work days for a user within a specific date range.
     */
    async getWorkDaysInRange(userId: string, from: Date, to: Date) {
        const start = DateUtils.normalizeDate(from);
        const end = DateUtils.normalizeDate(to);

        return WorkDayRepository.findByRange(userId, start, end);
    }
};
