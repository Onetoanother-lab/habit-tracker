import { CheckCircle, Circle, Trash2, Zap } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete, theme, isDark }) {
  return (
    <div className={`group relative p-6 rounded-2xl transition-all duration-300 ${
      isDark ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white shadow-lg border border-gray-100'
    } ${task.completed ? 'opacity-60' : 'hover:scale-[1.01]'}`}>
      <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300 -z-10"></div>
      
      <div className="flex items-center gap-4">
        <button onClick={onToggle} className="transition-transform hover:scale-110">
          {task.completed ? (
            <CheckCircle className="text-green-400" size={36} />
          ) : (
            <Circle className={isDark ? "text-white/30" : "text-gray-300"} size={36} />
          )}
        </button>

        <div className="flex-1">
          <span className={`text-lg font-medium block mb-2 ${task.completed ? 'line-through opacity-70' : ''}`}>
            {task.name}
          </span>
          
          <div className="flex items-center gap-2 flex-wrap">
            {task.category && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {task.category}
              </span>
            )}
            
            {task.difficulty && (
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                task.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {task.difficulty}
              </span>
            )}
            
            {!task.completed && task.xpReward && (
              <span className="text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">
                <Zap size={12} />
                +{task.xpReward} XP
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-red-400 transition-all hover:scale-110"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}