// src/components/features/SmartSuggestions.jsx
import { X, Lightbulb, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { useSmartSuggestions } from '../hooks/useSmartSuggestions';

export default function SmartSuggestions({ habits, isDark, onActionClick }) {
  const {
    suggestions,
    dismissSuggestion,
    generateSuggestions,
    userPreferences,
    setUserPreferences,
    analyzePatterns
  } = useSmartSuggestions(habits);

  const patterns = analyzePatterns();

  const getSuggestionColor = (type) => {
    const colors = {
      'difficulty-adjustment': 'from-orange-500 to-amber-500',
      'schedule-optimization': 'from-blue-500 to-cyan-500',
      'motivation': 'from-red-500 to-rose-500',
      'challenge': 'from-purple-500 to-pink-500',
      'time-reminder': 'from-green-500 to-emerald-500',
      'complementary': 'from-indigo-500 to-purple-500',
      'milestone': 'from-yellow-500 to-orange-500',
      'bundle': 'from-pink-500 to-rose-500',
      'getting-started': 'from-purple-500 to-indigo-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const handleAction = (suggestion) => {
    if (onActionClick) {
      onActionClick(suggestion.action, suggestion.data);
    }
    dismissSuggestion(suggestion.id);
  };

  if (suggestions.length === 0 && habits.length > 0) {
    return (
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <div className="text-center py-8">
          <Lightbulb size={48} className="mx-auto mb-3 text-green-500 opacity-50" />
          <h3 className="font-bold text-lg mb-2">You're doing great!</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No suggestions right now. Keep up the excellent work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500">
            <Lightbulb className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Smart Suggestions</h2>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Personalized insights to improve your habits
            </p>
          </div>
        </div>
        <button
          onClick={generateSuggestions}
          className={`p-2 rounded-lg transition-all hover:scale-110 ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title="Refresh suggestions"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Insights Summary */}
      {habits.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl mb-6 ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <div className={`text-lg font-black ${
              patterns.completionTrend === 'improving' ? 'text-green-500' :
              patterns.completionTrend === 'declining' ? 'text-red-500' :
              'text-blue-500'
            }`}>
              {patterns.completionTrend === 'improving' ? '📈' :
               patterns.completionTrend === 'declining' ? '📉' : '➡️'}
            </div>
            <div className="text-xs text-gray-500 capitalize">{patterns.completionTrend}</div>
          </div>
          
          {patterns.bestDay && (
            <div className="text-center">
              <div className="text-lg font-black text-green-500">{patterns.bestDay.day.slice(0, 3)}</div>
              <div className="text-xs text-gray-500">Best Day</div>
            </div>
          )}

          <div className="text-center">
            <div className="text-lg font-black text-purple-500">
              {patterns.mostSuccessfulHabits.length}
            </div>
            <div className="text-xs text-gray-500">Strong Habits</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-black text-orange-500">
              {patterns.strugglingHabits.length}
            </div>
            <div className="text-xs text-gray-500">Needs Help</div>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className={`p-4 rounded-xl border transition-all hover:scale-102 animate-fade-in ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${getSuggestionColor(suggestion.type)} flex items-center justify-center text-2xl shrink-0`}>
                {suggestion.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold">{suggestion.title}</h4>
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {suggestion.description}
                </p>

                {/* Action Button */}
                <button
                  onClick={() => handleAction(suggestion)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 bg-linear-to-r ${getSuggestionColor(suggestion.type)} text-white`}
                >
                  Take Action
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Priority Indicator */}
            <div className="flex items-center justify-end gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < suggestion.priority
                      ? 'bg-purple-500'
                      : isDark
                        ? 'bg-white/20'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <details className={`mt-6 p-4 rounded-xl ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <summary className="cursor-pointer font-semibold flex items-center gap-2">
          <TrendingUp size={16} />
          Suggestion Preferences
        </summary>
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-2">Suggestion Difficulty</label>
            <select
              value={userPreferences.difficulty}
              onChange={(e) => setUserPreferences({
                ...userPreferences,
                difficulty: e.target.value
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            >
              <option value="easy">Easy - Gentle nudges</option>
              <option value="balanced">Balanced - Mix of challenges</option>
              <option value="challenging">Challenging - Push my limits</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Frequency</label>
            <select
              value={userPreferences.frequency}
              onChange={(e) => setUserPreferences({
                ...userPreferences,
                frequency: e.target.value
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            >
              <option value="daily">Daily suggestions</option>
              <option value="weekly">Weekly insights</option>
              <option value="biweekly">Bi-weekly check-ins</option>
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={userPreferences.enableAI}
              onChange={(e) => setUserPreferences({
                ...userPreferences,
                enableAI: e.target.checked
              })}
              className="rounded"
            />
            <span className="text-sm font-semibold">Enable AI-powered suggestions</span>
          </label>
        </div>
      </details>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}