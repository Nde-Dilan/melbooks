
import Link from 'next/link';
import { Icons } from './icons';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">MelBooks</span>
          </Link>

          <div className="flex flex-wrap justify-center mt-6 -mx-4">
            <Link href="/" className="mx-4 text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/books" className="mx-4 text-sm text-muted-foreground hover:text-foreground transition-colors">Books</Link>
            <Link href="/seo-optimizer" className="mx-4 text-sm text-muted-foreground hover:text-foreground transition-colors">SEO Tool</Link>
            <Link href="/admin" className="mx-4 text-sm text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MelBooks. All Rights Reserved.</p>

          <div className="flex -mx-2 mt-3 sm:mt-0">
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="mx-2 text-muted-foreground hover:text-foreground transition-colors">
              <Icons.twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noreferrer" className="mx-2 text-muted-foreground hover:text-foreground transition-colors">
              <Icons.facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="mx-2 text-muted-foreground hover:text-foreground transition-colors">
              <Icons.instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
