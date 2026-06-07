import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface HabitCardProps {
  title: string;
  isCompleted: boolean;
  onToggle: () => void;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  title, 
  isCompleted, 
  onToggle,
  targetValue,
  currentValue,
  unit
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isCompleted && styles.completedCard]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
        {targetValue !== undefined && currentValue !== undefined && unit && (
          <Text style={[styles.progressText, isCompleted && styles.completedText]}>
            {currentValue} / {targetValue} {unit}
          </Text>
        )}
      </View>
      <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedCard: {
    backgroundColor: colors.success + '20', // 20% opacity sage green
    borderColor: colors.success,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  completedText: {
    color: colors.success,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
