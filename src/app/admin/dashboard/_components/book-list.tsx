
'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Book } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlusCircle, Trash2, Upload } from 'lucide-react';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
  onCreateNew: () => void;
  onDeleteBook: (bookId: string) => void;
  onBulkUpload: () => void;
}

export function BookList({
  books,
  isLoading,
  selectedBook,
  onSelectBook,
  onCreateNew,
  onDeleteBook,
  onBulkUpload,
}: BookListProps) {
  const handleDelete = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    onDeleteBook(bookId);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Books</h2>
            <Button size="sm" variant="outline" onClick={onBulkUpload}>
                <Upload className="mr-2 h-4 w-4"/>
                Bulk Upload
            </Button>
        </div>
        <Button className="w-full" variant="outline" onClick={onCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Book
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {books.map(book => (
              <div
                key={book.id}
                className={cn(
                  'p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center group',
                  selectedBook?.id === book.id && 'bg-muted'
                )}
                onClick={() => onSelectBook(book)}
              >
                <div>
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => handleDelete(e, book.id)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
