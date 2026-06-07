import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export const StatisticsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.cardValue}>12 Days 🔥</Text>
          <Text style={styles.cardSubtitle}>Best: 15 Days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Habit Completion (Last 7 Days)</Text>
          <View style={styles.barChartPlaceholder}>
            {/* Simple visual placeholder for a chart */}
            {[4, 6, 8, 8, 5, 8, 8].map((val, idx) => (
              <View key={idx} style={styles.barContainer}>
                <View style={[styles.bar, { height: `${(val / 8) * 100}%` }]} />
                <Text style={styles.barLabel}>D{idx + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Freeze Bank</Text>
          <Text style={styles.cardValue}>1 / 3 ❄️</Text>
          <Text style={styles.cardSubtitle}>You earn 1 freeze every 7 perfect days.</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  barChartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginTop: 16,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: colors.success,
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
