// src/lib/env.server.ts
import { getContext } from '@tanstack/react-start/server';

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

/**
 * Mendapatkan environment variables dengan aman.
 * - Saat di server (SSR/API), akan mengambil dari context Cloudflare.
 * - Saat di client, akan mengambil dari import.meta.env.
 */
export const getEnv = (): Env => {
  // Cek apakah kode ini berjalan di server
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' && typeof window === 'undefined') {
    try {
      const cloudflareContext = getContext('cloudflare');
      if (cloudflareContext?.env) {
        return cloudflareContext.env as unknown as Env;
      }
    } catch (error) {
      console.warn("Failed to get Cloudflare context, falling back to process.env", error);
    }
    // Fallback untuk development lokal
    return {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
      VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
    };
  }
  
  // Untuk environment client (browser)
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  };
};
