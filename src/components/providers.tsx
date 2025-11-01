
"use client";

import type { ReactNode } from 'react';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <Toaster />
      </WishlistProvider>
    </CartProvider>
  );
}
