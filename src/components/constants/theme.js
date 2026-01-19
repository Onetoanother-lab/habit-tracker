export const getTheme = (level) => {
  if (level >= 20) return { name: 'legendary', bg: 'from-purple-950 via-fuchsia-950 to-rose-950', accent: 'from-fuchsia-500 to-rose-500' };
  if (level >= 15) return { name: 'epic', bg: 'from-indigo-950 via-purple-950 to-pink-950', accent: 'from-indigo-500 to-purple-500' };
  if (level >= 10) return { name: 'hero', bg: 'from-blue-950 via-indigo-950 to-violet-950', accent: 'from-blue-500 to-indigo-500' };
  if (level >= 5)  return { name: 'advanced', bg: 'from-cyan-900 via-blue-900 to-indigo-900', accent: 'from-cyan-500 to-blue-500' };
  return { name: 'beginner', bg: 'from-slate-50 via-gray-50 to-zinc-100', accent: 'from-indigo-600 to-purple-600' };
};

export const isDarkTheme = (level) => level >= 5;