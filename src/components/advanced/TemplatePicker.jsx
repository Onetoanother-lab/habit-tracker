import { useState } from 'react';
import { Sparkles, X, ChevronRight, Search } from 'lucide-react';
import { HABIT_TEMPLATES, getPopularTemplates, searchTemplates } from '../../data/habitTemplates';

export default function TemplatePicker({ onSelect, onClose, isDark }) {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'popular', name: 'Popular', icon: '⭐', count: 12 },
    { id: 'health', name: 'Health & Fitness', icon: '💪', count: HABIT_TEMPLATES.health?.length || 0 },
    { id: 'productivity', name: 'Productivity', icon: '⚡', count: HABIT_TEMPLATES.productivity?.length || 0 },
    { id: 'learning', name: 'Learning', icon: '📚', count: HABIT_TEMPLATES.learning?.length || 0 },
    { id: 'social', name: 'Social', icon: '👥', count: HABIT_TEMPLATES.social?.length || 0 },
    { id: 'personal', name: 'Personal Growth', icon: '🎯', count: HABIT_TEMPLATES.personal?.length || 0 },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', count: HABIT_TEMPLATES.mindfulness?.length || 0 },
    { id: 'career', name: 'Career', icon: '💼', count: HABIT_TEMPLATES.career?.length || 0 },
    { id: 'finance', name: 'Finance', icon: '💰', count: HABIT_TEMPLATES.finance?.length || 0 },
    { id: 'relationships', name: 'Relationships', icon: '💑', count: HABIT_TEMPLATES.relationships?.length || 0 },
    { id: 'creativity', name: 'Creativity', icon: '🎨', count: HABIT_TEMPLATES.creativity?.length || 0 }
  ];

  const getTemplates = () => {
    if (searchQuery.trim()) {
      return searchTemplates(searchQuery);
    }
    if (selectedCategory === 'popular') {
      return getPopularTemplates(12);
    }
    return HABIT_TEMPLATES[selectedCategory] || [];
  };

  const templates = getTemplates();

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl ${
        isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Habit Templates</h2>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Choose from {Object.values(HABIT_TEMPLATES).flat().length}+ proven habit templates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-white/40' : 'text-gray-400'
            }`} size={20} />
            <input
              type="text"
              placeholder="Search habits... (e.g., exercise, meditation, reading)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all ${
                isDark 
                  ? 'bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-purple-500 focus:bg-white/10' 
                  : 'border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
              } outline-none`}
            />
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Categories Sidebar */}
          <div className={`w-64 border-r ${isDark ? 'border-white/10' : 'border-gray-200'} p-4 overflow-y-auto`}>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                    selectedCategory === cat.id && !searchQuery
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg'
                      : isDark
                        ? 'hover:bg-white/5'
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === cat.id && !searchQuery
                      ? 'bg-white/20'
                      : isDark
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {searchQuery && (
              <div className="mb-4">
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Found <strong>{templates.length}</strong> result{templates.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(template)}
                  className={`text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] group ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50'
                      : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-purple-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1 line-clamp-1">{template.name}</h3>
                        {template.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight 
                      size={18} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500 flex-shrink-0"
                    />
                  </div>
                  
                  <p className={`text-sm line-clamp-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    {template.suggestedTime && (
                      <div className={`text-xs flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                        <span>⏰</span>
                        <span>{template.suggestedTime}</span>
                      </div>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {template.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {templates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  No templates found
                </p>
                <p className={isDark ? 'text-white/60' : 'text-gray-600'}>
                  {searchQuery 
                    ? `Try searching for something else` 
                    : 'No templates available in this category'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className={`px-6 py-4 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className={isDark ? 'text-white/40' : 'text-gray-500'}>Total Templates: </span>
                <span className="font-bold">{Object.values(HABIT_TEMPLATES).flat().length}</span>
              </div>
              <div>
                <span className={isDark ? 'text-white/40' : 'text-gray-500'}>Categories: </span>
                <span className="font-bold">{Object.keys(HABIT_TEMPLATES).length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Easy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs">Hard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}