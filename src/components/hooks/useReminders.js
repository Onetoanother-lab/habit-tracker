// src/components/hooks/useReminders.js
import { useLocalStorage } from './useLocalStorage';
import { useState, useEffect } from 'react';

export const useReminders = () => {
  const [reminders, setReminders] = useLocalStorage('habit-reminders', {});
  const [activeReminders, setActiveReminders] = useState([]);

  const createReminder = (habitId, habitName, time, days = [0,1,2,3,4,5,6]) => {
    const reminderId = `${habitId}-${time}`;
    
    const newReminder = {
      id: reminderId,
      habitId,
      habitName,
      time, // "09:00" format
      days, // [0,1,2,3,4,5,6] for Sun-Sat
      enabled: true,
      createdAt: Date.now()
    };

    setReminders(prev => ({
      ...prev,
      [reminderId]: newReminder
    }));

    return reminderId;
  };

  const toggleReminder = (reminderId) => {
    setReminders(prev => {
      if (!prev[reminderId]) return prev;
      return {
        ...prev,
        [reminderId]: {
          ...prev[reminderId],
          enabled: !prev[reminderId].enabled
        }
      };
    });
  };

  const updateReminder = (reminderId, updates) => {
    setReminders(prev => {
      if (!prev[reminderId]) return prev;
      return {
        ...prev,
        [reminderId]: {
          ...prev[reminderId],
          ...updates
        }
      };
    });
  };

  const deleteReminder = (reminderId) => {
    setReminders(prev => {
      const updated = { ...prev };
      delete updated[reminderId];
      return updated;
    });
  };

  const getRemindersForHabit = (habitId) => {
    return Object.values(reminders)
      .filter(r => r.habitId === habitId)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const checkReminders = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay();

    const due = Object.values(reminders).filter(r => 
      r.enabled &&
      r.time === currentTime &&
      r.days.includes(currentDay)
    );

    setActiveReminders(due);
    return due;
  };

  const dismissReminder = (reminderId) => {
    setActiveReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  // Check reminders every minute
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  return {
    reminders: Object.values(reminders),
    activeReminders,
    createReminder,
    toggleReminder,
    updateReminder,
    deleteReminder,
    getRemindersForHabit,
    dismissReminder
  };
};