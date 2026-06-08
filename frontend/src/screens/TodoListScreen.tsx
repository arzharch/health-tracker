import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';

import withObservables from '@nozbe/with-observables';
import { database } from '../db';
import { Task } from '../db/models';

const TodoListScreenComponent = ({ tasks }: { tasks: Task[] }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await database.write(async () => {
        await database.collections.get<Task>('tasks').create(task => {
          task.title = newTaskTitle;
          task.isCompleted = false;
        });
      });
      setNewTaskTitle('');
    }
  };

  const toggleTask = async (task: Task) => {
    await database.write(async () => {
      await task.update(t => {
        t.isCompleted = !t.isCompleted;
      });
    });
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
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <Ionicons name="add" size={24} color={colors.surface} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <View style={styles.listContainer}>
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
          ) : (
            tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskItem, task.isCompleted && styles.taskItemCompleted]}
                onPress={() => toggleTask(task)}
                activeOpacity={0.7}
              >
                <View style={styles.taskLeft}>
                  <View style={[styles.checkbox, task.isCompleted && styles.checkboxCompleted]}>
                    {task.isCompleted && <Ionicons name="checkmark" size={16} color={colors.surface} />}
                  </View>
                  <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleCompleted]}>
                    {task.title}
                  </Text>
                </View>
                {task.isCompleted && (
                  <Ionicons name="star" size={16} color="#00C896" />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </MainLayout>
  );
};

const enhance = withObservables([], () => ({
  tasks: database.collections.get<Task>('tasks').query().observe(),
}));

export const TodoListScreen = enhance(TodoListScreenComponent);

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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'space-between',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 8,
    paddingLeft: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    height: 40,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 20,
    fontStyle: 'italic',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskItemCompleted: {
    backgroundColor: '#F0FBFA',
    borderColor: '#00C896',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6, // Square-ish for tasks
    borderWidth: 2,
    borderColor: colors.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
  },
  taskTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  taskTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
