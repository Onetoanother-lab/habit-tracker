// src/components/hooks/useHabitBundles.js
import { useLocalStorage } from './useLocalStorage';

export const useHabitBundles = () => {
  const [bundles, setBundles] = useLocalStorage('habit-bundles', []);
  const [bundleTemplates, setBundleTemplates] = useLocalStorage('bundle-templates', []);

  const PRESET_BUNDLES = {
    morningRoutine: {
      name: 'Morning Routine',
      icon: '🌅',
      description: 'Start your day right',
      color: 'orange',
      habitIds: [],
      timeOfDay: 'morning',
      estimatedDuration: 30
    },
    eveningWindDown: {
      name: 'Evening Wind Down',
      icon: '🌙',
      description: 'Prepare for restful sleep',
      color: 'indigo',
      habitIds: [],
      timeOfDay: 'evening',
      estimatedDuration: 45
    },
    workoutStack: {
      name: 'Workout Stack',
      icon: '💪',
      description: 'Complete fitness routine',
      color: 'red',
      habitIds: [],
      timeOfDay: 'flexible',
      estimatedDuration: 60
    },
    productivityBlock: {
      name: 'Productivity Block',
      icon: '⚡',
      description: 'Peak performance mode',
      color: 'yellow',
      habitIds: [],
      timeOfDay: 'morning',
      estimatedDuration: 90
    },
    selfCareBundle: {
      name: 'Self Care',
      icon: '✨',
      description: 'Nurture yourself',
      color: 'pink',
      habitIds: [],
      timeOfDay: 'evening',
      estimatedDuration: 40
    }
  };

  const createBundle = (bundleData) => {
    const bundle = {
      id: Date.now().toString(),
      name: bundleData.name,
      description: bundleData.description || '',
      icon: bundleData.icon || '📦',
      color: bundleData.color || 'blue',
      habitIds: bundleData.habitIds || [],
      order: bundleData.order || 'flexible', // 'strict', 'flexible'
      timeOfDay: bundleData.timeOfDay || 'flexible',
      estimatedDuration: bundleData.estimatedDuration || 0,
      createdAt: Date.now(),
      isActive: true,
      completionBonus: bundleData.completionBonus || 0
    };

    setBundles(prev => [...prev, bundle]);
    return bundle;
  };

  const updateBundle = (bundleId, updates) => {
    setBundles(prev => prev.map(b => 
      b.id === bundleId ? { ...b, ...updates } : b
    ));
  };

  const deleteBundle = (bundleId) => {
    setBundles(prev => prev.filter(b => b.id !== bundleId));
  };

  const addHabitToBundle = (bundleId, habitId) => {
    setBundles(prev => prev.map(b => 
      b.id === bundleId
        ? { ...b, habitIds: [...new Set([...b.habitIds, habitId])] }
        : b
    ));
  };

  const removeHabitFromBundle = (bundleId, habitId) => {
    setBundles(prev => prev.map(b => 
      b.id === bundleId
        ? { ...b, habitIds: b.habitIds.filter(id => id !== habitId) }
        : b
    ));
  };

  const reorderHabitsInBundle = (bundleId, habitIds) => {
    setBundles(prev => prev.map(b => 
      b.id === bundleId ? { ...b, habitIds } : b
    ));
  };

  const checkBundleCompletion = (bundleId, habits, date) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return false;

    return bundle.habitIds.every(habitId => {
      const habit = habits.find(h => h.id === habitId);
      return habit?.completions?.[date];
    });
  };

  const getBundleProgress = (bundleId, habits, date) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle || bundle.habitIds.length === 0) return 0;

    const completed = bundle.habitIds.filter(habitId => {
      const habit = habits.find(h => h.id === habitId);
      return habit?.completions?.[date];
    }).length;

    return Math.round((completed / bundle.habitIds.length) * 100);
  };

  const getBundleStreak = (bundleId, habits) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return 0;

    let streak = 0;
    let date = new Date();

    while (true) {
      const dateStr = date.toISOString().split('T')[0];
      const completed = checkBundleCompletion(bundleId, habits, dateStr);

      if (completed) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getBundleStats = (bundleId, habits) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return null;

    const today = new Date().toISOString().split('T')[0];
    const progress = getBundleProgress(bundleId, habits, today);
    const streak = getBundleStreak(bundleId, habits);

    // Calculate total completions in last 30 days
    let totalCompletions = 0;
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (checkBundleCompletion(bundleId, habits, dateStr)) {
        totalCompletions++;
      }
    }

    return {
      progress,
      streak,
      totalCompletions,
      completionRate: Math.round((totalCompletions / 30) * 100),
      habitCount: bundle.habitIds.length
    };
  };

  const completeBundle = (bundleId, habits, date) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return null;

    // Check if bundle is already complete
    if (checkBundleCompletion(bundleId, habits, date)) {
      return {
        success: true,
        alreadyComplete: true,
        bonusXP: 0
      };
    }

    // Calculate bonus XP
    const bonusXP = bundle.completionBonus || bundle.habitIds.length * 5;

    return {
      success: true,
      alreadyComplete: false,
      bonusXP,
      bundleName: bundle.name
    };
  };

  const saveAsTemplate = (bundleId) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return null;

    const template = {
      id: Date.now().toString(),
      name: bundle.name,
      description: bundle.description,
      icon: bundle.icon,
      color: bundle.color,
      habitCount: bundle.habitIds.length,
      timeOfDay: bundle.timeOfDay,
      estimatedDuration: bundle.estimatedDuration,
      createdAt: Date.now()
    };

    setBundleTemplates(prev => [...prev, template]);
    return template;
  };

  return {
    bundles,
    bundleTemplates,
    PRESET_BUNDLES,
    createBundle,
    updateBundle,
    deleteBundle,
    addHabitToBundle,
    removeHabitFromBundle,
    reorderHabitsInBundle,
    checkBundleCompletion,
    getBundleProgress,
    getBundleStreak,
    getBundleStats,
    completeBundle,
    saveAsTemplate
  };
};