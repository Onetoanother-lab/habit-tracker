import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useXPAndLevel } from '../hooks/useXPAndLevel';
import { useTheme } from '../ui/ThemeProvider';
import { getDateString } from '../utils/habitStats';
import { Plus, Sparkles } from 'lucide-react';
import Header from './Header';
import ViewSwitcher from './ViewSwitcher';
import AddHabitForm from './AddHabitForm';
import HabitItem from './HabitItem';
import DailyTasksList from './DailyTasksList';
import StatsView from './StatsView';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabit } = useHabits(); 
  const { xp, level, addXP } = useXPAndLevel();
  const [selectedView, setSelectedView] = useState('today');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [particles, setParticles] = useState([]);
  const { theme, isDark } = useTheme();
  const today = getDateString();

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [level]);

  return (
    <div className={`min-h-screen bg-linear-to-br ${theme.bg} ${isDark ? 'text-white' : 'text-gray-900'} transition-all duration-1000 relative overflow-hidden custom-cursor`}>
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main blobs */}
        <div className={`absolute top-20 left-10 w-96 h-96 bg-linear-to-r ${theme.accent} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 bg-linear-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-8 left-20 w-96 h-96 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000`}></div>
        
        {/* Additional floating blobs */}
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 bg-linear-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float animation-delay-3000`}></div>
        
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute w-${Math.floor(particle.size)} h-${Math.floor(particle.size)} ${theme.particle} rounded-full opacity-30 animate-float-particle`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}

        {/* Grid overlay */}
        <div className={`absolute inset-0 bg-grid-pattern opacity-5`}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <Header level={level} xp={xp} theme={theme} isDark={isDark} />
        <ViewSwitcher selectedView={selectedView} onChange={setSelectedView} theme={theme} isDark={isDark} />

        {selectedView === 'today' && (
          <div className="space-y-6">
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
                className={`w-full p-6 rounded-2xl border-2 border-dashed text-center transition-all duration-500 hover:scale-[1.02] group cursor-pointer ${
                  isDark 
                    ? 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20' 
                    : 'border-purple-200 hover:border-purple-400 bg-linear-to-br from-purple-50 to-pink-50 hover:shadow-2xl hover:shadow-purple-500/20'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Plus className="transition-transform group-hover:rotate-90 duration-500" size={24} />
                  <span className="font-bold text-lg">
                    Add New Habit <span className="text-yellow-400 animate-pulse">+10 XP</span>
                  </span>
                </div>
              </button>
            )}

            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className={`text-center py-20 px-6 rounded-3xl animate-fade-in ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200'
                }`}>
                  <Sparkles size={64} className="mx-auto mb-4 text-purple-400 animate-bounce-slow" />
                  <p className="text-xl font-bold mb-2">Your journey begins here</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    Create your first habit and start building greatness 🌱
                  </p>
                </div>
              ) : (
                habits.map((habit, index) => (
                  <div key={habit.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <HabitItem
                      habit={habit}
                      today={today}
                      onToggle={toggleHabit}
                      onDelete={deleteHabit}
                      theme={theme}
                      isDark={isDark}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedView === 'tasks' && <DailyTasksList theme={theme} isDark={isDark} addXP={addXP} />}
        {selectedView === 'stats' && <StatsView habits={habits} isDark={isDark} />}
      </div>

      <style>{`
        /* Custom cursor */
        .custom-cursor * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2"><circle cx="12" cy="12" r="10" fill="%23a855f7" fill-opacity="0.1"/><circle cx="12" cy="12" r="3" fill="%23a855f7"/></svg>'), auto !important;
        }
        
        .custom-cursor button,
        .custom-cursor input,
        .custom-cursor a {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ec4899" stroke-width="2"><circle cx="12" cy="12" r="10" fill="%23ec4899" fill-opacity="0.2"/><circle cx="12" cy="12" r="4" fill="%23ec4899"/></svg>'), pointer !important;
        }

        /* Animations */
        @keyframes linear {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes linear-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-linear-text {
          background-size: 200% 200%;
          animation: linear-text 3s ease infinite;
        }
        
        @keyframes linear-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-linear-slow {
          background-size: 200% 200%;
          animation: linear-slow 8s ease infinite;
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(40px, -60px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 30px) scale(0.9) rotate(240deg); }
        }
        
        .animate-blob {
          animation: blob 8s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, -50px) scale(1.5); opacity: 0.6; }
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
          25%, 75% { opacity: 0.9; }
        }
        
        .animate-flicker {
          animation: flicker 2s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Grid pattern */
        .bg-grid-pattern {
          background-image: 
            linear-linear(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-linear(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

