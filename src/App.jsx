import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, CheckCircle, Circle, 
  TrendingUp, Sparkles, MessageSquare, Award, 
  Zap, Star, Wand2 
} from 'lucide-react';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022"; // Update when newer model is available

export default function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('habits-data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tasks-data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('xp-data');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [level, setLevel] = useState(() => {
    try {
      const saved = localStorage.getItem('level-data');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedView, setSelectedView] = useState('today');
  const [aiInsights, setAiInsights] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [generatingTasks, setGeneratingTasks] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('habits-data', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('tasks-data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('xp-data', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('level-data', level.toString());
  }, [level]);

  // Level calculation
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel !== level) setLevel(newLevel);
  }, [xp, level]);

  const addXP = (amount) => setXp(prev => prev + amount);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim(),
      completions: {},
      createdAt: new Date().toISOString()
    };
    
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setShowAddHabit(false);
    addXP(10);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleHabit = (habitId, date) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      
      const completions = { ...h.completions };
      if (completions[date]) {
        delete completions[date];
        return { ...h, completions };
      } else {
        completions[date] = true;
        addXP(25);
        return { ...h, completions };
      }
    }));
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newCompleted = !t.completed;
      if (newCompleted) addXP(15);
      return { ...t, completed: newCompleted };
    }));
  };

  const getDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const today = getDateString();

  const getStreak = (habit) => {
    let streak = 0;
    let date = new Date();
    
    while (true) {
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getCompletionRate = (habit) => {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    const completions = Object.keys(habit.completions).length;
    return daysSinceCreation > 0 ? Math.round((completions / daysSinceCreation) * 100) : 0;
  };

  // ──────────────────────────────────────────────
  //                 AI FUNCTIONS
  // ──────────────────────────────────────────────

  const callAnthropic = async (messages, max_tokens = 1000) => {
    if (!ANTHROPIC_API_KEY) throw new Error("API key not configured");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens,
        messages
      })
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.content.find(c => c.type === "text")?.text || "";
  };

  const generateAITasks = async () => {
    if (generatingTasks) return;
    setGeneratingTasks(true);

    const habitsList = habits.map(h => h.name).join(', ');
    const recent = habits.map(h => `${h.name}: ${h.completions[today] ? 'yes' : 'no'}`).join(', ');

    const prompt = `Generate 5 personalized daily tasks for today.
Support existing habits: ${habitsList || 'none'}
Recent completions: ${recent}

Tasks should be:
- specific & actionable
- mix of quick wins and meaningful work
- support work-life balance

Return ONLY valid JSON array of strings:
["Task one", "Task two", ...]`;

    try {
      const text = await callAnthropic([{ role: "user", content: prompt }], 300);
      const clean = text.replace(/```json|```/g, '').trim();
      const taskNames = JSON.parse(clean);

      const newTasks = taskNames.map(name => ({
        id: Date.now() + Math.random(),
        name,
        completed: false,
        createdAt: new Date().toISOString(),
        aiGenerated: true
      }));

      setTasks(prev => [...prev, ...newTasks]);
      addXP(20);
    } catch (err) {
      console.error("AI Tasks failed:", err);
    } finally {
      setGeneratingTasks(false);
    }
  };

  const generateAIInsights = async () => {
    if (loadingAI || habits.length === 0) return;
    setLoadingAI(true);

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
    } catch (err) {
      setAiInsights("Couldn't connect to AI coach. Try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const newChat = [...aiChat, { role: 'user', content: userMessage }];
    setAiChat(newChat);

    const context = `You are a supportive habit & productivity coach.
User is level ${level} with ${xp} XP.
Habits: ${habits.map(h => `${h.name} (${getStreak(h)} streak)`).join(', ') || 'none'}
Tasks today: ${tasks.filter(t => t.completed).length}/${tasks.length}

User: ${userMessage}

Respond in 2–4 sentences. Be encouraging, practical and personal.`;

    try {
      const reply = await callAnthropic([{ role: "user", content: context }], 400);
      setAiChat([...newChat, { role: 'assistant', content: reply }]);
    } catch {
      setAiChat([...newChat, { role: 'assistant', content: "Sorry, I'm having trouble responding right now..." }]);
    }
  };

  const getTheme = () => {
    if (level >= 20) return { name: 'legendary', bg: 'from-purple-950 via-fuchsia-950 to-rose-950', accent: 'from-fuchsia-500 to-rose-500' };
    if (level >= 15) return { name: 'epic', bg: 'from-indigo-950 via-purple-950 to-pink-950', accent: 'from-indigo-500 to-purple-500' };
    if (level >= 10) return { name: 'hero', bg: 'from-blue-950 via-indigo-950 to-violet-950', accent: 'from-blue-500 to-indigo-500' };
    if (level >= 5)  return { name: 'advanced', bg: 'from-cyan-900 via-blue-900 to-indigo-900', accent: 'from-cyan-500 to-blue-500' };
    return { name: 'beginner', bg: 'from-slate-50 via-gray-50 to-zinc-100', accent: 'from-indigo-600 to-purple-600' };
  };

  const theme = getTheme();
  const isDark = level >= 5;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-${isDark ? 'white' : 'gray-900'} transition-colors duration-1000`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">
              Habit Quest
            </h1>
            <p className={isDark ? "text-purple-300" : "text-gray-600"}>
              Level {level} • {xp} XP
            </p>
          </div>

          <div className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${theme.accent} shadow-lg shadow-black/30 text-white font-bold text-xl flex items-center gap-3`}>
            <Award size={28} className="text-yellow-300" />
            <span>Level {level}</span>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 mb-8">
          {['today', 'tasks', 'stats', 'ai'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`
                px-5 py-2.5 rounded-full font-medium transition-all
                ${selectedView === view 
                  ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg` 
                  : isDark 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-white hover:bg-gray-100 shadow-sm'}
              `}
            >
              {view === 'ai' && <Sparkles className="inline mr-1.5" size={16} />}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>

        {/* ────────────────────────────────────────────── */}
        {/*                   VIEWS                        */}
        {/* ────────────────────────────────────────────── */}

        {selectedView === 'today' && (
          <div className="space-y-10">
            {/* Add Habit */}
            {showAddHabit ? (
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white shadow-lg'}`}>
                <input
                  autoFocus
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addHabit()}
                  placeholder="What habit will you build today?"
                  className={`w-full px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 ${
                    isDark 
                      ? 'bg-white/5 border border-white/20 text-white placeholder-white/50 focus:ring-purple-400' 
                      : 'border-2 border-gray-200 focus:ring-indigo-400'
                  }`}
                />
                <div className="flex gap-3">
                  <button
                    onClick={addHabit}
                    className={`flex-1 py-3 rounded-xl font-medium ${`bg-gradient-to-r ${theme.accent} text-white`}`}
                  >
                    Create Habit (+10 XP)
                  </button>
                  <button
                    onClick={() => { setShowAddHabit(false); setNewHabitName(''); }}
                    className={`px-6 py-3 rounded-xl font-medium ${isDark ? 'bg-white/15 hover:bg-white/25' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddHabit(true)}
                className={`w-full p-5 rounded-2xl border-2 border-dashed text-center transition-all hover:scale-[1.01] ${
                  isDark 
                    ? 'border-white/30 hover:border-white/50 text-white/70 hover:text-white' 
                    : 'border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Plus className="inline mr-2" /> Add New Habit (+10 XP)
              </button>
            )}

            {/* Habits List */}
            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className={`text-center py-12 opacity-70 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  No habits yet — start your journey today! 🌱
                </div>
              ) : (
                habits.map(habit => (
                  <div
                    key={habit.id}
                    className={`p-5 rounded-2xl ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-md'} flex items-center gap-4 group`}
                  >
                    <button onClick={() => toggleHabit(habit.id, today)}>
                      {habit.completions[today] ? (
                        <CheckCircle className="text-green-400" size={36} />
                      ) : (
                        <Circle className={isDark ? "text-white/40 group-hover:text-white/70" : "text-gray-300 group-hover:text-gray-500"} size={36} />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <div className={`text-sm ${isDark ? 'text-purple-300' : 'text-gray-500'} flex gap-4 mt-1`}>
                        <span>🔥 {getStreak(habit)} streak</span>
                        <span>📊 {getCompletionRate(habit)}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-40 hover:opacity-100 text-red-400 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedView === 'tasks' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Daily Tasks</h2>
              <button
                onClick={generateAITasks}
                disabled={generatingTasks}
                className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  `bg-gradient-to-r ${theme.accent} text-white shadow-md`
                } disabled:opacity-50`}
              >
                {generatingTasks ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Wand2 size={18} />
                    AI Generate Tasks (+20 XP)
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl flex items-center gap-4 ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-md'} ${task.completed ? 'opacity-65' : ''}`}
                >
                  <button onClick={() => toggleTask(task.id)}>
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
                    onClick={() => deleteTask(task.id)}
                    className="opacity-40 hover:opacity-100 text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Statistics</h2>
            
            {habits.length === 0 ? (
              <div className={`text-center py-16 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                Start tracking habits to see your progress statistics!
              </div>
            ) : (
              habits.map(habit => (
                <div key={habit.id} className={`p-6 rounded-2xl ${isDark ? 'bg-white/8 backdrop-blur-sm border border-white/10' : 'bg-white shadow-lg'}`}>
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-xl font-bold">{habit.name}</h3>
                    <button onClick={() => deleteHabit(habit.id)} className="text-red-400 opacity-60 hover:opacity-100">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-amber-600 to-red-600 rounded-xl text-white">
                      <div className="text-3xl font-bold">{getStreak(habit)}</div>
                      <div className="text-sm opacity-90">Streak</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white">
                      <div className="text-3xl font-bold">{Object.keys(habit.completions).length}</div>
                      <div className="text-sm opacity-90">Days</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl text-white">
                      <div className="text-3xl font-bold">{getCompletionRate(habit)}%</div>
                      <div className="text-sm opacity-90">Success</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedView === 'ai' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Sparkles /> AI Coach
              </h2>
              <p className={isDark ? "text-purple-200" : "text-indigo-700"}>
                Get personalized insights & talk with your productivity coach
              </p>
            </div>

            {/* Insights Button */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white shadow-lg'}`}>
              <button
                onClick={generateAIInsights}
                disabled={loadingAI || habits.length === 0}
                className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                  `bg-gradient-to-r ${theme.accent} text-white`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingAI ? (
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

            {/* Chat */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white shadow-lg'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Chat with AI Coach
              </h3>

              <div className="h-80 overflow-y-auto space-y-4 mb-5 pr-2">
                {aiChat.length === 0 && (
                  <div className={`text-center py-10 opacity-60 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    Ask anything about habits, motivation, productivity...
                  </div>
                )}

                {aiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl max-w-[85%] ${
                      msg.role === 'user'
                        ? isDark 
                          ? 'bg-white/20 ml-auto' 
                          : 'bg-indigo-100 ml-auto'
                        : isDark 
                          ? 'bg-white/10' 
                          : 'bg-gray-100'
                    }`}
                  >
                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      {msg.role === 'user' ? 'You' : 'Coach'}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask for advice, motivation, tips..."
                  className={`flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 ${
                    isDark 
                      ? 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-purple-400' 
                      : 'border-2 border-gray-200 focus:ring-indigo-400'
                  }`}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim()}
                  className={`px-6 rounded-xl font-medium ${`bg-gradient-to-r ${theme.accent} text-white`} disabled:opacity-50`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}