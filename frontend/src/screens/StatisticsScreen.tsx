import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../lib/DataContext';
import { PieChart } from 'react-native-chart-kit';

export const StatisticsScreen = () => {
  const [activeTab, setActiveTab] = useState('Day');
  const { habits, tasks, getHistoricalScores } = useData();

  const { healthScore, productivityScore } = getHistoricalScores(activeTab);

  const getDisplayCounts = () => {
    if (activeTab === 'Day') {
      const cHabits = habits.filter(h => h.isCompleted).length;
      const cTasks = tasks.filter(t => t.isCompleted).length;
      return { cHabits, tHabits: habits.length, cTasks, tTasks: tasks.length };
    } else if (activeTab === 'Week') {
      return { cHabits: 35, tHabits: 56, cTasks: 18, tTasks: 21 };
    } else {
      return { cHabits: 140, tHabits: 240, cTasks: 60, tTasks: 70 };
    }
  };
  const counts = getDisplayCounts();

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  const overallData = [
    { name: 'Health', score: healthScore, color: '#1F8EFA', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'Productivity', score: productivityScore, color: '#00C896', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'Pending', score: Math.max(0, 200 - healthScore - productivityScore), color: colors.border, legendFontColor: colors.textSecondary, legendFontSize: 12 }
  ];

  const healthData = [
    { name: 'Done', score: healthScore, color: '#1F8EFA', legendFontColor: colors.textSecondary, legendFontSize: 10 },
    { name: 'Left', score: 100 - healthScore, color: colors.border, legendFontColor: colors.textSecondary, legendFontSize: 10 }
  ];

  const productivityData = [
    { name: 'Done', score: productivityScore, color: '#00C896', legendFontColor: colors.textSecondary, legendFontSize: 10 },
    { name: 'Left', score: 100 - productivityScore, color: colors.border, legendFontColor: colors.textSecondary, legendFontSize: 10 }
  ];

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Statistics</Text>
          <Text style={styles.pageSubtitle}>Track your health and productivity progress</Text>
        </View>

        {/* Time Segments */}
        <View style={styles.segmentContainer}>
          {['Day', 'Week', 'Month'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={styles.segmentButton}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              {activeTab === tab ? (
                <LinearGradient
                  colors={['#1F8EFA', '#00C896']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.segmentActiveBg}
                >
                  <Text style={styles.segmentTextActive}>{tab}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.segmentTextInactive}>{tab}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Excellent Card */}
        <View style={styles.excellentCard}>
          <Ionicons name="star" size={48} color="#FFD700" style={styles.starIcon} />
          <Text style={styles.excellentTitle}>{activeTab === 'Day' ? 'Excellent!' : 'Great job!'}</Text>
          <Text style={styles.excellentSubtitle}>Your overall performance for {activeTab.toLowerCase()}</Text>
        </View>

        {/* Score Cards Row */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={[styles.dot, { backgroundColor: '#1F8EFA' }]} />
              <Text style={styles.scoreLabel}>Health Score</Text>
            </View>
            <Text style={[styles.scoreValue, { color: '#1F8EFA' }]}>{healthScore}%</Text>
            <Text style={styles.scoreSub}>{counts.cHabits} / {counts.tHabits} habits</Text>
          </View>
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={[styles.dot, { backgroundColor: '#00C896' }]} />
              <Text style={styles.scoreLabel}>Productivity Score</Text>
            </View>
            <Text style={[styles.scoreValue, { color: '#00C896' }]}>{productivityScore}%</Text>
            <Text style={styles.scoreSub}>{counts.cTasks} / {counts.tTasks} tasks</Text>
          </View>
        </View>

        {/* Overall Distribution Chart */}
        <View style={styles.distributionCard}>
          <View style={styles.distHeader}>
            <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
            <Text style={styles.distTitle}>Overall Distribution</Text>
          </View>
          <PieChart
            data={overallData}
            width={screenWidth - 64}
            height={160}
            chartConfig={chartConfig}
            accessor={"score"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            absolute
          />
        </View>

        {/* Bottom Cards Charts */}
        <View style={styles.scoreRow}>
          <View style={styles.distributionCardSmall}>
             <Text style={styles.distTitleSmall}>Health Habits</Text>
             <PieChart
                data={healthData}
                width={(screenWidth - 48) / 2}
                height={100}
                chartConfig={chartConfig}
                accessor={"score"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                hasLegend={false}
                absolute
                center={[((screenWidth - 48) / 4), 0]}
              />
          </View>
          <View style={styles.distributionCardSmall}>
             <Text style={styles.distTitleSmall}>Productivity</Text>
             <PieChart
                data={productivityData}
                width={(screenWidth - 48) / 2}
                height={100}
                chartConfig={chartConfig}
                accessor={"score"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                hasLegend={false}
                absolute
                center={[((screenWidth - 48) / 4), 0]}
              />
          </View>
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
    marginVertical: 16,
  },
  pageTitle: {
    fontSize: 14,
    color: '#00B4D8',
    fontWeight: '600',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    height: 36,
  },
  segmentActiveBg: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTextActive: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  segmentTextInactive: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 36,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  excellentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  starIcon: {
    marginBottom: 8,
  },
  excellentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00C896', // Green
    marginBottom: 4,
  },
  excellentSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreSub: {
    fontSize: 10,
    color: colors.textLight,
  },
  distributionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  distHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distTitle: {
    fontSize: 12,
    color: '#2B3482', // Dark blue
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  distributionCardSmall: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  distTitleSmall: {
    fontSize: 12,
    color: '#2B3482',
    fontWeight: '600',
  },
  chartPlaceholderSmall: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});
