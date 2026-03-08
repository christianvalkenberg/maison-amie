import { createClient } from '@supabase/supabase-js';

// Client voor gebruik in de browser (alleen lezen / beperkte rechten)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client voor gebruik op de server (volledige rechten)
// NOOIT gebruiken in client-side code!
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
