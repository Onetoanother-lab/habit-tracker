// src/components/parts/AddHabitForm.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';

export default function AddHabitForm({ onClose, theme, isDark, addXP }) {
  const { addHabit } = useHabits();
  const [newHabitName, setNewHabitName] = useState('');

  const handleAdd = () => {
    addHabit(newHabitName);
    addXP(10);
    setNewHabitName('');
    onClose();
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white shadow-lg'}`}>
      <input
        autoFocus
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="What habit will you build today?"
        className={`w-full px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 ${
          isDark 
            ? 'bg-white/5 border border-white/20 text-white placeholder-white/50 focus:ring-purple-400' 
            : 'border-2 border-gray-200 focus:ring-indigo-400'
        }`}
      />
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className={`flex-1 py-3 rounded-xl font-medium bg-gradient-to-r ${theme.accent} text-white`}
        >
          Create Habit (+10 XP)
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-3 rounded-xl font-medium ${isDark ? 'bg-white/15 hover:bg-white/25' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}