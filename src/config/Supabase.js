import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseUrl = 'https://xszanshxdxaoidjlkkre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemFuc2h4ZHhhb2lkamxra3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzQyNjgsImV4cCI6MjA1NTgxMDI2OH0.Tapvz68vEXgwNTiXF9SfzXMPPffzIFutijk5clLxfc4'
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Anon Key')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;