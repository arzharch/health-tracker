import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

const MOCK_TASKS: TaskItem[] = [
  { id: '1', title: 'Buy groceries', isCompleted: false },
  { id: '2', title: 'Call dentist', isCompleted: true },
];

export const TodoListScreen = ({ navigation }: any) => {
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([{ id: Date.now().toString(), title: newTaskTitle, isCompleted: false }, ...tasks]);
      setNewTaskTitle('');
    }
  };

  const renderTask = ({ item }: { item: TaskItem }) => (
    <TouchableOpacity 
      style={[styles.taskItem, item.isCompleted && styles.taskItemCompleted]} 
      onPress={() => toggleTask(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.isCompleted && styles.checkboxCompleted]}>
        {item.isCompleted && <Ionicons name="checkmark" size={20} color={colors.background} style={{ fontWeight: 'bold' }} />}
      </View>
      <Text style={[styles.taskTitle, item.isCompleted && styles.taskTitleCompleted]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.title}>Quests</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new quest..."
            placeholderTextColor={colors.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Ionicons name="add" size={32} color={colors.background} style={styles.addIcon} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="sparkles" size={64} color={colors.border} />
              <Text style={styles.emptyText}>All caught up! You're amazing.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 60,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.primaryShadow,
  },
  addIcon: {
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 24,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 4, // 3D effect
  },
  taskItemCompleted: {
    backgroundColor: colors.border + '30', // slight gray
    borderColor: colors.border,
    borderBottomWidth: 2, // pressed down
    marginTop: 2,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: colors.background,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  taskTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
});
