// src/components/hooks/useXPAndLevel.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useXPAndLevel = () => {
  const [xp, setXp] = useLocalStorage('xp-data', 0);
  const [level, setLevel] = useLocalStorage('level-data', 1);

  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [xp, level, setLevel]);

  const addXP = (amount) => {
    setXp((prev) => prev + amount);
  };

  return { xp, level, addXP };
};