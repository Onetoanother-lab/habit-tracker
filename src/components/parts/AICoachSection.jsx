// src/components/parts/AICoachSection.jsx
import { Sparkles } from 'lucide-react';
import AIInsights from './AIInsights';
import AIChat from './AIChat';

export default function AICoachSection({ theme, isDark, level, xp }) {
  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-linear-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30' : 'bg-linear-to-br from-indigo-50 to-purple-50'}`}>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Sparkles /> AI Coach
        </h2>
        <p className={isDark ? "text-purple-200" : "text-indigo-700"}>
          Get personalized insights & talk with your productivity coach
        </p>
      </div>

      <AIInsights theme={theme} isDark={isDark} level={level} xp={xp} />
      <AIChat theme={theme} isDark={isDark} />
    </div>
  );
}