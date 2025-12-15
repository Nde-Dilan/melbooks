"use client";

import { useState, useCallback } from "react";
import {
  uploadFile,
  deleteFile,
  FileValidationError,
  StorageUploadError,
} from "@/lib/storage";
import type { UploadOptions, UploadResult } from "@/lib/storage";

interface UseFileUploadOptions extends UploadOptions {
  /** Callback when upload starts */
  onUploadStart?: () => void;
  /** Callback when upload succeeds */
  onUploadSuccess?: (result: UploadResult) => void;
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  /** Auto-delete previous file when uploading new one */
  autoDeletePrevious?: boolean;
}

interface UseFileUploadReturn {
  /** Upload a file */
  upload: (file: File) => Promise<UploadResult | null>;
  /** Delete a file by URL */
  remove: (url: string) => Promise<void>;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Upload progress (0-100, if supported) */
  progress: number;
  /** Error message if upload failed */
  error: string | null;
  /** Clear the error */
  clearError: () => void;
  /** Upload result */
  result: UploadResult | null;
}

/**
 * React hook for file uploads with automatic state management
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error } = useFileUpload({
 *   folder: 'avatars',
 *   maxSize: 2 * 1024 * 1024,
 *   allowedTypes: ['image/jpeg', 'image/png'],
 * });
 *
 * const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const result = await upload(file);
 *     if (result) {
 *       console.log('Uploaded:', result.url);
 *     }
 *   }
 * };
 * ```
 */
export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        // Call the onUploadStart callback
        options.onUploadStart?.();

        // Delete previous file if enabled
        if (options.autoDeletePrevious && result?.url) {
          try {
            await deleteFile(result.url);
          } catch (err) {
            // Don't fail upload if delete fails
            console.warn("Failed to delete previous file:", err);
          }
        }

        // Simulate progress (since we don't have real progress from providers)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        // Upload the file
        const uploadResult = await uploadFile(file, options);

        clearInterval(progressInterval);
        setProgress(100);
        setResult(uploadResult);

        // Call the onUploadSuccess callback
        options.onUploadSuccess?.(uploadResult);

        return uploadResult;
      } catch (err) {
        let errorMessage = "Failed to upload file";

        if (err instanceof FileValidationError) {
          errorMessage = err.message;
        } else if (err instanceof StorageUploadError) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        // Call the onUploadError callback
        options.onUploadError?.(err as Error);

        return null;
      } finally {
        setIsUploading(false);
        // Reset progress after a delay
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [options, result]
  );

  const remove = useCallback(
    async (url: string): Promise<void> => {
      try {
        await deleteFile(url);
        if (result?.url === url) {
          setResult(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete file";
        setError(errorMessage);
        throw err;
      }
    },
    [result]
  );

  return {
    upload,
    remove,
    isUploading,
    progress,
    error,
    clearError,
    result,
  };
}
