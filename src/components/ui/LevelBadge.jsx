import { Award } from 'lucide-react';

export default function LevelBadge({ level, theme, xp }) {
  const progress = (xp % 100);
  
  return (
    <div className="relative group">
      <div className={`px-6 py-4 rounded-2xl bg-linear-to-r ${theme.accent} shadow-2xl ${theme.glow} text-white font-bold flex items-center gap-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl`}>
        <div className="relative">
          <Award size={32} className="text-yellow-300 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl">Level {level}</span>
          <span className="text-xs opacity-80">{progress}/100 XP</span>
        </div>
      </div>
      <div className="absolute -inset-0.5 bg-linear-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300 -z-10"></div>
    </div>
  );
}