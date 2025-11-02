
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { CartIcon } from '@/components/cart-icon';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Book } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/books?category=fiction', label: 'Fiction' },
  { href: '/books?category=non-fiction', label: 'Non-Fiction' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">MelBooks</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5"/>
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                    <Icons.logo className="h-6 w-6 text-primary" />
                    <span className="font-bold">MelBooks</span>
                </Link>
                <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                        'transition-colors hover:text-foreground/80 pl-4',
                        pathname === link.href ? 'text-foreground font-semibold' : 'text-foreground/60'
                        )}
                    >
                        {link.label}
                    </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex-none">
            <CartIcon />
          </div>
          <nav className="flex items-center">
            <Link href="https://www.instagram.com/books_and_bloom_cmr_?igsh=MXBlN3J5eXMzNTNkOQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" title="Fiction Instagram">
              <div className="h-9 w-9 flex items-center justify-center p-2 text-foreground/60 hover:text-foreground/80 transition-colors">
                <Icons.instagram className="h-4 w-4" />
                <span className="sr-only">Fiction Instagram</span>
              </div>
            </Link>
            <Link href="https://www.instagram.com/mel_bookss?igsh=NmQ1emRoanQ5ZXhp&utm_source=qr" target="_blank" rel="noreferrer" title="Non-Fiction Instagram">
              <div className="h-9 w-9 flex items-center justify-center p-2 text-foreground/60 hover:text-foreground/80 transition-colors">
                 <Icons.books className="h-4 w-4" />
                <span className="sr-only">Non-Fiction Instagram</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
