export const getTheme = (level) => {
  if (level >= 20) return { 
    name: 'legendary', 
    bg: 'from-purple-950 via-fuchsia-950 to-rose-950', 
    accent: 'from-fuchsia-500 to-rose-500',
    glow: 'shadow-fuchsia-500/50',
    particle: 'bg-fuchsia-400'
  };
  if (level >= 15) return { 
    name: 'epic', 
    bg: 'from-indigo-950 via-purple-950 to-pink-950', 
    accent: 'from-indigo-500 to-purple-500',
    glow: 'shadow-purple-500/50',
    particle: 'bg-purple-400'
  };
  if (level >= 10) return { 
    name: 'hero', 
    bg: 'from-blue-950 via-indigo-950 to-violet-950', 
    accent: 'from-blue-500 to-indigo-500',
    glow: 'shadow-indigo-500/50',
    particle: 'bg-indigo-400'
  };
  if (level >= 5) return { 
    name: 'advanced', 
    bg: 'from-cyan-900 via-blue-900 to-indigo-900', 
    accent: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/50',
    particle: 'bg-cyan-400'
  };
  return { 
    name: 'beginner', 
    bg: 'from-slate-50 via-purple-50 to-pink-50', 
    accent: 'from-indigo-600 to-purple-600',
    glow: 'shadow-indigo-500/30',
    particle: 'bg-indigo-400'
  };
};

export const isDarkTheme = (level) => level >= 5;