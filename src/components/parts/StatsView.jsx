// src/components/parts/StatsView.jsx
import HabitStatsCard from './HabitStatsCard';

export default function StatsView({ habits, isDark }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Statistics</h2>

      {habits.length === 0 ? (
        <div className={`text-center py-16 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          Start tracking habits to see your progress statistics!
        </div>
      ) : (
        habits.map((habit) => (
          <HabitStatsCard key={habit.id} habit={habit} isDark={isDark} />
        ))
      )}
    </div>
  );
}