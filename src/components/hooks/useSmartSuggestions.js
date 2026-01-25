// src/components/hooks/useSmartSuggestions.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useSmartSuggestions = (habits) => {
  const [suggestions, setSuggestions] = useState([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useLocalStorage('dismissed-suggestions', []);
  const [userPreferences, setUserPreferences] = useLocalStorage('suggestion-preferences', {
    difficulty: 'balanced', // 'easy', 'balanced', 'challenging'
    categories: [],
    frequency: 'daily', // 'daily', 'weekly', 'biweekly'
    enableAI: true
  });

  // Analyze user behavior patterns
  const analyzePatterns = () => {
    if (!habits || habits.length === 0) return {};

    const patterns = {
      bestCompletionTime: null,
      worstDay: null,
      bestDay: null,
      avgCompletionRate: 0,
      completionTrend: 'stable', // 'improving', 'declining', 'stable'
      mostSuccessfulHabits: [],
      strugglingHabits: [],
      consistencyScore: 0
    };

    // Calculate average completion rate
    const totalDays = 30;
    let totalCompletions = 0;

    habits.forEach(habit => {
      const completions = Object.keys(habit.completions || {}).length;
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      const rate = daysSinceCreation > 0 ? (completions / daysSinceCreation) * 100 : 0;
      
      if (rate > 70) {
        patterns.mostSuccessfulHabits.push({ ...habit, rate });
      } else if (rate < 40) {
        patterns.strugglingHabits.push({ ...habit, rate });
      }
    });

    // Analyze day-of-week patterns
    const dayStats = Array(7).fill(0).map(() => ({ completions: 0, total: 0 }));
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      habits.forEach(habit => {
        dayStats[dayOfWeek].total++;
        if (habit.completions && habit.completions[dateStr]) {
          dayStats[dayOfWeek].completions++;
        }
      });
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let bestDayIndex = 0;
    let worstDayIndex = 0;
    let bestRate = 0;
    let worstRate = 100;

    dayStats.forEach((stat, index) => {
      if (stat.total > 0) {
        const rate = (stat.completions / stat.total) * 100;
        if (rate > bestRate) {
          bestRate = rate;
          bestDayIndex = index;
        }
        if (rate < worstRate) {
          worstRate = rate;
          worstDayIndex = index;
        }
      }
    });

    patterns.bestDay = { day: dayNames[bestDayIndex], rate: Math.round(bestRate) };
    patterns.worstDay = { day: dayNames[worstDayIndex], rate: Math.round(worstRate) };

    // Calculate trend (last 7 days vs previous 7 days)
    const recent = [];
    const previous = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = habits.filter(h => h.completions && h.completions[dateStr]).length;
      recent.push(completed);
    }

    for (let i = 7; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = habits.filter(h => h.completions && h.completions[dateStr]).length;
      previous.push(completed);
    }

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    if (recentAvg > previousAvg * 1.1) {
      patterns.completionTrend = 'improving';
    } else if (recentAvg < previousAvg * 0.9) {
      patterns.completionTrend = 'declining';
    }

    return patterns;
  };

  // Generate personalized suggestions
  const generateSuggestions = () => {
    if (!habits || habits.length === 0) {
      return [{
        id: 'welcome',
        type: 'getting-started',
        title: 'Welcome to HabitQuest!',
        description: 'Start by creating your first habit. We recommend beginning with something small and achievable.',
        action: 'createHabit',
        priority: 1,
        icon: '🎯'
      }];
    }

    const patterns = analyzePatterns();
    const newSuggestions = [];

    // Pattern-based suggestions
    if (patterns.strugglingHabits.length > 0) {
      newSuggestions.push({
        id: `struggling-${Date.now()}`,
        type: 'difficulty-adjustment',
        title: 'Lower the barrier to success',
        description: `You're struggling with "${patterns.strugglingHabits[0].name}". Consider breaking it into smaller steps or adjusting the difficulty.`,
        action: 'adjustDifficulty',
        data: { habitId: patterns.strugglingHabits[0].id },
        priority: 1,
        icon: '💡'
      });
    }

    if (patterns.worstDay && patterns.worstDay.rate < 50) {
      newSuggestions.push({
        id: `worst-day-${Date.now()}`,
        type: 'schedule-optimization',
        title: `Improve your ${patterns.worstDay.day}s`,
        description: `${patterns.worstDay.day} is your weakest day (${patterns.worstDay.rate}% completion). Try scheduling easier habits or setting reminders.`,
        action: 'scheduleOptimization',
        data: { day: patterns.worstDay.day },
        priority: 2,
        icon: '📅'
      });
    }

    if (patterns.completionTrend === 'declining') {
      newSuggestions.push({
        id: `trend-${Date.now()}`,
        type: 'motivation',
        title: 'Momentum is slipping',
        description: 'Your completion rate has dropped recently. Consider taking a break with Vacation Mode or reviewing your goals.',
        action: 'reviewGoals',
        priority: 1,
        icon: '⚠️'
      });
    }

    if (patterns.completionTrend === 'improving') {
      newSuggestions.push({
        id: `improving-${Date.now()}`,
        type: 'challenge',
        title: 'You\'re on fire! 🔥',
        description: 'Your consistency is improving. Ready to level up? Consider adding a new challenging habit or joining a bundle.',
        action: 'addChallenge',
        priority: 3,
        icon: '🚀'
      });
    }

    // Time-based suggestions
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 10) {
      const morningHabits = habits.filter(h => 
        !h.completions || !h.completions[now.toISOString().split('T')[0]]
      );

      if (morningHabits.length > 0) {
        newSuggestions.push({
          id: `morning-${Date.now()}`,
          type: 'time-reminder',
          title: 'Perfect time for morning habits',
          description: `You have ${morningHabits.length} habit${morningHabits.length > 1 ? 's' : ''} to complete today. Start your day strong!`,
          action: 'viewHabits',
          priority: 2,
          icon: '🌅'
        });
      }
    }

    // Complementary habit suggestions
    const habitCategories = {
      exercise: ['Meditation', 'Healthy eating', 'Stretching'],
      meditation: ['Journaling', 'Reading', 'Gratitude practice'],
      reading: ['Writing', 'Learning', 'Creative time'],
      productivity: ['Break time', 'Exercise', 'Sleep routine']
    };

    habits.forEach(habit => {
      const habitName = habit.name.toLowerCase();
      Object.entries(habitCategories).forEach(([category, complements]) => {
        if (habitName.includes(category)) {
          const hasComplement = complements.some(comp => 
            habits.some(h => h.name.toLowerCase().includes(comp.toLowerCase()))
          );
          
          if (!hasComplement) {
            newSuggestions.push({
              id: `complement-${category}-${Date.now()}`,
              type: 'complementary',
              title: `Pair with ${complements[0]}`,
              description: `You track "${habit.name}". Studies show ${complements[0].toLowerCase()} complements this habit well.`,
              action: 'suggestHabit',
              data: { suggestion: complements[0] },
              priority: 3,
              icon: '🔗'
            });
          }
        }
      });
    });

    // Milestone suggestions
    habits.forEach(habit => {
      const streak = getStreakForHabit(habit);
      const milestones = [7, 30, 50, 100, 365];
      const nextMilestone = milestones.find(m => m > streak);
      
      if (nextMilestone && streak >= nextMilestone - 3) {
        newSuggestions.push({
          id: `milestone-${habit.id}-${Date.now()}`,
          type: 'milestone',
          title: `${nextMilestone - streak} days to milestone!`,
          description: `Keep going with "${habit.name}" - you're ${nextMilestone - streak} day${nextMilestone - streak > 1 ? 's' : ''} away from a ${nextMilestone}-day streak!`,
          action: 'viewProgress',
          data: { habitId: habit.id },
          priority: 2,
          icon: '🎖️'
        });
      }
    });

    // Bundle suggestions
    if (habits.length >= 3) {
      const morningHabits = habits.filter(h => h.name.toLowerCase().includes('morning') || h.name.toLowerCase().includes('breakfast'));
      const eveningHabits = habits.filter(h => h.name.toLowerCase().includes('evening') || h.name.toLowerCase().includes('night'));

      if (morningHabits.length >= 2) {
        newSuggestions.push({
          id: `bundle-morning-${Date.now()}`,
          type: 'bundle',
          title: 'Create a morning bundle',
          description: 'Stack your morning habits together for better consistency and bonus XP.',
          action: 'createBundle',
          data: { type: 'morning', habitIds: morningHabits.map(h => h.id) },
          priority: 3,
          icon: '📦'
        });
      }
    }

    // Filter out dismissed suggestions
    return newSuggestions
      .filter(s => !dismissedSuggestions.includes(s.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);
  };

  const dismissSuggestion = (suggestionId) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const clearDismissed = () => {
    setDismissedSuggestions([]);
  };

  useEffect(() => {
    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
  }, [habits.length, JSON.stringify(habits.map(h => ({ id: h.id, completions: Object.keys(h.completions || {}).length })))]);

  return {
    suggestions,
    dismissSuggestion,
    clearDismissed,
    userPreferences,
    setUserPreferences,
    analyzePatterns,
    generateSuggestions
  };
};

// Helper function
function getStreakForHabit(habit) {
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