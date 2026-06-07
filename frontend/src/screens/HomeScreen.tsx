import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { HabitCard } from '../components/HabitCard';
import { colors } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';
import { syncDatabase } from '../db/sync';

// Mock data for initial rendering until WatermelonDB is fully hooked up to React components
const MOCK_HABITS = [
  { id: '1', name: 'Drink 8 glasses of water', isCompleted: true, currentValue: 8, targetValue: 8, unit: 'glasses' },
  { id: '2', name: 'Exercise for 30 minutes', isCompleted: false, currentValue: 15, targetValue: 30, unit: 'minutes' },
  { id: '3', name: 'Read for 15 minutes', isCompleted: false, currentValue: 0, targetValue: 15, unit: 'minutes' },
];

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncDatabase();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, User!</Text>
            <Text style={styles.date}>{new Date().toDateString()}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Freezes ❄️</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Habits (1/8)</Text>
          {MOCK_HABITS.map(habit => (
            <HabitCard
              key={habit.id}
              title={habit.name}
              isCompleted={habit.isCompleted}
              currentValue={habit.currentValue}
              targetValue={habit.targetValue}
              unit={habit.unit}
              onToggle={() => console.log('Toggle habit', habit.id)}
            />
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <PrimaryButton 
            title="Go to To-Do List" 
            onPress={() => navigation.navigate('TodoList')} 
            variant="outline"
          />
          <PrimaryButton 
            title="Write in Journal" 
            onPress={() => navigation.navigate('Journal')} 
            variant="outline"
          />
          <PrimaryButton 
            title="View Statistics" 
            onPress={() => navigation.navigate('Statistics')} 
            variant="outline"
          />
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
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 32,
  },
});
