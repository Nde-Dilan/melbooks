# Storage Module

A SOLID, provider-agnostic file upload system.

## Quick Usage

```typescript
import { uploadFile } from "@/lib/storage";

// Upload a file
const result = await uploadFile(file, {
  folder: "images",
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png"],
});

console.log(result.url); // Use this URL
```

## Configuration

Set in `.env`:

```bash
NEXT_PUBLIC_STORAGE_PROVIDER=supabase  # supabase, firebase, s3, cloudinary

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_SUPABASE_BUCKET=uploads
```

## Supported Providers

- ✅ **Supabase** (default, recommended)
- ✅ **Firebase Storage**
- ⚠️ **AWS S3** (requires server-side setup)
- ✅ **Cloudinary**

## Architecture

Following SOLID principles:

- **S**ingle Responsibility: Each provider handles only its storage
- **O**pen/Closed: Easy to add new providers
- **L**iskov Substitution: All providers are interchangeable
- **I**nterface Segregation: Clean, minimal interface
- **D**ependency Inversion: Code depends on interface, not implementation

## See Full Documentation

📚 [Complete Documentation](../../../docs/storage-system.md)
