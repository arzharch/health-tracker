import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../lib/DataContext';
import { Calendar } from 'react-native-calendars';

export const HomeScreen = () => {
  const { habits, toggleHabit, streak, completedDates } = useData();

  const completedCount = habits.filter(h => h.isCompleted).length;
  
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const markedDates = completedDates.reduce((acc, date) => {
    acc[date] = { 
      selected: true, 
      selectedColor: '#00C896', // Bright Green
      marked: true,
      dotColor: '#FFD700' // Gold dot to act as the 🔥
    };
    return acc;
  }, {} as any);

  // Add today's date indicator if not completed
  const today = new Date().toISOString().split('T')[0];
  if (!markedDates[today]) {
    markedDates[today] = { marked: true, dotColor: colors.primary };
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
              <View style={styles.streakHeader}>
                <Ionicons name="sparkles-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.streakHeaderText}>Current Streak</Text>
              </View>
              <Text style={styles.streakValue}>{streak}</Text>
              <Text style={styles.streakLabel}>days strong</Text>
            </View>
          </View>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <View style={styles.progressCountPill}>
              <Text style={styles.progressCountText}>{completedCount}/{habits.length}</Text>
            </View>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(completedCount / habits.length) * 100}%` }]} />
          </View>
        </View>

        {/* Habits Section */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.verticalLine} />
            <Text style={styles.sectionTitle}>Today's Habits</Text>
          </View>

          <View style={styles.habitsList}>
            {habits.map(habit => (
              <TouchableOpacity 
                key={habit.id} 
                style={styles.habitCard}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, habit.isCompleted && styles.checkboxCompleted]}>
                  {habit.isCompleted && <Ionicons name="checkmark" size={16} color={colors.surface} />}
                </View>
                <Text style={[styles.habitName, habit.isCompleted && styles.habitNameCompleted]}>
                  {habit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.verticalLine} />
            <Text style={styles.sectionTitle}>Streak Calendar</Text>
          </View>
          <Calendar
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.surface,
              todayTextColor: colors.primary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textLight,
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
            }}
          />
        </View>

      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  mainIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 16,
    color: '#00B4D8',
    fontWeight: '600',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakHeaderText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.secondary,
    lineHeight: 40,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  progressCountPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressCountText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
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
  habitsSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  verticalLine: {
    width: 3,
    height: 16,
    backgroundColor: '#00B4D8',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: '500',
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  habitName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  habitNameCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
