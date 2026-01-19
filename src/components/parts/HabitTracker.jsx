// src/components/HabitTracker.jsx
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, TrendingUp, Sparkles, MessageSquare, Award, Zap, Star, Wand2 } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useXPAndLevel } from '../hooks/useXPAndLevel';
import { useTheme } from '../ui/ThemeProvider';
import { getDateString } from '../utils/habitStats';
import Header from '../parts/Header';
import ViewSwitcher from '../parts/ViewSwitcher';
import AddHabitForm from '../parts/AddHabitForm';
import HabitItem from '../parts/HabitItem';
import DailyTasksList from '../parts/DailyTasksList';
import StatsView from '../parts/StatsView';
import AICoachSection from '../parts/AICoachSection';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabit } = useHabits();
  const { xp, level, addXP } = useXPAndLevel();
  const [selectedView, setSelectedView] = useState('today');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const { theme, isDark } = useTheme();
  const today = getDateString();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-${isDark ? 'white' : 'gray-900'} transition-colors duration-1000`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Header level={level} xp={xp} theme={theme} />

        <ViewSwitcher selectedView={selectedView} onChange={setSelectedView} theme={theme} isDark={isDark} />

        {selectedView === 'today' && (
          <div className="space-y-10">
            {showAddHabit ? (
              <AddHabitForm onClose={() => setShowAddHabit(false)} theme={theme} isDark={isDark} addXP={addXP} />
            ) : (
              <button
                onClick={() => setShowAddHabit(true)}
                className={`w-full p-5 rounded-2xl border-2 border-dashed text-center transition-all hover:scale-[1.01] ${
                  isDark 
                    ? 'border-white/30 hover:border-white/50 text-white/70 hover:text-white' 
                    : 'border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Plus className="inline mr-2" /> Add New Habit (+10 XP)
              </button>
            )}

            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className={`text-center py-12 opacity-70 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  No habits yet — start your journey today! 🌱
                </div>
              ) : (
                habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    today={today}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                    theme={theme}
                    isDark={isDark}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {selectedView === 'tasks' && <DailyTasksList theme={theme} isDark={isDark} addXP={addXP} />}

        {selectedView === 'stats' && <StatsView isDark={isDark} />}

        {selectedView === 'ai' && <AICoachSection theme={theme} isDark={isDark} level={level} xp={xp} />}
      </div>
    </div>
  );
}