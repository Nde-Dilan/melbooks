
"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import type { Book } from '@/lib/types';

interface AddToCartButtonProps {
  book: Book;
  showText?: boolean;
}

export function AddToCartButton({ book, showText = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(book);
  };

  if (showText) {
      return (
        <Button onClick={handleClick} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      );
  }
  
  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <ShoppingCart className="h-4 w-4" />
      <span className="sr-only">Add to cart</span>
    </Button>
  );
}
