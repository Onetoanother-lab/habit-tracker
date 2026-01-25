// src/components/hooks/useFocusTimer.js
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useFocusTimer = () => {
  const [timerSettings, setTimerSettings] = useLocalStorage('timer-settings', {
    focusDuration: 25, // minutes
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  });

  const [timerState, setTimerState] = useLocalStorage('timer-state', {
    currentSession: 0,
    totalSessions: 0,
    totalFocusTime: 0 // minutes
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration * 60);
  const [timerType, setTimerType] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const playSound = () => {
    if (!timerSettings.soundEnabled) return;
    
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    const duration = timerType === 'focus' 
      ? timerSettings.focusDuration 
      : timerType === 'shortBreak'
        ? timerSettings.shortBreak
        : timerSettings.longBreak;
    setTimeLeft(duration * 60);
  };

  const skipToBreak = () => {
    const isLongBreak = (timerState.currentSession + 1) % timerSettings.sessionsUntilLongBreak === 0;
    const newType = isLongBreak ? 'longBreak' : 'shortBreak';
    const duration = isLongBreak ? timerSettings.longBreak : timerSettings.shortBreak;
    
    setTimerType(newType);
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  const skipToFocus = () => {
    setTimerType('focus');
    setTimeLeft(timerSettings.focusDuration * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            playSound();
            
            if (timerType === 'focus') {
              // Focus session completed
              const newCurrentSession = timerState.currentSession + 1;
              const newTotalSessions = timerState.totalSessions + 1;
              const newTotalFocusTime = timerState.totalFocusTime + timerSettings.focusDuration;
              
              setTimerState({
                currentSession: newCurrentSession,
                totalSessions: newTotalSessions,
                totalFocusTime: newTotalFocusTime
              });

              // Determine next timer type
              const isLongBreak = newCurrentSession % timerSettings.sessionsUntilLongBreak === 0;
              const nextType = isLongBreak ? 'longBreak' : 'shortBreak';
              const nextDuration = isLongBreak ? timerSettings.longBreak : timerSettings.shortBreak;
              
              setTimerType(nextType);
              setIsRunning(timerSettings.autoStartBreaks);
              return nextDuration * 60;
            } else {
              // Break completed
              setTimerType('focus');
              setIsRunning(timerSettings.autoStartPomodoros);
              return timerSettings.focusDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timerType, timerSettings, timerState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = timerType === 'focus'
      ? timerSettings.focusDuration * 60
      : timerType === 'shortBreak'
        ? timerSettings.shortBreak * 60
        : timerSettings.longBreak * 60;
    
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return {
    timerSettings,
    setTimerSettings,
    timerState,
    isRunning,
    isPaused,
    timeLeft,
    timerType,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    skipToFocus,
    formatTime,
    getProgress
  };
};