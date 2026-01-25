// src/components/hooks/useAnalytics.js
export const useAnalytics = (habits) => {
  
  const getCompletionTrend = (days = 30) => {
    const trend = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completedCount = habits.filter(h => 
        h.completions && h.completions[dateStr]
      ).length;

      trend.push({
        date: dateStr,
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      });
    }

    return trend;
  };

  const getBestPerformingDay = () => {
    const dayStats = Array(7).fill(0).map((_, i) => ({
      day: i,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      completions: 0,
      total: 0
    }));

    habits.forEach(habit => {
      if (!habit.completions) return;
      
      Object.keys(habit.completions).forEach(dateStr => {
        const date = new Date(dateStr);
        const dayIndex = date.getDay();
        dayStats[dayIndex].completions++;
        dayStats[dayIndex].total++;
      });
    });

    dayStats.forEach(stat => {
      stat.average = stat.total > 0 ? stat.completions / stat.total : 0;
    });

    return dayStats.sort((a, b) => b.average - a.average);
  };

  const getHabitPerformance = () => {
    return habits.map(habit => {
      const totalDays = habit.completions ? Object.keys(habit.completions).length : 0;
      const daysSinceCreation = habit.createdAt 
        ? Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 1;
      
      const completionRate = Math.round((totalDays / daysSinceCreation) * 100);
      
      let currentStreak = 0;
      let date = new Date();
      while (habit.completions && habit.completions[date.toISOString().split('T')[0]]) {
        currentStreak++;
        date.setDate(date.getDate() - 1);
      }

      let longestStreak = 0;
      let tempStreak = 0;
      const sortedDates = habit.completions 
        ? Object.keys(habit.completions).sort().reverse()
        : [];

      sortedDates.forEach((dateStr, index) => {
        if (index === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(sortedDates[index - 1]);
          const currDate = new Date(dateStr);
          const dayDiff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      });
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        id: habit.id,
        name: habit.name,
        totalCompletions: totalDays,
        completionRate,
        currentStreak,
        longestStreak,
        daysSinceCreation,
        lastCompleted: sortedDates[0] || null
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
  };

  const getMonthlyStats = () => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      let totalCompletions = 0;
      habits.forEach(habit => {
        if (!habit.completions) return;
        Object.keys(habit.completions).forEach(dateStr => {
          if (dateStr.startsWith(monthKey)) {
            totalCompletions++;
          }
        });
      });

      months.push({
        month: monthKey,
        monthName: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        completions: totalCompletions,
        habitsTracked: habits.length
      });
    }

    return months;
  };

  const getOverallStats = () => {
    const allCompletions = habits.reduce((sum, h) => 
      sum + (h.completions ? Object.keys(h.completions).length : 0), 0);
    
    const avgCompletionRate = habits.length > 0
      ? habits.reduce((sum, h) => {
          const days = h.createdAt 
            ? Math.floor((Date.now() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 1;
          const completions = h.completions ? Object.keys(h.completions).length : 0;
          return sum + (completions / days);
        }, 0) / habits.length * 100
      : 0;

    const maxStreak = Math.max(...habits.map(h => {
      let streak = 0;
      let date = new Date();
      while (h.completions && h.completions[date.toISOString().split('T')[0]]) {
        streak++;
        date.setDate(date.getDate() - 1);
      }
      return streak;
    }), 0);

    return {
      totalHabits: habits.length,
      totalCompletions: allCompletions,
      averageCompletionRate: Math.round(avgCompletionRate),
      longestStreak: maxStreak,
      activeDays: new Set(
        habits.flatMap(h => h.completions ? Object.keys(h.completions) : [])
      ).size
    };
  };

  return {
    getCompletionTrend,
    getBestPerformingDay,
    getHabitPerformance,
    getMonthlyStats,
    getOverallStats
  };
};