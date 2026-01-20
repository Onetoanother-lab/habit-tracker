// src/components/parts/TaskItem.jsx
import { CheckCircle, Circle, Trash2, Zap } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete, theme, isDark }) {
  return (
    <div
      className={`p-5 rounded-2xl flex items-center gap-4 transition-all ${
        isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-md'
      } ${task.completed ? 'opacity-65' : 'hover:scale-[1.01]'}`}
    >
      <button onClick={onToggle} className="flex-shrink-0">
        {task.completed ? (
          <CheckCircle className="text-green-400" size={32} />
        ) : (
          <Circle 
            className={isDark ? "text-white/40 hover:text-white/70" : "text-gray-300 hover:text-gray-500"} 
            size={32} 
          />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-lg block mb-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
          {task.name}
        </span>
        
        {task.category && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
              {task.category}
            </span>
            
            {!task.completed && task.xpReward && (
              <span className="text-xs flex items-center gap-1 text-yellow-500 font-semibold">
                <Zap size={12} />
                +{task.xpReward} XP
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onDelete}
        className="opacity-40 hover:opacity-100 text-red-400 transition-opacity flex-shrink-0"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}