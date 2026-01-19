// src/components/hooks/useTasks.js
import { useLocalStorage } from './useLocalStorage';

export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage('tasks-data', []);

  const addTasks = (newTasks) => {
    setTasks((prev) => [...prev, ...newTasks]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, completed: !t.completed };
      })
    );
  };

  return { tasks, addTasks, deleteTask, toggleTask };
};