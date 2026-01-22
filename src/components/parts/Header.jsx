import { Target, Sparkles } from 'lucide-react';
import LevelBadge from '../ui/LevelBadge';

export default function Header({ level, xp, theme, isDark }) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient">
          Habit Quest
        </h1>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-purple-100'} backdrop-blur-sm`}>
            <Target size={16} className="text-purple-400" />
            <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              Level {level}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-indigo-100'} backdrop-blur-sm`}>
            <Sparkles size={16} className="text-yellow-400" />
            <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-indigo-700'}`}>
              {xp} XP
            </span>
          </div>
        </div>
      </div>
      <LevelBadge level={level} theme={theme} xp={xp} />
    </header>
  );
}
