import { createClient } from "@supabase/supabase-js"

// Credenciais do Supabase diretamente no código
const supabaseUrl = "https://bszzzmrmwvykuewafrbn.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenp6bXJtd3Z5a3Vld2FmcmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjA3MjAsImV4cCI6MjA2MjIzNjcyMH0.GI_q6t99JySI6103qeLN4sbb6ewYD26gHr-mr6efPV4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
