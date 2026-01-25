// src/components/hooks/useMilestones.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MILESTONE_DEFINITIONS = {
  firstHabit: {
    id: 'firstHabit',
    name: 'First Step',
    description: 'Created your first habit',
    icon: '🌱',
    check: (habits) => habits.length >= 1
  },
  threeHabits: {
    id: 'threeHabits',
    name: 'Building Momentum',
    description: 'Created 3 habits',
    icon: '🚀',
    check: (habits) => habits.length >= 3
  },
  firstWeek: {
    id: 'firstWeek',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    check: (habits) => habits.some(h => getStreak(h) >= 7)
  },
  firstMonth: {
    id: 'firstMonth',
    name: 'Month Master',
    description: 'Maintained a 30-day streak',
    icon: '👑',
    check: (habits) => habits.some(h => getStreak(h) >= 30)
  },
  hundredDays: {
    id: 'hundredDays',
    name: 'Century Club',
    description: 'Completed 100 total habit days',
    icon: '💯',
    check: (habits) => {
      const total = habits.reduce((sum, h) => 
        sum + Object.keys(h.completions || {}).length, 0);
      return total >= 100;
    }
  },
  perfectWeek: {
    id: 'perfectWeek',
    name: 'Perfect Week',
    description: 'Completed all habits for 7 consecutive days',
    icon: '✨',
    check: (habits) => {
      if (habits.length === 0) return false;
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const allCompleted = habits.every(h => h.completions && h.completions[dateStr]);
        if (!allCompleted) return false;
      }
      return true;
    }
  },
  fiftyStreak: {
    id: 'fiftyStreak',
    name: 'Half Century',
    description: 'Maintained a 50-day streak',
    icon: '⭐',
    check: (habits) => habits.some(h => getStreak(h) >= 50)
  },
  hundredStreak: {
    id: 'hundredStreak',
    name: 'Legendary',
    description: 'Maintained a 100-day streak',
    icon: '🏆',
    check: (habits) => habits.some(h => getStreak(h) >= 100)
  },
  fiveHundredDays: {
    id: 'fiveHundredDays',
    name: 'Hall of Fame',
    description: 'Completed 500 total habit days',
    icon: '🎖️',
    check: (habits) => {
      const total = habits.reduce((sum, h) => 
        sum + Object.keys(h.completions || {}).length, 0);
      return total >= 500;
    }
  },
  yearStreak: {
    id: 'yearStreak',
    name: 'Year Champion',
    description: 'Maintained a 365-day streak',
    icon: '🌟',
    check: (habits) => habits.some(h => getStreak(h) >= 365)
  }
};

function getStreak(habit) {
  if (!habit?.completions) return 0;
  
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
}

export const useMilestones = (habits) => {
  const [unlockedMilestones, setUnlockedMilestones] = useLocalStorage('unlocked-milestones', []);
  const [pendingCelebrations, setPendingCelebrations] = useState([]);

  useEffect(() => {
    const newUnlocks = [];

    Object.values(MILESTONE_DEFINITIONS).forEach(milestone => {
      if (!unlockedMilestones.includes(milestone.id) && milestone.check(habits)) {
        newUnlocks.push(milestone);
      }
    });

    if (newUnlocks.length > 0) {
      setUnlockedMilestones(prev => [
        ...prev,
        ...newUnlocks.map(m => m.id)
      ]);
      setPendingCelebrations(newUnlocks);
    }
  }, [habits, unlockedMilestones, setUnlockedMilestones]);

  const dismissCelebration = (milestoneId) => {
    setPendingCelebrations(prev => 
      prev.filter(m => m.id !== milestoneId)
    );
  };

  const getAllMilestones = () => {
    return Object.values(MILESTONE_DEFINITIONS).map(milestone => ({
      ...milestone,
      unlocked: unlockedMilestones.includes(milestone.id)
    }));
  };

  const getProgress = () => {
    const total = Object.keys(MILESTONE_DEFINITIONS).length;
    const unlocked = unlockedMilestones.length;
    return {
      total,
      unlocked,
      percentage: Math.round((unlocked / total) * 100)
    };
  };

  return {
    pendingCelebrations,
    dismissCelebration,
    getAllMilestones,
    getProgress,
    unlockedMilestones
  };
};