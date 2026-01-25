// src/components/features/ExportShareModal.jsx
import { useState } from 'react';
import { Download, Upload, Share2, X, FileJson, FileText, Link, Check } from 'lucide-react';
import { useHabitExport } from '../hooks/useHabitExport';

export default function ExportShareModal({ habits, onClose, onImport, isDark }) {
  const [activeTab, setActiveTab] = useState('export');
  const [exportOptions, setExportOptions] = useState({
    includeStats: true,
    includeCompletions: true
  });
  const [copied, setCopied] = useState(false);
  
  const {
    exportToJSON,
    exportToCSV,
    importFromJSON,
    generateShareableLink
  } = useHabitExport();

  const handleExportJSON = () => {
    exportToJSON(habits, exportOptions);
  };

  const handleExportCSV = () => {
    exportToCSV(habits);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const importedHabits = await importFromJSON(file);
      onImport(importedHabits);
      alert(`Successfully imported ${importedHabits.length} habits!`);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const handleShare = () => {
    generateShareableLink(habits);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`max-w-2xl w-full rounded-3xl ${
        isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
      } shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Export & Share</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'export'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="inline mr-2" size={18} />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'import'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="inline mr-2" size={18} />
            Import
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'share'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Share2 className="inline mr-2" size={18} />
            Share
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Export Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeStats}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        includeStats: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span>Include statistics</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCompletions}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        includeCompletions: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span>Include completion history</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleExportJSON}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    isDark
                      ? 'border-white/10 hover:border-purple-500 bg-white/5'
                      : 'border-gray-200 hover:border-purple-500 bg-gray-50'
                  }`}
                >
                  <FileJson className="mx-auto mb-2 text-purple-500" size={32} />
                  <div className="font-semibold">JSON Format</div>
                  <div className="text-xs text-gray-500 mt-1">Full data export</div>
                </button>

                <button
                  onClick={handleExportCSV}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    isDark
                      ? 'border-white/10 hover:border-blue-500 bg-white/5'
                      : 'border-gray-200 hover:border-blue-500 bg-gray-50'
                  }`}
                >
                  <FileText className="mx-auto mb-2 text-blue-500" size={32} />
                  <div className="font-semibold">CSV Format</div>
                  <div className="text-xs text-gray-500 mt-1">Spreadsheet compatible</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Import habits from a previously exported JSON file. This will add the imported habits to your existing collection.
              </p>

              <label className={`block p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all hover:scale-105 ${
                isDark
                  ? 'border-white/20 hover:border-purple-500 bg-white/5'
                  : 'border-gray-300 hover:border-purple-500 bg-gray-50'
              }`}>
                <Upload className="mx-auto mb-3 text-purple-500" size={48} />
                <div className="font-semibold mb-1">Choose file to import</div>
                <div className="text-xs text-gray-500">JSON files only</div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Note:</strong> Imported habits will be added to your existing habits, not replace them.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate a shareable link to your habit progress. Others can view your habit names and completion counts.
              </p>

              <button
                onClick={handleShare}
                className={`w-full p-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="inline mr-2" size={18} />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Link className="inline mr-2" size={18} />
                    Generate Share Link
                  </>
                )}
              </button>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Privacy:</strong> Shared links only include habit names and total completions, not detailed history.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}