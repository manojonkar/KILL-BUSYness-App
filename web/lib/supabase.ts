import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnnuxambmejpjgfjnfna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubnV4YW1ibWVqcGpnZmpuZm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMTE4MTIsImV4cCI6MjEwNTc4NzgxMn0.nlaLDrMhNi5G2x25sdR5SFcjO-XHSgkJif1jmyAeeVc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
