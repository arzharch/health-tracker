import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

interface DataContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  toggleHabit: (id: string) => void;
  streak: number;
  completedDates: string[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTask: (id: string) => void;
  addTask: (title: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  getHistoricalScores: (timeframe: string) => { healthScore: number, productivityScore: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Drink 8 glasses of water', isCompleted: false },
    { id: '2', name: 'Exercise for 30 minutes', isCompleted: false },
    { id: '3', name: 'Meditate for 10 minutes', isCompleted: false },
    { id: '4', name: 'Get 8 hours of sleep', isCompleted: false },
    { id: '5', name: 'Read 10 pages of a book', isCompleted: false },
    { id: '6', name: 'Eat a healthy breakfast', isCompleted: false },
    { id: '7', name: 'Take a 15 min walk', isCompleted: false },
    { id: '8', name: 'Limit screen time before bed', isCompleted: false },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'trial', isCompleted: false },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: '1', date: new Date().toDateString(), content: 'Feeling great today! Drank all my water and worked out.', mood: '🤩' },
  ]);

  const [streak, setStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState<string[]>([]);

  // Simple streak logic for demo:
  // If all habits are completed today, add today to completedDates and streak is 1.
  useEffect(() => {
    const allDone = habits.every(h => h.isCompleted);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (allDone && habits.length > 0) {
      if (!completedDates.includes(today)) {
        setCompletedDates([...completedDates, today]);
      }
      setStreak(1); // Mock logic: streak is 1 if today is done.
    } else {
      if (completedDates.includes(today)) {
        setCompletedDates(completedDates.filter(d => d !== today));
      }
      setStreak(0);
    }
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, isCompleted: !h.isCompleted } : h));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const addTask = (title: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), title, isCompleted: false }]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
  };

  const getHistoricalScores = (timeframe: string) => {
    if (timeframe === 'Day') {
      const completedHabits = habits.filter(h => h.isCompleted).length;
      const healthScore = habits.length === 0 ? 0 : Math.round((completedHabits / habits.length) * 100);

      const completedTasks = tasks.filter(t => t.isCompleted).length;
      const productivityScore = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

      return { healthScore, productivityScore };
    } else if (timeframe === 'Week') {
      return { healthScore: 75, productivityScore: 82 }; // Mock week data
    } else {
      return { healthScore: 88, productivityScore: 90 }; // Mock month data
    }
  };

  return (
    <DataContext.Provider value={{
      habits, setHabits, toggleHabit,
      streak, completedDates,
      tasks, setTasks, toggleTask, addTask,
      journalEntries, addJournalEntry,
      getHistoricalScores
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
