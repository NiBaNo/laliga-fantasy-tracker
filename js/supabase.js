
const SUPABASE_URL = "https://xkwzddjzypnskakskell.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mRv3S9r8wbop2EyPR5Icyg_bTAHwYNz";

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
