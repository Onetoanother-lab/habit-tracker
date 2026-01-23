import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import challengesData from '../../data/challenges.json';
import { TRAITS } from '../constants/traits';

const DAILY_CHALLENGE_LIMIT = 3;
const COOLDOWN_DAYS = 7;
const MAX_SKIPS_PER_DAY = 2;

export const useChallengeSystem = () => {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useLocalStorage('active-challenges', []);
  const [completedChallenges, setCompletedChallenges] = useLocalStorage('completed-challenges', []);
  const [skippedChallenges, setSkippedChallenges] = useLocalStorage('skipped-challenges', []);
  const [traits, setTraits] = useLocalStorage('user-traits', {});
  const [streak, setStreak] = useLocalStorage('challenge-streak', { current: 0, best: 0, lastDate: null });
  const [dailyStats, setDailyStats] = useLocalStorage('daily-stats', {});
  const [skipCount, setSkipCount] = useLocalStorage('daily-skip-count', { date: null, count: 0 });
  const [difficultyLevel, setDifficultyLevel] = useLocalStorage('difficulty-level', 1);

  // Load challenges from JSON
  useEffect(() => {
    try {
      const data = challengesData?.challenges || [];
      setChallenges(data);
    } catch (err) {
      console.error('Error loading challenges:', err);
    }
  }, []);

  // Get today's date string
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Initialize traits if empty
  useEffect(() => {
    if (Object.keys(traits).length === 0) {
      const initialTraits = {};
      Object.keys(TRAITS).forEach(key => {
        initialTraits[key] = { level: 0, totalProgress: 0 };
      });
      setTraits(initialTraits);
    }
  }, []);

  // Update streak logic
  const updateStreak = (completed) => {
    const today = getTodayString();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (completed) {
      if (streak.lastDate === today) return; // Already counted today
      
      if (streak.lastDate === yesterday || !streak.lastDate) {
        const newCurrent = (streak.lastDate === yesterday ? streak.current : 0) + 1;
        setStreak({
          current: newCurrent,
          best: Math.max(newCurrent, streak.best),
          lastDate: today
        });
      } else {
        // Streak broken
        setStreak({ current: 1, best: streak.best, lastDate: today });
      }
    }
  };

  // Get challenges on cooldown
  const getChallengesOnCooldown = () => {
    const now = Date.now();
    const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    
    return [...completedChallenges, ...skippedChallenges].filter(entry => {
      return (now - entry.timestamp) < cooldownMs;
    }).map(entry => entry.id);
  };

  // Get available challenges (not on cooldown)
  const getAvailableChallenges = () => {
    const onCooldown = getChallengesOnCooldown();
    const available = challenges.filter(c => !onCooldown.includes(c.id));
    
    // If too few available, allow some repeats (graceful degradation)
    if (available.length < DAILY_CHALLENGE_LIMIT) {
      return [...available, ...challenges.slice(0, DAILY_CHALLENGE_LIMIT - available.length)];
    }
    
    return available;
  };

  // Adaptive difficulty selection
  const selectByDifficulty = (challengeList) => {
    const { current: streakCount } = streak;
    
    let difficultyDistribution;
    if (streakCount < 3 || difficultyLevel < 2) {
      difficultyDistribution = { easy: 2, medium: 1, hard: 0 };
    } else if (streakCount < 7 || difficultyLevel < 3) {
      difficultyDistribution = { easy: 1, medium: 2, hard: 0 };
    } else if (streakCount < 14 || difficultyLevel < 4) {
      difficultyDistribution = { easy: 1, medium: 1, hard: 1 };
    } else {
      difficultyDistribution = { easy: 0, medium: 2, hard: 1 };
    }

    const easy = challengeList.filter(c => c.difficulty === 'easy');
    const medium = challengeList.filter(c => c.difficulty === 'medium');
    const hard = challengeList.filter(c => c.difficulty === 'hard');

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    
    const selected = [
      ...shuffle(easy).slice(0, difficultyDistribution.easy),
      ...shuffle(medium).slice(0, difficultyDistribution.medium),
      ...shuffle(hard).slice(0, difficultyDistribution.hard),
    ];

    return shuffle(selected).slice(0, DAILY_CHALLENGE_LIMIT);
  };

  // Generate daily challenges
  const generateDailyChallenges = () => {
    const today = getTodayString();
    
    // Check if already generated today
    const alreadyActive = activeChallenges.filter(ac => ac.date === today);
    if (alreadyActive.length > 0) {
      return { success: false, message: 'Challenges already generated for today' };
    }

    const available = getAvailableChallenges();
    if (available.length === 0) {
      return { success: false, message: 'No challenges available' };
    }

    const selected = selectByDifficulty(available);
    
    const newActiveChallenges = selected.map(challenge => ({
      ...challenge,
      status: 'active',
      date: today,
      startTime: Date.now(),
      reflection: null
    }));

    setActiveChallenges(prev => [...prev.filter(ac => ac.date !== today), ...newActiveChallenges]);
    
    return { success: true, challenges: newActiveChallenges };
  };

  // Complete a challenge
  const completeChallenge = (challengeId, reflection = null) => {
    const today = getTodayString();
    const challenge = activeChallenges.find(c => c.id === challengeId && c.date === today);
    
    if (!challenge) return { success: false, message: 'Challenge not found' };

    // Update active challenges
    setActiveChallenges(prev => prev.map(c => 
      c.id === challengeId && c.date === today 
        ? { ...c, status: 'completed', completedTime: Date.now(), reflection }
        : c
    ));

    // Add to completed history
    setCompletedChallenges(prev => [...prev, { 
      id: challengeId, 
      timestamp: Date.now(),
      date: today,
      reflection 
    }]);

    // Update traits
    const category = challenge.category;
    if (category && TRAITS[category]) {
      const progressGain = challenge.difficulty === 'easy' ? 1 : challenge.difficulty === 'medium' ? 2 : 3;
      
      setTraits(prev => {
        const current = prev[category] || { level: 0, totalProgress: 0 };
        const newProgress = current.totalProgress + progressGain;
        const newLevel = Math.floor(newProgress / 10);
        
        return {
          ...prev,
          [category]: {
            level: newLevel,
            totalProgress: newProgress
          }
        };
      });
    }

    // Update streak
    updateStreak(true);

    // Update daily stats
    setDailyStats(prev => ({
      ...prev,
      [today]: {
        completed: (prev[today]?.completed || 0) + 1,
        traits: [...(prev[today]?.traits || []), category]
      }
    }));

    // Adjust difficulty level based on performance
    const todayChallenges = activeChallenges.filter(c => c.date === today);
    const todayCompleted = todayChallenges.filter(c => c.status === 'completed').length + 1;
    
    if (todayCompleted === DAILY_CHALLENGE_LIMIT && streak.current >= 7) {
      setDifficultyLevel(prev => Math.min(prev + 0.1, 5));
    }

    return { 
      success: true, 
      traitImproved: category,
      newLevel: traits[category]?.level || 0
    };
  };

  // Skip a challenge
  const skipChallenge = (challengeId) => {
    const today = getTodayString();
    
    // Check skip limit
    if (skipCount.date === today && skipCount.count >= MAX_SKIPS_PER_DAY) {
      return { success: false, message: `Maximum ${MAX_SKIPS_PER_DAY} skips per day` };
    }

    const challenge = activeChallenges.find(c => c.id === challengeId && c.date === today);
    if (!challenge) return { success: false, message: 'Challenge not found' };

    // Update active challenges
    setActiveChallenges(prev => prev.map(c => 
      c.id === challengeId && c.date === today 
        ? { ...c, status: 'skipped', skippedTime: Date.now() }
        : c
    ));

    // Add to skipped history
    setSkippedChallenges(prev => [...prev, { 
      id: challengeId, 
      timestamp: Date.now(),
      date: today 
    }]);

    // Update skip count
    setSkipCount({
      date: today,
      count: skipCount.date === today ? skipCount.count + 1 : 1
    });

    return { success: true, skipsRemaining: MAX_SKIPS_PER_DAY - (skipCount.date === today ? skipCount.count + 1 : 1) };
  };

  // Fail a challenge (no punishment)
  const failChallenge = (challengeId, note = null) => {
    const today = getTodayString();
    
    setActiveChallenges(prev => prev.map(c => 
      c.id === challengeId && c.date === today 
        ? { ...c, status: 'failed', failedTime: Date.now(), note }
        : c
    ));

    return { success: true, message: 'No worries - this challenge may appear again later' };
  };

  // Get today's challenges
  const getTodayChallenges = () => {
    const today = getTodayString();
    return activeChallenges.filter(c => c.date === today);
  };

  // Get daily summary
  const getDailySummary = (date = null) => {
    const targetDate = date || getTodayString();
    const dayChallenges = activeChallenges.filter(c => c.date === targetDate);
    const completed = dayChallenges.filter(c => c.status === 'completed');
    
    const traitsImproved = [...new Set(completed.map(c => c.category).filter(Boolean))];
    
    return {
      total: dayChallenges.length,
      completed: completed.length,
      skipped: dayChallenges.filter(c => c.status === 'skipped').length,
      failed: dayChallenges.filter(c => c.status === 'failed').length,
      traitsImproved,
      streak: streak.current,
      date: targetDate
    };
  };

  // Get skip count for today
  const getSkipsRemaining = () => {
    const today = getTodayString();
    if (skipCount.date !== today) return MAX_SKIPS_PER_DAY;
    return MAX_SKIPS_PER_DAY - skipCount.count;
  };

  return {
    challenges,
    activeChallenges: getTodayChallenges(),
    traits,
    streak,
    difficultyLevel,
    generateDailyChallenges,
    completeChallenge,
    skipChallenge,
    failChallenge,
    getDailySummary,
    getSkipsRemaining,
    DAILY_CHALLENGE_LIMIT,
    MAX_SKIPS_PER_DAY
  };
};
