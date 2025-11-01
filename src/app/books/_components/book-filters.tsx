
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useCallback } from 'react';

interface BookFiltersProps {
  categories: Category[];
}

export function BookFilters({ categories }: BookFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      router.push(pathname + '?' + createQueryString('q', e.target.value));
  };
  
  const handleCategoryChange = (value: string) => {
      router.push(pathname + '?' + createQueryString('category', value === 'all' ? '' : value));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by title or author..."
          className="pl-10"
          onChange={handleSearchChange}
          defaultValue={searchParams.get('q') ?? ''}
        />
      </div>
      <Select onValueChange={handleCategoryChange} defaultValue={searchParams.get('category') ?? 'all'}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
