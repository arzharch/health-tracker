import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../lib/DataContext';

export const TodoListScreen = () => {
  const { tasks, toggleTask, addTask } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = tasks.length - completed;

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Personal To-Do List</Text>
          <Text style={styles.pageSubtitle}>Track your work and personal tasks</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Tasks</Text>
            <Text style={[styles.statValue, { color: '#2B3482' }]}>{tasks.length}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completed}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: colors.secondary }]}>{pending}</Text>
          </View>
        </View>

        {/* Add Task Card */}
        <View style={styles.addTaskCard}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor={colors.textLight}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity onPress={handleAddTask} activeOpacity={0.8}>
            <LinearGradient
              colors={['#1F8EFA', '#00C896']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <Ionicons name="add" size={16} color={colors.surface} />
              <Text style={styles.addButtonText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="radio-button-off" size={16} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
          </View>

          <View style={styles.tasksList}>
            {tasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskCard}
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, task.isCompleted && styles.checkboxCompleted]}>
                  {task.isCompleted && <Ionicons name="checkmark" size={14} color={colors.surface} />}
                </View>
                <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))}
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
    marginVertical: 24,
  },
  pageTitle: {
    fontSize: 16,
    color: '#00B4D8',
    fontWeight: '600',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addTaskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 12,
    gap: 4,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  tasksSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#2B3482', // Dark blue as in screenshot
    fontWeight: '500',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  taskTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
