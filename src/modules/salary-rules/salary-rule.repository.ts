import prisma from "@/lib/prisma";
import {Prisma, SalaryBaseType} from '@/generated/prisma/client';

export interface CreateSalaryRuleInput {
  userId: string
  name: string
  currency: string

  baseType: SalaryBaseType
  baseAmount: number

  standardHoursPerDay: number
  workingDaysPerMonth?: number | null

  overtimeEnabled: boolean
  overtimeMultiplier?: number | null

  holidayPaid: boolean
  holidayMultiplier?: number | null

  validFrom: Date
}

export const salaryRuleRepository = {
  async create(input: CreateSalaryRuleInput) {
    return prisma.salaryRule.create({
      data: {
        userId: input.userId, 

        name: input.name,
        currency: input.currency,
        baseType: input.baseType,

        baseAmount: new Prisma.Decimal(input.baseAmount),
        standardHoursPerDay: new Prisma.Decimal(input.standardHoursPerDay),

        workingDaysPerMonth: input.workingDaysPerMonth ?? null,

        overtimeEnabled: input.overtimeEnabled,
        overtimeMultiplier:
          input.overtimeMultiplier != null
            ? new Prisma.Decimal(input.overtimeMultiplier)
            : null,

        holidayPaid: input.holidayPaid,
        holidayMultiplier:
          input.holidayMultiplier != null
            ? new Prisma.Decimal(input.holidayMultiplier)
            : null,

        validFrom: input.validFrom,
        validTo: null,
        isActive: true,
      },
    })
  },

  deactivateActive(userId: string, validTo: Date) {
    return prisma.salaryRule.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        validTo,
      },
    })
  },

  findActive(userId: string) {
    return prisma.salaryRule.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        validFrom: 'desc',
      },
    })
  },

  findByDate(userId: string, date: Date) {
    return prisma.salaryRule.findFirst({
      where: {
        userId,
        validFrom: { lte: date },
        OR: [{ validTo: null }, { validTo: { gte: date } }],
      },
      orderBy: {
        validFrom: 'desc',
      },
    })
  },
}
