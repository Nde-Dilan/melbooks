
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { WishlistItem, Book } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Book) => void;
  removeFromWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
    }
  }, []);

  const updateLocalStorage = useCallback((items: WishlistItem[]) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, []);

  const addToWishlist = (book: Book) => {
    setWishlistItems(prevItems => {
      if (prevItems.find(item => item.slug === book.slug)) {
        toast({
            title: "Already in wishlist",
            description: `${book.title} is already in your wishlist.`,
            variant: "default"
        });
        return prevItems;
      }
      const newItems = [...prevItems, book];
      updateLocalStorage(newItems);
      toast({
        title: "Added to wishlist",
        description: `${book.title} has been added to your wishlist.`,
      });
      return newItems;
    });
  };

  const removeFromWishlist = (slug: string) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.slug !== slug);
      updateLocalStorage(newItems);
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist.",
      });
      return newItems;
    });
  };

  const isWishlisted = (slug: string) => {
    return wishlistItems.some(item => item.slug === slug);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}
