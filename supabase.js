// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your own values from Supabase > Project Settings > API
const SUPABASE_URL = 'https://zkzijlpapvnlumsfbbhx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpremlqbHBhcHZubHVtc2ZiYmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjIzMDgsImV4cCI6MjA1OTY5ODMwOH0.j1k9qID8iZaJW8xS0q8n7tdb7KNG176HKIIinsScui0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
