import { IStorageProvider, StorageConfig } from "./types";
import { SupabaseStorageProvider } from "./providers/supabase";
import { FirebaseStorageProvider } from "./providers/firebase";
import { S3StorageProvider } from "./providers/s3";
import { CloudinaryStorageProvider } from "./providers/cloudinary";

/**
 * Storage provider factory
 * Implements the Factory Pattern to create storage providers
 * Following the Dependency Inversion Principle (DIP)
 */
export class StorageProviderFactory {
  private static instance: IStorageProvider | null = null;

  /**
   * Create a storage provider based on configuration
   * Using Singleton pattern to reuse provider instances
   */
  static createProvider(config?: Partial<StorageConfig>): IStorageProvider {
    // Return cached instance if available
    if (this.instance) {
      return this.instance;
    }

    // Get provider from config or environment variable
    const providerName =
      config?.provider ||
      (process.env.NEXT_PUBLIC_STORAGE_PROVIDER as StorageConfig["provider"]) ||
      "supabase";

    let provider: IStorageProvider;

    switch (providerName) {
      case "supabase":
        provider = new SupabaseStorageProvider({
          bucket: config?.bucket,
        });
        break;

      case "firebase":
        provider = new FirebaseStorageProvider({
          bucket: config?.bucket,
        });
        break;

      case "s3":
        provider = new S3StorageProvider({
          bucket: config?.bucket,
          region: config?.region,
        });
        break;

      case "cloudinary":
        provider = new CloudinaryStorageProvider();
        break;

      default:
        throw new Error(`Unsupported storage provider: ${providerName}`);
    }

    // Validate configuration
    if (!provider.isConfigured()) {
      console.warn(
        `Storage provider "${providerName}" is not properly configured. Check your environment variables.`
      );
    }

    // Cache the instance
    this.instance = provider;

    return provider;
  }

  /**
   * Reset the cached provider instance
   * Useful for testing or reconfiguration
   */
  static resetProvider(): void {
    this.instance = null;
  }

  /**
   * Get the current provider instance without creating a new one
   */
  static getCurrentProvider(): IStorageProvider | null {
    return this.instance;
  }
}

/**
 * Convenience function to get the configured storage provider
 */
export function getStorageProvider(
  config?: Partial<StorageConfig>
): IStorageProvider {
  return StorageProviderFactory.createProvider(config);
}
