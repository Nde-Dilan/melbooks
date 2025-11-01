
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OptimizeSeoContentInput, OptimizeSeoContentOutput } from '@/ai/flows/seo-content-optimization';
import { optimizeSeoContentAction } from '../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
});

interface SeoOptimizerFormProps {
    categories: Category[];
}

export function SeoOptimizerForm({ categories }: SeoOptimizerFormProps) {
  const [result, setResult] = useState<OptimizeSeoContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const input: OptimizeSeoContentInput = {
      title: values.title,
      description: values.description,
      category: values.category,
    };

    try {
      const output = await optimizeSeoContentAction(input);
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          <CardDescription>Enter the details of the book you want to optimize.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Midnight Library" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A short summary of the book..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimize Content
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary"/>
                Optimized Suggestions
            </CardTitle>
            <CardDescription>Here are the AI-powered suggestions for your content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">SEO Title</h3>
              <p className="p-3 bg-muted rounded-md">{result.seoTitle}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SEO Description</h3>
              <p className="p-3 bg-muted rounded-md">{result.seoDescription}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
