// src/components/hooks/useRecoveryMode.js
import { useLocalStorage } from './useLocalStorage';

export const useRecoveryMode = () => {
  const [streakSavers, setStreakSavers] = useLocalStorage('streak-savers', {
    available: 3, // Free streak freezes
    used: [],
    earned: []
  });

  const [vacationMode, setVacationMode] = useLocalStorage('vacation-mode', {
    isActive: false,
    startDate: null,
    endDate: null,
    pausedHabits: []
  });

  const [gracePeriod, setGracePeriod] = useLocalStorage('grace-period', {
    enabled: true,
    hours: 24 // Allow completion within 24 hours
  });

  // Streak Saver Functions
  const useStreakSaver = (habitId, date) => {
    if (streakSavers.available <= 0) {
      return { success: false, reason: 'No streak savers available' };
    }

    const saver = {
      id: Date.now().toString(),
      habitId,
      date,
      usedAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    setStreakSavers(prev => ({
      ...prev,
      available: prev.available - 1,
      used: [...prev.used, saver]
    }));

    return { success: true, saver };
  };

  const earnStreakSaver = (reason, count = 1) => {
    const earned = {
      id: Date.now().toString(),
      reason,
      count,
      earnedAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    setStreakSavers(prev => ({
      ...prev,
      available: prev.available + count,
      earned: [...prev.earned, earned]
    }));

    return earned;
  };

  const checkStreakSaverEligibility = (habit) => {
    // Earn streak saver every 30 days of streak
    const streak = getStreakForHabit(habit);
    const milestoneDays = [30, 60, 90, 120, 180, 365];
    
    for (const days of milestoneDays) {
      if (streak === days) {
        return { eligible: true, days };
      }
    }

    return { eligible: false };
  };

  // Vacation Mode Functions
  const activateVacationMode = (startDate, endDate, habitIds = []) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return { success: false, reason: 'End date must be after start date' };
    }

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 14) {
      return { success: false, reason: 'Maximum vacation period is 14 days' };
    }

    setVacationMode({
      isActive: true,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      pausedHabits: habitIds,
      activatedAt: new Date().toISOString()
    });

    return { success: true, days: daysDiff };
  };

  const deactivateVacationMode = () => {
    setVacationMode({
      isActive: false,
      startDate: null,
      endDate: null,
      pausedHabits: []
    });
  };

  const isInVacationMode = (date = new Date()) => {
    if (!vacationMode.isActive) return false;

    const checkDate = new Date(date);
    const start = new Date(vacationMode.startDate);
    const end = new Date(vacationMode.endDate);

    return checkDate >= start && checkDate <= end;
  };

  const isHabitPaused = (habitId, date = new Date()) => {
    if (!isInVacationMode(date)) return false;
    
    // If no specific habits are paused, all habits are paused
    if (vacationMode.pausedHabits.length === 0) return true;
    
    return vacationMode.pausedHabits.includes(habitId);
  };

  // Grace Period Functions
  const isInGracePeriod = (date) => {
    if (!gracePeriod.enabled) return false;

    const targetDate = new Date(date);
    const now = new Date();
    const hoursDiff = (now - targetDate) / (1000 * 60 * 60);

    return hoursDiff <= gracePeriod.hours && hoursDiff >= 0;
  };

  const updateGracePeriod = (hours) => {
    setGracePeriod(prev => ({
      ...prev,
      hours: Math.min(Math.max(hours, 0), 48) // Max 48 hours
    }));
  };

  const toggleGracePeriod = () => {
    setGracePeriod(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  // Recovery Suggestions
  const getRecoverySuggestions = (habit) => {
    const suggestions = [];

    // Check if streak saver is available
    if (streakSavers.available > 0) {
      suggestions.push({
        type: 'streakSaver',
        title: 'Use Streak Saver',
        description: `Preserve your streak with a freeze (${streakSavers.available} available)`,
        action: 'useStreakSaver',
        priority: 1
      });
    }

    // Suggest vacation mode
    suggestions.push({
      type: 'vacation',
      title: 'Activate Vacation Mode',
      description: 'Pause habits for up to 14 days without breaking streaks',
      action: 'activateVacation',
      priority: 2
    });

    // Suggest grace period if not enabled
    if (!gracePeriod.enabled) {
      suggestions.push({
        type: 'gracePeriod',
        title: 'Enable Grace Period',
        description: '24-hour window to complete yesterday\'s habits',
        action: 'enableGracePeriod',
        priority: 3
      });
    }

    // Suggest earning streak savers
    if (streakSavers.available === 0) {
      suggestions.push({
        type: 'earn',
        title: 'Earn Streak Savers',
        description: 'Reach 30, 60, or 90-day streaks to earn more',
        action: 'viewMilestones',
        priority: 4
      });
    }

    return suggestions.sort((a, b) => a.priority - b.priority);
  };

  // Stats
  const getRecoveryStats = () => {
    return {
      streakSavers: {
        available: streakSavers.available,
        used: streakSavers.used.length,
        earned: streakSavers.earned.reduce((sum, e) => sum + e.count, 0)
      },
      vacationMode: {
        isActive: vacationMode.isActive,
        daysRemaining: vacationMode.isActive 
          ? Math.ceil((new Date(vacationMode.endDate) - new Date()) / (1000 * 60 * 60 * 24))
          : 0,
        pausedHabits: vacationMode.pausedHabits.length
      },
      gracePeriod: {
        enabled: gracePeriod.enabled,
        hours: gracePeriod.hours
      }
    };
  };

  return {
    streakSavers,
    vacationMode,
    gracePeriod,
    useStreakSaver,
    earnStreakSaver,
    checkStreakSaverEligibility,
    activateVacationMode,
    deactivateVacationMode,
    isInVacationMode,
    isHabitPaused,
    isInGracePeriod,
    updateGracePeriod,
    toggleGracePeriod,
    getRecoverySuggestions,
    getRecoveryStats
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