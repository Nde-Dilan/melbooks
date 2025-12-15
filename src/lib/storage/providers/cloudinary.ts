import {
  IStorageProvider,
  UploadOptions,
  UploadResult,
  StorageUploadError,
} from '../types';
import {
  validateFile,
  generateUniqueFileName,
  sanitizeFileName,
  buildFilePath,
} from '../utils';

/**
 * Cloudinary storage provider implementation
 * Uses unsigned upload preset for client-side uploads
 */
export class CloudinaryStorageProvider implements IStorageProvider {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'melbook-preset';
    this.apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
  }

  isConfigured(): boolean {
    return !!this.cloudName && !!this.uploadPreset;
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new StorageUploadError(
        'Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
        'cloudinary'
      );
    }

    // Validate file
    validateFile(file, options);

    // Generate file name
    let fileName = options?.fileName
      ? sanitizeFileName(options.fileName)
      : file.name.split('.')[0];

    if (options?.generateUniqueName !== false) {
      fileName = generateUniqueFileName(fileName).split('.')[0]; // Cloudinary handles extensions
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      
      if (options?.folder) {
        formData.append('folder', options.folder);
      }
      
      formData.append('public_id', fileName);

      if (options?.metadata) {
        formData.append('context', Object.entries(options.metadata)
          .map(([key, value]) => `${key}=${value}`)
          .join('|')
        );
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const data = await response.json();

      return {
        url: data.secure_url,
        fileName: data.public_id,
        fileSize: data.bytes,
        mimeType: file.type,
        metadata: {
          cloudinaryId: data.public_id,
          cloudinaryUrl: data.secure_url,
          width: data.width,
          height: data.height,
          format: data.format,
          resourceType: data.resource_type,
        },
      };
    } catch (error) {
      throw new StorageUploadError(
        `Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'cloudinary',
        error
      );
    }
  }

  async delete(fileUrl: string): Promise<void> {
    throw new StorageUploadError(
      'Cloudinary delete requires server-side implementation with API secret',
      'cloudinary'
    );
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    // Cloudinary URLs are public by default
    // For private images, you'd need server-side signing
    return fileUrl;
  }
}
