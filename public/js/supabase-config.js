/* Public (browser-safe) Supabase config for Realtime chat.
   ONLY the anon/public key goes here — never the service role key,
   which stays server-side in Vercel env vars (see lib/supabase.js).
   Replace the two placeholders below with your project's values from
   Supabase → Project Settings → API. */

const SUPABASE_URL = 'https://wctbgfwlkffhbzgbvkii.supabase.co';
const SUPABASE_ANON_KEY = 'postgresql://postgres:[YOUR-PASSWORD]@db.wctbgfwlkffhbzgbvkii.supabase.co:5432/postgres';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
