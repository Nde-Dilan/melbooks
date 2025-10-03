import { createBook, sanityClient } from './sanity.js';

// Sample book data (corrected paths for Vite public folder)
const books = [
    {
        title: "Simple way of piece life",
        author: "Armor Ramsey",
        price: 40000,
        genre: "Fiction",
        image: "/images/product-item1.jpg", // Corrected path (public is root)
    },
    {
        title: "Great travel at desert",
        author: "Sanchit Howdy",
        price: 38000,
        genre: "Fiction",
        image: "/images/product-item2.jpg",
    },
    {
        title: "The lady beauty Scarlett",
        author: "Arthur Doyle",
        price: 45000,
        genre: "Fiction",
        image: "/images/product-item3.jpg",
    },
    {
        title: "Once upon a time",
        author: "Klien Marry",
        price: 35000,
        genre: "Fiction",
        image: "/images/product-item4.jpg",
    },
    {
        title: "Peaceful Enlightment",
        author: "Marmik Lama",
        price: 40000,
        genre: "Non-Fiction",
        image: "/images/tab-item5.jpg",
    },
    {
        title: "Tips of simple lifestyle",
        author: "Bratt Smith",
        price: 40000,
        genre: "Non-Fiction",
        image: "/images/tab-item3.jpg",
    },
    {
        title: "Portrait photography",
        author: "Adam Silber",
        price: 40000,
        genre: "Non-Fiction",
        image: "/images/tab-item1.jpg",
    },
    {
        title: "Just felt from outside",
        author: "Nicole Wilson",
        price: 40000,
        genre: "Non-Fiction",
        image: "/images/tab-item4.jpg",
    },
    {
        title: "Life among the pirates",
        author: "Armor Ramsey",
        price: 40000,
        genre: "Fiction",
        image: "/images/tab-item7.jpg",
    },
    {
        title: "Birds gonna be happy",
        author: "Timbur Hood",
        price: 45000,
        genre: "Fiction",
        image: "/images/single-image.jpg",
    },
];

// Function to upload all books to Sanity (with image handling)
export async function uploadBooksToSanity(bookArray) {
    try {
        const results = [];
        for (const book of bookArray) {
            const { image, ...bookData } = book; // Extract image path
            let imageAsset = null;

            // Upload image if provided
            if (image) {
                try {
                    const response = await fetch(image); // Fetch image from public path
                    if (!response.ok) throw new Error(`Failed to fetch image: ${image}`);
                    const blob = await response.blob();
                    imageAsset = await sanityClient.assets.upload('image', blob, {
                        filename: image.split('/').pop(), // Use filename from path
                    });
                } catch (error) {
                    console.warn(`Skipping image upload for "${book.title}": ${error.message}`);
                }
            }

            // Create book with image reference
            const bookWithImage = {
                ...bookData,
                ...(imageAsset && {
                    image: {
                        _type: 'image',
                        asset: { _ref: imageAsset._id },
                    },
                }),
            };
            const result = await createBook(bookWithImage);
            results.push(result);
        }
        console.log('All books uploaded successfully:', results);
        return results;
    } catch (error) {
        console.error('Error uploading books:', error);
        throw error;
    }
}

// Function to delete all books from Sanity
export async function deleteAllBooksFromSanity() {
    try {
        // Fetch all book IDs
        const books = await sanityClient.fetch(`*[_type == "book"]._id`);
        if (books.length === 0) {
            console.log('No books to delete.');
            return;
        }

        // Delete each book
        const deletePromises = books.map(id => sanityClient.delete(id));
        await Promise.all(deletePromises);
        console.log(`Deleted ${books.length} books successfully.`);
    } catch (error) {
        console.error('Error deleting books:', error);
        throw error;
    }
}

// Uncomment to run uploads (use cautiously)
// uploadBooksToSanity(books);

// Uncomment to run deletions (use cautiously)
// deleteAllBooksFromSanity();