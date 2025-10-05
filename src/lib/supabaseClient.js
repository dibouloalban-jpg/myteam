// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// exporte une instance réutilisable dans toute l'app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
 