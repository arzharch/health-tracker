import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import { schema } from './schema'
import { Profile, Habit, HabitLog, Task, JournalEntry } from './models'

// For Web, we must use the LokiJS adapter instead of SQLite
const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false, // Optional: configure web workers for better performance if needed
  useIncrementalIndexedDB: true,
  onSetUpError: error => {
    console.error(error)
  }
})

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
