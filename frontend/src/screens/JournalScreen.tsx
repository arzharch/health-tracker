import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';

import withObservables from '@nozbe/with-observables';
import { database } from '../db';
import { JournalEntry } from '../db/models';
import { Q } from '@nozbe/watermelondb';

const MOODS = [
  { emoji: '😭', label: 'Terrible' },
  { emoji: '😞', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '🤩', label: 'Great' },
];

const JournalScreenComponent = ({ entries }: { entries: JournalEntry[] }) => {
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleAddEntry = async () => {
    if (newEntry.trim() && selectedMood) {
      await database.write(async () => {
        await database.collections.get<JournalEntry>('journal_entries').create(entry => {
          entry.content = `${selectedMood}|${newEntry}`;
          entry.entryDate = new Date().getTime();
        });
      });
      setNewEntry('');
      setSelectedMood(null);
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    let mood = '📝';
    let text = item.content;
    if (text.includes('|')) {
      const parts = text.split('|');
      mood = parts[0];
      text = parts.slice(1).join('|');
    }
    
    return (
      <View style={styles.entryCard}>
        <View style={styles.entryImagePlaceholder}>
          <Text style={styles.entryMood}>{mood}</Text>
        </View>
        <View style={styles.entryCaption}>
          <Text style={styles.entryContent}>{text}</Text>
          <Text style={styles.entryDate}>{new Date(item.entryDate).toDateString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <MainLayout>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.pageTitle}>Journal</Text>

        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No entries yet. How are you feeling today?</Text>
          }
        />

        <View style={styles.composerCard}>
          <Text style={styles.composerTitle}>How are you feeling?</Text>
          <View style={styles.moodSelector}>
            {MOODS.map((m) => (
              <TouchableOpacity 
                key={m.label} 
                style={[styles.moodBtn, selectedMood === m.emoji && styles.moodBtnSelected]}
                onPress={() => setSelectedMood(m.emoji)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts..."
              placeholderTextColor={colors.textLight}
              value={newEntry}
              onChangeText={setNewEntry}
              multiline
              maxLength={200}
            />
            <TouchableOpacity 
              style={[styles.postButton, (!newEntry.trim() || !selectedMood) && styles.postButtonDisabled]}
              onPress={handleAddEntry}
              disabled={!newEntry.trim() || !selectedMood}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const enhance = withObservables([], () => ({
  entries: database.collections.get<JournalEntry>('journal_entries').query(Q.sortBy('entry_date', Q.desc)).observe(),
}));

export const JournalScreen = enhance(JournalScreenComponent);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 40,
    fontStyle: 'italic',
  },
  entryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryImagePlaceholder: {
    height: 120,
    backgroundColor: '#F0FBFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryMood: {
    fontSize: 48,
  },
  entryCaption: {
    padding: 16,
  },
  entryContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  composerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 216, 0.2)',
    shadowColor: '#1F8EFA',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  composerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodBtnSelected: {
    backgroundColor: '#E6F4FF',
    borderColor: '#1F8EFA',
  },
  moodEmoji: {
    fontSize: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    paddingTop: 12,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#1F8EFA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: colors.border,
  },
  postButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
