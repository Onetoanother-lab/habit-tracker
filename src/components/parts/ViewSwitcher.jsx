import { Target, Zap, TrendingUp, Brain } from 'lucide-react';

export default function ViewSwitcher({ selectedView, onChange, theme, isDark }) {
const views = [
  { id: 'today', label: 'Habits', icon: Target },
  { id: 'challenges', label: 'Challenges', icon: Brain }, // NEW
  { id: 'stats', label: 'Stats', icon: TrendingUp }
];

  return (
    <nav className="flex flex-wrap gap-3 mb-10">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer
            ${selectedView === id 
              ? `bg-linear-to-r ${theme.accent} text-white shadow-2xl ${theme.glow} scale-105` 
              : isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:scale-105' 
                : 'bg-white hover:bg-gray-50 shadow-md border border-gray-200 hover:scale-105 hover:shadow-xl'}
          `}
        >
          <Icon size={18} className={selectedView === id ? 'animate-pulse' : ''} />
          {label}
          {selectedView === id && (
            <>
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-slow"></div>
              <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 -z-10"></div>
            </>
          )}
        </button>
      ))}
    </nav>
  );
}