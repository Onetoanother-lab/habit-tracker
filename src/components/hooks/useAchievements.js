// src/components/hooks/useAchievements.js
import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

const ACHIEVEMENTS = {
  first_habit: {
    id: 'first_habit',
    name: 'Getting Started',
    description: 'Create your first habit',
    icon: '🌱',
    xpReward: 50,
    tier: 'bronze'
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xpReward: 100,
    tier: 'silver'
  },
  month_master: {
    id: 'month_master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
    xpReward: 500,
    tier: 'gold'
  },
  century_club: {
    id: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 habits',
    icon: '💯',
    xpReward: 1000,
    tier: 'platinum'
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    icon: '✨',
    xpReward: 200,
    tier: 'silver'
  },
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete habits before 9 AM for 7 days',
    icon: '🌅',
    xpReward: 150,
    tier: 'bronze'
  },
  level_10: {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '🌟',
    xpReward: 300,
    tier: 'gold'
  },
  level_25: {
    id: 'level_25',
    name: 'Champion',
    description: 'Reach level 25',
    icon: '🏆',
    xpReward: 750,
    tier: 'platinum'
  },
  challenge_master: {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Complete 50 daily challenges',
    icon: '🎯',
    xpReward: 400,
    tier: 'gold'
  },
  trait_specialist: {
    id: 'trait_specialist',
    name: 'Trait Specialist',
    description: 'Max out any psychological trait',
    icon: '🧠',
    xpReward: 600,
    tier: 'platinum'
  }
};

export const useAchievements = (habits, level, traits, completedChallenges) => {
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('achievements', []);
  const [pendingAchievements, setPendingAchievements] = useLocalStorage('pending-achievements', []);

  const checkAchievements = () => {
    const newUnlocks = [];

    // First habit
    if (habits.length >= 1 && !unlockedAchievements.includes('first_habit')) {
      newUnlocks.push('first_habit');
    }

    // Streak achievements
    const maxStreak = Math.max(...habits.map(h => {
      let streak = 0;
      let date = new Date();
      while (h.completions && h.completions[date.toISOString().split('T')[0]]) {
        streak++;
        date.setDate(date.getDate() - 1);
      }
      return streak;
    }), 0);

    if (maxStreak >= 7 && !unlockedAchievements.includes('week_warrior')) {
      newUnlocks.push('week_warrior');
    }

    if (maxStreak >= 30 && !unlockedAchievements.includes('month_master')) {
      newUnlocks.push('month_master');
    }

    // Total completions
    const totalCompletions = habits.reduce((sum, h) => 
      sum + (h.completions ? Object.keys(h.completions).length : 0), 0);
    
    if (totalCompletions >= 100 && !unlockedAchievements.includes('century_club')) {
      newUnlocks.push('century_club');
    }

    // Level achievements
    if (level >= 10 && !unlockedAchievements.includes('level_10')) {
      newUnlocks.push('level_10');
    }

    if (level >= 25 && !unlockedAchievements.includes('level_25')) {
      newUnlocks.push('level_25');
    }

    // Challenge achievements
    if (completedChallenges >= 50 && !unlockedAchievements.includes('challenge_master')) {
      newUnlocks.push('challenge_master');
    }

    // Trait achievements
    const maxTraitLevel = Math.max(...Object.values(traits).map(t => t.level || 0), 0);
    if (maxTraitLevel >= 10 && !unlockedAchievements.includes('trait_specialist')) {
      newUnlocks.push('trait_specialist');
    }

    if (newUnlocks.length > 0) {
      setUnlockedAchievements(prev => [...new Set([...prev, ...newUnlocks])]);
      setPendingAchievements(prev => [...prev, ...newUnlocks]);
    }

    return newUnlocks;
  };

  const clearPendingAchievements = () => {
    setPendingAchievements([]);
  };

  const getAchievementProgress = () => {
    return {
      total: Object.keys(ACHIEVEMENTS).length,
      unlocked: unlockedAchievements.length,
      percentage: Math.round((unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100)
    };
  };

  const getAchievementsByTier = (tier) => {
    return Object.values(ACHIEVEMENTS)
      .filter(a => a.tier === tier)
      .map(a => ({
        ...a,
        unlocked: unlockedAchievements.includes(a.id)
      }));
  };

  useEffect(() => {
    checkAchievements();
  }, [habits.length, level, completedChallenges]);

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    pendingAchievements,
    checkAchievements,
    clearPendingAchievements,
    getAchievementProgress,
    getAchievementsByTier
  };
};