import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';

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
      setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, isCompleted: false }]);
      setNewTaskTitle('');
    }
  };

  const renderTask = ({ item }: { item: TaskItem }) => (
    <TouchableOpacity 
      style={styles.taskItem} 
      onPress={() => toggleTask(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.isCompleted && styles.checkboxCompleted]}>
        {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.taskTitle, item.isCompleted && styles.taskTitleCompleted]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>To-Do List</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor={colors.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 12,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 24,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  taskTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  taskTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
