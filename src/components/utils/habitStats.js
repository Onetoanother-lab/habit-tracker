// src/utils/habitStats.js
export const getDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getStreak = (habit) => {
  if (!habit?.completedDates || !Array.isArray(habit.completedDates)) {
    return 0;
  }

  let streak = 0;
  let date = new Date();  // today

  while (true) {
    const dateStr = getDateStringFromDate(date); // helper below
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Helper to avoid code duplication
function getDateStringFromDate(d) {
  return d.toISOString().split('T')[0];
}

export const getCompletionRate = (habit) => {
  if (!habit?.createdAt || !habit?.completedDates || !Array.isArray(habit.completedDates)) {
    return 0;
  }

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const completions = habit.completedDates.length;
  return daysSinceCreation > 0 ? Math.round((completions / daysSinceCreation) * 100) : 0;
};