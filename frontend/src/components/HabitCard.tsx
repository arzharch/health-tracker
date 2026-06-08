import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HabitCardProps {
  title: string;
  isCompleted: boolean;
  onToggle: () => void;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  title, 
  isCompleted, 
  onToggle,
  targetValue,
  currentValue,
  unit,
  iconName = 'star'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable 
      style={styles.container}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onToggle}
    >
      <View style={[
        styles.cardBase, 
        isCompleted ? styles.completedBase : styles.uncompletedBase,
        isPressed && styles.cardBasePressed
      ]}>
        <View style={[
          styles.cardTop, 
          isCompleted ? styles.completedTop : styles.uncompletedTop,
          isPressed ? styles.cardTopPressed : styles.cardTopUnpressed
        ]}>
          <View style={[styles.iconContainer, isCompleted && styles.iconContainerCompleted]}>
            <Ionicons 
              name={iconName} 
              size={28} 
              color={isCompleted ? colors.success : colors.secondary} 
            />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
            {targetValue !== undefined && currentValue !== undefined && unit && (
              <Text style={[styles.progressText, isCompleted && styles.completedText]}>
                {currentValue} / {targetValue} {unit}
              </Text>
            )}
          </View>

          <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
            {isCompleted && <Ionicons name="checkmark" size={20} color={colors.background} style={styles.checkmarkIcon} />}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  cardBase: {
    borderRadius: 16,
    width: '100%',
    paddingBottom: 4, // 3D effect depth
  },
  uncompletedBase: {
    backgroundColor: colors.border,
  },
  completedBase: {
    backgroundColor: colors.primaryShadow,
  },
  cardBasePressed: {
    paddingBottom: 0,
    marginTop: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  uncompletedTop: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  completedTop: {
    backgroundColor: colors.success + '1A', // very light green
    borderColor: colors.success,
  },
  cardTopUnpressed: {
    transform: [{ translateY: 0 }],
  },
  cardTopPressed: {
    transform: [{ translateY: 0 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.secondary + '1A', // light blue background for icon
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerCompleted: {
    backgroundColor: colors.success + '20',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '700',
  },
  completedText: {
    color: colors.success,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: colors.surface,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmarkIcon: {
    fontWeight: 'bold',
  }
});
