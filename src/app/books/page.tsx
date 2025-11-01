
import { getBooks, getCategories } from '@/lib/data';
import { BookGrid } from '@/components/book-grid';
import { BookFilters } from './_components/book-filters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Books | MelBooks',
  description: 'Browse our collection of fiction and non-fiction books.',
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const category = searchParams?.category;
  
  const books = await getBooks({ category });
  const categories = await getCategories();

  const query = searchParams?.q?.toLowerCase() ?? '';
  const maxPriceQuery = searchParams?.maxPrice;
  
  const prices = books.map(book => book.price);
  const minPrice = Math.min(0, ...prices);
  const maxPrice = Math.max(100000, ...prices);

  const currentMaxPrice = maxPriceQuery ? parseInt(maxPriceQuery, 10) : maxPrice;

  const filteredBooks = books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(query);
    const authorMatch = book.author.toLowerCase().includes(query);
    const priceMatch = book.price <= currentMaxPrice;
    return (titleMatch || authorMatch) && priceMatch;
  });

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Our Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find your next favorite book from our curated collection.
        </p>
      </div>

      <div className="mb-8">
        <BookFilters 
            categories={categories} 
            priceRange={{ min: minPrice, max: maxPrice }}
        />
      </div>

      <BookGrid books={filteredBooks} />
    </div>
  );
}
