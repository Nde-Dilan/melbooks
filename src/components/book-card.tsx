
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from './add-to-cart-button';
import { WishlistButton } from './wishlist-button';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/book/${book.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="book cover"
          />
           <div className="absolute top-2 right-2 z-10">
            <WishlistButton book={book} className="bg-background/70 hover:bg-background" />
           </div>
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/book/${book.slug}`}>
            <h3 className="font-semibold text-lg leading-tight truncate hover:underline">{book.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="font-bold text-lg text-primary">{formatCurrency(book.price)}</p>
          <AddToCartButton book={book} />
        </div>
      </CardContent>
    </Card>
  );
}
