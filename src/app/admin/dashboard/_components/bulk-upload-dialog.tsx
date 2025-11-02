
'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirestore } from '@/firebase';
import { collection, where, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import Papa from 'papaparse';
import { AlertCircle, CheckCircle, HelpCircle, Loader2, UploadCloud, XCircle } from 'lucide-react';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
  categories: Category[];
}

type UploadStatus = 'idle' | 'parsing' | 'uploading' | 'complete';
type RowResult = {
  row: number;
  title: string;
  status: 'success' | 'error';
  message: string;
};

const CSV_HEADERS = ['title', 'author', 'price', 'stock', 'description', 'categorySlug'];

export function BulkUploadDialog({ open, onOpenChange, onUploadComplete, categories }: BulkUploadDialogProps) {
  const firestore = useFirestore();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<RowResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const categoryMap = useMemo(() => {
    return new Map(categories.map(cat => [cat.slug, cat.id]));
  }, [categories]);

  const resetState = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setResults([]);
    setError(null);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (status !== 'uploading') {
      onOpenChange(isOpen);
      if (!isOpen) {
        resetState();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid .csv file.');
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const processCsv = async () => {
    if (!file || !firestore) return;

    setStatus('parsing');
    setError(null);
    setResults([]);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (papaResults) => {
        const data = papaResults.data as any[];
        const headers = papaResults.meta.fields || [];

        const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            setError(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
            setStatus('idle');
            return;
        }

        setStatus('uploading');
        const totalRows = data.length;
        let processedCount = 0;
        const tempResults: RowResult[] = [];

        for (let i = 0; i < totalRows; i++) {
          const row = data[i];
          const title = row.title;
          
          try {
            if (!title || !row.author || !row.price || !row.stock || !row.description || !row.categorySlug) {
              throw new Error('Missing required fields.');
            }

            const categoryId = categoryMap.get(row.categorySlug);
            if (!categoryId) {
              throw new Error(`Category slug "${row.categorySlug}" not found.`);
            }

            const bookData = {
              title,
              author: row.author,
              price: parseFloat(row.price),
              stock: parseInt(row.stock, 10),
              description: row.description,
              categoryId,
              slug: generateSlug(title),
              image: 'https://picsum.photos/seed/placeholder/600/400', // Default placeholder
              createdAt: serverTimestamp(),
            };

            const booksCollection = collection(firestore, 'books');
            await addDoc(booksCollection, bookData);

            tempResults.push({ row: i + 2, title, status: 'success', message: 'Book created successfully.' });

          } catch (e: any) {
            tempResults.push({ row: i + 2, title: title || 'N/A', status: 'error', message: e.message });
          }

          processedCount++;
          setProgress((processedCount / totalRows) * 100);
          setResults([...tempResults]);
        }

        setStatus('complete');
        onUploadComplete();
      },
      error: (err: any) => {
        setError(`CSV parsing error: ${err.message}`);
        setStatus('idle');
      }
    });
  };

  const summary = useMemo(() => {
    if (status !== 'complete') return null;
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    return { successCount, errorCount };
  }, [status, results]);

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Books</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple books to your inventory at once.
          </DialogDescription>
        </DialogHeader>
        
        {status === 'idle' && (
            <div className="py-4 space-y-4">
                <div className='flex items-center justify-between'>
                    <label htmlFor="csv-upload" className="font-medium text-sm">CSV File</label>
                    <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)}>
                        <HelpCircle className="mr-2 h-4 w-4"/>
                        Formatting Help
                    </Button>
                </div>
                <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        )}

        {(status === 'parsing' || status === 'uploading' || status === 'complete') && (
            <div className='space-y-4 py-4'>
                <div>
                    <div className="flex justify-between mb-1">
                        <p className='text-sm font-medium'>
                            {status === 'parsing' && 'Parsing CSV...'}
                            {status === 'uploading' && `Uploading books... (${Math.round(progress)}%)`}
                            {status === 'complete' && 'Upload Complete'}
                        </p>
                        {status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin"/>}
                    </div>
                    <Progress value={progress} />
                </div>
                {summary && (
                    <Alert variant={summary.errorCount > 0 ? "destructive" : "default"}>
                         {summary.errorCount > 0 ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <AlertTitle>
                            {summary.errorCount > 0 ? "Upload Finished with Errors" : "Upload Successful"}
                        </AlertTitle>
                        <AlertDescription>
                            {summary.successCount} books uploaded successfully. {summary.errorCount > 0 && `${summary.errorCount} rows failed.`}
                        </AlertDescription>
                    </Alert>
                )}
                {results.length > 0 && (
                    <ScrollArea className="h-64 border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[80px]'>Row</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className='w-[100px]'>Status</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map(res => (
                                    <TableRow key={res.row}>
                                        <TableCell>{res.row}</TableCell>
                                        <TableCell className='font-medium'>{res.title}</TableCell>
                                        <TableCell>
                                            {res.status === 'success' ? 
                                                <span className='text-green-600 flex items-center'><CheckCircle className='h-4 w-4 mr-1'/> Success</span> : 
                                                <span className='text-red-600 flex items-center'><XCircle className='h-4 w-4 mr-1'/> Error</span>}
                                        </TableCell>
                                        <TableCell className='text-muted-foreground text-xs'>{res.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </div>
        )}

        <DialogFooter>
          {status === 'idle' ? (
            <>
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button onClick={processCsv} disabled={!file}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload and Process
                </Button>
            </>
          ) : (
            <Button onClick={() => handleOpenChange(false)} disabled={status === 'uploading'}>
                {status === 'complete' ? 'Close' : 'Cancel'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showHelp} onOpenChange={setShowHelp}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>CSV Formatting Instructions</AlertDialogTitle>
                <AlertDialogDescription>
                    Ensure your CSV file has the following headers in the first row. The order does not matter, but the names must be exact.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="text-sm">
                <p>Required headers:</p>
                <ul className="list-disc list-inside my-2 p-3 bg-muted rounded-md font-mono text-xs">
                    {CSV_HEADERS.map(h => <li key={h}>{h}</li>)}
                </ul>
                <p className='font-semibold mt-4'>Column Details:</p>
                <ul className='space-y-1 mt-2 text-muted-foreground'>
                    <li><span className='font-mono font-semibold text-foreground'>title</span>: The full title of the book.</li>
                    <li><span className='font-mono font-semibold text-foreground'>author</span>: The author's full name.</li>
                    <li><span className='font-mono font-semibold text-foreground'>price</span>: A number representing the price (e.g., 15000).</li>
                    <li><span className='font-mono font-semibold text-foreground'>stock</span>: An integer for the quantity available.</li>
                    <li><span className='font-mono font-semibold text-foreground'>description</span>: A brief summary of the book.</li>
                    <li><span className='font-mono font-semibold text-foreground'>categorySlug</span>: The URL-friendly slug for the category (e.g., 'fiction', 'non-fiction'). Must match an existing category slug in your database.</li>
                </ul>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Got it</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}

