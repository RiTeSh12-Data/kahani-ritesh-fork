# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for voice note file storage.

## What Was Implemented

✅ Voice notes are now automatically:
1. Downloaded from WhatsApp when received
2. Uploaded to Supabase Storage
3. Stored with permanent URLs (no expiration)
4. Saved in the database with Supabase URLs

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create a new one if needed)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (the secret key, not the anon key)

### 2. Create the Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Configure the bucket:
   - **Name:** `voice-notes` (must match exactly)
   - **Public bucket:** ✅ **Enable this** (so files can be accessed via public URLs)
   - **File size limit:** Set appropriate limit (e.g., 10MB for voice notes)
   - **Allowed MIME types:** Leave empty or add: `audio/ogg`, `audio/mp3`, `audio/m4a`
4. Click **Create bucket**

### 3. Set Up Environment Variables

Add these to your `.env` file or environment variables:

```bash
# Supabase Storage Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:**
- Never commit the Service Role Key to version control
- The Service Role Key has admin privileges - keep it secret
- Use environment variables or secrets management in your deployment platform

### 4. Verify the Setup

After setting up:

1. **Check logs:** When a voice note is received, you should see:
   ```
   Voice note downloaded and uploaded to Supabase: {
     voiceNoteId: '...',
     mediaId: '...',
     supabaseUrl: 'https://xxxxx.supabase.co/storage/v1/object/public/voice-notes/...',
     sizeBytes: ...
   }
   ```

2. **Check Supabase Storage:** 
   - Go to Storage → voice-notes bucket
   - You should see uploaded files with names like `{voiceNoteId}.ogg`

3. **Check Database:**
   - The `voice_notes` table should have `mediaUrl` pointing to Supabase URLs
   - The `localFilePath` field should contain the file path

## How It Works

### Flow Diagram

```
WhatsApp Voice Note Received
    ↓
Webhook → handleVoiceNote()
    ↓
Save metadata to database (status: "pending")
    ↓
downloadAndStoreVoiceNote() [async]
    ↓
1. Get media URL from WhatsApp API
    ↓
2. Download file from WhatsApp (temporary URL)
    ↓
3. Upload file to Supabase Storage
    ↓
4. Get public URL from Supabase
    ↓
5. Update database with Supabase URL (status: "completed")
```

### File Naming

Files are stored with the format: `{voiceNoteId}.{extension}`
- Example: `550e8400-e29b-41d4-a716-446655440000.ogg`
- Extension is determined from MIME type (ogg, mp3, or m4a)

### Public URLs

Files are accessible via public URLs like:
```
https://{project-ref}.supabase.co/storage/v1/object/public/voice-notes/{voiceNoteId}.ogg
```

These URLs are:
- ✅ Permanent (don't expire)
- ✅ Publicly accessible (no authentication needed)
- ✅ CDN-backed (fast delivery)
- ✅ Directly usable in HTML `<audio>` tags

## Troubleshooting

### Error: "Supabase client not initialized"

**Cause:** Missing environment variables

**Solution:**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check that they're loaded in your environment (restart server if needed)

### Error: "Bucket not found" or "Permission denied"

**Cause:** Bucket doesn't exist or wrong permissions

**Solution:**
1. Verify bucket name is exactly `voice-notes`
2. Ensure bucket is set to **Public**
3. Check that Service Role Key has correct permissions

### Files not uploading

**Check:**
1. Server logs for error messages
2. Supabase Storage dashboard for files
3. Database `voice_notes` table - check `downloadStatus` field:
   - `pending` = still processing
   - `completed` = successfully uploaded
   - `failed` = upload failed (check logs)

### Files upload but URLs don't work

**Cause:** Bucket might not be public

**Solution:**
1. Go to Storage → voice-notes bucket
2. Click **Settings** (gear icon)
3. Ensure **Public bucket** is enabled

## Testing

To test the implementation:

1. Send a voice note via WhatsApp to your business number
2. Check server logs for upload confirmation
3. Verify file appears in Supabase Storage
4. Check database `voice_notes` table for Supabase URL
5. Try accessing the URL directly in a browser (should download/play audio)

## Cost Considerations

Supabase Free Tier includes:
- 1 GB storage
- 2 GB bandwidth/month

For production:
- Monitor storage usage in Supabase Dashboard
- Consider upgrading if you exceed free tier limits
- Voice notes are typically 30-60 seconds, ~100-500KB each

## Security Notes

1. **Service Role Key:** 
   - Only use on server-side
   - Never expose in client code
   - Rotate if compromised

2. **Public Bucket:**
   - Files are publicly accessible via URL
   - URLs are hard to guess (UUID-based)
   - Consider adding authentication layer if needed

3. **File Validation:**
   - Currently accepts any audio MIME type
   - Consider adding file size limits
   - Could add virus scanning in future

## Next Steps (Optional Enhancements)

- [ ] Add file size validation before upload
- [ ] Implement retry logic for failed uploads
- [ ] Add cleanup job for old voice notes
- [ ] Add authentication for file access
- [ ] Implement file compression
- [ ] Add CDN caching headers

