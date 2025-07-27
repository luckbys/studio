'use server';

import { generateMonthlySummary } from '@/ai/flows/generate-monthly-summary';
import type { Transaction } from '@/lib/types';

export async function getAiSummary(transactions: Transaction[], savingsGoal: number) {
  try {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense' && t.category !== 'Renda')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    if (income === 0 && Object.keys(expenses).length === 0) {
        return "Adicione algumas transações de renda e despesa para gerar um resumo."
    }

    const result = await generateMonthlySummary({
      income,
      expenses,
      savingsGoal: savingsGoal > 0 ? savingsGoal : undefined,
    });
    return result.summary;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return 'Ocorreu um erro ao gerar o resumo. Por favor, tente novamente mais tarde.';
  }
}
