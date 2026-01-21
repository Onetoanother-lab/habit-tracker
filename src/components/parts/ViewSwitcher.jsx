// src/components/parts/ViewSwitcher.jsx
import { Sparkles } from 'lucide-react';

export default function ViewSwitcher({ selectedView, onChange, theme, isDark }) {
  const views = ['today', 'tasks', 'stats'];

  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onChange(view)}
          className={`
            px-5 py-2.5 rounded-full font-medium transition-all
            ${selectedView === view 
              ? `bg-linear-to-r ${theme.accent} text-white shadow-lg` 
              : isDark 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-white hover:bg-gray-100 shadow-sm'}
          `}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </nav>
  );
}