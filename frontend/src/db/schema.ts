import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'display_name', type: 'string', isOptional: true },
        { name: 'current_streak', type: 'number' },
        { name: 'freeze_bank', type: 'number' },
        { name: 'last_streak_date', type: 'number', isOptional: true }, // Storing dates as Unix timestamp
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'habits',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'target_value', type: 'number' },
        { name: 'unit', type: 'string', isOptional: true },
        { name: 'icon_slug', type: 'string', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'habit_logs',
      columns: [
        { name: 'habit_id', type: 'string', isIndexed: true },
        { name: 'log_date', type: 'number' },
        { name: 'current_value', type: 'number' },
        { name: 'is_completed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'is_completed', type: 'boolean' },
        { name: 'due_date', type: 'number', isOptional: true },
        { name: 'reminder_minutes_before', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'journal_entries',
      columns: [
        { name: 'content', type: 'string' },
        { name: 'entry_date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    })
  ]
})
