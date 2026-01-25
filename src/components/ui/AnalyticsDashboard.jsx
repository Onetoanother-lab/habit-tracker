import { TrendingUp, Calendar, Flame, Award } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export default function AnalyticsDashboard({ habits, isDark }) {
  const { 
    getCompletionTrend, 
    getBestPerformingDay, 
    getHabitPerformance,
    getMonthlyStats,
    getOverallStats 
  } = useAnalytics(habits);

  const trend = getCompletionTrend(30);
  const dayStats = getBestPerformingDay();
  const performance = getHabitPerformance();
  const monthlyStats = getMonthlyStats();
  const overallStats = getOverallStats();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Analytics Dashboard
      </h2>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Award className="text-purple-500" />}
          label="Total Habits"
          value={overallStats.totalHabits}
          isDark={isDark}
        />
        <StatCard
          icon={<TrendingUp className="text-green-500" />}
          label="Total Completions"
          value={overallStats.totalCompletions}
          isDark={isDark}
        />
        <StatCard
          icon={<Flame className="text-orange-500" />}
          label="Longest Streak"
          value={`${overallStats.longestStreak} days`}
          isDark={isDark}
        />
        <StatCard
          icon={<Calendar className="text-blue-500" />}
          label="Active Days"
          value={overallStats.activeDays}
          isDark={isDark}
        />
      </div>

      {/* 30-Day Trend */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          30-Day Completion Trend
        </h3>
        <div className="flex items-end gap-1 h-40">
          {trend.map((day, index) => (
            <div
              key={index}
              className="flex-1 relative group cursor-pointer"
              title={`${day.date}: ${day.completed}/${day.total}`}
            >
              <div
                className={`w-full bg-linear-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:from-purple-600 hover:to-pink-600 ${
                  day.percentage === 0 ? 'opacity-20' : ''
                }`}
                style={{ height: `${day.percentage}%` }}
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {day.percentage}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{trend[0]?.date}</span>
          <span>{trend[trend.length - 1]?.date}</span>
        </div>
      </div>

      {/* Best Performing Days */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <h3 className="text-xl font-bold mb-4">Best Performing Days</h3>
        <div className="space-y-2">
          {dayStats.slice(0, 3).map((stat, index) => (
            <div
              key={stat.day}
              className={`flex items-center justify-between p-3 rounded-xl ${
                index === 0 ? 'bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {index === 0 && <Award className="text-yellow-500" size={20} />}
                <span className="font-semibold">{stat.dayName}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{stat.completions} completions</div>
                <div className="text-xs opacity-60">
                  {Math.round(stat.average * 100)}% avg
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Performance Ranking */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <h3 className="text-xl font-bold mb-4">Habit Performance Ranking</h3>
        <div className="space-y-3">
          {performance.slice(0, 5).map((habit, index) => (
            <div
              key={habit.id}
              className={`p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-semibold">{habit.name}</span>
                </div>
                <span className="text-lg font-bold text-green-500">
                  {habit.completionRate}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`text-center p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                  <div className="font-bold">{habit.currentStreak}</div>
                  <div className="opacity-60">Current Streak</div>
                </div>
                <div className={`text-center p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                  <div className="font-bold">{habit.longestStreak}</div>
                  <div className="opacity-60">Best Streak</div>
                </div>
                <div className={`text-center p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                  <div className="font-bold">{habit.totalCompletions}</div>
                  <div className="opacity-60">Total Days</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Overview */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <h3 className="text-xl font-bold mb-4">6-Month Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {monthlyStats.map(month => (
            <div
              key={month.month}
              className={`p-4 rounded-xl text-center ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="text-sm opacity-60 mb-1">{month.monthName}</div>
              <div className="text-2xl font-black text-purple-500">
                {month.completions}
              </div>
              <div className="text-xs opacity-60">completions</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, isDark }) {
  return (
    <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 cursor-pointer ${
      isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-md border border-gray-100'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          {label}
        </span>
      </div>
      <div className="text-2xl font-black">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}