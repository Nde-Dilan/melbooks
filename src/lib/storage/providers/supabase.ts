import {
  IStorageProvider,
  UploadOptions,
  UploadResult,
  StorageUploadError,
} from "../types";
import {
  validateFile,
  generateUniqueFileName,
  sanitizeFileName,
  buildFilePath,
} from "../utils";

/**
 * Supabase storage provider implementation
 * Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export class SupabaseStorageProvider implements IStorageProvider {
  private supabaseUrl: string;
  private supabaseKey: string;
  private bucketName: string;

  constructor(config?: { bucket?: string }) {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    this.bucketName =
      config?.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";
  }

  isConfigured(): boolean {
    return !!this.supabaseUrl && !!this.supabaseKey;
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new StorageUploadError(
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "supabase"
      );
    }

    // Validate file
    validateFile(file, options);

    // Generate file name
    let fileName = options?.fileName
      ? `${sanitizeFileName(options.fileName)}.${file.name.split(".").pop()}`
      : file.name;

    if (options?.generateUniqueName !== false) {
      fileName = generateUniqueFileName(fileName);
    } else {
      fileName = sanitizeFileName(fileName);
    }

    // Build full path with folder
    const filePath = buildFilePath(fileName, options?.folder);

    try {
      // Upload to Supabase Storage using REST API
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${filePath}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      // Construct public URL
      const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${filePath}`;

      return {
        url: publicUrl,
        fileName: fileName,
        fileSize: file.size,
        mimeType: file.type,
        metadata: {
          bucket: this.bucketName,
          path: filePath,
        },
      };
    } catch (error) {
      throw new StorageUploadError(
        `Failed to upload file to Supabase: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "supabase",
        error
      );
    }
  }

  async delete(fileUrl: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new StorageUploadError("Supabase is not configured", "supabase");
    }

    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);

      if (!pathMatch) {
        throw new Error("Invalid Supabase URL format");
      }

      const filePath = pathMatch[1];
      const deleteUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${filePath}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }
    } catch (error) {
      throw new StorageUploadError(
        `Failed to delete file from Supabase: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "supabase",
        error
      );
    }
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    if (!this.isConfigured()) {
      throw new StorageUploadError("Supabase is not configured", "supabase");
    }

    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);

      if (!pathMatch) {
        throw new Error("Invalid Supabase URL format");
      }

      const filePath = pathMatch[1];
      const signUrl = `${this.supabaseUrl}/storage/v1/object/sign/${this.bucketName}/${filePath}`;

      const response = await fetch(signUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate signed URL");
      }

      const data = await response.json();
      return `${this.supabaseUrl}${data.signedURL}`;
    } catch (error) {
      throw new StorageUploadError(
        `Failed to generate signed URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "supabase",
        error
      );
    }
  }
}
