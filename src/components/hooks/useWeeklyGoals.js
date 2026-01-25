// src/components/hooks/useWeeklyGoals.js
import { useLocalStorage } from './useLocalStorage';

const getWeekKey = (date = new Date()) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toISOString().split('T')[0];
};

export const useWeeklyGoals = () => {
  const [goals, setGoals] = useLocalStorage('weekly-goals', {});

  const createGoal = (title, targetCount, habitId = null) => {
    const weekKey = getWeekKey();
    const goalId = `${weekKey}-${Date.now()}`;

    const newGoal = {
      id: goalId,
      title: title.trim(),
      targetCount: Math.max(1, targetCount),
      currentCount: 0,
      habitId, // null for general goals
      weekKey,
      createdAt: Date.now(),
      completed: false
    };

    setGoals(prev => ({
      ...prev,
      [goalId]: newGoal
    }));

    return goalId;
  };

  const updateGoalProgress = (goalId, increment = 1) => {
    setGoals(prev => {
      const goal = prev[goalId];
      if (!goal) return prev;

      const newCount = goal.currentCount + increment;
      const completed = newCount >= goal.targetCount;

      return {
        ...prev,
        [goalId]: {
          ...goal,
          currentCount: newCount,
          completed,
          completedAt: completed && !goal.completed ? Date.now() : goal.completedAt
        }
      };
    });
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => {
      const updated = { ...prev };
      delete updated[goalId];
      return updated;
    });
  };

  const getCurrentWeekGoals = () => {
    const weekKey = getWeekKey();
    return Object.values(goals)
      .filter(g => g.weekKey === weekKey)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const getGoalStats = () => {
    const currentGoals = getCurrentWeekGoals();
    return {
      total: currentGoals.length,
      completed: currentGoals.filter(g => g.completed).length,
      inProgress: currentGoals.filter(g => !g.completed && g.currentCount > 0).length,
      notStarted: currentGoals.filter(g => g.currentCount === 0).length,
      completionRate: currentGoals.length > 0 
        ? Math.round((currentGoals.filter(g => g.completed).length / currentGoals.length) * 100)
        : 0
    };
  };

  const getHistoricalGoals = (weeks = 4) => {
    const today = new Date();
    const weekKeys = [];
    
    for (let i = 0; i < weeks; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (i * 7));
      weekKeys.push(getWeekKey(date));
    }

    return weekKeys.map(weekKey => ({
      weekKey,
      goals: Object.values(goals).filter(g => g.weekKey === weekKey),
      completionRate: (() => {
        const weekGoals = Object.values(goals).filter(g => g.weekKey === weekKey);
        return weekGoals.length > 0
          ? Math.round((weekGoals.filter(g => g.completed).length / weekGoals.length) * 100)
          : 0;
      })()
    }));
  };

  return {
    goals: Object.values(goals),
    createGoal,
    updateGoalProgress,
    deleteGoal,
    getCurrentWeekGoals,
    getGoalStats,
    getHistoricalGoals
  };
};