import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { schema } from './schema'
import { Profile, Habit, HabitLog, Task, JournalEntry } from './models'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to pass migrations here later)
  jsi: true, /* Set to true to enable synchronous JSI database access on iOS/Android */
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error(error)
  }
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Profile,
    Habit,
    HabitLog,
    Task,
    JournalEntry,
  ],
})
