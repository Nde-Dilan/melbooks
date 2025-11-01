
"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { CartSidebar } from './cart-sidebar';
import { Button } from './ui/button';
import { Sheet, SheetTrigger } from './ui/sheet';

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <CartSidebar />
    </Sheet>
  );
}
