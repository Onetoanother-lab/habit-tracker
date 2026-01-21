// src/components/parts/DailyTasksList.jsx
import { useState } from 'react';
import { Wand2, RefreshCw } from 'lucide-react';
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
    }, 800);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: isDark ? 'text-green-400' : 'text-green-600',
      medium: isDark ? 'text-yellow-400' : 'text-yellow-600',
      hard: isDark ? 'text-red-400' : 'text-red-600'
    };
    return colors[difficulty] || '';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Daily Challenges</h2>
        <button
          onClick={generateTasks}
          disabled={generating || loading}
          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all bg-linear-to-r ${theme.accent} text-white shadow-md disabled:opacity-50 hover:scale-105`}
        >
          {generating ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Get Daily Challenges (+20 XP)
            </>
          )}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className={`text-center py-16 px-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border-2 border-dashed border-gray-300'}`}>
          <p className={`text-lg mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            Ready to level up? 🚀
          </p>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Click "Get Daily Challenges" to receive a balanced mix of tasks
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              <TaskItem
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
                addXP={addXP}
              />
              {task.difficulty && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {task.estimatedMinutes > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      {task.estimatedMinutes}m
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <div className={`p-5 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-indigo-50 border border-indigo-200'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)}m
              </div>
              <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Time Left</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.xpReward || 0), 0)} XP
              </div>
              <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}