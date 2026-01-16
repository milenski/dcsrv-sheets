import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase environment variables are missing!\n" +
    "Please create a .env file in the root directory with:\n" +
    "VITE_SUPABASE_URL=your_supabase_url\n" +
    "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
  );
}

// Use placeholder values if env vars are missing to prevent crash
// The app will show errors when trying to use auth, but won't crash on load
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);