// src/components/features/FocusTimerWidget.jsx
import { useState } from 'react';
import { Timer, Play, Pause, RotateCcw, SkipForward, Settings, X, Coffee, Brain } from 'lucide-react';
import { useFocusTimer } from '../hooks/useFocusTimer';

export default function FocusTimerWidget({ isDark, onClose }) {
  const [showSettings, setShowSettings] = useState(false);
  const {
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
  } = useFocusTimer();

  const [settingsForm, setSettingsForm] = useState(timerSettings);

  const saveSettings = () => {
    setTimerSettings(settingsForm);
    setShowSettings(false);
    resetTimer();
  };

  const progress = getProgress();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getTimerColor = () => {
    switch(timerType) {
      case 'focus': return 'text-purple-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getTimerBg = () => {
    switch(timerType) {
      case 'focus': return 'from-purple-500/20 to-pink-500/20';
      case 'shortBreak': return 'from-green-500/20 to-emerald-500/20';
      case 'longBreak': return 'from-blue-500/20 to-cyan-500/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <div className={`rounded-3xl overflow-hidden ${
      isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-2xl'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Timer className={getTimerColor()} size={20} />
          <span className="font-bold">Focus Timer</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-lg mb-4">Timer Settings</h3>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Focus Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settingsForm.focusDuration}
              onChange={(e) => setSettingsForm({
                ...settingsForm,
                focusDuration: parseInt(e.target.value) || 25
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settingsForm.shortBreak}
              onChange={(e) => setSettingsForm({
                ...settingsForm,
                shortBreak: parseInt(e.target.value) || 5
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settingsForm.longBreak}
              onChange={(e) => setSettingsForm({
                ...settingsForm,
                longBreak: parseInt(e.target.value) || 15
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Sessions Until Long Break</label>
            <input
              type="number"
              min="2"
              max="10"
              value={settingsForm.sessionsUntilLongBreak}
              onChange={(e) => setSettingsForm({
                ...settingsForm,
                sessionsUntilLongBreak: parseInt(e.target.value) || 4
              })}
              className={`w-full px-4 py-2 rounded-lg ${
                isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsForm.autoStartBreaks}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  autoStartBreaks: e.target.checked
                })}
                className="rounded"
              />
              <span className="text-sm">Auto-start breaks</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsForm.autoStartPomodoros}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  autoStartPomodoros: e.target.checked
                })}
                className="rounded"
              />
              <span className="text-sm">Auto-start pomodoros</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsForm.soundEnabled}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  soundEnabled: e.target.checked
                })}
                className="rounded"
              />
              <span className="text-sm">Sound notifications</span>
            </label>
          </div>

          <button
            onClick={saveSettings}
            className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all"
          >
            Save Settings
          </button>
        </div>
      ) : (
        <div className="p-8">
          {/* Timer Display */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={getTimerColor()}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-black mb-2 ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                {timerType === 'focus' ? (
                  <>
                    <Brain size={16} />
                    Focus Time
                  </>
                ) : (
                  <>
                    <Coffee size={16} />
                    {timerType === 'shortBreak' ? 'Short' : 'Long'} Break
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:scale-110 transition-all"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`p-4 rounded-xl bg-linear-to-r ${getTimerBg()} hover:scale-110 transition-all shadow-lg`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={timerType === 'focus' ? skipToBreak : skipToFocus}
              className="p-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:scale-110 transition-all"
              title="Skip"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-4 p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <div className="text-2xl font-black text-purple-500">
                {timerState.currentSession % timerSettings.sessionsUntilLongBreak}
              </div>
              <div className="text-xs text-gray-500">Current Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-500">
                {timerState.totalSessions}
              </div>
              <div className="text-xs text-gray-500">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-500">
                {Math.floor(timerState.totalFocusTime / 60)}h
              </div>
              <div className="text-xs text-gray-500">Focus Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}