import { incomeRepository, CreateIncomeSourceInput, CreateIncomeEntryInput } from './income.repository';

export const incomeService = {
    createIncomeSource(input: CreateIncomeSourceInput) {
        return incomeRepository.createSource(input);
    },

    getIncomeSources(userId: string) {
        return incomeRepository.listSources(userId);
    },

    logIncomeEntry(input: CreateIncomeEntryInput) {
        return incomeRepository.create(input);
    },

    getIncomeHistory(userId: string, from: Date, to: Date) {
        return incomeRepository.findByRange(userId, from, to);
    }
};
