import { salaryRuleRepository, CreateSalaryRuleInput } from './salary-rule.repository'


export const salaryRuleService = {
  async create(input: CreateSalaryRuleInput) {
    // Close current active rule
    await salaryRuleRepository.deactivateActive(
      input.userId,
      new Date(input.validFrom.getTime() - 1)
    )

    return salaryRuleRepository.create(input)
  },

  getActive(userId: string) {
    return salaryRuleRepository.findActive(userId)
  },

  getForDate(userId: string, date: Date) {
    return salaryRuleRepository.findByDate(userId, date)
  },
}
