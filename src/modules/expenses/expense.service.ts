import { expenseRepository, CreateExpenseCategoryInput, CreateExpenseInput } from './expense.repository';

export const expenseService = {
    createCategory(input: CreateExpenseCategoryInput) {
        return expenseRepository.createCategory(input);
    },

    getCategories(userId: string) {
        return expenseRepository.listCategories(userId);
    },

    logExpense(input: CreateExpenseInput) {
        return expenseRepository.create(input);
    },

    getExpenseHistory(userId: string, from: Date, to: Date) {
        return expenseRepository.findByRange(userId, from, to);
    }
};
