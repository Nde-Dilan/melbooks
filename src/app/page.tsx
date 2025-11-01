
import { HeroSection } from "@/components/hero-section";
import { BookGrid } from "@/components/book-grid";
import { getBooks } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const allBooks = await getBooks();
  // Show the 4 most recent books on the homepage
  const recentBooks = allBooks.slice(0, 4);

  return (
    <div>
      <HeroSection />
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">New Arrivals</h2>
            <Button asChild variant="ghost">
              <Link href="/books">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <BookGrid books={recentBooks} />
        </div>
      </section>
    </div>
  );
}
