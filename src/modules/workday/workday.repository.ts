import prisma from "@/lib/prisma";
import { WorkDayStatus, Prisma } from "@/generated/prisma/client";

export interface UpsertWorkDayInput {
  userId: string;
  date: Date;
  status: WorkDayStatus;
  amount: string;
  metadata?: Prisma.InputJsonValue;
}

export const WorkDayRepository = {
  upsert(input: UpsertWorkDayInput) {
    return prisma.workDay.upsert({
      where: {
        userId_date: {
          userId: input.userId,
          date: input.date,
        },
      },
      update: {
        status: input.status,
        amount: input.amount,
        metadata: input.metadata,
      },
      create: {
        userId: input.userId,
        date: input.date,
        status: input.status,
        amount: input.amount,
        metadata: input.metadata,
      },
    });
  },

  findByRange(userId: string, from: Date, to: Date) {
    return prisma.workDay.findMany({
      where: {
        userId,
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { date: "asc" },
    });
  },
};
