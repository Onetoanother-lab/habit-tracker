// src/components/parts/DailyTasksList.jsx
import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useAI } from '../hooks/useAI';
import { useHabits } from '../hooks/useHabits';
import TaskItem from './TaskItem'; // Assuming TaskItem is in parts/

export default function DailyTasksList({ theme, isDark, addXP }) {
  const { tasks, addTasks, toggleTask, deleteTask } = useTasks();
  const { callAnthropic } = useAI();
  const { habits } = useHabits();
  const [generating, setGenerating] = useState(false);

  const generateTasks = async () => {
    if (generating) return;
    setGenerating(true);

    const habitsList = habits.map(h => h.name).join(', ');
    const today = new Date().toISOString().split('T')[0];
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

      addTasks(newTasks);
      addXP(20);
    } catch (err) {
      console.error("AI Tasks failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Daily Tasks</h2>
        <button
          onClick={generateTasks}
          disabled={generating}
          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all bg-gradient-to-r ${theme.accent} text-white shadow-md disabled:opacity-50`}
        >
          {generating ? (
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
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
            theme={theme}
            isDark={isDark}
            addXP={addXP}
          />
        ))}
      </div>
    </div>
  );
}