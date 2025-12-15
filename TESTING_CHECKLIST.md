# File Upload System - Testing Checklist

Use this checklist to verify the file upload system is working correctly.

## 📋 Pre-Testing Setup

- [ ] Environment variables are set in `.env` or `.env.local`
- [ ] Development server has been restarted after adding env vars
- [ ] Storage provider account is created (Supabase/Firebase/etc.)
- [ ] Storage bucket/container is created and configured
- [ ] CORS is properly configured in storage provider

## 🧪 Functional Tests

### Basic Upload

- [ ] Can select a file using the file picker
- [ ] Can drag and drop a file onto the upload area
- [ ] Upload progress indicator shows during upload
- [ ] Success: File URL is returned and displayed
- [ ] Uploaded file appears in storage provider dashboard

### File Validation

- [ ] Uploading a file larger than maxSize shows error message
- [ ] Uploading disallowed file type shows error message
- [ ] Error messages are user-friendly and descriptive
- [ ] Upload button is disabled during validation error

### Image Preview

- [ ] Image preview shows after successful upload
- [ ] Preview displays correct image
- [ ] Can clear/remove uploaded image
- [ ] Preview updates when new image is uploaded

### Manual URL Input

- [ ] Can manually enter a URL in the fallback input
- [ ] Manually entered URL is validated (if validation enabled)
- [ ] Manual URL works alongside file upload

### Form Integration (Book Editor)

- [ ] Image upload field appears in book editor form
- [ ] Can upload book cover image
- [ ] Uploaded URL is saved to form state
- [ ] Form validation works with uploaded image URL
- [ ] Can save book with uploaded image
- [ ] Saved book displays uploaded image

## 🔄 Provider Switching Tests

### Test Each Provider

- [ ] **Supabase**: Upload works with Supabase config
- [ ] **Firebase**: Upload works with Firebase config
- [ ] **Cloudinary**: Upload works with Cloudinary config
- [ ] **S3**: Verify error message for server-side requirement

### Switch Between Providers

- [ ] Change NEXT_PUBLIC_STORAGE_PROVIDER in .env
- [ ] Restart dev server
- [ ] Upload still works with new provider
- [ ] URLs from different providers all work

## 🎨 UI/UX Tests

### Visual States

- [ ] Default state: Shows upload icon and text
- [ ] Dragging state: Visual feedback when dragging file over
- [ ] Uploading state: Shows loading spinner
- [ ] Success state: Shows image preview (for images)
- [ ] Error state: Shows error message with icon

### Interactions

- [ ] Hover effects work on upload area
- [ ] Click anywhere in upload area to open file picker
- [ ] Clear/remove button works correctly
- [ ] Disabled state prevents all interactions

### Responsive Design

- [ ] Upload component works on mobile screens
- [ ] Preview displays correctly on small screens
- [ ] Touch events work for drag & drop on mobile

## 🐛 Error Handling Tests

### Network Errors

- [ ] Graceful handling when network is offline
- [ ] Retry or error message when upload fails
- [ ] Timeout handling for slow connections

### Configuration Errors

- [ ] Clear error when provider not configured
- [ ] Helpful message indicating which env vars are missing
- [ ] No crashes, only error messages

### File Errors

- [ ] Handles corrupt files gracefully
- [ ] Handles zero-byte files
- [ ] Handles files with special characters in name

## 🔒 Security Tests

### Validation

- [ ] Client-side validation works (size, type)
- [ ] Cannot bypass size limits in UI
- [ ] Cannot bypass file type restrictions in UI
- [ ] Unique filenames prevent overwriting

### Access Control

- [ ] Public files are accessible via URL
- [ ] Private files require authentication (if configured)
- [ ] Cannot access other users' files (if using auth)

## ⚡ Performance Tests

### Upload Speed

- [ ] Small files (<100KB) upload quickly (<1s)
- [ ] Medium files (1-5MB) upload reasonably (<10s)
- [ ] Large files show progress indication
- [ ] Multiple sequential uploads work smoothly

### Browser Compatibility

- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Mobile browsers: All features work

## 📱 Integration Tests

### Book Editor

- [ ] Can create new book with uploaded image
- [ ] Can edit existing book and change image
- [ ] Previous image is replaced (not accumulated)
- [ ] Book list shows uploaded images correctly

### Form Validation

- [ ] Required validation works with file upload
- [ ] Form is dirty after file upload
- [ ] Form submission includes uploaded URL
- [ ] Validation errors prevent submission

## 🧹 Cleanup Tests

### Delete Functionality

- [ ] Can delete uploaded file using deleteFile()
- [ ] File is removed from storage provider
- [ ] UI updates after deletion
- [ ] Deleting non-existent file handled gracefully

### Old File Cleanup

- [ ] When replacing image, old file is cleaned up (if implemented)
- [ ] No orphaned files accumulate in storage

## 📊 Edge Cases

- [ ] Upload same file twice (should create unique names)
- [ ] Upload file with very long name
- [ ] Upload file with special characters (@, #, spaces, etc.)
- [ ] Upload file with no extension
- [ ] Rapid consecutive uploads
- [ ] Cancel/close during upload
- [ ] Navigate away during upload

## 🔍 Debugging Checklist

If something doesn't work:

1. **Check Browser Console**

   - [ ] No JavaScript errors
   - [ ] No network errors
   - [ ] Check API response in Network tab

2. **Verify Environment Variables**

   - [ ] All required variables are set
   - [ ] Variables start with NEXT*PUBLIC*
   - [ ] No typos in variable names
   - [ ] Values are correct (URL, keys, etc.)

3. **Check Storage Provider**

   - [ ] Bucket/container exists
   - [ ] Bucket is accessible (public or with correct permissions)
   - [ ] CORS is configured
   - [ ] API keys are valid

4. **Check Code**
   - [ ] No TypeScript errors
   - [ ] Component is imported correctly
   - [ ] Props are passed correctly
   - [ ] onChange handler is wired up

## ✅ Test Results

Date tested: ******\_\_\_******
Tester: ******\_\_\_******
Provider used: ******\_\_\_******

Overall result:

- [ ] ✅ All tests passed
- [ ] ⚠️ Some tests passed with minor issues
- [ ] ❌ Major issues found

Notes:

---

---

---

## 🚀 Production Readiness Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured in production
- [ ] Storage bucket configured for production use
- [ ] Security policies configured (if using private files)
- [ ] File size limits appropriate for production
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Monitoring set up for storage usage
- [ ] Backup strategy in place
- [ ] CDN configured (if needed)
- [ ] Cost estimation done for storage usage

## 📞 Support

If you encounter issues:

1. Check `/docs/storage-system.md` for documentation
2. Check `/QUICK_SETUP.md` for setup instructions
3. Check provider-specific setup in documentation
4. Review error messages in browser console
5. Check storage provider dashboard for logs
