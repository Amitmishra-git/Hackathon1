import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yprljkpbojdcqytybyjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwcmxqa3Bib2pkY3F5dHlieWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTU0ODAsImV4cCI6MjA2OTA5MTQ4MH0.8WPEMnJX1HNoWrRqLPAXa6tI7SrrZGWFK5WpvPHvSok';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 