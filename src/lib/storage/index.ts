/**
 * Storage Module - Centralized file upload management
 *
 * This module provides a SOLID, provider-agnostic file upload system
 * that can be easily configured to use different storage backends.
 *
 * Supported providers:
 * - Supabase (default)
 * - Firebase Storage
 * - AWS S3
 * - Cloudinary
 *
 * Configuration:
 * Set NEXT_PUBLIC_STORAGE_PROVIDER in your .env file to choose the provider
 *
 * @example
 * ```typescript
 * import { uploadFile } from '@/lib/storage';
 *
 * const result = await uploadFile(file, {
 *   folder: 'book-covers',
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedTypes: ['image/jpeg', 'image/png'],
 * });
 *
 * console.log(result.url); // Use this URL in your database
 * ```
 */

export * from "./types";
export * from "./factory";
export * from "./utils";

// Re-export providers for advanced usage
export { SupabaseStorageProvider } from "./providers/supabase";
export { FirebaseStorageProvider } from "./providers/firebase";
export { S3StorageProvider } from "./providers/s3";
export { CloudinaryStorageProvider } from "./providers/cloudinary";

import { getStorageProvider } from "./factory";
import type { UploadOptions, UploadResult } from "./types";

/**
 * Upload a file using the configured storage provider
 * This is the main function you should use in your application
 */
export async function uploadFile(
  file: File,
  options?: UploadOptions
): Promise<UploadResult> {
  const provider = getStorageProvider();
  return provider.upload(file, options);
}

/**
 * Delete a file using the configured storage provider
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  const provider = getStorageProvider();
  return provider.delete(fileUrl);
}

/**
 * Get a signed URL for a file (if supported by the provider)
 */
export async function getSignedUrl(
  fileUrl: string,
  expiresIn?: number
): Promise<string> {
  const provider = getStorageProvider();

  if (!provider.getSignedUrl) {
    return fileUrl; // Return original URL if signing not supported
  }

  return provider.getSignedUrl(fileUrl, expiresIn);
}
