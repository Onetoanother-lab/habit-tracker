// src/components/parts/AIChat.jsx
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { useHabits } from '../hooks/useHabits';
import { useTasks } from '../hooks/useTasks';
import { useXPAndLevel } from '../hooks/useXPAndLevel';

export default function AIChat({ theme, isDark }) {
  const { callAnthropic } = useAI();
  const { tasks } = useTasks();
  const { level, xp } = useXPAndLevel();
  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    const newChat = [...aiChat, { role: 'user', content: userMessage }];
    setAiChat(newChat);

    const context = `You are a supportive habit & productivity coach.
User is level ${level} with ${xp} XP.
Habits: ${habits.map(h => h.name).join(', ') || 'none'}
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

  return (
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
                ? isDark ? 'bg-white/20 ml-auto' : 'bg-indigo-100 ml-auto'
                : isDark ? 'bg-white/10' : 'bg-gray-100'
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
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask for advice, motivation, tips..."
          className={`flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-purple-400' 
              : 'border-2 border-gray-200 focus:ring-indigo-400'
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={!chatInput.trim()}
          className={`px-6 rounded-xl font-medium bg-linear-to-r ${theme.accent} text-white disabled:opacity-50`}
        >
          Send
        </button>
      </div>
    </div>
  );
}