
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { Icons } from './icons';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = "1234567890"; // Replace with your WhatsApp number

export function CartSidebar() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = "Hello ChapterLink, I would like to order the following books:\n\n";
    cartItems.forEach(item => {
      message += `${item.title} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\nTotal: ${formatCurrency(cartTotal)}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Cart</SheetTitle>
      </SheetHeader>
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="my-4 flex-1 px-6">
            <div className="flex flex-col gap-6">
              {cartItems.map(item => (
                <div key={item.slug} className="flex items-start justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative aspect-square w-16 h-20 overflow-hidden rounded-md">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/book/${item.slug}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.author}</p>
                      <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.slug, parseInt(e.target.value, 10))}
                      className="h-8 w-16"
                    />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.slug)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="gap-2 bg-secondary/50 p-6">
            <div className="flex items-center justify-between w-full">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
            </div>
            <Button className="w-full" onClick={handleWhatsAppCheckout}>
              <Icons.whatsapp className="mr-2 h-5 w-5" />
              Checkout via WhatsApp
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
            </Button>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground">Add some books to get started.</p>
          <SheetTrigger asChild>
            <Button variant="outline">Continue Shopping</Button>
          </SheetTrigger>
        </div>
      )}
    </SheetContent>
  );
}
