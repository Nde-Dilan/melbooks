
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

type ToastInfo = {
    id: 'added' | 'removed' | 'already-in';
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();
  const [lastToast, setLastToast] = useState<ToastInfo | null>(null);
  
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

  useEffect(() => {
    if (lastToast) {
        toast({
            title: lastToast.title,
            description: lastToast.description,
            variant: lastToast.variant,
        });
        setLastToast(null);
    }
  }, [lastToast, toast]);

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
        setLastToast({
            id: 'already-in',
            title: "Already in wishlist",
            description: `${book.title} is already in your wishlist.`,
            variant: "default"
        });
        return prevItems;
      }
      const newItems = [...prevItems, book];
      updateLocalStorage(newItems);
      setLastToast({
        id: 'added',
        title: "Added to wishlist",
        description: `${book.title} has been added to your wishlist.`,
      });
      return newItems;
    });
  };

  const removeFromWishlist = (slug: string) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.slug === slug);
      if (!itemToRemove) return prevItems;

      const newItems = prevItems.filter(item => item.slug !== slug);
      updateLocalStorage(newItems);
      setLastToast({
        id: 'removed',
        title: "Removed from wishlist",
        description: `"${itemToRemove.title}" has been removed from your wishlist.`,
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
