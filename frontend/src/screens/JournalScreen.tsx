import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { MainLayout } from '../components/MainLayout';
import { useData } from '../lib/DataContext';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

const MOODS = [
  { emoji: '😭', label: 'Terrible' },
  { emoji: '😞', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '🤩', label: 'Great' },
];

export const JournalScreen = () => {
  const { journalEntries, addJournalEntry } = useData();
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleAddEntry = () => {
    if (newEntry.trim() && selectedMood) {
      addJournalEntry({
        date: new Date().toDateString(),
        content: newEntry,
        mood: selectedMood
      });
      setNewEntry('');
      setSelectedMood(null);
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryImagePlaceholder}>
        <Text style={styles.entryMood}>{item.mood}</Text>
      </View>
      <View style={styles.entryCaption}>
        <Text style={styles.entryContent}>{item.content}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <MainLayout>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.pageTitle}>Journal</Text>

        <FlatList
          data={journalEntries}
          keyExtractor={item => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputSection}>
          <Text style={styles.promptText}>How are you feeling?</Text>
          <View style={styles.moodSelector}>
            {MOODS.map((mood, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.moodBtn, selectedMood === mood.emoji && styles.moodBtnSelected]}
                onPress={() => setSelectedMood(mood.emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.textLight}
            multiline
            value={newEntry}
            onChangeText={setNewEntry}
          />
          <TouchableOpacity 
            style={[styles.saveButton, (!newEntry.trim() || !selectedMood) && styles.saveButtonDisabled]}
            onPress={handleAddEntry}
            disabled={!newEntry.trim() || !selectedMood}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>SAVE ENTRY</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  entryCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  entryImagePlaceholder: {
    backgroundColor: '#F7FAFC',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  entryMood: {
    fontSize: 48,
  },
  entryCaption: {
    padding: 16,
  },
  entryContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '700',
    textAlign: 'right',
  },
  inputSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingBottom: 24,
  },
  promptText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  moodBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 20,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    height: 100,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#95D965', // Light green from screenshot
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
