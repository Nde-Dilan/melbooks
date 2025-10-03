// Sanity CMS Configuration and API Methods
import {createClient} from '@sanity/client'
// Replace with your actual values from Sanity
const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET;
const SANITY_API_TOKEN = import.meta.env.VITE_SANITY_API_TOKEN;



// Initialize Sanity Client
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2025-02-06', // Use latest stable version
  useCdn: true, // Use CDN for faster reads
  token: SANITY_API_TOKEN, // For authenticated requests if needed
});

// Query to fetch all books (maps to your current array structure)
const BOOKS_QUERY = `*[_type == "book"]{
  _id,
  title,
  author,
  price,
  genre,
  "image": image.asset->url // Get image URL
}`;

// In getBooks and getBooksByGenre, map _id to id
export async function getBooks() {
  try {
    const books = await sanityClient.fetch(BOOKS_QUERY);
    return books.map(book => ({
      id: book._id, // Map _id to id
      title: book.title,
      author: book.author,
      price: Number(book.price),
      genre: book.genre,
      image: book.image,
    }));
  } catch (error) {
    console.error('Error fetching books from Sanity:', error);
    return [];
  }
}

// Similarly for getBooksByGenre
export async function getBooksByGenre(genre) {
  try {
    const query = genre === 'all' 
      ? BOOKS_QUERY 
      : `*[_type == "book" && genre == "${genre}"]{
          _id,
          title,
          author,
          price,
          genre,
          "image": image.asset->url
        }`;
    const books = await sanityClient.fetch(query);
    return books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      price: Number(book.price),
      genre: book.genre,
      image: book.image,
    }));
  } catch (error) {
    console.error('Error fetching books by genre:', error);
    return [];
  }
}

// Optional: Method to add/update books (for future admin panel)
export async function createBook(bookData) {
  try {
    const result = await sanityClient.create({
      _type: 'book',
      ...bookData,
    });
    return result;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}