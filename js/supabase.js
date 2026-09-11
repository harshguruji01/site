import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
const supabaseKey = 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Expose to window for global access if needed
window.supabaseClient = supabase;
