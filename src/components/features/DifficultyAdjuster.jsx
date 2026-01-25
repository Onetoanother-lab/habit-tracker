// src/components/features/DifficultyAdjuster.jsx
import { Sliders, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useDifficultyAdjuster } from '../hooks/useDifficultyAdjuster';

export default function DifficultyAdjuster({ habit, isDark }) {
  const {
    DIFFICULTY_LEVELS,
    setHabitDifficultyLevel,
    getHabitDifficulty,
    getDifficultyData,
    suggestDifficultyChange,
    calculateXPBonus,
    getDifficultyStats
  } = useDifficultyAdjuster();

  const currentLevel = getHabitDifficulty(habit.id);
  const currentData = getDifficultyData(currentLevel);
  const suggestion = suggestDifficultyChange(habit);
  const stats = getDifficultyStats(habit.id);
  const xpBonus = calculateXPBonus(habit.id);

  const getDifficultyColor = (level) => {
    const colors = {
      green: 'bg-green-500',
      lime: 'bg-lime-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colors[DIFFICULTY_LEVELS[level]?.color] || 'bg-gray-500';
  };

  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-purple-500" />
          <span className="font-semibold">Difficulty Level</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentData.icon}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentLevel)} text-white`}>
            {currentData.name}
          </span>
        </div>
      </div>

      {/* Suggestion Alert */}
      {suggestion && (
        <div className={`p-3 rounded-lg mb-4 border ${
          suggestion.type === 'increase'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-orange-500/10 border-orange-500/30'
        }`}>
          <div className="flex items-start gap-2">
            {suggestion.type === 'increase' ? (
              <TrendingUp className="text-green-500 mt-0.5" size={18} />
            ) : (
              <TrendingDown className="text-orange-500 mt-0.5" size={18} />
            )}
            <div className="flex-1">
              <div className={`text-sm font-semibold mb-1 ${
                suggestion.type === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {suggestion.type === 'increase' ? 'Ready for more?' : 'Need to adjust?'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {suggestion.reason}
              </div>
              <button
                onClick={() => setHabitDifficultyLevel(habit.id, suggestion.suggested)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  suggestion.type === 'increase'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white transition-all hover:scale-105`}
              >
                Switch to {DIFFICULTY_LEVELS[suggestion.suggested].name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Selector */}
      <div className="space-y-2 mb-4">
        {Object.entries(DIFFICULTY_LEVELS).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setHabitDifficultyLevel(habit.id, key)}
            className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-102 ${
              currentLevel === key
                ? `${getDifficultyColor(key)} border-transparent text-white shadow-lg`
                : isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{data.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{data.name}</div>
                  <div className={`text-xs ${
                    currentLevel === key ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {data.description}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-bold ${
                currentLevel === key ? 'text-white' : 'text-purple-500'
              }`}>
                {Math.floor(10 * data.multiplier)} XP
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`p-3 rounded-lg ${
        isDark ? 'bg-white/5' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">XP per completion:</span>
          <span className="font-bold text-purple-500">+{xpBonus} XP</span>
        </div>
        {stats.changes > 0 && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Difficulty changes:</span>
            <span className="font-bold">{stats.changes}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`mt-3 p-3 rounded-lg border flex items-start gap-2 ${
        isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
      }`}>
        <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Higher difficulty levels earn more XP but require consistent completion. Adjust based on your current capacity.
        </p>
      </div>
    </div>
  );
}