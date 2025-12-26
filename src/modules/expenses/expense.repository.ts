import prisma from "@/lib/prisma";
import { Prisma, ExpenseType } from "@/generated/prisma/client";
import { DateUtils } from "@/lib/date-utils";

export interface CreateExpenseInput {
  userId: string;
  categoryId: string;
  amount: string;
  date: Date;
  currency: string;
  metadata?: Prisma.InputJsonValue;
}

export interface CreateExpenseCategoryInput {
  userId: string;
  name: string;
  type: ExpenseType;
}

export const expenseRepository = {
  createCategory(input: CreateExpenseCategoryInput) {
    return prisma.expenseCategory.create({
      data: input,
    });
  },

  listCategories(userId: string) {
    return prisma.expenseCategory.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  },

  create(input: CreateExpenseInput) {
    return prisma.expenseEntry.create({
      data: { ...input, date: DateUtils.normalizeDate(input.date) },
    });
  },

  findByRange(userId: string, from: Date, to: Date) {
    return prisma.expenseEntry.findMany({
      where: {
        userId,
        date: {
          gte: DateUtils.normalizeDate(from),
          lte: DateUtils.normalizeDate(to),
        },
      },
      orderBy: { date: "asc" },
    });
  },
};
