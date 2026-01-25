// src/components/features/RecoveryMode.jsx
import { useState } from 'react';
import { RefreshCw, Shield, Clock, Palmtree, Heart, AlertCircle, Check } from 'lucide-react';
import { useRecoveryMode } from '../hooks/useRecoveryMode';

export default function RecoveryMode({ habits, isDark }) {
  const [activeTab, setActiveTab] = useState('savers');
  const [vacationDates, setVacationDates] = useState({
    startDate: '',
    endDate: '',
    pauseAll: true,
    selectedHabits: []
  });

  const {
    streakSavers,
    vacationMode,
    gracePeriod,
    useStreakSaver,
    activateVacationMode,
    deactivateVacationMode,
    toggleGracePeriod,
    updateGracePeriod,
    getRecoverySuggestions,
    getRecoveryStats
  } = useRecoveryMode();

  const stats = getRecoveryStats();

  const handleActivateVacation = () => {
    if (!vacationDates.startDate || !vacationDates.endDate) {
      alert('Please select start and end dates');
      return;
    }

    const habitIds = vacationDates.pauseAll 
      ? [] 
      : vacationDates.selectedHabits;

    const result = activateVacationMode(
      vacationDates.startDate,
      vacationDates.endDate,
      habitIds
    );

    if (result.success) {
      alert(`Vacation mode activated for ${result.days} days!`);
      setVacationDates({
        startDate: '',
        endDate: '',
        pauseAll: true,
        selectedHabits: []
      });
    } else {
      alert(result.reason);
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-500">
          <RefreshCw className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Recovery Mode</h2>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Protect and recover your progress
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-6 ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-2xl font-black text-green-500">
            {stats.streakSavers.available}
          </div>
          <div className="text-xs text-gray-500">Savers Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-blue-500">
            {stats.streakSavers.used}
          </div>
          <div className="text-xs text-gray-500">Savers Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-purple-500">
            {stats.gracePeriod.hours}h
          </div>
          <div className="text-xs text-gray-500">Grace Period</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-6 p-1 rounded-xl ${
        isDark ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setActiveTab('savers')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'savers'
              ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white'
              : 'hover:bg-white/10'
          }`}
        >
          <Shield className="inline mr-2" size={16} />
          Streak Savers
        </button>
        <button
          onClick={() => setActiveTab('vacation')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'vacation'
              ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white'
              : 'hover:bg-white/10'
          }`}
        >
          <Palmtree className="inline mr-2" size={16} />
          Vacation Mode
        </button>
        <button
          onClick={() => setActiveTab('grace')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'grace'
              ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
              : 'hover:bg-white/10'
          }`}
        >
          <Clock className="inline mr-2" size={16} />
          Grace Period
        </button>
      </div>

      {/* Content */}
      {activeTab === 'savers' && (
        <div className="space-y-4">
          {/* Info Card */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              <Shield className="text-green-500 shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-green-700 dark:text-green-400">
                  What are Streak Savers?
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Streak Savers let you freeze your streak for one day without breaking it. 
                  Use them wisely when life gets in the way!
                </p>
              </div>
            </div>
          </div>

          {/* Available Savers */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Available Streak Savers</h4>
              <div className="text-3xl font-black text-green-500">
                {stats.streakSavers.available}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-xl flex items-center justify-center ${
                    i < stats.streakSavers.available
                      ? 'bg-linear-to-br from-green-500 to-emerald-500'
                      : isDark
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                  }`}
                >
                  <Shield
                    size={32}
                    className={i < stats.streakSavers.available ? 'text-white' : 'text-gray-400'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn More */}
          <div>
            <h4 className="font-semibold mb-3">Earn More Streak Savers</h4>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">30</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">30-Day Streak Milestone</div>
                  <div className="text-xs text-gray-500">Earn 1 streak saver</div>
                </div>
              </div>

              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">90</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">90-Day Streak Milestone</div>
                  <div className="text-xs text-gray-500">Earn 2 streak savers</div>
                </div>
              </div>

              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">365</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">365-Day Streak Milestone</div>
                  <div className="text-xs text-gray-500">Earn 5 streak savers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage History */}
          {streakSavers.used.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Recent Usage</h4>
              <div className="space-y-2">
                {streakSavers.used.slice(-5).reverse().map(saver => (
                  <div
                    key={saver.id}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">
                      Used on {new Date(saver.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(saver.usedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vacation' && (
        <div className="space-y-4">
          {/* Active Vacation Mode */}
          {vacationMode.isActive ? (
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3 mb-4">
                <Palmtree className="text-blue-500" size={24} />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">
                    Vacation Mode Active
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                    Your selected habits are paused. Streaks won't break during this period.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Start:</strong> {new Date(vacationMode.startDate).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>End:</strong> {new Date(vacationMode.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {stats.vacationMode.daysRemaining} days remaining
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={deactivateVacationMode}
                className="w-full py-2 rounded-lg bg-linear-to-r from-red-500 to-rose-500 text-white font-semibold hover:scale-105 transition-all"
              >
                Deactivate Vacation Mode
              </button>
            </div>
          ) : (
            <>
              {/* Info */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Palmtree className="text-blue-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">
                      Vacation Mode
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Pause habits for up to 14 days without breaking streaks. Perfect for trips, 
                      recovery periods, or planned breaks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Setup Form */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h4 className="font-semibold mb-3">Set Up Vacation</h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date</label>
                      <input
                        type="date"
                        value={vacationDates.startDate}
                        onChange={(e) => setVacationDates({ ...vacationDates, startDate: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date</label>
                      <input
                        type="date"
                        value={vacationDates.endDate}
                        onChange={(e) => setVacationDates({ ...vacationDates, endDate: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={vacationDates.pauseAll}
                      onChange={(e) => setVacationDates({ ...vacationDates, pauseAll: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-semibold">Pause all habits</span>
                  </label>

                  {!vacationDates.pauseAll && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Select habits to pause
                      </label>
                      <div className={`max-h-40 overflow-y-auto p-3 rounded-lg ${
                        isDark ? 'bg-white/5' : 'bg-white'
                      }`}>
                        {habits.map(habit => (
                          <label key={habit.id} className="flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              checked={vacationDates.selectedHabits.includes(habit.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setVacationDates({
                                    ...vacationDates,
                                    selectedHabits: [...vacationDates.selectedHabits, habit.id]
                                  });
                                } else {
                                  setVacationDates({
                                    ...vacationDates,
                                    selectedHabits: vacationDates.selectedHabits.filter(id => id !== habit.id)
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{habit.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleActivateVacation}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:scale-105 transition-all"
                  >
                    Activate Vacation Mode
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'grace' && (
        <div className="space-y-4">
          {/* Info */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start gap-3">
              <Clock className="text-purple-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold mb-1 text-purple-700 dark:text-purple-400">
                  Grace Period
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  Complete yesterday's habits within the grace period without breaking your streak.
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Grace Period Status</h4>
                <p className="text-sm text-gray-500">
                  {gracePeriod.enabled ? 'Active' : 'Disabled'} • {gracePeriod.hours} hours
                </p>
              </div>
              <button
                onClick={toggleGracePeriod}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  gracePeriod.enabled
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                    : isDark
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {gracePeriod.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Grace Period Duration: {gracePeriod.hours} hours
              </label>
              <input
                type="range"
                min="0"
                max="48"
                step="6"
                value={gracePeriod.hours}
                onChange={(e) => updateGracePeriod(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0h</span>
                <span>12h</span>
                <span>24h</span>
                <span>36h</span>
                <span>48h</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold mb-1 text-yellow-700 dark:text-yellow-400">
                  Recommended Settings
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">
                  We recommend a 24-hour grace period for most users. This gives you flexibility 
                  while maintaining accountability.
                </p>
                <button
                  onClick={() => updateGracePeriod(24)}
                  className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 hover:underline"
                >
                  Set to 24 hours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}