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
 * Firebase storage provider implementation
 * Uses Firebase Storage REST API
 */
export class FirebaseStorageProvider implements IStorageProvider {
  private projectId: string;
  private apiKey: string;
  private bucketName: string;

  constructor(config?: { bucket?: string }) {
    this.projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
    this.apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
    this.bucketName =
      config?.bucket ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${this.projectId}.appspot.com`;
  }

  isConfigured(): boolean {
    return !!this.projectId && !!this.apiKey;
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new StorageUploadError(
        "Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY",
        "firebase"
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
      // Upload using Firebase Storage REST API
      const encodedPath = encodeURIComponent(filePath);
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o?uploadType=media&name=${encodedPath}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Upload failed");
      }

      const data = await response.json();

      // Construct public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o/${encodedPath}?alt=media`;

      return {
        url: publicUrl,
        fileName: fileName,
        fileSize: file.size,
        mimeType: file.type,
        metadata: {
          bucket: this.bucketName,
          path: filePath,
          firebaseData: data,
        },
      };
    } catch (error) {
      throw new StorageUploadError(
        `Failed to upload file to Firebase: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "firebase",
        error
      );
    }
  }

  async delete(fileUrl: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new StorageUploadError("Firebase is not configured", "firebase");
    }

    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)$/);

      if (!pathMatch) {
        throw new Error("Invalid Firebase Storage URL format");
      }

      const encodedPath = pathMatch[1].split("?")[0];
      const deleteUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o/${encodedPath}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Delete failed");
      }
    } catch (error) {
      throw new StorageUploadError(
        `Failed to delete file from Firebase: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "firebase",
        error
      );
    }
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    // Firebase public URLs don't need signing for public buckets
    // For private buckets, you'd need to use Firebase Admin SDK on the server
    return fileUrl;
  }
}
