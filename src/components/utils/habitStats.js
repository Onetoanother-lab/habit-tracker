export const getDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getStreak = (habit) => {
  if (!habit?.completions) return 0;
  
  let streak = 0;
  let date = new Date();
  
  while (true) {
    const dateStr = getDateStringFromDate(date);
    if (habit.completions[dateStr]) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

function getDateStringFromDate(d) {
  return d.toISOString().split('T')[0];
}

export const getCompletionRate = (habit) => {
  if (!habit?.createdAt || !habit?.completions) return 0;
  
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const completions = Object.keys(habit.completions).length;
  const rate = daysSinceCreation > 0 ? Math.round((completions / daysSinceCreation) * 100) : 0;
  
  // Security: Cap at 100%
  return Math.min(rate, 100);
};