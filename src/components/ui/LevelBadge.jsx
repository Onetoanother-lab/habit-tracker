// src/components/ui/LevelBadge.jsx
import { Award } from 'lucide-react';

export default function LevelBadge({ level, theme }) {
  return (
    <div className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${theme.accent} shadow-lg shadow-black/30 text-white font-bold text-xl flex items-center gap-3`}>
      <Award size={28} className="text-yellow-300" />
      <span>Level {level}</span>
    </div>
  );
}