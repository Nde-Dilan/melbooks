
import type { Metadata } from 'next';
import { SeoOptimizerForm } from './_components/seo-optimizer-form';
import { getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'SEO Content Optimizer | ChapterLink',
  description: 'Use our AI-powered tool to optimize your book listings for search engines.',
};

export default async function SeoOptimizerPage() {
    const categories = await getCategories();
  return (
    <div className="container max-w-3xl py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          SEO Content Optimizer
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enhance your book's visibility with AI-powered title, description, and keyword suggestions.
        </p>
      </div>
      <SeoOptimizerForm categories={categories} />
    </div>
  );
}
