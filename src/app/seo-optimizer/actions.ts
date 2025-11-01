
'use server';

import { optimizeSeoContent, OptimizeSeoContentInput, OptimizeSeoContentOutput } from '@/ai/flows/seo-content-optimization';

export async function optimizeSeoContentAction(input: OptimizeSeoContentInput): Promise<OptimizeSeoContentOutput> {
  try {
    const result = await optimizeSeoContent(input);
    return result;
  } catch (error) {
    console.error('Error in optimizeSeoContentAction:', error);
    throw new Error('Failed to optimize content. Please try again.');
  }
}
