
import { Book, Category } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Note: In a real app, you'd want to use a more robust method for reading and parsing files.
// For this example, we're keeping it simple.

const booksDirectory = path.join(process.cwd(), 'content/books');
const categoriesDirectory = path.join(process.cwd(), 'content/categories');

export async function getBooks(): Promise<Book[]> {
  try {
    const filenames = await fs.readdir(booksDirectory);
    const books = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(booksDirectory, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as Book;
      })
    );
    return books;
  } catch (error) {
    console.error('Failed to read books:', error);
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const filePath = path.join(booksDirectory, `${slug}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Book;
  } catch (error) {
    // This can happen if the file doesn't exist, which is a valid case.
    console.error(`Failed to read book with slug ${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const filenames = await fs.readdir(categoriesDirectory);
    const categories = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(categoriesDirectory, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as Category;
      })
    );
    return categories;
  } catch (error) {
    console.error('Failed to read categories:', error);
    return [];
  }
}
