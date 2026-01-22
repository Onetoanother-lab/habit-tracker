import { useState } from 'react';
import { Wand2, RefreshCw, Sparkles } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useChallenges } from '../hooks/useChallenges';
import TaskItem from './TaskItem';

export default function DailyTasksList({ theme, isDark, addXP }) {
  const { tasks, addTasks, toggleTask, deleteTask } = useTasks();
  const { getDailyMix, getXPForChallenge, loading } = useChallenges();
  const [generating, setGenerating] = useState(false);

  const generateTasks = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const selectedChallenges = getDailyMix();
      
      const newTasks = selectedChallenges.map(challenge => ({
        id: Date.now() + Math.random(),
        name: challenge.title,
        completed: false,
        createdAt: new Date().toISOString(),
        challengeId: challenge.id,
        difficulty: challenge.difficulty,
        category: challenge.category,
        estimatedMinutes: challenge.estimatedMinutes,
        xpReward: getXPForChallenge(challenge)
      }));

      addTasks(newTasks);
      addXP(20); 
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-black">Daily Challenges</h2>
        <button
          onClick={generateTasks}
          disabled={generating || loading}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-linear-to-r ${theme.accent} text-white shadow-xl ${theme.glow} disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
        >
          {generating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Get Challenges +20 XP
            </>
          )}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className={`text-center py-20 px-6 rounded-3xl border-2 border-dashed ${
          isDark ? 'bg-white/5 border-white/20' : 'bg-linear-to-br from-purple-50 to-pink-50 border-purple-200'
        }`}>
          <Sparkles size={48} className="mx-auto mb-4 text-purple-400" />
          <p className="text-xl font-bold mb-2">Ready to level up?</p>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Click the button above to receive your daily challenges
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

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <div className={`p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-black">{tasks.length}</div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Total Tasks</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-500">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Completed</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-500">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)}m
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Time Left</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-500">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.xpReward || 0), 0)} XP
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
