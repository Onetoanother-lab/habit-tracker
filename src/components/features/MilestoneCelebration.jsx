// src/components/features/MilestoneCelebration.jsx
import { useState, useEffect } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';

export default function MilestoneCelebration({ milestone, onDismiss, isDark }) {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    setShow(true);
    
    // Generate confetti
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
      size: Math.random() * 10 + 5
    }));
    setConfetti(particles);

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [milestone, onDismiss]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
      show ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Confetti */}
      {confetti.map(particle => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}

      {/* Celebration Card */}
      <div className={`relative max-w-md w-full rounded-3xl overflow-hidden transform transition-all duration-500 ${
        show ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
      } ${isDark ? 'bg-gray-900 border-2 border-white/20' : 'bg-white'} shadow-2xl`}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 via-pink-500/20 to-yellow-500/20 animate-pulse" />

        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 mb-6 animate-bounce-slow shadow-2xl">
              <span className="text-5xl">{milestone.icon}</span>
            </div>

            {/* Trophy Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="text-yellow-500 animate-pulse" size={24} />
              <span className="text-sm font-bold text-yellow-500 uppercase tracking-wider">
                Milestone Unlocked!
              </span>
              <Trophy className="text-yellow-500 animate-pulse" size={24} />
            </div>

            {/* Milestone Name */}
            <h2 className="text-3xl font-black mb-3 bg-linear-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              {milestone.name}
            </h2>

            {/* Description */}
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {milestone.description}
            </p>

            {/* Sparkles */}
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="text-purple-500 animate-pulse" size={20} />
              <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Keep up the amazing work!
              </span>
              <Sparkles className="text-pink-500 animate-pulse" size={20} />
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="mt-8 w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-all shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}