import { TrendingUp, Flame, Target, Award } from 'lucide-react';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function StatsView({ habits, isDark }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mb-8 bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Your Progress & Achievements</h2>

      {habits.length === 0 ? (
        <div className={`text-center py-20 animate-fade-in ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          <TrendingUp size={64} className="mx-auto mb-4 opacity-40 animate-bounce-slow" />
          <p className="text-xl font-bold mb-2">No Statistics Yet</p>
          <p className="text-sm">Start tracking habits to see your progress and achievements</p>
        </div>
      ) : (
        habits.map((habit, index) => {
          const streak = getStreak(habit);
          const days = Object.keys(habit.completions).length;
          const rate = getCompletionRate(habit);
          
          return (
            <div key={habit.id} className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] cursor-default animate-fade-in ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white shadow-2xl border-gray-100'
            }`} style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{habit.name}</h3>
                <Award className="text-yellow-400 animate-pulse" size={28} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative text-center p-6 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-2 cursor-pointer group overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Flame size={32} className="mx-auto mb-2 animate-flicker relative z-10" />
                  <div className="text-4xl font-black mb-1 relative z-10">{streak}</div>
                  <div className="text-sm opacity-90 font-semibold relative z-10">Day Streak</div>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
                
                <div className="relative text-center p-6 bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-2 cursor-pointer group overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Target size={32} className="mx-auto mb-2 relative z-10" />
                  <div className="text-4xl font-black mb-1 relative z-10">{days}</div>
                  <div className="text-sm opacity-90 font-semibold relative z-10">Total Days</div>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
                </div>
                
                <div className="relative text-center p-6 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-2 cursor-pointer group overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <TrendingUp size={32} className="mx-auto mb-2 relative z-10" />
                  <div className="text-4xl font-black mb-1 relative z-10">{rate}%</div>
                  <div className="text-sm opacity-90 font-semibold relative z-10">Success Rate</div>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}