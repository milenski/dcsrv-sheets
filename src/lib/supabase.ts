import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log whether env vars are loaded (without exposing actual values)
console.log("🔧 Supabase config:", {
  urlLoaded: !!supabaseUrl,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : "MISSING",
  keyLoaded: !!supabaseAnonKey,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase environment variables are missing!\n" +
    "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set as secrets."
  );
}

// Use placeholder values if env vars are missing to prevent crash
// The app will show errors when trying to use auth, but won't crash on load
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);