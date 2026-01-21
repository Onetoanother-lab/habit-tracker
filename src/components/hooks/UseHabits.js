// src/components/hooks/useHabits.js
import { useLocalStorage } from './useLocalStorage';

export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage('habits-data', []);

  const addHabit = (name) => {
    console.log('addHabit called with:', name);

    if (typeof name !== 'string' || !name.trim()) {
      console.warn('addHabit: invalid or empty name');
      return;
    }

    const trimmedName = name.trim();

    const newHabit = {
      id: Date.now().toString(),           // string id is safer for keys
      name: trimmedName,
      completions: {},                      // object { "2025-01-21": true, ... }
      createdAt: new Date().toISOString(),
    };

    console.log('Creating new habit:', newHabit);

    // Use functional update → safest way
    setHabits((currentHabits) => {
      const updated = [...currentHabits, newHabit];
      console.log('Updated habits array:', updated);
      return updated;
    });
  };

  const deleteHabit = (id) => {
    setHabits((current) => {
      const updated = current.filter((h) => h.id !== id);
      console.log('Habits after delete:', updated);
      return updated;
    });
  };

  const toggleHabit = (habitId, date) => {
    setHabits((current) => {
      const updated = current.map((h) => {
        if (h.id !== habitId) return h;

        const completions = { ...h.completions };

        if (completions[date]) {
          delete completions[date];
        } else {
          completions[date] = true;
        }

        return { ...h, completions };
      });

      console.log('Habits after toggle:', updated);
      return updated;
    });
  };

  return { habits, addHabit, deleteHabit, toggleHabit };
};