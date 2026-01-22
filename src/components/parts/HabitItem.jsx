import { CheckCircle, Circle, Trash2, Flame, TrendingUp } from 'lucide-react';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function HabitItem({ habit, today, onToggle, onDelete, theme, isDark }) {
  const streak = getStreak(habit);
  const completionRate = getCompletionRate(habit);
  const isCompleted = habit.completions[today];

  return (
    <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      isDark 
        ? 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20' 
        : 'bg-white shadow-lg hover:shadow-2xl border border-gray-100'
    }`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300 -z-10"></div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(habit.id, today)}
          className="transition-transform duration-300 hover:scale-110"
        >
          {isCompleted ? (
            <div className="relative">
              <CheckCircle className="text-green-400" size={40} />
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
            </div>
          ) : (
            <Circle 
              className={`transition-colors duration-300 ${
                isDark ? "text-white/30 group-hover:text-white/60" : "text-gray-300 group-hover:text-indigo-400"
              }`} 
              size={40} 
            />
          )}
        </button>

        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">{habit.name}</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isDark ? 'bg-orange-500/20' : 'bg-orange-50'
            }`}>
              <Flame size={14} className="text-orange-500" />
              <span className={`text-sm font-semibold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                {streak} day streak
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-50'
            }`}>
              <TrendingUp size={14} className="text-blue-500" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {completionRate}% success
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(habit.id)}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all duration-300 hover:scale-110"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}

