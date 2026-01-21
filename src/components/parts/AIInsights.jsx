// src/components/parts/AIInsights.jsx
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useXPAndLevel } from '../hooks/useXPAndLevel';
import { getStreak, getCompletionRate } from '../utils/habitStats';

export default function AIInsights({ theme, isDark }) {
  const { callAnthropic, loading } = useAI();
  const { tasks } = useTasks();
  const { level, xp } = useXPAndLevel();
  const [aiInsights, setAiInsights] = useState('');

  const generateInsights = async () => {
    if (loading || habits.length === 0) return;

    const analytics = habits.map(h => ({
      name: h.name,
      streak: getStreak(h),
      rate: getCompletionRate(h)
    }));

    const prompt = `You are an excellent personal productivity coach.

User level: ${level} (${xp} XP)
Habits:
${analytics.map(h => `- ${h.name}: ${h.streak} streak, ${h.rate}% completion`).join('\n')}

Tasks today: ${tasks.filter(t => t.completed).length}/${tasks.length}

Write 4–6 sentences:
1. Warm congratulations on current level & progress
2. One interesting pattern you notice
3. One concrete suggestion to reach next level faster
4. Short motivational closing

Tone: supportive, wise, slightly playful`;

    try {
      const insights = await callAnthropic([{ role: "user", content: prompt }]);
      setAiInsights(insights);
    } catch {
      setAiInsights("Couldn't connect to AI coach. Try again later.");
    }
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white shadow-lg'}`}>
      <button
        onClick={generateInsights}
        disabled={loading || habits.length === 0}
        className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 bg-linear-to-r ${theme.accent} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>Analyzing your progress...</>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Personal Insights
          </>
        )}
      </button>

      {aiInsights && (
        <div className={`mt-6 p-5 rounded-xl whitespace-pre-line ${isDark ? 'bg-white/10 border border-white/20' : 'bg-indigo-50 border border-indigo-200'}`}>
          {aiInsights}
        </div>
      )}
    </div>
  );
}