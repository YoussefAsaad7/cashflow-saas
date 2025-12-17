/*
  Warnings:

  - Added the required column `currency` to the `ExpenseEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `IncomeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseEntry" ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IncomeEntry" ADD COLUMN     "currency" TEXT NOT NULL;
