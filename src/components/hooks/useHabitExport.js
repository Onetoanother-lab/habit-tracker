// src/components/hooks/useHabitExport.js
import { useState } from 'react';

export const useHabitExport = () => {
  const [exportStatus, setExportStatus] = useState({ loading: false, error: null });

  const exportToJSON = (habits, options = {}) => {
    const {
      includeStats = true,
      includeCompletions = true,
      includeNotes = false
    } = options;

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      habits: habits.map(habit => {
        const baseData = {
          name: habit.name,
          createdAt: habit.createdAt
        };

        if (includeCompletions) {
          baseData.completions = habit.completions;
        }

        if (includeStats) {
          const totalDays = Object.keys(habit.completions || {}).length;
          const daysSinceCreation = Math.floor(
            (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
          
          baseData.stats = {
            totalCompletions: totalDays,
            completionRate: Math.round((totalDays / daysSinceCreation) * 100),
            daysSinceCreation
          };
        }

        return baseData;
      })
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitquest-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    return exportData;
  };

  const exportToCSV = (habits) => {
    const headers = ['Habit Name', 'Created Date', 'Total Completions', 'Completion Rate'];
    const rows = habits.map(habit => {
      const totalDays = Object.keys(habit.completions || {}).length;
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      const rate = Math.round((totalDays / daysSinceCreation) * 100);

      return [
        habit.name,
        new Date(habit.createdAt).toLocaleDateString(),
        totalDays,
        `${rate}%`
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitquest-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = async (file) => {
    setExportStatus({ loading: true, error: null });

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid format: habits array not found');
      }

      const importedHabits = data.habits.map(habit => ({
        id: Date.now() + Math.random(),
        name: habit.name,
        completions: habit.completions || {},
        createdAt: habit.createdAt || new Date().toISOString()
      }));

      setExportStatus({ loading: false, error: null });
      return importedHabits;
    } catch (error) {
      setExportStatus({ loading: false, error: error.message });
      throw error;
    }
  };

  const generateShareableLink = (habits) => {
    const shareData = {
      habits: habits.map(h => ({
        name: h.name,
        completions: Object.keys(h.completions || {}).length
      }))
    };

    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}?share=${encoded}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }

    return url;
  };

  const parseSharedLink = () => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('share');

    if (!shared) return null;

    try {
      const decoded = atob(shared);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  return {
    exportToJSON,
    exportToCSV,
    importFromJSON,
    generateShareableLink,
    parseSharedLink,
    exportStatus
  };
};