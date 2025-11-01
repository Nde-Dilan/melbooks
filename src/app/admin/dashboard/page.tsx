
'use client';

import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { BookList } from './_components/book-list';
import { BookEditor } from './_components/book-editor';
import type { Book, Category } from '@/lib/types';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const booksQuery = useMemoFirebase(() => collection(firestore, 'books'), [firestore]);
  const categoriesQuery = useMemoFirebase(() => collection(firestore, 'categories'), [firestore]);
  
  const { data: books, isLoading: isLoadingBooks } = useCollection<Book>(booksQuery);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin');
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsCreatingNew(false);
  };

  const handleCreateNewBook = () => {
    setSelectedBook(null);
    setIsCreatingNew(true);
  };

  const handleBookSaved = () => {
    setSelectedBook(null);
    setIsCreatingNew(false);
  };
  
  const handleCancel = () => {
    setSelectedBook(null);
    setIsCreatingNew(false);
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this book?')) {
      await deleteDoc(doc(firestore, 'books', bookId));
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
       <header className="flex h-16 items-center border-b px-6 flex-shrink-0 bg-background z-10">
        <div className="flex-1">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">{user.email}</p>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <div className="w-1/3 border-r overflow-y-auto">
          <BookList
            books={books || []}
            isLoading={isLoadingBooks}
            selectedBook={selectedBook}
            onSelectBook={handleSelectBook}
            onCreateNew={handleCreateNewBook}
            onDeleteBook={handleDeleteBook}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <BookEditor
            book={selectedBook}
            isCreating={isCreatingNew}
            categories={categories || []}
            onSave={handleBookSaved}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
