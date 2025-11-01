
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HeroSection() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
    return (
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-black/50 z-10" />
            {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="relative z-20 text-center p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 font-headline drop-shadow-lg">
                    Your Trusted Bookstore
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto text-neutral-200 drop-shadow-md">
                    Discover captivating stories and knowledge from around the world. Your literary adventure starts here.
                </p>
                <Button asChild size="lg" className="mt-8 transition-transform hover:scale-105">
                    <Link href="/books">Explore All Books</Link>
                </Button>
            </div>
        </section>
    );
}
