import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export class Profile extends Model {
  static table = 'profiles'
  @field('display_name') displayName!: string
  @field('current_streak') currentStreak!: number
  @field('freeze_bank') freezeBank!: number
  @date('last_streak_date') lastStreakDate!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}

export class Habit extends Model {
  static table = 'habits'
  @field('name') name!: string
  @field('target_value') targetValue!: number
  @field('unit') unit!: string
  @field('icon_slug') iconSlug!: string
}

export class HabitLog extends Model {
  static table = 'habit_logs'
  @field('habit_id') habitId!: string
  @date('log_date') logDate!: number
  @field('current_value') currentValue!: number
  @field('is_completed') isCompleted!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}

export class Task extends Model {
  static table = 'tasks'
  @field('title') title!: string
  @field('is_completed') isCompleted!: boolean
  @date('due_date') dueDate!: number
  @field('reminder_minutes_before') reminderMinutesBefore!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}

export class JournalEntry extends Model {
  static table = 'journal_entries'
  @field('content') content!: string
  @date('entry_date') entryDate!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
