import { useState } from 'react';
import { CheckCircle, Circle, SkipForward, XCircle, ChevronDown, ChevronUp, Target, Clock, Sparkles } from 'lucide-react';
import { TRAITS, getTraitColor, getTraitBgColor } from '../constants/traits';

export default function ChallengeCard({ challenge, onComplete, onSkip, onFail, theme, isDark, skipsRemaining }) {
  const [showDescription, setShowDescription] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');
  const [note, setNote] = useState('');

  const isCompleted = challenge.status === 'completed';
  const isSkipped = challenge.status === 'skipped';
  const isFailed = challenge.status === 'failed';
  const isActive = challenge.status === 'active';

  const trait = TRAITS[challenge.category];

  const handleComplete = () => {
    if (challenge.requiresReflection && !reflection.trim()) {
      setShowReflection(true);
      return;
    }
    onComplete(challenge.id, reflection || null);
    setShowReflection(false);
  };

  const handleFail = () => {
    onFail(challenge.id, note || null);
  };

  return (
    <div className={`group relative rounded-2xl transition-all duration-500 animate-fade-in ${
      isDark ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white shadow-lg border border-gray-100'
    } ${isCompleted ? 'opacity-80' : isSkipped || isFailed ? 'opacity-50' : 'hover:scale-[1.01]'}`}>
      <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 transition duration-500 -z-10 ${
        isActive ? 'group-hover:opacity-30 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 animate-linear-slow' : ''
      }`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0 mt-1">
            {isCompleted ? (
              <div className="relative">
                <CheckCircle className="text-green-400" size={36} />
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
              </div>
            ) : isSkipped ? (
              <SkipForward className="text-yellow-400" size={36} />
            ) : isFailed ? (
              <XCircle className="text-gray-400" size={36} />
            ) : (
              <Circle 
                className={`transition-all duration-500 ${
                  isDark ? "text-white/30 group-hover:text-white/70" : "text-gray-300 group-hover:text-indigo-400"
                }`} 
                size={36} 
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isActive ? 'group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text' : ''
            }`}>
              {challenge.title}
            </h3>
            
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {trait && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-300 hover:scale-110 cursor-pointer ${getTraitBgColor(challenge.category, isDark)} ${getTraitColor(challenge.category, isDark)}`}>
                  {trait.icon} {trait.name}
                </span>
              )}
              
              <span className={`text-xs px-3 py-1 rounded-full font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${
                challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {challenge.difficulty}
              </span>

              {challenge.estimatedMinutes > 0 && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${
                  isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock size={12} />
                  {challenge.estimatedMinutes}m
                </span>
              )}

              {challenge.context && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                }`}>
                  {challenge.context}
                </span>
              )}
            </div>

            {/* Description Toggle */}
            {challenge.description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-300 hover:scale-110 cursor-pointer flex items-center gap-1 ${
                  isDark ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {showDescription ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showDescription ? 'Hide' : 'Details'}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Description */}
        {challenge.description && showDescription && (
          <div className={`mb-4 p-4 rounded-xl border transition-all duration-300 animate-slide-in ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-purple-200' : 'text-gray-600'}`}>
              {challenge.description}
            </p>
          </div>
        )}

        {/* Reflection Section */}
        {isActive && showReflection && challenge.reflectionPrompt && (
          <div className={`mb-4 p-4 rounded-xl border transition-all duration-300 animate-slide-in ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-200'
          }`}>
            <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-purple-300' : 'text-indigo-700'}`}>
              {challenge.reflectionPrompt}
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Your reflection..."
              className={`w-full px-4 py-3 rounded-lg text-sm resize-none outline-none transition-all duration-300 ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-purple-400' 
                  : 'border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
              }`}
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        {isActive && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleComplete}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r ${theme.accent} text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer`}
            >
              <CheckCircle size={16} />
              Complete
            </button>

            <button
              onClick={() => onSkip(challenge.id)}
              disabled={skipsRemaining <= 0}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 ${
                isDark 
                  ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 disabled:opacity-30' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-30'
              } disabled:cursor-not-allowed`}
              title={skipsRemaining <= 0 ? 'No skips remaining today' : `${skipsRemaining} skips remaining`}
            >
              <SkipForward size={16} />
              Skip ({skipsRemaining})
            </button>

            <button
              onClick={() => setShowReflection(true)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Couldn't Do It
            </button>
          </div>
        )}

        {/* Completed Status */}
        {isCompleted && challenge.reflection && (
          <div className={`mt-4 p-4 rounded-xl border ${
            isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
          }`}>
            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
              <strong>Your reflection:</strong> {challenge.reflection}
            </p>
          </div>
        )}

        {/* Identity Message */}
        {isCompleted && trait && (
          <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
          }`}>
            <Sparkles className={isDark ? 'text-purple-400' : 'text-purple-600'} size={20} />
            <p className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              You strengthened your <strong>{trait.name}</strong> today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

