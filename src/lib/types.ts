
export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  category: string; // This will now be the category slug
  categoryId: string; // Keep relation to category document
  stock: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface WishlistItem extends Book {}
