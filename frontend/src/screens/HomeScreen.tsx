import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { HabitCard } from '../components/HabitCard';
import { colors } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';
import { Header } from '../components/Header';
import { syncDatabase } from '../db/sync';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

const INITIAL_HABITS = [
  { id: '1', name: 'Drink Water', isCompleted: true, currentValue: 8, targetValue: 8, unit: 'glasses', icon: 'water' as IconName },
  { id: '2', name: 'Morning Run', isCompleted: false, currentValue: 0, targetValue: 30, unit: 'mins', icon: 'walk' as IconName },
  { id: '3', name: 'Read a Book', isCompleted: false, currentValue: 0, targetValue: 15, unit: 'mins', icon: 'book' as IconName },
  { id: '4', name: 'Meditate', isCompleted: false, currentValue: 0, targetValue: 10, unit: 'mins', icon: 'leaf' as IconName },
  { id: '5', name: 'Eat Vegetables', isCompleted: false, currentValue: 1, targetValue: 3, unit: 'servings', icon: 'nutrition' as IconName },
  { id: '6', name: 'Sleep 8 Hours', isCompleted: false, currentValue: 6, targetValue: 8, unit: 'hours', icon: 'moon' as IconName },
  { id: '7', name: 'No Sugar', isCompleted: true, currentValue: 1, targetValue: 1, unit: 'day', icon: 'fast-food' as IconName },
  { id: '8', name: 'Stretch', isCompleted: false, currentValue: 0, targetValue: 5, unit: 'mins', icon: 'body' as IconName },
];

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncDatabase();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  const toggleHabit = (id: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === id) {
          const isCompleted = !habit.isCompleted;
          return {
            ...habit,
            isCompleted,
            currentValue: isCompleted ? habit.targetValue : 0
          };
        }
        return habit;
      })
    );
  };

  const completedCount = habits.filter(h => h.isCompleted).length;

  return (
    <SafeAreaView style={styles.container}>
      <Header streak={0} freezes={0} />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Ready to crush it?</Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Quests</Text>
            <Text style={styles.progressText}>{completedCount}/{habits.length}</Text>
          </View>
          
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              title={habit.name}
              isCompleted={habit.isCompleted}
              currentValue={habit.currentValue}
              targetValue={habit.targetValue}
              unit={habit.unit}
              iconName={habit.icon}
              onToggle={() => toggleHabit(habit.id)}
            />
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Extra Activities</Text>
          <View style={styles.actionGrid}>
            <PrimaryButton 
              title="To-Do List" 
              onPress={() => navigation.navigate('TodoList')} 
              variant="secondary"
            />
            <PrimaryButton 
              title="Journal" 
              onPress={() => navigation.navigate('Journal')} 
              variant="outline"
            />
            <PrimaryButton 
              title="Statistics" 
              onPress={() => navigation.navigate('Statistics')} 
              variant="solid"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900', // Extra bold for Duolingo style
    color: colors.textPrimary,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quickActions: {
    marginBottom: 32,
  },
  actionGrid: {
    gap: 8,
    marginTop: 16,
  },
});
