
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem, Book } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Book) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

type ToastInfo = {
    id: 'added' | 'removed' | 'cleared';
    title: string;
    description: string;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [lastToast, setLastToast] = useState<ToastInfo | null>(null);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (lastToast) {
        toast({
            title: lastToast.title,
            description: lastToast.description,
        });
        setLastToast(null);
    }
  }, [lastToast, toast]);

  const updateLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, []);

  const addToCart = (book: Book) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.slug === book.slug);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.slug === book.slug ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...book, quantity: 1 }];
      }
      updateLocalStorage(newItems);
      setLastToast({
        id: 'added',
        title: "Added to cart",
        description: `${book.title} has been added to your cart.`,
      });
      return newItems;
    });
  };

  const removeFromCart = (slug: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.slug === slug);
      if (!itemToRemove) return prevItems;

      const newItems = prevItems.filter(item => item.slug !== slug);
      updateLocalStorage(newItems);
      setLastToast({
        id: 'removed',
        title: "Removed from cart",
        description: `"${itemToRemove.title}" has been removed from your cart.`,
      });
      return newItems;
    });
  };

  const updateQuantity = (slug: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        const itemToRemove = prevItems.find(item => item.slug === slug);
        const newItems = prevItems.filter(item => item.slug !== slug);
        updateLocalStorage(newItems);
        if (itemToRemove) {
            setLastToast({
                id: 'removed',
                title: "Removed from cart",
                description: `"${itemToRemove.title}" has been removed from your cart.`,
            });
        }
        return newItems;
      }
      const newItems = prevItems.map(item =>
        item.slug === slug ? { ...item, quantity } : item
      );
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems(prevItems => {
        if (prevItems.length === 0) return prevItems;
        updateLocalStorage([]);
        setLastToast({
            id: 'cleared',
            title: "Cart cleared",
            description: "Your shopping cart has been emptied.",
        });
        return [];
    });
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}
