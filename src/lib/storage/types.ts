/**
 * File upload result returned by storage providers
 */
export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  metadata?: Record<string, unknown>;
}

/**
 * Upload options for customizing file uploads
 */
export interface UploadOptions {
  /** Custom file name (without extension) */
  fileName?: string;
  /** Folder path where the file should be stored */
  folder?: string;
  /** Max file size in bytes */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Whether to generate a unique name */
  generateUniqueName?: boolean;
  /** Additional metadata to store with the file */
  metadata?: Record<string, string>;
}

/**
 * Storage provider configuration
 */
export interface StorageConfig {
  provider: "supabase" | "firebase" | "s3" | "cloudinary";
  bucket?: string;
  region?: string;
  apiKey?: string;
  apiSecret?: string;
  [key: string]: unknown;
}

/**
 * Interface that all storage providers must implement
 * Following the Interface Segregation Principle (ISP)
 */
export interface IStorageProvider {
  /**
   * Upload a file to the storage provider
   */
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Delete a file from the storage provider
   */
  delete(fileUrl: string): Promise<void>;

  /**
   * Get a signed URL for private files (optional)
   */
  getSignedUrl?(fileUrl: string, expiresIn?: number): Promise<string>;

  /**
   * Check if the provider is properly configured
   */
  isConfigured(): boolean;
}

/**
 * Error thrown when file upload fails
 */
export class StorageUploadError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "StorageUploadError";
  }
}

/**
 * Error thrown when file validation fails
 */
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}
