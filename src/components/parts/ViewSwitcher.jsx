import { Target, Zap, TrendingUp } from 'lucide-react';

export default function ViewSwitcher({ selectedView, onChange, theme, isDark }) {
  const views = [
    { id: 'today', label: 'Today', icon: Target },
    { id: 'tasks', label: 'Challenges', icon: Zap },
    { id: 'stats', label: 'Stats', icon: TrendingUp }
  ];

  return (
    <nav className="flex flex-wrap gap-3 mb-10">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
            ${selectedView === id 
              ? `bg-linear-to-r ${theme.accent} text-white shadow-xl ${theme.glow} scale-105` 
              : isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                : 'bg-white hover:bg-gray-50 shadow-md border border-gray-200'}
          `}
        >
          <Icon size={18} />
          {label}
          {selectedView === id && (
            <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
          )}
        </button>
      ))}
    </nav>
  );
}
