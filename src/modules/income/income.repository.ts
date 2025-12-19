import prisma from "@/lib/prisma";
import { IncomeEntryType, IncomeSourceType, Prisma } from "@/generated/prisma/client";
import { DateUtils } from "@/lib/date-utils";


export interface CreateIncomeEntryInput {
  userId: string;
  sourceId: string;
  amount: string;
  date: Date;
  type: IncomeEntryType;
  currency: string
  metadata: Prisma.InputJsonValue;
}

export interface CreateIncomeSourceInput {
  userId: string;
  name: string;
  type: IncomeSourceType;
}

export const incomeRepository = {
  createSource(input: CreateIncomeSourceInput) {
    return prisma.incomeSource.create({
      data: {
        userId: input.userId,
        name: input.name,
        type: input.type,
      }
    });
  },

  listSources(userId: string) {
    return prisma.incomeSource.findMany({
      where: { userId, isActive: true },
    });
  },

  create(input: CreateIncomeEntryInput) {
    return prisma.incomeEntry.create({
      data: {
        userId: input.userId,
        sourceId: input.sourceId,
        amount: input.amount,
        date: DateUtils.normalizeDate(input.date),
        type: input.type,
        currency: input.currency,
        metadata: input.metadata,
      },
    });
  },

  findByRange(userId: string, from: Date, to: Date) {
    return prisma.incomeEntry.findMany({
      where: {
        userId,
        date: { gte: DateUtils.normalizeDate(from), lte: DateUtils.normalizeDate(to) },
      },
      orderBy: { date: "asc" },
    });
  },
};
