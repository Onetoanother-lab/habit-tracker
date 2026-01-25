import { useState } from 'react';
import { Wand2, RefreshCw, Sparkles, Shield } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useChallenges } from '../hooks/useChallenges';
import TaskItem from './TaskItem';

export default function DailyTasksList({ theme, isDark, addXP }) {
  const { tasks, addTasks, toggleTask, deleteTask } = useTasks();
  const { getDailyMix, getXPForChallenge, loading } = useChallenges();
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const generateTasks = () => {
    // Security: Prevent spam generation (max once per 5 seconds)
    const now = Date.now();
    if (lastGenerated && (now - lastGenerated) < 5000) {
      return;
    }

    setGenerating(true);
    setLastGenerated(now);
    
    setTimeout(() => {
      try {
        const selectedChallenges = getDailyMix();
        
        // Security: Validate challenges before creating tasks
        if (!Array.isArray(selectedChallenges) || selectedChallenges.length === 0) {
          console.error('Invalid challenges received');
          setGenerating(false);
          return;
        }

        const newTasks = selectedChallenges.map(challenge => {
          // Security: Validate each challenge object
          if (!challenge || typeof challenge !== 'object') {
            return null;
          }

          return {
            id: Date.now() + Math.random(),
            name: String(challenge.title || 'Unnamed Challenge').slice(0, 200), // Limit length
            description: challenge.description ? String(challenge.description).slice(0, 500) : null, // Add description with limit
            completed: false,
            createdAt: new Date().toISOString(),
            challengeId: challenge.id,
            difficulty: ['easy', 'medium', 'hard'].includes(challenge.difficulty) ? challenge.difficulty : 'medium',
            category: String(challenge.category || 'general').slice(0, 50),
            estimatedMinutes: Math.max(0, Math.min(Number(challenge.estimatedMinutes) || 0, 480)), // Max 8 hours
            xpReward: Math.max(0, Math.min(getXPForChallenge(challenge), 100)) // Max 100 XP per task
          };
        }).filter(Boolean); // Remove any null values

        addTasks(newTasks);
        addXP(20);
      } catch (error) {
        console.error('Error generating tasks:', error);
      } finally {
        setGenerating(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Daily Challenges</h2>
          <Shield size={24} className="text-green-500 animate-pulse" title="Secured & Rate Limited" />
        </div>
        <button
          onClick={generateTasks}
          disabled={generating || loading}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-linear-to-r ${theme.accent} text-white shadow-2xl ${theme.glow} disabled:opacity-50 transition-all duration-500 hover:scale-110 hover:shadow-3xl cursor-pointer group disabled:cursor-not-allowed`}
        >
          {generating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              Generate Challenges +20 XP
            </>
          )}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className={`text-center py-20 px-6 rounded-3xl border-2 border-dashed animate-fade-in ${
          isDark ? 'bg-white/5 border-white/20' : 'bg-linear-to-br from-purple-50 to-pink-50 border-purple-200'
        }`}>
          <Sparkles size={64} className="mx-auto mb-4 text-purple-400 animate-bounce-slow" />
          <p className="text-xl font-bold mb-2">Ready to Level Up?</p>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Click the button above to receive your personalized daily challenges
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => {
                toggleTask(task.id);
                if (!task.completed && task.xpReward) {
                  addXP(task.xpReward);
                }
              }}
              onDelete={() => deleteTask(task.id)}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      {/* Enhanced Summary Stats */}
      {tasks.length > 0 && (
        <div className={`p-6 rounded-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.01] cursor-default ${isDark ? 'bg-white/5 border border-white/10' : 'bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="transition-all duration-300 hover:scale-110 cursor-pointer">
              <div className="text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{tasks.length}</div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Total Challenges</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110 cursor-pointer">
              <div className="text-3xl font-black text-green-500 animate-pulse-slow">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Completed</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110 cursor-pointer">
              <div className="text-3xl font-black text-yellow-500">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)}m
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Time Remaining</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110 cursor-pointer">
              <div className="text-3xl font-black text-purple-500 animate-bounce-slow">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.xpReward || 0), 0)} XP
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>XP Available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}