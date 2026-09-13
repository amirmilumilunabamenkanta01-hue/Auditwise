// js/config.js
export const API_URL = "https://zzfghyrjkckasdnhpywl.supabase.co/functions/v1/auditwise";
export const SUPABASE_URL = "https://zzfghyrjkckasdnhpywl.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZmdoeXJqa2NrYXNkbmhweXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDkwOTcsImV4cCI6MjEwMzU4NTA5N30.ViZ_NpS1pgO6ECnN6ahSNz7NGr30BSp_naItXD46vYw";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { "Content-Type": "application/json" };
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
    };
}
