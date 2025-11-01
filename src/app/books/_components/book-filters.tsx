
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface BookFiltersProps {
  categories: Category[];
  priceRange: { min: number, max: number };
}

export function BookFilters({ categories, priceRange }: BookFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState(searchParams.get('maxPrice') ? [parseInt(searchParams.get('maxPrice')!, 10)] : [priceRange.max]);
  const debouncedPrice = useDebounce(price, 500);

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if(debouncedPrice[0] < priceRange.max) {
      params.set('maxPrice', debouncedPrice[0].toString());
    } else {
        params.delete('maxPrice');
    }
    router.push(pathname + '?' + params.toString());
  }, [debouncedPrice, pathname, router, searchParams, priceRange.max]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative md:col-span-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by title or author..."
          className="pl-10"
          onChange={handleSearchChange}
          defaultValue={searchParams.get('q') ?? ''}
        />
      </div>
      <Select onValueChange={handleCategoryChange} defaultValue={searchParams.get('category') ?? 'all'}>
        <SelectTrigger className="w-full">
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Label htmlFor="price-range">Price Range</Label>
            <span className="text-sm font-medium">{formatCurrency(price[0])}</span>
        </div>
        <Slider
          id="price-range"
          min={priceRange.min}
          max={priceRange.max}
          step={100}
          value={price}
          onValueChange={setPrice}
          className="w-full"
        />
      </div>
    </div>
  );
}
