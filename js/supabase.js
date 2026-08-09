import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://wumdbpyhpblvgjttsbpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bWRicHlocGJsdmdqdHRzYnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDMwNDQsImV4cCI6MjEwMTgxOTA0NH0.6eK0veaHyf6Dk9UMX6fGrxNItsfa4Y-m-NE6PXbCQ80';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Expose to window for global access if needed
window.supabaseClient = supabase;
