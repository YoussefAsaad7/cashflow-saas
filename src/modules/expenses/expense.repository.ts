import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

interface CreateExpenseInput {
  userId: string;
  categoryId: string;
  amount: string;
  date: Date;
  currency: string
  metadata?: Prisma.InputJsonValue;
}

export const expenseRepository = {
  create(input: CreateExpenseInput) {
    return prisma.expenseEntry.create({
      data: input,
    });
  },

  findByRange(userId: string, from: Date, to: Date) {
    return prisma.expenseEntry.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
    });
  },
};
