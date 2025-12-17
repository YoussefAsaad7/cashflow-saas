/*
  Warnings:

  - Added the required column `salaryRuleId` to the `WorkDay` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SalaryBaseType" AS ENUM ('MONTHLY', 'DAILY', 'HOURLY');

-- AlterTable
ALTER TABLE "WorkDay" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "salaryRuleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SalaryRule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "baseType" "SalaryBaseType" NOT NULL,
    "baseAmount" DECIMAL(65,30) NOT NULL,
    "standardHoursPerDay" DECIMAL(65,30) NOT NULL,
    "workingDaysPerMonth" INTEGER,
    "overtimeEnabled" BOOLEAN NOT NULL,
    "overtimeMultiplier" DECIMAL(65,30),
    "holidayPaid" BOOLEAN NOT NULL,
    "holidayMultiplier" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SalaryRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalaryRule_userId_isActive_idx" ON "SalaryRule"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "WorkDay" ADD CONSTRAINT "WorkDay_salaryRuleId_fkey" FOREIGN KEY ("salaryRuleId") REFERENCES "SalaryRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
