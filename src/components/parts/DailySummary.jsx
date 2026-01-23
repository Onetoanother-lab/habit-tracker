import { CheckCircle, SkipForward, XCircle, Sparkles } from 'lucide-react';
import { TRAITS } from '../constants/traits';

export default function DailySummary({ summary, traits, isDark }) {
  const traitsData = summary.traitsImproved
    .map(key => ({ key, ...TRAITS[key] }))
    .filter(t => t.name);

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm border animate-slide-in ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-linear-to-br from-indigo-50 to-purple-50 border-indigo-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-purple-500 animate-pulse" size={24} />
        <h3 className="text-xl font-bold">Today's Progress</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-2xl font-black text-green-500">{summary.completed}</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Completed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <SkipForward className="text-yellow-500" size={20} />
            <span className="text-2xl font-black text-yellow-500">{summary.skipped}</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Skipped</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <XCircle className="text-gray-500" size={20} />
            <span className="text-2xl font-black text-gray-500">{summary.failed}</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Couldn't Do</p>
        </div>
      </div>

      {traitsData.length > 0 && (
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
        }`}>
          <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
            Traits Strengthened Today:
          </p>
          <div className="flex flex-wrap gap-2">
            {traitsData.map(trait => (
              <span
                key={trait.key}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-200 text-purple-800'
                }`}
              >
                {trait.icon} {trait.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {summary.streak > 0 && (
        <div className={`mt-4 p-4 rounded-xl border text-center ${
          isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'
        }`}>
          <p className={`text-lg font-black ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
            🔥 {summary.streak} Day Streak!
          </p>
          <p className={`text-xs ${isDark ? 'text-orange-200/60' : 'text-orange-600/60'}`}>
            You're building consistency
          </p>
        </div>
      )}
    </div>
  );
}

