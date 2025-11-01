
"use client";

import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Book } from '@/lib/types';

interface WishlistButtonProps {
  book: Book;
  className?: string;
}

export function WishlistButton({ book, className }: WishlistButtonProps) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isWishlisted(book.slug);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (wishlisted) {
      removeFromWishlist(book.slug);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground hover:text-red-500", className)}
      onClick={handleClick}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn("h-5 w-5 transition-colors", wishlisted && 'fill-red-500 text-red-500')} />
    </Button>
  );
}
