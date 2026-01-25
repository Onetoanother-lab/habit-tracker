// src/components/hooks/useDifficultyAdjuster.js
import { useLocalStorage } from './useLocalStorage';

export const useDifficultyAdjuster = () => {
  const [habitDifficulty, setHabitDifficulty] = useLocalStorage('habit-difficulty', {});
  const [difficultyHistory, setDifficultyHistory] = useLocalStorage('difficulty-history', {});

  const DIFFICULTY_LEVELS = {
    veryEasy: {
      name: 'Very Easy',
      multiplier: 0.5,
      color: 'green',
      description: 'Just starting out - small steps',
      icon: '🌱'
    },
    easy: {
      name: 'Easy',
      multiplier: 0.75,
      color: 'lime',
      description: 'Building confidence',
      icon: '🌿'
    },
    normal: {
      name: 'Normal',
      multiplier: 1,
      color: 'blue',
      description: 'Standard challenge',
      icon: '🎯'
    },
    hard: {
      name: 'Hard',
      multiplier: 1.5,
      color: 'orange',
      description: 'Pushing your limits',
      icon: '💪'
    },
    veryHard: {
      name: 'Very Hard',
      multiplier: 2,
      color: 'red',
      description: 'Maximum challenge',
      icon: '🔥'
    }
  };

  const setHabitDifficultyLevel = (habitId, level) => {
    setHabitDifficulty(prev => ({
      ...prev,
      [habitId]: level
    }));

    // Track history
    setDifficultyHistory(prev => ({
      ...prev,
      [habitId]: [
        ...(prev[habitId] || []),
        {
          level,
          timestamp: Date.now(),
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const getHabitDifficulty = (habitId) => {
    return habitDifficulty[habitId] || 'normal';
  };

  const getDifficultyData = (level) => {
    return DIFFICULTY_LEVELS[level] || DIFFICULTY_LEVELS.normal;
  };

  const suggestDifficultyChange = (habit) => {
    if (!habit.completions) return null;

    const recentDays = 14;
    const dates = [];
    for (let i = 0; i < recentDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const completions = dates.filter(date => habit.completions[date]).length;
    const completionRate = completions / recentDays;
    const currentDifficulty = getHabitDifficulty(habit.id);

    // Suggest increase if consistently completing (>85%)
    if (completionRate > 0.85 && currentDifficulty !== 'veryHard') {
      const currentIndex = Object.keys(DIFFICULTY_LEVELS).indexOf(currentDifficulty);
      const suggestedLevel = Object.keys(DIFFICULTY_LEVELS)[currentIndex + 1];
      return {
        type: 'increase',
        current: currentDifficulty,
        suggested: suggestedLevel,
        reason: `You're crushing it! ${Math.round(completionRate * 100)}% completion rate.`
      };
    }

    // Suggest decrease if struggling (<40%)
    if (completionRate < 0.4 && currentDifficulty !== 'veryEasy') {
      const currentIndex = Object.keys(DIFFICULTY_LEVELS).indexOf(currentDifficulty);
      const suggestedLevel = Object.keys(DIFFICULTY_LEVELS)[currentIndex - 1];
      return {
        type: 'decrease',
        current: currentDifficulty,
        suggested: suggestedLevel,
        reason: `Let's make this easier. ${Math.round(completionRate * 100)}% completion rate.`
      };
    }

    return null;
  };

  const calculateXPBonus = (habitId) => {
    const difficulty = getHabitDifficulty(habitId);
    const data = getDifficultyData(difficulty);
    return Math.floor(10 * data.multiplier);
  };

  const getDifficultyStats = (habitId) => {
    const history = difficultyHistory[habitId] || [];
    const current = getHabitDifficulty(habitId);
    
    return {
      current,
      changes: history.length,
      history: history.slice(-5), // Last 5 changes
      currentData: getDifficultyData(current)
    };
  };

  return {
    DIFFICULTY_LEVELS,
    setHabitDifficultyLevel,
    getHabitDifficulty,
    getDifficultyData,
    suggestDifficultyChange,
    calculateXPBonus,
    getDifficultyStats
  };
};