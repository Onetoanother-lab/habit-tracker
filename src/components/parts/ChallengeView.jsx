import { useState } from 'react';
import { useChallengeSystem } from '../hooks/useChallengeSystem';
import { useTheme } from '../ui/ThemeProvider';
import { Target, Flame, TrendingUp, Award, RefreshCw, Calendar } from 'lucide-react';
import ChallengeCard from './ChallengeCard';
import TraitProgress from './TraitProgress';
import DailySummary from './DailySummary';

export default function ChallengeView() {
  const { theme, isDark } = useTheme();
  const {
    activeChallenges,
    traits,
    streak,
    difficultyLevel,
    generateDailyChallenges,
    completeChallenge,
    skipChallenge,
    failChallenge,
    getDailySummary,
    getSkipsRemaining,
    DAILY_CHALLENGE_LIMIT
  } = useChallengeSystem();

  const [showSummary, setShowSummary] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const result = generateDailyChallenges();
      if (!result.success) {
        alert(result.message);
      }
      setGenerating(false);
    }, 800);
  };

  const handleComplete = (id, reflection) => {
    const result = completeChallenge(id, reflection);
    if (result.success && result.traitImproved) {
      // Success feedback handled by card
    }
  };

  const handleSkip = (id) => {
    const result = skipChallenge(id);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleFail = (id, note) => {
    failChallenge(id, note);
  };

  const summary = getDailySummary();
  const skipsRemaining = getSkipsRemaining();

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-md border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500 animate-flicker" size={20} />
            <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Current Streak</span>
          </div>
          <div className="text-2xl font-black">{streak.current} days</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Best: {streak.best} days</div>
        </div>

        <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-md border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-500" size={20} />
            <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Today's Progress</span>
          </div>
          <div className="text-2xl font-black">{summary.completed}/{summary.total}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Completed</div>
        </div>

        <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-md border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-500" size={20} />
            <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Difficulty Level</span>
          </div>
          <div className="text-2xl font-black">Level {Math.floor(difficultyLevel)}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Adaptive scaling</div>
        </div>

        <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-md border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-yellow-500 animate-pulse" size={20} />
            <span className={`text-xs font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Active Traits</span>
          </div>
          <div className="text-2xl font-black">{Object.keys(traits).length}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>In development</div>
        </div>
      </div>

      {/* Generate or View Challenges */}
      {activeChallenges.length === 0 ? (
        <div className={`text-center py-20 px-6 rounded-3xl border-2 border-dashed ${
          isDark ? 'bg-white/5 border-white/20' : 'bg-linear-to-br from-purple-50 to-pink-50 border-purple-200'
        }`}>
          <Target size={64} className="mx-auto mb-4 text-purple-400 animate-bounce-slow" />
          <h3 className="text-2xl font-bold mb-2">Ready for Your Daily Challenges?</h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Receive {DAILY_CHALLENGE_LIMIT} personalized challenges tailored to your progress
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto bg-linear-to-r ${theme.accent} text-white shadow-2xl ${theme.glow} disabled:opacity-50 transition-all duration-500 hover:scale-110 cursor-pointer`}
          >
            {generating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Target size={20} />
                Generate Daily Challenges
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Today's Challenges
            </h2>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Calendar size={16} />
              {showSummary ? 'Hide' : 'View'} Summary
            </button>
          </div>

          {showSummary && <DailySummary summary={summary} traits={traits} isDark={isDark} />}

          <div className="space-y-4">
            {activeChallenges.map((challenge, index) => (
              <div key={challenge.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ChallengeCard
                  challenge={challenge}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  onFail={handleFail}
                  theme={theme}
                  isDark={isDark}
                  skipsRemaining={skipsRemaining}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trait Progress Section */}
      {Object.keys(traits).length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Your Psychological Development
          </h2>
          <TraitProgress traits={traits} isDark={isDark} />
        </div>
      )}
    </div>
  );
}