import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';

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

const MOCK_ENTRIES: JournalEntry[] = [
  { id: '1', date: new Date().toDateString(), content: 'Feeling great today! Drank all my water and worked out.', mood: '🤩' },
];

export const JournalScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const addEntry = () => {
    if (newEntry.trim() && selectedMood) {
      setEntries([
        { id: Date.now().toString(), date: new Date().toDateString(), content: newEntry, mood: selectedMood },
        ...entries
      ]);
      setNewEntry('');
      setSelectedMood(null);
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.polaroidCard}>
      <View style={styles.polaroidImagePlaceholder}>
        <Text style={styles.polaroidMood}>{item.mood}</Text>
      </View>
      <View style={styles.polaroidCaption}>
        <Text style={styles.entryContent}>{item.content}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.title}>Journal</Text>

        <FlatList
          data={entries}
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
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
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
            disabled={!newEntry.trim() || !selectedMood}
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
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  polaroidCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8, // slight rounding for polaroid
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ rotate: '-1deg' }], // Playful tilt
  },
  polaroidImagePlaceholder: {
    backgroundColor: colors.border + '50',
    height: 120,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  polaroidMood: {
    fontSize: 64,
  },
  polaroidCaption: {
    paddingHorizontal: 8,
  },
  entryContent: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'normal', // Adds a handwritten feel if available
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'right',
  },
  inputSection: {
    marginTop: 'auto',
    borderTopWidth: 2,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 4,
  },
  moodBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
    borderBottomWidth: 2,
    marginTop: 2,
  },
  moodEmoji: {
    fontSize: 24,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    height: 120,
    fontSize: 16,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontWeight: '500',
  },
});
