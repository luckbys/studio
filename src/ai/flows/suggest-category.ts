'use server';

/**
 * @fileOverview Suggests a financial category for a transaction based on its name.
 *
 * - suggestCategory - A function that suggests the category.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 * - SuggestCategoryOutput - The return type for the suggestCategory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { categories, type Category } from '@/lib/types';

const SuggestCategoryInputSchema = z.object({
  transactionName: z.string().describe('The name of the transaction.'),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const SuggestCategoryOutputSchema = z.object({
  category: z.enum(categories).describe('The suggested category for the transaction.'),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;


export async function suggestCategory(input: SuggestCategoryInput): Promise<SuggestCategoryOutput> {
    return suggestCategoryFlow(input);
}


const prompt = ai.definePrompt({
    name: 'suggestCategoryPrompt',
    input: { schema: SuggestCategoryInputSchema },
    output: { schema: SuggestCategoryOutputSchema },
    prompt: `You are an expert financial assistant. Your task is to categorize a transaction based on its name.
    
Analyze the following transaction name and assign it to the most appropriate category from the list provided.

Transaction Name: {{{transactionName}}}

Available Categories:
{{#each categories}}
- {{this}}
{{/each}}

Select only one category from the list above.
`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async (input) => {
    // Inject the available categories into the prompt context
    const { output } = await prompt({ ...input, categories });
    return output!;
  }
);
