import { Target, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useWeeklyGoals } from '../hooks/useWeeklyGoals';

export default function WeeklyGoalsWidget({ isDark }) {
  const { getCurrentWeekGoals, createGoal, deleteGoal, getGoalStats } = useWeeklyGoals();
  const [showForm, setShowForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetCount, setTargetCount] = useState(7);

  const goals = getCurrentWeekGoals();
  const stats = getGoalStats();

  const handleCreateGoal = () => {
    if (!goalTitle.trim()) return;
    createGoal(goalTitle, targetCount);
    setGoalTitle('');
    setTargetCount(7);
    setShowForm(false);
  };

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-purple-500" size={24} />
          <h3 className="text-xl font-bold">Weekly Goals</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-2 rounded-lg transition-all hover:scale-110 ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="mb-4 p-3 rounded-xl bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex justify-between text-sm mb-2">
          <span>{stats.completed} of {stats.total} completed</span>
          <span className="font-bold">{stats.completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Goal Creation Form */}
      {showForm && (
        <div className={`mb-4 p-4 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <input
            type="text"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            placeholder="Goal description..."
            className={`w-full px-4 py-2 rounded-lg mb-3 ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/40' 
                : 'border border-gray-300'
            } outline-none`}
          />
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-semibold">Target:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
              className={`w-20 px-3 py-2 rounded-lg ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white' 
                  : 'border border-gray-300'
              } outline-none`}
            />
            <span className="text-sm">times this week</span>
          </div>
          <button
            onClick={handleCreateGoal}
            disabled={!goalTitle.trim()}
            className="w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold disabled:opacity-50 hover:scale-105 transition-all"
          >
            Create Goal
          </button>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {goals.length === 0 ? (
          <p className={`text-center py-8 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            No goals set for this week. Create one to get started!
          </p>
        ) : (
          goals.map(goal => (
            <div
              key={goal.id}
              className={`p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                goal.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : isDark 
                    ? 'bg-white/5 border-white/10'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className={`font-semibold ${goal.completed ? 'line-through opacity-70' : ''}`}>
                    {goal.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`text-xs font-bold ${
                      goal.completed ? 'text-green-500' : 'text-purple-500'
                    }`}>
                      {goal.currentCount} / {goal.targetCount}
                    </div>
                    {goal.completed && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {!goal.completed && (
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${(goal.currentCount / goal.targetCount) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}