import { createClient } from '@supabase/supabase-js'
import { config } from '../config.js'

let supabaseAdminClient

export function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'houseofbeauty-server',
        },
      },
    })
  }

  return supabaseAdminClient
}
