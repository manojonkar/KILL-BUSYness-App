import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// We use the service role key to bypass RLS in the API route if needed.
// Ensure you have SUPABASE_SERVICE_ROLE_KEY set in your environment variables.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
