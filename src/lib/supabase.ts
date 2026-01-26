import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  
  console.error('Missing Supabase environment variables:', missing)
  console.error('Current env:', {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    allEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  })
  
  throw new Error(
    `Missing Supabase environment variables: ${missing.join(', ')}. ` +
    `Please check your .env file or Cloudflare Pages environment variables. ` +
    `Variables must be prefixed with VITE_ to be available in client-side code.`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)




