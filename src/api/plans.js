import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let client = null
function getClient() {
  if (!client) client = createClient(supabaseUrl, supabaseAnonKey)
  return client
}

/** 플랜 목록 조회 (RLS: plans 공개 읽기) */
export async function getPlans() {
  const { data, error } = await getClient().from('plans').select('*').order('amount', { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}
