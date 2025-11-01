
import { getBookBySlug, getBooks } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { WishlistButton } from '@/components/wishlist-button';
import { Badge } from '@/components/ui/badge';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const book = await getBookBySlug(params.slug);

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  return {
    title: `${book.title} by ${book.author} | MelBooks`,
    description: book.description.substring(0, 160),
  };
}

// This function is commented out because we are fetching data dynamically from Firestore
// and we don't know all possible slugs at build time.
// If you have a small, fixed number of books, you could re-enable this.
// export async function generateStaticParams() {
//   const books = await getBooks();
//   return books.map((book) => ({
//     slug: book.slug,
//   }));
// }

export default async function BookDetailPage({ params }: Props) {
  const book = await getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            data-ai-hint="book cover"
          />
        </div>
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-2">{book.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{book.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>
          <p className="mt-6 font-bold text-3xl text-primary">{formatCurrency(book.price)}</p>
          
          <div className="mt-8 prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
            <p>{book.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <AddToCartButton book={book} showText={true} />
            <WishlistButton book={book} className="w-12 h-12 border"/>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</p>
        </div>
      </div>
    </div>
  );
}
