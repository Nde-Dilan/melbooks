# File Storage System

A SOLID, provider-agnostic file upload system for the Melbooks application.

## Features

- 🔌 **Multiple Providers**: Supabase, Firebase, S3, Cloudinary
- 🎯 **SOLID Principles**: Interface-based design, easy to extend
- ⚙️ **Environment Configuration**: Simple .env setup
- 📦 **Type-Safe**: Full TypeScript support
- 🎨 **UI Components**: Ready-to-use React components
- ✅ **Validation**: File size, type, and custom validation
- 🖼️ **Image Preview**: Built-in preview for images
- 🔄 **Drag & Drop**: Modern file upload UX

## Quick Start

### 1. Choose Your Provider

Set the provider in your `.env` file:

```bash
NEXT_PUBLIC_STORAGE_PROVIDER=supabase  # or firebase, s3, cloudinary
```

### 2. Configure Provider Credentials

#### Supabase (Default)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_BUCKET=uploads
```

#### Firebase

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

#### AWS S3

```bash
NEXT_PUBLIC_S3_BUCKET=your-bucket-name
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_ACCESS_KEY_ID=your-access-key
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your-secret-key
```

#### Cloudinary

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### 3. Use in Your Code

```tsx
import { FileUpload } from "@/components/file-upload";

function MyForm() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <FileUpload
      value={imageUrl}
      onChange={setImageUrl}
      uploadOptions={{
        folder: "products",
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/png"],
      }}
    />
  );
}
```

## Architecture

### SOLID Principles

#### Single Responsibility Principle (SRP)

- Each provider handles only its own storage logic
- Validation logic separated in `utils.ts`
- UI component separated from business logic

#### Open/Closed Principle (OCP)

- Easy to add new providers without modifying existing code
- Extend `IStorageProvider` interface for new implementations

#### Liskov Substitution Principle (LSP)

- All providers are interchangeable through the `IStorageProvider` interface
- Consumer code doesn't need to know which provider is being used

#### Interface Segregation Principle (ISP)

- `IStorageProvider` defines only necessary methods
- Optional methods (like `getSignedUrl`) are truly optional

#### Dependency Inversion Principle (DIP)

- Components depend on `IStorageProvider` interface, not concrete implementations
- Factory pattern creates appropriate provider based on configuration

### Directory Structure

```
src/lib/storage/
├── index.ts                    # Main exports and convenience functions
├── types.ts                    # Interfaces and types
├── factory.ts                  # Provider factory (Factory Pattern)
├── utils.ts                    # Validation and utility functions
└── providers/
    ├── supabase.ts            # Supabase implementation
    ├── firebase.ts            # Firebase implementation
    ├── s3.ts                  # AWS S3 implementation
    └── cloudinary.ts          # Cloudinary implementation
```

## API Reference

### Main Functions

#### uploadFile(file, options)

Upload a file using the configured provider.

```typescript
import { uploadFile } from "@/lib/storage";

const result = await uploadFile(file, {
  folder: "avatars",
  maxSize: 2 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png"],
  generateUniqueName: true,
});

console.log(result.url); // Use this URL
```

#### deleteFile(fileUrl)

Delete a file from storage.

```typescript
import { deleteFile } from "@/lib/storage";

await deleteFile("https://...");
```

#### getSignedUrl(fileUrl, expiresIn)

Get a signed URL for private files.

```typescript
import { getSignedUrl } from "@/lib/storage";

const signedUrl = await getSignedUrl(fileUrl, 3600);
```

### Upload Options

```typescript
interface UploadOptions {
  fileName?: string; // Custom file name
  folder?: string; // Folder path
  maxSize?: number; // Max size in bytes
  allowedTypes?: string[]; // Allowed MIME types
  generateUniqueName?: boolean; // Generate unique name (default: true)
  metadata?: Record<string, string>; // Custom metadata
}
```

### Upload Result

```typescript
interface UploadResult {
  url: string; // Public URL of uploaded file
  fileName: string; // File name in storage
  fileSize: number; // File size in bytes
  mimeType: string; // MIME type
  metadata?: Record<string, unknown>; // Provider-specific metadata
}
```

## UI Components

### FileUpload Component

A complete file upload component with drag & drop, preview, and validation.

```tsx
<FileUpload
  value={imageUrl}
  onChange={setImageUrl}
  accept="image/*"
  uploadOptions={{
    folder: "covers",
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  }}
  showPreview={true}
  placeholder="Upload cover image"
  disabled={false}
/>
```

## Provider Setup Guides

### Supabase Setup

1. Create a Supabase project at https://app.supabase.com
2. Go to Storage and create a bucket (e.g., "uploads")
3. Make the bucket public or configure RLS policies
4. Copy credentials from Project Settings > API
5. Add to `.env`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   NEXT_PUBLIC_SUPABASE_BUCKET=uploads
   ```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firebase Storage
3. Configure security rules
4. Get credentials from Project Settings
5. Add to `.env`:
   ```bash
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   ```

### Cloudinary Setup

1. Create account at https://cloudinary.com
2. Go to Settings > Upload
3. Create an unsigned upload preset
4. Add to `.env`:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
   ```

### AWS S3 Setup

⚠️ **Note**: S3 requires server-side implementation for security.

1. Create S3 bucket in AWS Console
2. Configure CORS policy
3. Create IAM user with S3 access
4. Create API route for presigned URLs
5. Add credentials to `.env`

## Adding a New Provider

1. Create a new file in `src/lib/storage/providers/`
2. Implement the `IStorageProvider` interface
3. Add provider to the factory in `factory.ts`
4. Update `.env.example` with required variables
5. Update documentation

Example:

```typescript
// providers/my-provider.ts
import { IStorageProvider, UploadOptions, UploadResult } from "../types";

export class MyStorageProvider implements IStorageProvider {
  isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_MY_PROVIDER_KEY;
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    // Your implementation
  }

  async delete(fileUrl: string): Promise<void> {
    // Your implementation
  }
}
```

## Error Handling

The system provides specific error types:

```typescript
import { StorageUploadError, FileValidationError } from "@/lib/storage";

try {
  await uploadFile(file);
} catch (error) {
  if (error instanceof FileValidationError) {
    // Handle validation errors (size, type, etc.)
  } else if (error instanceof StorageUploadError) {
    // Handle upload errors
    console.log(error.provider); // Which provider failed
  }
}
```

## Best Practices

1. **Always validate files**: Use `allowedTypes` and `maxSize` options
2. **Use unique names**: Keep `generateUniqueName: true` (default) to avoid conflicts
3. **Organize with folders**: Use the `folder` option to organize files
4. **Handle errors gracefully**: Show user-friendly error messages
5. **Clean up old files**: Delete old files when updating records
6. **Use environment variables**: Never hardcode credentials
7. **Test with different providers**: Ensure your code works with all providers

## Security Considerations

1. **Client-side validation is not enough**: Always validate on the server
2. **Use presigned URLs for S3**: Don't expose AWS credentials to the client
3. **Configure CORS properly**: Restrict allowed origins
4. **Set file size limits**: Prevent abuse
5. **Use content-type validation**: Ensure uploaded files are what they claim to be
6. **Implement rate limiting**: Prevent abuse of upload endpoints

## Troubleshooting

### Provider not configured

- Check that all required environment variables are set
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart your development server after adding new variables

### CORS errors

- Configure CORS policy in your storage provider
- Allow your domain in the provider's settings
- For local development, allow `localhost`

### Upload fails silently

- Check browser console for errors
- Verify provider credentials
- Check file size and type restrictions
- Ensure bucket/container exists and is accessible

## License

MIT
