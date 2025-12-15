"use client";

import { useCallback, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  uploadFile,
  FileValidationError,
  StorageUploadError,
} from "@/lib/storage";
import type { UploadOptions } from "@/lib/storage";

interface FileUploadProps {
  /** Current file URL */
  value?: string;
  /** Callback when file is uploaded */
  onChange: (url: string) => void;
  /** Upload options */
  uploadOptions?: UploadOptions;
  /** Accept file types (e.g., "image/*") */
  accept?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Show preview for images */
  showPreview?: boolean;
  /** Custom class name */
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  uploadOptions,
  accept = "image/*",
  disabled = false,
  placeholder = "Click to upload or drag and drop",
  showPreview = true,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled) return;

      setIsUploading(true);
      setError(null);

      try {
        const result = await uploadFile(file, uploadOptions);
        onChange(result.url);
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
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, uploadOptions, onChange]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      // Reset input value to allow uploading the same file again
      event.target.value = "";
    },
    [handleUpload]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = event.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [disabled, handleUpload]
  );

  const handleClear = useCallback(() => {
    if (!disabled) {
      onChange("");
      setError(null);
    }
  }, [disabled, onChange]);

  const isImage =
    value &&
    (value.match(/\.(jpg|jpeg|png|gif|webp)$/i) || accept.includes("image"));

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive",
          !isDragging && !error && "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Preview */}
        {showPreview && value && isImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Upload Area */}
        <label
          className={cn(
            "flex flex-col items-center justify-center px-6 py-8 cursor-pointer",
            disabled && "cursor-not-allowed",
            showPreview && value && isImage && "py-4"
          )}
        >
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              {value && !showPreview ? (
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {value}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>
                    {" or drag and drop"}
                  </div>
                  {uploadOptions?.allowedTypes && (
                    <p className="text-xs text-gray-500">
                      {uploadOptions.allowedTypes
                        .map((type) => type.split("/")[1])
                        .join(", ")}
                    </p>
                  )}
                  {uploadOptions?.maxSize && (
                    <p className="text-xs text-gray-500">
                      Max size:{" "}
                      {(uploadOptions.maxSize / (1024 * 1024)).toFixed(1)}MB
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Manual URL Input */}
      {!isUploading && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Or enter URL manually:</span>
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={disabled}
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
        </div>
      )}
    </div>
  );
}
