import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

const MOCK_ENTRIES: JournalEntry[] = [
  { id: '1', date: new Date().toDateString(), content: 'Feeling great today! Drank all my water and worked out.' },
];

export const JournalScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [newEntry, setNewEntry] = useState('');

  const addEntry = () => {
    if (newEntry.trim()) {
      setEntries([
        { id: Date.now().toString(), date: new Date().toDateString(), content: newEntry },
        ...entries
      ]);
      setNewEntry('');
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.entryCard}>
      <Text style={styles.entryDate}>{item.date}</Text>
      <Text style={styles.entryContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Journal</Text>

        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.textSecondary}
            multiline
            value={newEntry}
            onChangeText={setNewEntry}
          />
          <PrimaryButton 
            title="Save Entry" 
            onPress={addEntry} 
            disabled={!newEntry.trim()}
          />
        </View>
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
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  entryCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  entryContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  inputSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 16,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});
