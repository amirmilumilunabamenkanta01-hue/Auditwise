// js/config.js
export const API_URL = "PASTE_YOUR_DENO_URL_HERE";
export const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
export const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { "Content-Type": "application/json" };
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
    };
  }
