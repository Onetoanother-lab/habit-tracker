import { Award, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AchievementToast({ achievement, onDismiss, isDark }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const tierColors = {
    bronze: 'from-amber-600 to-orange-700',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-500 to-yellow-700',
    platinum: 'from-purple-500 to-indigo-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`max-w-sm p-6 rounded-2xl border backdrop-blur-xl shadow-2xl ${
        isDark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-linear-to-br ${tierColors[achievement.tier]} shadow-lg`}>
            <span className="text-3xl">{achievement.icon}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
              <button onClick={() => {
                setShow(false);
                setTimeout(onDismiss, 300);
              }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">
              {achievement.name}
            </p>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {achievement.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Award size={16} className="text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                +{achievement.xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}