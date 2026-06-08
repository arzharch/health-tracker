import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const StatisticsScreen = ({ navigation }: any) => {
  const chartData = [4, 6, 8, 8, 5, 8, 8];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={[styles.card, styles.streakCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="flame" size={32} color={colors.streak} />
            <Text style={styles.cardTitle}>Current Streak</Text>
          </View>
          <Text style={styles.cardValue}>0 Days</Text>
          <Text style={styles.cardSubtitle}>Best: 15 Days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleDark}>Quests Completed (Last 7 Days)</Text>
          <View style={styles.barChartPlaceholder}>
            {chartData.map((val, idx) => {
              const heightPct = (val / 8) * 100;
              const isPerfect = val === 8;
              return (
                <View key={idx} style={styles.barContainer}>
                  <View style={styles.barBackground}>
                    <View style={[
                      styles.bar, 
                      { height: `${heightPct}%` },
                      isPerfect && styles.barPerfect
                    ]} />
                  </View>
                  <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.rowCards}>
          <View style={[styles.smallCard, styles.freezeCard]}>
            <Ionicons name="snow" size={32} color={colors.freeze} />
            <Text style={styles.smallCardValue}>0</Text>
            <Text style={styles.smallCardLabel}>Freezes</Text>
          </View>
          <View style={[styles.smallCard, styles.gemCard]}>
            <Ionicons name="diamond" size={32} color={colors.secondary} />
            <Text style={styles.smallCardValue}>150</Text>
            <Text style={styles.smallCardLabel}>Gems</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        
        <View style={styles.achievementCard}>
          <View style={styles.achievementIconPlaceholder}>
            <Ionicons name="trophy" size={32} color={colors.warning} />
          </View>
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>Early Bird</Text>
            <Text style={styles.achievementDesc}>Complete 5 quests before 8 AM.</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
            <Text style={styles.achievementProgressText}>3 / 5</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 6, // 3D effect
  },
  streakCard: {
    borderColor: colors.streak + '40',
    backgroundColor: colors.streak + '10',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: colors.streak,
    fontWeight: '800',
  },
  cardTitleDark: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: 16,
  },
  cardValue: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  barChartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    marginTop: 8,
  },
  barContainer: {
    alignItems: 'center',
    width: 32,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barBackground: {
    width: 24,
    height: 120,
    backgroundColor: colors.border,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  barPerfect: {
    backgroundColor: colors.warning, // Gold for perfect days
  },
  barLabel: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  smallCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 6,
  },
  freezeCard: {
    borderColor: colors.freeze + '40',
    backgroundColor: colors.freeze + '10',
  },
  gemCard: {
    borderColor: colors.secondary + '40',
    backgroundColor: colors.secondary + '10',
  },
  smallCardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 8,
  },
  smallCardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 4,
    alignItems: 'center',
  },
  achievementIconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  achievementDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.warning,
    borderRadius: 6,
  },
  achievementProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
});
