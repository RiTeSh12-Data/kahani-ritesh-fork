import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase Storage not configured. Voice notes will not be uploaded to Supabase.');
}

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const VOICE_NOTES_BUCKET = 'voice-notes';

/**
 * Upload a voice note file to Supabase Storage
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The file name (should be unique, e.g., voiceNoteId.ogg)
 * @param mimeType - The MIME type of the file
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadVoiceNoteToStorage(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot upload voice note.');
    return null;
  }

  try {
    // Determine file extension from mimeType
    const extension = mimeType.includes('ogg') ? 'ogg' : 
                      mimeType.includes('mp3') ? 'mp3' : 
                      mimeType.includes('m4a') ? 'm4a' : 'ogg';
    
    const fullFileName = `${fileName}.${extension}`;
    const filePath = `${fullFileName}`;

    const { data, error } = await supabase.storage
      .from(VOICE_NOTES_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('Error uploading voice note to Supabase Storage:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(VOICE_NOTES_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      console.error('Failed to get public URL for uploaded voice note');
      return null;
    }

    console.log('Voice note uploaded to Supabase Storage:', {
      fileName: fullFileName,
      publicUrl: urlData.publicUrl
    });

    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception uploading voice note to Supabase Storage:', error);
    return null;
  }
}

