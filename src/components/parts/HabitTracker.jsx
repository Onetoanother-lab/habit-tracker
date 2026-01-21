// src/components/parts/HabitTracker.jsx
import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useXPAndLevel } from '../hooks/useXPAndLevel';
import { useTheme } from '../ui/ThemeProvider';
import { getDateString } from '../utils/habitStats';
import Header from './Header';
import ViewSwitcher from './ViewSwitcher';
import AddHabitForm from './AddHabitForm';
import HabitItem from './HabitItem';
import DailyTasksList from './DailyTasksList';
import StatsView from './StatsView';
import { Plus } from 'lucide-react';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabit } = useHabits(); 
  const { xp, level, addXP } = useXPAndLevel();
  const [selectedView, setSelectedView] = useState('today');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const { theme, isDark } = useTheme();
  const today = getDateString();

  console.log("Rendering HabitTracker with habits:", habits);
  console.log("Habits count:", habits.length);
  console.log("First habit if exists:", habits[0]);

  useEffect(() => {
    console.log('Habits changed →', habits);
  }, [habits]);

  return (
    <div className={`min-h-screen bg-linear-to-br ${theme.bg} text-${isDark ? 'white' : 'gray-900'} transition-colors duration-1000`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Header level={level} xp={xp} theme={theme} />

        <ViewSwitcher selectedView={selectedView} onChange={setSelectedView} theme={theme} isDark={isDark} />

        {selectedView === 'today' && (
          <div className="space-y-10">
            {showAddHabit ? (
              <AddHabitForm 
                onClose={() => setShowAddHabit(false)} 
                theme={theme} 
                isDark={isDark} 
                addXP={addXP}
                addHabit={addHabit}                
              />
            ) : (
              <button
                onClick={() => setShowAddHabit(true)}
                className={`w-full p-5 rounded-2xl border-2 border-dashed text-center transition-all hover:scale-[1.01] ${
                  isDark 
                    ? 'border-white/30 hover:border-white/50 text-white/70 hover:text-white' 
                    : 'border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Plus className="inline mr-2" size={20} /> 
                Add New Habit (+10 XP)
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

        {selectedView === 'stats' && (
  <StatsView habits={habits} isDark={isDark} />
)}
      </div>
    </div>
  );
}