// src/components/parts/HabitStatsCard.jsx
import { Trash2 } from 'lucide-react';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function HabitStatsCard({ habit, isDark }) {
  const streak = getStreak(habit);
  const days = Object.keys(habit.completions).length;
  const rate = getCompletionRate(habit);

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-lg'}`}>
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold">{habit.name}</h3>
        <button onClick={() => deleteHabit(habit.id)} className="text-red-400 opacity-60 hover:opacity-100">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-linear-to-br from-amber-600 to-red-600 rounded-xl text-white">
          <div className="text-3xl font-bold">{streak}</div>
          <div className="text-sm opacity-90">Streak</div>
        </div>
        <div className="text-center p-4 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl text-white">
          <div className="text-3xl font-bold">{days}</div>
          <div className="text-sm opacity-90">Days</div>
        </div>
        <div className="text-center p-4 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl text-white">
          <div className="text-3xl font-bold">{rate}%</div>
          <div className="text-sm opacity-90">Success</div>
        </div>
      </div>
    </div>
  );
}