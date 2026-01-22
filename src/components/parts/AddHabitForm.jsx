import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AddHabitForm({ onClose, theme, isDark, addXP, addHabit }) {
  const [newHabitName, setNewHabitName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName);
    addXP(10);
    setNewHabitName('');
    onClose();
  };

  return (
    <div className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
      isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white shadow-xl border-gray-200'
    }`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create New Habit
        </h3>
        <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-gray-600'}`}>
          Start building a better you, one habit at a time ✨
        </p>
      </div>
      
      <input
        autoFocus
        type="text"
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
        placeholder="e.g., Morning meditation, Read 30 minutes..."
        className={`w-full px-6 py-4 rounded-xl mb-6 text-lg transition-all duration-300 ${
          isDark 
            ? 'bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:bg-white/10' 
            : 'border-2 border-gray-200 focus:border-indigo-400 focus:shadow-lg'
        } outline-none`}
      />
      
      <div className="flex gap-4">
        <button
          onClick={handleAdd}
          disabled={!newHabitName.trim()}
          className={`flex-1 py-4 rounded-xl font-bold text-lg bg-linear-to-r ${theme.accent} text-white shadow-xl ${theme.glow} disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2`}
        >
          <Plus size={20} />
          Create Habit
        </button>
        <button
          onClick={onClose}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
