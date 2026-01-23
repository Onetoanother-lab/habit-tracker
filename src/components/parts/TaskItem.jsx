import { CheckCircle, Circle, Trash2, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, theme, isDark }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className={`group relative rounded-2xl transition-all duration-500 animate-fade-in ${
      isDark ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white shadow-lg border border-gray-100'
    } ${task.completed ? 'opacity-60' : 'hover:scale-[1.01]'}`}>
      <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 -z-10 animate-linear-slow"></div>
      
      <div className="p-6">
        <div className="flex items-center gap-4">
          <button onClick={onToggle} className="transition-transform duration-500 hover:scale-125 cursor-pointer shrink-0">
            {task.completed ? (
              <div className="relative">
                <CheckCircle className="text-green-400" size={36} />
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
              </div>
            ) : (
              <Circle className={`transition-all duration-500 ${isDark ? "text-white/30 group-hover:text-white/70 group-hover:rotate-180" : "text-gray-300 group-hover:text-indigo-400 group-hover:rotate-180"}`} size={36} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <span className={`text-lg font-medium block mb-2 transition-colors duration-300 ${task.completed ? 'line-through opacity-70' : 'group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text'}`}>
              {task.name}
            </span>
            
            <div className="flex items-center gap-2 flex-wrap">
              {task.category && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-300 hover:scale-110 cursor-pointer ${
                  isDark ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}>
                  {task.category}
                </span>
              )}
              
              {task.difficulty && (
                <span className={`text-xs px-3 py-1 rounded-full font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${
                  task.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                  task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                  'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}>
                  {task.difficulty}
                </span>
              )}
              
              {!task.completed && task.xpReward && (
                <span className="text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-bold transition-all duration-300 hover:scale-110 cursor-pointer animate-pulse-slow">
                  <Zap size={12} className="animate-bounce" />
                  +{task.xpReward} XP
                </span>
              )}

              {task.description && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-300 hover:scale-110 cursor-pointer flex items-center gap-1 ${
                    isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {showDescription ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showDescription ? 'Hide' : 'Details'}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-red-400 transition-all duration-500 hover:scale-125 hover:rotate-12 cursor-pointer shrink-0"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Description Expandable Section */}
        {task.description && showDescription && (
          <div className={`mt-4 pt-4 border-t transition-all duration-300 animate-slide-in ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-purple-200' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}