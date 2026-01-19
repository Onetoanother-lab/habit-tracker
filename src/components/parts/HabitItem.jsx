// src/components/parts/HabitItem.jsx
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function HabitItem({ habit, today, onToggle, onDelete, theme, isDark }) {
  const streak = getStreak(habit);
  const completionRate = getCompletionRate(habit);

  return (
    <div
      className={`p-5 rounded-2xl ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-md'} flex items-center gap-4 group`}
    >
      <button onClick={() => onToggle(habit.id, today)}>
        {habit.completions[today] ? (
          <CheckCircle className="text-green-400" size={36} />
        ) : (
          <Circle className={isDark ? "text-white/40 group-hover:text-white/70" : "text-gray-300 group-hover:text-gray-500"} size={36} />
        )}
      </button>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{habit.name}</h3>
        <div className={`text-sm ${isDark ? 'text-purple-300' : 'text-gray-500'} flex gap-4 mt-1`}>
          <span>🔥 {streak} streak</span>
          <span>📊 {completionRate}%</span>
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-40 hover:opacity-100 text-red-400 transition-opacity"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}