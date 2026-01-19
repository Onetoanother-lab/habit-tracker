// src/components/utils/habitStats.js
export const getDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getStreak = (habit) => {
  let streak = 0;
  let date = new Date();
  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    if (habit.completions[dateStr]) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getCompletionRate = (habit) => {
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const completions = Object.keys(habit.completions).length;
  return daysSinceCreation > 0 ? Math.round((completions / daysSinceCreation) * 100) : 0;
};