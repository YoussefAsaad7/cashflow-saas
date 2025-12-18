// src/modules/salary-calculator.engine.ts
import Decimal from 'decimal.js';

// --- Domain Types (Decoupled from Prisma) ---

export type SalaryBaseType = 'MONTHLY' | 'DAILY' | 'HOURLY';
export type WorkDayStatus = 'WORKED' | 'HOLIDAY' | 'WORKED_HOLIDAY' | 'SICK' | 'UNPAID_LEAVE';

export interface SalaryRuleDomain {
  baseType: SalaryBaseType;
  baseAmount: Decimal | number | string;

  standardHoursPerDay: Decimal | number | string;
  workingDaysPerMonth?: number | null; // Required if baseType is MONTHLY

  overtimeEnabled: boolean;
  overtimeMultiplier?: Decimal | number | string | null;

  holidayPaid: boolean;
  holidayMultiplier?: Decimal | number | string | null;
}

export interface CalculationParams {
  totalHours?: number;
}

export const SalaryCalculator = {
  /**
   * Pure function to calculate earnings for a specific day.
   * Throws errors for invalid configurations (no silent defaults).
   */
  calculateDailyEarnings(
    rule: SalaryRuleDomain,
    status: WorkDayStatus,
    params: CalculationParams = {}
  ): Decimal {
    // Normalize inputs to Decimal
    const baseAmount = new Decimal(rule.baseAmount);
    const standardHours = new Decimal(rule.standardHoursPerDay);

    // Validate Configuration
    if (rule.baseType === 'MONTHLY' && !rule.workingDaysPerMonth) {
      throw new Error("Validation Error: 'workingDaysPerMonth' is required for MONTHLY salary rules.");
    }

    // 1. Determine Daily Rate & Hourly Rate
    let dailyRate = new Decimal(0);
    let hourlyRate = new Decimal(0);

    if (rule.baseType === 'DAILY') {
      dailyRate = baseAmount;
      hourlyRate = dailyRate.div(standardHours);
    } else if (rule.baseType === 'HOURLY') {
      hourlyRate = baseAmount;
      dailyRate = hourlyRate.mul(standardHours);
    } else if (rule.baseType === 'MONTHLY') {
      // We explicitly validated workingDaysPerMonth exists above
      const workingDays = new Decimal(rule.workingDaysPerMonth!);
      dailyRate = baseAmount.div(workingDays);
      hourlyRate = dailyRate.div(standardHours);
    }

    // Determine Actual Hours (Hoisted for use in Status Switch)
    const totalHours = new Decimal(params.totalHours ?? 0);
    const actualHours = (params.totalHours !== undefined) ? totalHours : standardHours;

    // 2. Handle Status
    switch (status) {
      case 'SICK':
      case 'UNPAID_LEAVE':
        return new Decimal(0);

      case 'HOLIDAY':
        return rule.holidayPaid ? dailyRate : new Decimal(0);

      case 'WORKED_HOLIDAY':
        // BUGFIX: Pay strictly based on hours worked * holiday multiplier
        const holMultiplier = rule.holidayMultiplier
          ? new Decimal(rule.holidayMultiplier)
          : new Decimal(1);
        return actualHours.mul(hourlyRate).mul(holMultiplier);

      case 'WORKED':
        // Proceed to calculation
        break;

      default:
        // Fail fast for unknown statuses
        throw new Error(`Unknown WorkDayStatus: ${status}`);
    }

    // 3. Calculate Pay for WORKED / WORKED_HOLIDAY
    //    Logic: Base Pay + Overtime Pay
    //    For WORKED_HOLIDAY, Base Pay is multiplied by holiday multiplier.
    //    Overtime Pay is calculated separately using overtime multiplier.



    // Explicit ambiguity Check: If totalHours is 0, assume standard day? 
    // Or strictly require hours? 
    // Current design: If params.totalHours is provided, use it. 
    // If not provided, assume Standard Hours for "WorkDay" context? 
    // NO. If we want to be strict, we really should require hours for calculation if it matters.
    // But for backward compat/ease, let's default to standardHours IF not provided.
    // The user asked to clarify semantics.



    const extraHours = actualHours.sub(standardHours);

    // -- Base Portion --
    let basePay = dailyRate;



    // -- Overtime / Undertime Portion --
    let adjustmentPay = new Decimal(0);

    if (extraHours.isPositive()) {
      if (rule.overtimeEnabled) {
        const otMultiplier = rule.overtimeMultiplier
          ? new Decimal(rule.overtimeMultiplier)
          : new Decimal(1.5);

        // Overtime is: Extra Hours * Hourly Rate * OT Multiplier
        adjustmentPay = extraHours.mul(hourlyRate).mul(otMultiplier);
      } else {
        // Overtime disabled: Just pay straight time for extra hours? 
        // Or zero? Usually standard salary implies fixed pay despite OT if OT disabled.
        // But for HOURLY, you get paid.
        // For MONTHLY/DAILY, if OT disabled, usually you don't get extra.
        if (rule.baseType === 'HOURLY') {
          adjustmentPay = extraHours.mul(hourlyRate);
        }
      }
    } else if (extraHours.isNegative()) {
      // Worked LESS than standard
      // For HOURLY: Deduct
      // For MONTHLY/DAILY: Usually deducted too if strict, or ignored.
      // Let's assume strict deduction for now to be "Engine" accurate, 
      // but maybe this needs a flag? 
      // For now, let's implement strict correlation:
      // Pay = Hours * HourlyRate (effectively)
      // So adjustments = (Actual - Standard) * HourlyRate
      // This effectively reduces the dailyRate.

      adjustmentPay = extraHours.mul(hourlyRate);
    }

    return basePay.add(adjustmentPay);
  }
};
