
import { Book, Category } from '@/lib/types';
import { collection, getDocs, query, where, getDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase'; // Assuming you have a firebase setup

const processBookDoc = (doc: any) => {
    const data = doc.data();
    const book: Book = { id: doc.id, ...data } as Book;

    // Convert Firestore Timestamps to serializable strings
    if (data.createdAt && data.createdAt instanceof Timestamp) {
        book.createdAt = data.createdAt.toDate().toISOString();
    }
    return book;
}

export async function getBooks(filters?: { category?: string }): Promise<Book[]> {
  try {
    const booksCollection = collection(firestore, 'books');
    let booksQuery = query(booksCollection);

    if (filters?.category) {
      // First, get the category id from the slug
      const categoriesCollection = collection(firestore, 'categories');
      const categoryQuery = query(categoriesCollection, where('slug', '==', filters.category));
      const categorySnapshot = await getDocs(categoryQuery);
      if (!categorySnapshot.empty) {
        const categoryId = categorySnapshot.docs[0].id;
        booksQuery = query(booksCollection, where('categoryId', '==', categoryId));
      } else {
        return []; // No category found with that slug
      }
    }

    const booksSnapshot = await getDocs(booksQuery);
    const books = booksSnapshot.docs.map(processBookDoc);
    
    // We need to get the category slug for each book
    const categories = await getCategories();
    const booksWithCategory = books.map(book => {
      const category = categories.find(cat => cat.id === book.categoryId);
      return { ...book, category: category?.slug ?? 'uncategorized' };
    });

    // Sort by creation date, most recent first
    return booksWithCategory.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });

  } catch (error) {
    console.error('Failed to read books from Firestore:', error);
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
    try {
        const booksCollection = collection(firestore, 'books');
        const q = query(booksCollection, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const bookDoc = querySnapshot.docs[0];
        const bookData = processBookDoc(bookDoc);

        // Get category slug
        if (bookData.categoryId) {
            const categoryDoc = await getDoc(doc(firestore, 'categories', bookData.categoryId));
            if (categoryDoc.exists()) {
                bookData.category = (categoryDoc.data() as Category).slug;
            }
        }
        
        return bookData;
    } catch (error) {
        console.error(`Failed to read book with slug ${slug} from Firestore:`, error);
        return null;
    }
}


export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesCollection = collection(firestore, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    return categories;
  } catch (error) {
    console.error('Failed to read categories from Firestore:', error);
    return [];
  }
}
