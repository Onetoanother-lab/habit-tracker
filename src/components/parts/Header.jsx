// src/components/parts/Header.jsx
import { Award } from 'lucide-react';
import LevelBadge from '../ui/LevelBadge';

export default function Header({ level, xp, theme }) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">
          Habit Quest
        </h1>
        <p className="text-purple-300">
          Level {level} • {xp} XP
        </p>
      </div>

      <LevelBadge level={level} theme={theme} />
    </header>
  );
}