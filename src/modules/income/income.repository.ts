import prisma from "@/lib/prisma";
import { IncomeEntryType, Prisma } from "@/generated/prisma/client";

export interface CreateIncomeEntryInput {
  userId: string;
  sourceId: string;
  amount: string;
  date: Date;
  type: IncomeEntryType;
  currency: string
  metadata: Prisma.InputJsonValue;
}

export const incomeRepository = {
  create(input: CreateIncomeEntryInput) {
    return prisma.incomeEntry.create({
      data: {
        userId: input.userId,
        sourceId: input.sourceId,
        amount: input.amount,
        date: input.date,
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
        date: { gte: from, lte: to },
      },
      orderBy: { date: "asc" },
    });
  },
};
