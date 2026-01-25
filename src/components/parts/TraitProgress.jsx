
import { TRAITS, getTraitColor, getTraitBgColor } from '../constants/traits';

export default function TraitProgress({ traits, isDark }) {
  const sortedTraits = Object.entries(traits)
    .sort(([, a], [, b]) => b.totalProgress - a.totalProgress)
    .filter(([, data]) => data.totalProgress > 0);

  if (sortedTraits.length === 0) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
        Complete challenges to start developing your traits
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sortedTraits.map(([key, data]) => {
        const trait = TRAITS[key];
        if (!trait) return null;

        const progressInLevel = data.totalProgress % 10;
        const progressPercent = (progressInLevel / 10) * 100;

        return (
          <div
            key={key}
            className={`p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white shadow-md border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{trait.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{trait.name}</h3>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    Level {data.level}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getTraitBgColor(key, isDark)} ${getTraitColor(key, isDark)}`}>
                {data.totalProgress} pts
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getTraitBgColor(key, isDark)}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              {progressInLevel}/10 to level {data.level + 1}
            </p>
          </div>
        );
      })}
    </div>
  );
}

