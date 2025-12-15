# Melbooks - Online Bookstore

A modern, full-featured online bookstore built with Next.js, Firebase, and a flexible file storage system.

## Features

- 📚 Browse and search books by category
- 🛒 Shopping cart functionality
- ❤️ Wishlist management
- 🔐 Admin dashboard for book management
- 📤 **Multi-provider file upload system** (Supabase, Firebase, S3, Cloudinary)
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- ⚡ AI-powered SEO content optimization with Genkit
- 🔥 Real-time updates with Firestore

## File Upload System

This project includes a comprehensive, SOLID-based file upload system that supports multiple storage providers:

- ✅ **Supabase Storage** (default, recommended)
- ✅ **Firebase Storage**
- ✅ **Cloudinary**
- ⚠️ **AWS S3** (requires server-side setup)

### Quick Setup

1. Choose your provider in `.env`:

```bash
NEXT_PUBLIC_STORAGE_PROVIDER=supabase
```

2. Add provider credentials (see `.env.example` for all options)

3. Use in your code:

```tsx
import { FileUpload } from "@/components/file-upload";

<FileUpload
  value={imageUrl}
  onChange={setImageUrl}
  uploadOptions={{
    folder: "book-covers",
    maxSize: 5 * 1024 * 1024,
  }}
/>;
```

📚 **[Full Storage Documentation](docs/storage-system.md)**

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project (for Firestore)
- Storage provider account (Supabase, Firebase, etc.)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Nde-Dilan/melbooks.git
cd melbooks
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── book/              # Book detail pages
│   └── books/             # Books listing
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── file-upload.tsx   # File upload component
├── lib/
│   └── storage/          # 📤 File storage system
│       ├── providers/    # Storage provider implementations
│       ├── types.ts      # TypeScript interfaces
│       ├── factory.ts    # Provider factory
│       └── utils.ts      # Utilities
├── hooks/                # Custom React hooks
├── context/              # React context providers
└── firebase/             # Firebase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run genkit:dev` - Start Genkit for AI flows

## Technologies

- **Framework**: Next.js 15.3
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Firebase Firestore
- **Storage**: Multi-provider (Supabase/Firebase/S3/Cloudinary)
- **AI**: Google Genkit
- **Forms**: React Hook Form + Zod
- **Type Safety**: TypeScript

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT
