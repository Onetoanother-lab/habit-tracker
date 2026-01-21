// src/components/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error(`Error reading ${key}:`, err);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const saveValue = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
    }
  };

  // This is the setter that supports updater functions
  const setValue = (newValue) => {
    setStoredValue((prev) => {
      const next =
        typeof newValue === 'function'
          ? newValue(prev)                          // execute the updater
          : newValue;

      console.log(`useLocalStorage next value for ${key}:`, next);
      saveValue(next);                              // save the computed value
      return next;
    });
  };

  // Optional: listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}