// src/components/hooks/useHabitNotes.js
import { useLocalStorage } from './useLocalStorage';

export const useHabitNotes = () => {
  const [notes, setNotes] = useLocalStorage('habit-notes', {});

  const addNote = (habitId, date, content, mood = null) => {
    const noteId = `${habitId}-${date}-${Date.now()}`;
    const newNote = {
      id: noteId,
      habitId,
      date,
      content: content.trim(),
      mood, // 'great', 'good', 'okay', 'struggling'
      timestamp: Date.now(),
    };

    setNotes(prev => ({
      ...prev,
      [noteId]: newNote
    }));

    return noteId;
  };

  const updateNote = (noteId, content, mood = null) => {
    setNotes(prev => {
      if (!prev[noteId]) return prev;
      return {
        ...prev,
        [noteId]: {
          ...prev[noteId],
          content: content.trim(),
          mood: mood || prev[noteId].mood,
          updatedAt: Date.now()
        }
      };
    });
  };

  const deleteNote = (noteId) => {
    setNotes(prev => {
      const updated = { ...prev };
      delete updated[noteId];
      return updated;
    });
  };

  const getNotesForHabit = (habitId) => {
    return Object.values(notes)
      .filter(note => note.habitId === habitId)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const getNotesForDate = (date) => {
    return Object.values(notes)
      .filter(note => note.date === date)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const getMoodStats = (habitId, days = 30) => {
    const habitNotes = getNotesForHabit(habitId);
    const moodCounts = { great: 0, good: 0, okay: 0, struggling: 0 };
    
    habitNotes
      .filter(note => note.mood)
      .slice(0, days)
      .forEach(note => {
        if (moodCounts.hasOwnProperty(note.mood)) {
          moodCounts[note.mood]++;
        }
      });

    return moodCounts;
  };

  return {
    notes: Object.values(notes),
    addNote,
    updateNote,
    deleteNote,
    getNotesForHabit,
    getNotesForDate,
    getMoodStats
  };
};