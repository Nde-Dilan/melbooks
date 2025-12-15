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
 * AWS S3 storage provider implementation
 * Uses S3 REST API with presigned URLs
 */
export class S3StorageProvider implements IStorageProvider {
  private bucketName: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(config?: { bucket?: string; region?: string }) {
    this.bucketName = config?.bucket || process.env.NEXT_PUBLIC_S3_BUCKET || "";
    this.region =
      config?.region || process.env.NEXT_PUBLIC_S3_REGION || "us-east-1";
    this.accessKeyId = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || "";
    this.secretAccessKey = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || "";
  }

  isConfigured(): boolean {
    return !!this.bucketName && !!this.accessKeyId && !!this.secretAccessKey;
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new StorageUploadError(
        "S3 is not configured. Please set NEXT_PUBLIC_S3_BUCKET, NEXT_PUBLIC_S3_ACCESS_KEY_ID, and NEXT_PUBLIC_S3_SECRET_ACCESS_KEY",
        "s3"
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
      // For client-side S3 uploads, you typically need to:
      // 1. Get a presigned URL from your backend
      // 2. Upload directly to S3 using that URL
      //
      // This is a simplified implementation. In production, you should:
      // - Create an API route that generates presigned URLs
      // - Use that presigned URL to upload the file

      throw new Error(
        "S3 provider requires server-side implementation. Please create an API route to generate presigned URLs."
      );

      // Example of what the flow would look like:
      // const presignedUrl = await this.getPresignedUploadUrl(filePath, file.type);
      // await fetch(presignedUrl, {
      //   method: 'PUT',
      //   body: file,
      //   headers: { 'Content-Type': file.type }
      // });

      // const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filePath}`;

      // return {
      //   url: publicUrl,
      //   fileName: fileName,
      //   fileSize: file.size,
      //   mimeType: file.type,
      //   metadata: {
      //     bucket: this.bucketName,
      //     region: this.region,
      //     path: filePath,
      //   },
      // };
    } catch (error) {
      throw new StorageUploadError(
        `Failed to upload file to S3: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "s3",
        error
      );
    }
  }

  async delete(fileUrl: string): Promise<void> {
    throw new StorageUploadError(
      "S3 delete requires server-side implementation",
      "s3"
    );
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    throw new StorageUploadError(
      "S3 signed URLs require server-side implementation",
      "s3"
    );
  }
}
