import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from './supabase/server';

export async function getSessionUser() {
  // In dev mode, return a mock user if no real session exists
  if (process.env.NODE_ENV === 'development') {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    
    // If there's a real session, use it
    if (!error && data.user) {
      return data.user;
    }
    
    // Otherwise, return a mock dev user
    return {
      id: 'dev-user-id',
      email: 'dev@rendervault.studio',
      user_metadata: {
        full_name: 'Dev User',
      },
    } as any;
  }
  
  // In production, require real authentication
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
