
'use server';

/**
 * @fileOverview An SEO content optimization AI agent.
 *
 * - optimizeSeoContent - A function that handles the SEO content optimization process.
 * - OptimizeSeoContentInput - The input type for the optimizeSeoContent function.
 * - OptimizeSeoContentOutput - The return type for the optimizeSeoContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSeoContentInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('The description of the book.'),
  category: z.string().describe('The category of the book.'),
});
export type OptimizeSeoContentInput = z.infer<typeof OptimizeSeoContentInputSchema>;

const OptimizeSeoContentOutputSchema = z.object({
  seoTitle: z.string().describe('The optimized SEO title for the book.'),
  seoDescription: z.string().describe('The optimized SEO description for the book.'),
  keywords: z.array(z.string()).describe('The suggested keywords for the book.'),
});
export type OptimizeSeoContentOutput = z.infer<typeof OptimizeSeoContentOutputSchema>;

export async function optimizeSeoContent(input: OptimizeSeoContentInput): Promise<OptimizeSeoContentOutput> {
  return optimizeSeoContentFlow(input);
}

const optimizeSeoContentPrompt = ai.definePrompt({
  name: 'optimizeSeoContentPrompt',
  input: {schema: OptimizeSeoContentInputSchema},
  output: {schema: OptimizeSeoContentOutputSchema},
  prompt: `You are an SEO expert optimizing content for a bookstore application called ChapterLink.

  Optimize the title and description provided for better search engine visibility.
  Also, suggest relevant keywords for the book.

  Book Title: {{{title}}}
  Book Description: {{{description}}}
  Book Category: {{{category}}}

  Ensure that the optimized SEO title and description are engaging and accurately represent the book's content.
  The keywords should be relevant to the book's content and category.
  Return the results in JSON format.
  `,
});

const optimizeSeoContentFlow = ai.defineFlow(
  {
    name: 'optimizeSeoContentFlow',
    inputSchema: OptimizeSeoContentInputSchema,
    outputSchema: OptimizeSeoContentOutputSchema,
  },
  async input => {
    const {output} = await optimizeSeoContentPrompt(input);
    return output!;
  }
);
