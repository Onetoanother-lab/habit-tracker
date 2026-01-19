// src/components/parts/TaskItem.jsx
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete, theme, isDark, addXP }) {
  const handleToggle = () => {
    onToggle();
    if (!task.completed) addXP(15);
  };

  return (
    <div
      className={`p-5 rounded-2xl flex items-center gap-4 ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-md'} ${task.completed ? 'opacity-65' : ''}`}
    >
      <button onClick={handleToggle}>
        {task.completed ? (
          <CheckCircle className="text-green-400" size={32} />
        ) : (
          <Circle className={isDark ? "text-white/40 hover:text-white/70" : "text-gray-300 hover:text-gray-500"} size={32} />
        )}
      </button>

      <div className="flex-1">
        <span className={`text-lg ${task.completed ? 'line-through opacity-70' : ''}`}>
          {task.name}
        </span>
        {task.aiGenerated && (
          <span className="ml-2 text-xs px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
            AI
          </span>
        )}
      </div>

      <button
        onClick={onDelete}
        className="opacity-40 hover:opacity-100 text-red-400"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}