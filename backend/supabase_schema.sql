-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Custom Users table (replacing auth.users)
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    token_version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- A. Profiles (Gamification & Stats)
CREATE TABLE profiles (
    id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    
    -- Gamification Logic
    current_streak INT DEFAULT 0,
    freeze_bank INT DEFAULT 0 CHECK (freeze_bank <= 3),
    last_streak_date DATE,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- B. Habits
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    target_value INT DEFAULT 1,
    unit TEXT,
    icon_slug TEXT
);

-- C. Habit Logs
CREATE TABLE habit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    habit_id INT REFERENCES habits(id) NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    
    -- Progress Data
    current_value INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    
    -- Sync Logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMP WITH TIME ZONE, -- For Offline Soft Deletes

    UNIQUE(user_id, habit_id, log_date)
);

-- D. Tasks
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_minutes_before INT,
    
    -- Sync Logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- E. Journal Entries
CREATE TABLE journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    
    entry_date DATE DEFAULT CURRENT_DATE NOT NULL,
    
    -- Sync Logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Triggers for updated_at
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_logs_modtime BEFORE UPDATE ON habit_logs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_journal_modtime BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create Profile on Signup is now handled manually by FastAPI backend when user registers.

-- Seed Default Habits
INSERT INTO habits (name, target_value, unit, icon_slug) VALUES
('Drink 8 glasses of water', 8, 'glasses', 'water'),
('Exercise for 30 minutes', 30, 'minutes', 'fitness'),
('Meditate for 10 minutes', 10, 'minutes', 'meditation'),
('Get 8 hours of sleep', 8, 'hours', 'sleep'),
('Eat 3 healthy meals', 3, 'meals', 'nutrition'),
('No sugar', 1, 'check', 'no-sugar'),
('Read for 15 minutes', 15, 'minutes', 'reading'),
('No screen time before bed', 1, 'check', 'disconnect');
