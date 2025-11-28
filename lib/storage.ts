import { createSupabaseServiceRoleClient } from './supabase/server';

export async function ensurePublicBucket(bucket: string) {
  const admin = createSupabaseServiceRoleClient();
  const { data, error } = await admin.storage.getBucket(bucket);
  if (error) {
    throw error;
  }

  if (!data) {
    const { error: createError } = await admin.storage.createBucket(bucket, { public: true });
    if (createError && createError.message?.includes('already exists') === false) {
      throw createError;
    }
  }

  return admin.storage.from(bucket);
}

export function buildPublicUrl(bucket: string, path: string) {
  const admin = createSupabaseServiceRoleClient();
  return admin.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
