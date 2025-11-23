import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://sazrqodkgjmusfrmlgbx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhenJxb2RrZ2ptdXNmcm1sZ2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzI0MTksImV4cCI6MjA3NzUwODQxOX0.Fc71issOeAC7f1CxTlkArgwVj9GSrFb6_2Y9MMb_wLw";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
