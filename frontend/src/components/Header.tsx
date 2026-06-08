import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  streak: number;
  freezes: number;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({ streak, freezes, avatarUrl }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statPill}>
          <Ionicons name="flame" size={20} color={streak > 0 ? colors.streak : colors.textSecondary} />
          <Text style={[styles.statText, { color: streak > 0 ? colors.streak : colors.textSecondary }]}>
            {streak}
          </Text>
        </View>

        <View style={styles.statPill}>
          <Ionicons name="snow" size={20} color={freezes > 0 ? colors.freeze : colors.textSecondary} />
          <Text style={[styles.statText, { color: freezes > 0 ? colors.freeze : colors.textSecondary }]}>
            {freezes}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 6,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
