import { FileValidationError, UploadOptions } from "./types";

/**
 * Validate file against upload options
 */
export function validateFile(file: File, options?: UploadOptions): void {
  if (options?.maxSize && file.size > options.maxSize) {
    throw new FileValidationError(
      `File size (${formatBytes(
        file.size
      )}) exceeds maximum allowed size (${formatBytes(options.maxSize)})`
    );
  }

  if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
    throw new FileValidationError(
      `File type ${
        file.type
      } is not allowed. Allowed types: ${options.allowedTypes.join(", ")}`
    );
  }
}

/**
 * Generate a unique file name with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = sanitizeFileName(nameWithoutExtension);

  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Sanitize file name to be URL-safe
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extract file name from URL
 */
export function extractFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split("/").pop() || "";
    return decodeURIComponent(fileName);
  } catch {
    return "";
  }
}

/**
 * Get file extension from file name
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop() || "";
}

/**
 * Build full file path with folder
 */
export function buildFilePath(fileName: string, folder?: string): string {
  if (!folder) return fileName;

  // Remove leading/trailing slashes from folder
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");

  return `${cleanFolder}/${fileName}`;
}
