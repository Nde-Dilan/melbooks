# Quick Setup Guide - Supabase Storage

Get file uploads working in 5 minutes with Supabase (recommended default provider).

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Create a new project (or use existing)
3. Wait for the project to be ready

## Step 2: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it `uploads` (or any name you prefer)
4. Choose **Public bucket** for easier setup (or configure RLS for private)
5. Click **Create bucket**

## Step 3: Configure Public Access (Optional)

If you chose a public bucket:

1. Click on your bucket
2. Go to **Policies**
3. Click **New policy**
4. Select **For full customization** or use a template
5. Allow public read access:
   ```sql
   SELECT: true for everyone
   INSERT: true for authenticated users (or everyone for testing)
   ```

## Step 4: Get Your Credentials

1. Go to **Project Settings** (gear icon)
2. Go to **API** section
3. Copy these values:
   - **URL** (under Project URL)
   - **anon/public** key (under Project API keys)

## Step 5: Add to .env

Create or edit `.env.local` in your project root:

```bash
# Storage Provider
NEXT_PUBLIC_STORAGE_PROVIDER=supabase

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_BUCKET=uploads
```

Replace `xxxxx.supabase.co` with your actual project URL and `your-anon-key-here` with your anon key.

## Step 6: Restart Development Server

```bash
npm run dev
```

## Step 7: Test It!

1. Go to your admin dashboard
2. Try creating or editing a book
3. Upload an image using the file upload component
4. The image should upload to Supabase Storage
5. Check your Supabase Storage bucket to see the uploaded file

## ✅ That's It!

Your file upload system is now working with Supabase Storage.

## Troubleshooting

### "Provider not configured" error

- Make sure you've added all three variables to `.env.local`
- Restart your dev server after adding env variables
- Check that variable names start with `NEXT_PUBLIC_`

### Upload fails with CORS error

- Go to Supabase Storage settings
- Add your domain to allowed origins
- For local dev, add `http://localhost:9002`

### "Access denied" error

- Check your bucket policies
- For testing, make the bucket public
- For production, configure proper RLS policies

### File uploads but URL doesn't work

- Verify the bucket is set to public
- Check the URL format in Supabase Storage
- Ensure CORS is configured correctly

## Next Steps

- Switch to private buckets with RLS policies for production
- Configure file size limits in the upload component
- Customize the upload folder structure
- Add custom validation rules

## Alternative: Use Firebase Instead

If you prefer Firebase Storage, just change `.env.local`:

```bash
NEXT_PUBLIC_STORAGE_PROVIDER=firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

The code works exactly the same way!
