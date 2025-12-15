/**
 * Storage System Examples
 *
 * This file demonstrates various ways to use the storage system
 */

import { uploadFile, deleteFile, getSignedUrl } from "@/lib/storage";

// ============================================
// Example 1: Basic File Upload
// ============================================
export async function basicUpload(file: File) {
  const result = await uploadFile(file);
  console.log("File uploaded:", result.url);
  return result.url;
}

// ============================================
// Example 2: Upload with Options
// ============================================
export async function uploadWithOptions(file: File) {
  const result = await uploadFile(file, {
    folder: "book-covers",
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    generateUniqueName: true,
    metadata: {
      uploadedBy: "admin",
      category: "book-cover",
    },
  });

  return result;
}

// ============================================
// Example 3: Upload with Custom Name
// ============================================
export async function uploadWithCustomName(file: File, bookSlug: string) {
  const result = await uploadFile(file, {
    folder: "book-covers",
    fileName: `${bookSlug}-cover`,
    generateUniqueName: false, // Use exact name
  });

  return result;
}

// ============================================
// Example 4: Upload with Error Handling
// ============================================
export async function uploadWithErrorHandling(file: File) {
  try {
    const result = await uploadFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ["image/jpeg", "image/png"],
    });

    return { success: true, url: result.url };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

// ============================================
// Example 5: Delete File
// ============================================
export async function deleteUploadedFile(fileUrl: string) {
  try {
    await deleteFile(fileUrl);
    console.log("File deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete file:", error);
    return false;
  }
}

// ============================================
// Example 6: Get Signed URL (for private files)
// ============================================
export async function getPrivateFileUrl(fileUrl: string) {
  try {
    const signedUrl = await getSignedUrl(fileUrl, 3600); // 1 hour
    return signedUrl;
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    return fileUrl; // Fallback to original URL
  }
}

// ============================================
// Example 7: Upload Multiple Files
// ============================================
export async function uploadMultipleFiles(files: File[]) {
  const results = await Promise.allSettled(
    files.map((file) =>
      uploadFile(file, {
        folder: "bulk-uploads",
        maxSize: 5 * 1024 * 1024,
      })
    )
  );

  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<any>).value);

  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => (r as PromiseRejectedResult).reason);

  return { successful, failed };
}

// ============================================
// Example 8: Replace Existing File
// ============================================
export async function replaceFile(oldFileUrl: string, newFile: File) {
  try {
    // Upload new file first
    const result = await uploadFile(newFile, {
      folder: "book-covers",
    });

    // Delete old file
    try {
      await deleteFile(oldFileUrl);
    } catch (error) {
      console.warn("Failed to delete old file:", error);
      // Continue anyway - new file was uploaded successfully
    }

    return result;
  } catch (error) {
    console.error("Failed to replace file:", error);
    throw error;
  }
}

// ============================================
// Example 9: Validate Before Upload
// ============================================
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(
        2
      )}MB) exceeds maximum allowed size (5MB)`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${
        file.type
      } is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

// ============================================
// Example 10: Upload with Progress Tracking
// ============================================
export async function uploadWithProgress(
  file: File,
  onProgress: (progress: number) => void
) {
  // Simulate progress since most providers don't support it directly
  const progressInterval = setInterval(() => {
    // This is a simulation - real progress would come from the provider
    const randomProgress = Math.floor(Math.random() * 20) + 10;
    onProgress(randomProgress);
  }, 200);

  try {
    const result = await uploadFile(file, {
      folder: "uploads",
    });

    clearInterval(progressInterval);
    onProgress(100);

    return result;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

// ============================================
// Example 11: Upload Image and Get Thumbnail
// ============================================
export async function uploadImageWithThumbnail(file: File) {
  // Upload original image
  const result = await uploadFile(file, {
    folder: "products/original",
    maxSize: 10 * 1024 * 1024, // 10MB for originals
  });

  // In a real scenario, you might:
  // 1. Generate a thumbnail on the server
  // 2. Upload the thumbnail separately
  // 3. Return both URLs

  return {
    original: result.url,
    thumbnail: result.url, // In this example, same as original
    metadata: result.metadata,
  };
}

// ============================================
// Example 12: Batch Upload with Retry
// ============================================
export async function batchUploadWithRetry(
  files: File[],
  maxRetries = 3
): Promise<Array<{ file: File; result?: any; error?: string }>> {
  const results = [];

  for (const file of files) {
    let lastError: Error | null = null;
    let success = false;

    for (let attempt = 0; attempt < maxRetries && !success; attempt++) {
      try {
        const result = await uploadFile(file, {
          folder: "batch-uploads",
        });
        results.push({ file, result });
        success = true;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Upload attempt ${attempt + 1} failed for ${file.name}`);

        // Wait before retry
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }
    }

    if (!success) {
      results.push({
        file,
        error: lastError?.message || "Upload failed after retries",
      });
    }
  }

  return results;
}
