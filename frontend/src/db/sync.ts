import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from './index'
import { supabase } from '../lib/supabase'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/sync'

export async function syncDatabase() {
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token

  if (!token) {
    console.error('Cannot sync: No authentication token')
    return
  }

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const response = await fetch(`${API_URL}/pull?lastPulledAt=${lastPulledAt || 0}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to pull changes: ${response.statusText}`)
      }
      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`${API_URL}/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ changes, lastPulledAt }),
      })
      if (!response.ok) {
        throw new Error(`Failed to push changes: ${response.statusText}`)
      }
    },
    migrationsEnabledAtVersion: 1,
  })
}
