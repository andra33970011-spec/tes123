// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getEnv } from '@/lib/env.server';

function createSupabaseClient() {
  // Gunakan fungsi getEnv() untuk mengambil environment variables
  const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = getEnv();

  if (!VITE_SUPABASE_URL || !VITE_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      'Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.'
    );
  }

  return createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

// Export singleton client seperti biasa
let _supabase: ReturnType<typeof createSupabaseClient> | undefined;
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop);
  },
});
