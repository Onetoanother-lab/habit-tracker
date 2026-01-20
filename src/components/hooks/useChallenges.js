import { useState, useEffect } from 'react';
import challengesData from '../../data/challenges.json';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const raw = challengesData;
      let list = [];

      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && Array.isArray(raw.challenges)) {
        list = raw.challenges;
      } else if (raw && typeof raw === 'object') {
        const possibleArray = Object.values(raw).find(Array.isArray);
        if (possibleArray) list = possibleArray;
      }

      setChallenges(list);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load challenges');
      console.error('Error loading challenges:', err);
      setLoading(false);
    }
  }, []);

  const getXPForChallenge = (challenge) => {
    if (!challenge || !challenge.difficulty) return 0;

    const baseXP = {
      easy: 15,
      medium: 30,
      hard: 50,
    };

    const base = baseXP[challenge.difficulty] ?? 20;
    const timeBonus = Math.min(Math.floor((challenge.estimatedMinutes || 0) / 10) * 5, 25);

    return base + timeBonus;
  };

  // Helper to pick N random items from an array
  const pickRandom = (arr, count) => {
    if (!Array.isArray(arr) || arr.length === 0 || count <= 0) return [];
    const copy = [...arr];
    // Fisher-Yates shuffle (better than sort(random))
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  };

  const getDailyMix = () => {
    if (challenges.length === 0) return [];

    const now = new Date();
    const dayName = now.toLocaleString('en-US', { weekday: 'long' }); // Monday, Tuesday, ...

    const easy   = challenges.filter(c => c.difficulty === 'easy');
    const medium = challenges.filter(c => c.difficulty === 'medium');
    const hard   = challenges.filter(c => c.difficulty === 'hard');

    let selected = [];

    if (['Monday', 'Wednesday', 'Friday'].includes(dayName)) {
      // 2 medium + 1 easy
      selected = [
        ...pickRandom(medium, 2),
        ...pickRandom(easy, 1),
      ];
    } else if (dayName === 'Sunday') {
      // 3 hard
      selected = pickRandom(hard, 3);
    } else {
      // Tuesday, Thursday, Saturday → 2 medium + 1 hard
      selected = [
        ...pickRandom(medium, 2),
        ...pickRandom(hard, 1),
      ];
    }

    // Final shuffle so the order isn't always grouped by difficulty
    return pickRandom(selected, selected.length);
  };

  const getRandomChallenges = (count = 5) => {
    return pickRandom(challenges, count);
  };

  const getChallengesByCategory = (category) => {
    if (!category) return [];
    return challenges.filter(c => c.category === category);
  };

  const getChallengesByDifficulty = (difficulty) => {
    if (!difficulty) return [];
    return challenges.filter(c => c.difficulty === difficulty);
  };

  return {
    challenges,
    loading,
    error,
    getRandomChallenges,
    getChallengesByCategory,
    getChallengesByDifficulty,
    getDailyMix,
    getXPForChallenge,
  };
};