
export interface Book {
  slug: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface WishlistItem extends Book {}
