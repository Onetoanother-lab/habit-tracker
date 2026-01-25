// src/components/features/HabitBundles.jsx
import { useState } from 'react';
import { Layers, Plus, X, Check, Trash2, GripVertical, Zap, TrendingUp } from 'lucide-react';
import { useHabitBundles } from '../hooks/useHabitBundles';

export default function HabitBundles({ habits, isDark }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: 'blue',
    habitIds: [],
    timeOfDay: 'flexible'
  });

  const {
    bundles,
    PRESET_BUNDLES,
    createBundle,
    deleteBundle,
    addHabitToBundle,
    removeHabitFromBundle,
    getBundleProgress,
    getBundleStats,
    completeBundle
  } = useHabitBundles();

  const today = new Date().toISOString().split('T')[0];

  const handleCreateBundle = () => {
    if (!formData.name.trim() || formData.habitIds.length === 0) {
      alert('Please provide a name and select at least one habit');
      return;
    }

    createBundle(formData);
    setFormData({
      name: '',
      description: '',
      icon: '📦',
      color: 'blue',
      habitIds: [],
      timeOfDay: 'flexible'
    });
    setShowCreateForm(false);
  };

  const toggleHabitSelection = (habitId) => {
    setFormData(prev => ({
      ...prev,
      habitIds: prev.habitIds.includes(habitId)
        ? prev.habitIds.filter(id => id !== habitId)
        : [...prev.habitIds, habitId]
    }));
  };

  const getBundleColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      orange: 'from-orange-500 to-amber-500',
      red: 'from-red-500 to-rose-500',
      yellow: 'from-yellow-500 to-orange-500',
      pink: 'from-pink-500 to-rose-500',
      indigo: 'from-indigo-500 to-purple-500'
    };
    return colors[color] || colors.blue;
  };

  const icons = ['📦', '🌅', '🌙', '💪', '⚡', '✨', '🎯', '🔥', '💎', '🚀'];

  return (
    <div className={`p-6 rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers className="text-purple-500" size={24} />
          <div>
            <h2 className="text-xl font-bold">Habit Bundles</h2>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Stack habits for better results
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-all"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Create Bundle Form */}
      {showCreateForm && (
        <div className={`p-4 rounded-xl border mb-4 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className="font-semibold mb-3">Create New Bundle</h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Bundle name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              />

              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              >
                {icons.map(icon => (
                  <option key={icon} value={icon}>{icon} {icon}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg resize-none ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              >
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="pink">Pink</option>
                <option value="indigo">Indigo</option>
              </select>

              <select
                value={formData.timeOfDay}
                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                }`}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Habits ({formData.habitIds.length})
              </label>
              <div className={`max-h-40 overflow-y-auto p-3 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-white'
              }`}>
                {habits.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No habits available. Create habits first.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {habits.map(habit => (
                      <label
                        key={habit.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                          formData.habitIds.includes(habit.id)
                            ? 'bg-purple-500/20'
                            : isDark
                              ? 'hover:bg-white/5'
                              : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.habitIds.includes(habit.id)}
                          onChange={() => toggleHabitSelection(habit.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{habit.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateBundle}
                className="flex-1 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all"
              >
                Create Bundle
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bundles List */}
      {bundles.length === 0 ? (
        <div className="text-center py-12">
          <Layers size={48} className="mx-auto mb-3 text-gray-400 opacity-50" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No bundles yet. Create your first habit bundle!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map(bundle => {
            const progress = getBundleProgress(bundle.id, habits, today);
            const stats = getBundleStats(bundle.id, habits);
            const bundleHabits = habits.filter(h => bundle.habitIds.includes(h.id));

            return (
              <div
                key={bundle.id}
                className={`p-4 rounded-xl border transition-all hover:scale-102 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Bundle Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${getBundleColor(bundle.color)} flex items-center justify-center text-2xl shrink-0`}>
                    {bundle.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">{bundle.name}</h4>
                      <button
                        onClick={() => deleteBundle(bundle.id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {bundle.description && (
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {bundle.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className={`h-2 rounded-full overflow-hidden mb-2 ${
                      isDark ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-full bg-linear-to-r ${getBundleColor(bundle.color)} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Check size={12} className="text-green-500" />
                        <strong>{progress}%</strong> complete
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-blue-500" />
                        <strong>{stats?.streak || 0}</strong> day streak
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={12} className="text-purple-500" />
                        <strong>{bundle.habitIds.length}</strong> habits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Habit List */}
                <div className={`p-3 rounded-lg ${
                  isDark ? 'bg-white/5' : 'bg-white'
                }`}>
                  <div className="space-y-1">
                    {bundleHabits.map((habit, index) => {
                      const isComplete = habit.completions?.[today];
                      return (
                        <div
                          key={habit.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <GripVertical size={12} className="text-gray-400" />
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-green-500' : isDark ? 'bg-white/20' : 'bg-gray-300'
                          }`}>
                            {isComplete && <Check size={10} className="text-white" />}
                          </span>
                          <span className={isComplete ? 'line-through opacity-60' : ''}>
                            {habit.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Completion Bonus */}
                {progress === 100 && (
                  <div className={`mt-3 p-3 rounded-lg border flex items-center gap-2 ${
                    isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                  }`}>
                    <Zap className="text-green-500" size={16} />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Bundle Complete! +{bundle.completionBonus || bundle.habitIds.length * 5} XP Bonus
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}