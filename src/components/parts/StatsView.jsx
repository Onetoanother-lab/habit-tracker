import { TrendingUp, Flame, Target } from 'lucide-react';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function StatsView({ habits, isDark }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mb-8">Your Progress</h2>

      {habits.length === 0 ? (
        <div className={`text-center py-20 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          <TrendingUp size={64} className="mx-auto mb-4 opacity-40" />
          <p className="text-xl font-bold">Start tracking habits to see amazing stats!</p>
        </div>
      ) : (
        habits.map((habit) => {
          const streak = getStreak(habit);
          const days = Object.keys(habit.completions).length;
          const rate = getCompletionRate(habit);
          
          return (
            <div key={habit.id} className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.01] ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white shadow-xl border-gray-100'
            }`}>
              <h3 className="text-2xl font-bold mb-6">{habit.name}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-xl transform transition-transform hover:scale-105">
                  <Flame size={32} className="mx-auto mb-2" />
                  <div className="text-4xl font-black mb-1">{streak}</div>
                  <div className="text-sm opacity-90 font-semibold">Day Streak</div>
                </div>
                
                <div className="text-center p-6 bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-xl transform transition-transform hover:scale-105">
                  <Target size={32} className="mx-auto mb-2" />
                  <div className="text-4xl font-black mb-1">{days}</div>
                  <div className="text-sm opacity-90 font-semibold">Total Days</div>
                </div>
                
                <div className="text-center p-6 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-xl transform transition-transform hover:scale-105">
                  <TrendingUp size={32} className="mx-auto mb-2" />
                  <div className="text-4xl font-black mb-1">{rate}%</div>
                  <div className="text-sm opacity-90 font-semibold">Success Rate</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
