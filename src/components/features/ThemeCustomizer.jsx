// src/components/features/ThemeCustomizer.jsx
import { useState } from 'react';
import { Palette, Download, Upload, RotateCcw, Check, Sparkles, Moon, Sun } from 'lucide-react';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';

export default function ThemeCustomizer({ onClose, isDark }) {
  const [activeTab, setActiveTab] = useState('presets');
  const {
    customTheme,
    PRESET_THEMES,
    applyPresetTheme,
    updateThemeProperty,
    resetToDefault,
    exportTheme,
    importTheme
  } = useThemeCustomizer();

  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const success = await importTheme(file);
    if (success) {
      alert('Theme imported successfully!');
    } else {
      alert('Failed to import theme. Please check the file format.');
    }
  };

  const handleApplyPreset = (presetName) => {
    applyPresetTheme(presetName);
    setSelectedPreset(presetName);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full rounded-3xl overflow-hidden ${
        isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
      } shadow-2xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} sticky top-0 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500">
                <Palette className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Theme Customizer</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Personalize your HabitQuest experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'presets'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="inline mr-2" size={18} />
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="inline mr-2" size={18} />
            Custom
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'advanced'
                ? 'border-b-2 border-purple-500 text-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="inline mr-2" size={18} />
            Advanced
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'presets' && (
            <div>
              <h3 className="font-semibold mb-4">Choose a Preset Theme</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(PRESET_THEMES).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleApplyPreset(key)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedPreset === key
                        ? 'border-purple-500 shadow-lg'
                        : isDark
                          ? 'border-white/10 hover:border-white/30'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{
                          background: `linear-linear(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`
                        }}
                      />
                      {selectedPreset === key && (
                        <Check className="text-purple-500" size={18} />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm mb-1">{preset.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {preset.mode === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                        {preset.mode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3">Color Palette</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => updateThemeProperty('primaryColor', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.primaryColor}
                        onChange={(e) => updateThemeProperty('primaryColor', e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customTheme.secondaryColor}
                        onChange={(e) => updateThemeProperty('secondaryColor', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.secondaryColor}
                        onChange={(e) => updateThemeProperty('secondaryColor', e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customTheme.accentColor}
                        onChange={(e) => updateThemeProperty('accentColor', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.accentColor}
                        onChange={(e) => updateThemeProperty('accentColor', e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Background Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customTheme.backgroundColor}
                        onChange={(e) => updateThemeProperty('backgroundColor', e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.backgroundColor}
                        onChange={(e) => updateThemeProperty('backgroundColor', e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block font-semibold mb-3">Preview</label>
                <div
                  className="p-6 rounded-xl"
                  style={{
                    background: customTheme.backgroundColor,
                    color: customTheme.textColor
                  }}
                >
                  <h4 className="text-xl font-bold mb-2">Sample Heading</h4>
                  <p className="mb-4 opacity-70">This is how your theme will look.</p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded-lg font-semibold"
                      style={{
                        background: `linear-linear(135deg, ${customTheme.primaryColor}, ${customTheme.secondaryColor})`,
                        color: 'white'
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-semibold"
                      style={{
                        backgroundColor: customTheme.accentColor,
                        color: 'white'
                      }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3">Border Radius</label>
                <div className="grid grid-cols-3 gap-2">
                  {['none', 'sm', 'rounded', 'lg', 'xl', 'full'].map(radius => (
                    <button
                      key={radius}
                      onClick={() => updateThemeProperty('borderRadius', radius)}
                      className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                        customTheme.borderRadius === radius
                          ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                          : isDark
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Font Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {['sm', 'base', 'lg', 'xl'].map(size => (
                    <button
                      key={size}
                      onClick={() => updateThemeProperty('fontSize', size)}
                      className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                        customTheme.fontSize === size
                          ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                          : isDark
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Effects</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customTheme.animations}
                      onChange={(e) => updateThemeProperty('animations', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span>Enable Animations</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customTheme.particles}
                      onChange={(e) => updateThemeProperty('particles', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span>Background Particles</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customTheme.glassmorphism}
                      onChange={(e) => updateThemeProperty('glassmorphism', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span>Glassmorphism Effects</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customTheme.linears}
                      onChange={(e) => updateThemeProperty('linears', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span>linear Backgrounds</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t ${isDark ? 'border-white/10 bg-gray-900' : 'border-gray-200 bg-gray-50'} sticky bottom-0`}>
          <div className="flex items-center gap-3">
            <button
              onClick={exportTheme}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Download size={18} />
              Export
            </button>

            <label className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              <Upload size={18} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={resetToDefault}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing import
function Settings({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m-9-7h6m6 0h6" />
    </svg>
  );
}