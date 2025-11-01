
import type { Book } from '@/lib/types';
import { BookCard } from './book-card';

interface BookGridProps {
    books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
    if (books.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">No Books Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
                <BookCard key={book.slug} book={book} />
            ))}
        </div>
    )
}
