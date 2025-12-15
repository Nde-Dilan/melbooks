"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Book, Category } from "@/lib/types";
import { useFirestore } from "@/firebase/provider";
import { doc, collection } from "firebase/firestore";
import {
  setDocumentNonBlocking,
  addDocumentNonBlocking,
} from "@/firebase/non-blocking-updates";
import { Loader2 } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  author: z.string().min(1, "Author is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
});

interface BookEditorProps {
  book: Book | null;
  isCreating: boolean;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export function BookEditor({
  book,
  isCreating,
  categories,
  onSave,
  onCancel,
}: BookEditorProps) {
  const firestore = useFirestore();

  const defaultValues = useMemo(
    () => ({
      title: book?.title || "",
      slug: book?.slug || "",
      author: book?.author || "",
      price: book?.price || 0,
      stock: book?.stock || 0,
      description: book?.description || "",
      categoryId: book?.categoryId || "",
      image: book?.image || "",
    }),
    [book]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [book, isCreating, reset, defaultValues]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && isCreating) {
        form.setValue("slug", generateSlug(value.title || ""), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isCreating]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;

    const bookData = {
      ...values,
      image: values.image || "https://picsum.photos/seed/1/600/400", // default placeholder
    };

    if (book && !isCreating) {
      const bookRef = doc(firestore, "books", book.id);
      setDocumentNonBlocking(bookRef, bookData, { merge: true });
    } else {
      const booksCollection = collection(firestore, "books");
      addDocumentNonBlocking(booksCollection, bookData);
    }
    onSave();
  }

  if (!book && !isCreating) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Select a book to edit</h2>
          <p className="text-muted-foreground">
            Or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 h-full flex flex-col"
        >
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <h2 className="text-2xl font-semibold">
              {isCreating ? "Create New Book" : "Edit Book"}
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Great Gatsby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="the-great-gatsby"
                      {...field}
                      disabled={!isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="F. Scott Fitzgerald" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Cover Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                      uploadOptions={{
                        folder: "book-covers",
                        maxSize: 5 * 1024 * 1024, // 5MB
                        allowedTypes: [
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                          "image/jpg",
                        ],
                        generateUniqueName: true,
                      }}
                      showPreview
                      placeholder="Upload book cover image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A novel about the American dream..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-shrink-0 pt-4 border-t">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreating ? "Create Book" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
