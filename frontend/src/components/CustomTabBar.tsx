import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const TABS = [
  { name: 'Home', label: 'Self Care', icon: 'heart-outline' as any },
  { name: 'TodoList', label: 'To-Do List', icon: 'checkbox-outline' as any },
  { name: 'Journal', label: 'Journal', icon: 'book-outline' as any },
  { name: 'Statistics', label: 'Statistics', icon: 'bar-chart-outline' as any },
];

export const CustomTabBar = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = route.name === tab.name;

        return (
          <TouchableOpacity 
            key={tab.name} 
            style={styles.tabButton}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            {isActive ? (
              <LinearGradient
                colors={['#1F8EFA', '#00C896']} // Blue to Green gradient as per UI
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activePill}
              >
                <Ionicons name={tab.icon} size={18} color={colors.surface} />
                <Text style={styles.activeText}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactivePill}>
                <Ionicons name={tab.icon} size={18} color={colors.textLight} />
                <Text style={styles.inactiveText}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
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
    padding: 8,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  inactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  activeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveText: {
    color: colors.textLight,
    fontSize: 12,
  },
});
