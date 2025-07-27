'use server';

/**
 * @fileOverview Generates a summary of monthly spending habits using AI.
 *
 * - generateMonthlySummary - A function that generates the monthly summary.
 * - GenerateMonthlySummaryInput - The input type for the generateMonthlySummary function.
 * - GenerateMonthlySummaryOutput - The return type for the generateMonthlySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMonthlySummaryInputSchema = z.object({
  income: z.number().describe('Total income for the month.'),
  expenses: z.record(z.string(), z.number()).describe('A map of expense categories to amounts.'),
  savingsGoal: z.number().optional().describe('Optional savings goal for the month.'),
});
export type GenerateMonthlySummaryInput = z.infer<typeof GenerateMonthlySummaryInputSchema>;

const GenerateMonthlySummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of monthly spending habits.'),
});
export type GenerateMonthlySummaryOutput = z.infer<typeof GenerateMonthlySummaryOutputSchema>;

export async function generateMonthlySummary(input: GenerateMonthlySummaryInput): Promise<GenerateMonthlySummaryOutput> {
  return generateMonthlySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMonthlySummaryPrompt',
  input: {schema: GenerateMonthlySummaryInputSchema},
  output: {schema: GenerateMonthlySummaryOutputSchema},
  prompt: `Você é um consultor financeiro especializado em ajudar as pessoas a entender seus hábitos de gastos mensais.

  Com base nas informações fornecidas, gere um resumo conciso dos hábitos de gastos do usuário, destacando as principais áreas de gastos excessivos ou economia.
  Forneça o resumo em português.

  Renda: {{{income}}}
  Despesas:
  {{#each expenses}}
  - {{key}}: {{{this}}}
  {{/each}}
  Meta de economia: {{{savingsGoal}}}
  `,
});

const generateMonthlySummaryFlow = ai.defineFlow(
  {
    name: 'generateMonthlySummaryFlow',
    inputSchema: GenerateMonthlySummaryInputSchema,
    outputSchema: GenerateMonthlySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
