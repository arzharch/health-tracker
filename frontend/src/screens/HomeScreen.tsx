import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';

import withObservables from '@nozbe/with-observables';
import { database } from '../db';
import { Habit, HabitLog } from '../db/models';
import { Q } from '@nozbe/watermelondb';

const HomeScreenComponent = ({ habits, habitLogs, allLogs }: { habits: Habit[], habitLogs: HabitLog[], allLogs: HabitLog[] }) => {
  const toggleHabit = async (habitId: string) => {
    // Find if a log exists for today
    const existingLog = habitLogs.find(l => l.habitId === habitId);
    const today = new Date();
    today.setHours(0,0,0,0);

    await database.write(async () => {
      if (existingLog) {
        await existingLog.update(log => {
          log.isCompleted = !log.isCompleted;
        });
      } else {
        await database.collections.get<HabitLog>('habit_logs').create(log => {
          log.habitId = habitId;
          log.logDate = today.getTime();
          log.isCompleted = true;
          log.currentValue = 1;
        });
      }
    });
  };

  // Build a mapped array of habits with their completed status for UI
  const mappedHabits = habits.map(h => {
    const log = habitLogs.find(l => l.habitId === h.id);
    return { ...h, isCompleted: log ? log.isCompleted : false };
  });

  const completedCount = mappedHabits.filter(h => h.isCompleted).length;
  
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Calculate completedDates for Calendar from allLogs
  const completedDatesMap: { [key: string]: boolean } = {};
  
  // Group logs by date
  const logsByDate: { [key: number]: HabitLog[] } = {};
  allLogs.forEach(log => {
    if (!logsByDate[log.logDate]) logsByDate[log.logDate] = [];
    logsByDate[log.logDate].push(log);
  });

  // For a date to be completed, all habits must be completed.
  const totalHabits = habits.length;
  Object.keys(logsByDate).forEach(timestampStr => {
    const timestamp = parseInt(timestampStr);
    const logs = logsByDate[timestamp];
    const completed = logs.filter(l => l.isCompleted).length;
    if (totalHabits > 0 && completed === totalHabits) {
      const dateStr = new Date(timestamp).toISOString().split('T')[0];
      completedDatesMap[dateStr] = true;
    }
  });

  const markedDates = Object.keys(completedDatesMap).reduce((acc, date) => {
    acc[date] = { 
      selected: true, 
      selectedColor: '#00C896', // Bright Green
      marked: true,
      dotColor: '#FFD700' // Gold dot to act as the 🔥
    };
    return acc;
  }, {} as any);

  // Add today's date indicator if not completed
  const todayStr = new Date().toISOString().split('T')[0];
  if (!markedDates[todayStr]) {
    markedDates[todayStr] = { marked: true, dotColor: colors.primary };
  }

  // Calculate streak based on completedDatesMap
  let streak = 0;
  let d = new Date();
  d.setHours(0,0,0,0);
  while (true) {
    const dStr = d.toISOString().split('T')[0];
    if (completedDatesMap[dStr]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <LinearGradient
            colors={['#1F8EFA', '#00C896']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.mainIconContainer}
          >
            <Ionicons name="heart" size={32} color={colors.surface} />
          </LinearGradient>
          <Text style={styles.pageTitle}>Daily Self Care</Text>
          <Text style={styles.pageSubtitle}>Complete all habits to build your streak ✨</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <LinearGradient
              colors={['#00C896', '#1F8EFA']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.streakIconBox}
            >
              <Ionicons name="flame-outline" size={24} color={colors.surface} />
            </LinearGradient>
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>{streak} {streak === 1 ? 'Day' : 'Days'}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={todayStr}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.border,
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        {/* Habits Checklist */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Daily Progress</Text>
              <Text style={styles.progressCount}>{completedCount}/{totalHabits}</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0}%` }]} />
            </View>
            {completedCount === totalHabits && totalHabits > 0 && (
              <Text style={styles.perfectDayText}>🌟 Perfect day unlocked! Streak updated.</Text>
            )}
          </View>

          <View style={styles.listContainer}>
            {mappedHabits.map((habit) => (
              <TouchableOpacity 
                key={habit.id}
                style={[styles.habitItem, habit.isCompleted && styles.habitItemCompleted]}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.7}
              >
                <View style={styles.habitLeft}>
                  <View style={[styles.checkbox, habit.isCompleted && styles.checkboxCompleted]}>
                    {habit.isCompleted && <Ionicons name="checkmark" size={16} color={colors.surface} />}
                  </View>
                  <Text style={[styles.habitName, habit.isCompleted && styles.habitNameCompleted]}>
                    {habit.name}
                  </Text>
                </View>
                {habit.isCompleted && (
                  <LinearGradient
                    colors={['#00C896', '#00B4D8']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.confetti}
                  >
                    <Ionicons name="star" size={12} color="#fff" />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </MainLayout>
  );
};

const enhance = withObservables([], () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const startOfDay = today.getTime();

  return {
    habits: database.collections.get<Habit>('habits').query().observe(),
    habitLogs: database.collections.get<HabitLog>('habit_logs').query(
      Q.where('log_date', startOfDay)
    ).observe(),
    allLogs: database.collections.get<HabitLog>('habit_logs').query().observe(),
  };
});

export const HomeScreen = enhance(HomeScreenComponent);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  mainIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1F8EFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 216, 0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressCount: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  perfectDayText: {
    fontSize: 12,
    color: '#FFD700', // Gold color for perfect day
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  habitsSection: {
    flex: 1,
  },
  listContainer: {
    gap: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitItemCompleted: {
    backgroundColor: '#F0FBFA',
    borderColor: '#00C896',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
  },
  habitName: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  habitNameCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  confetti: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
