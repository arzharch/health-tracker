import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../lib/AuthContext';

export const TopHeader = () => {
  const { setToken, user } = useAuth();
  
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={20} color={colors.surface} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome back, {user?.display_name || 'Friend'}!</Text>
          <Text style={styles.emailText}>{user?.email || 'Start your journey'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={() => setToken(null)}>
        <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 16, // Top margin to separate from screen edge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B4D8', // Light blue/cyan solid color like the screenshot
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  emailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
