// src/components/hooks/useHabits.js
import { useLocalStorage } from './useLocalStorage';

export const useHabits = () => {
  const [habits, setHabits] = useLocalStorage('habits-data', []);

  const addHabit = (name) => {
    if (!name.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: name.trim(),
      completions: {},
      createdAt: new Date().toISOString()
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = (habitId, date) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const completions = { ...h.completions };
        if (completions[date]) {
          delete completions[date];
        } else {
          completions[date] = true;
        }
        return { ...h, completions };
      })
    );
  };

  return { habits, addHabit, deleteHabit, toggleHabit };
};