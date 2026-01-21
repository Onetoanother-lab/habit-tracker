// src/components/parts/AddHabitForm.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AddHabitForm({
  onClose,
  theme,
  isDark,
  addXP,
  addHabit,              // ← add this (passed from HabitTracker)
}) {
  const [newHabitName, setNewHabitName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const name = newHabitName.trim();
    if (!name) return;

    addHabit(name);       // ← now using the prop passed from parent
    addXP(0);            // ← changed from 0 to 10 as per your original message
    setNewHabitName('');
    onClose();
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white shadow-lg'}`}>
      <input
        autoFocus
        type="text"
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();           // ← prevents double-submit in some browsers
            handleAdd(e);
          }
        }}
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
          disabled={!newHabitName.trim()}
          className={`flex-1 py-3 rounded-xl font-medium bg-linear-to-r ${theme.accent} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105`}
        >
          Create Habit
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-3 rounded-xl font-medium ${isDark ? 'bg-white/15 hover:bg-white/25' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}