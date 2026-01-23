export const TRAITS = {
  'self-control': { 
    name: 'Self-Control', 
    icon: '🎯', 
    color: 'blue',
    description: 'Managing impulses and delayed gratification'
  },
  'emotional-regulation': { 
    name: 'Emotional Regulation', 
    icon: '🧘', 
    color: 'purple',
    description: 'Staying calm under pressure'
  },
  'confidence': { 
    name: 'Confidence', 
    icon: '💪', 
    color: 'orange',
    description: 'Self-assured presence and boundaries'
  },
  'awareness': { 
    name: 'Awareness', 
    icon: '👁️', 
    color: 'cyan',
    description: 'Mindful observation of self and surroundings'
  },
  'communication': { 
    name: 'Communication', 
    icon: '💬', 
    color: 'green',
    description: 'Clear, intentional expression'
  },
  'resilience': { 
    name: 'Resilience', 
    icon: '🛡️', 
    color: 'red',
    description: 'Bouncing back from setbacks'
  },
  'discipline': { 
    name: 'Discipline', 
    icon: '⚡', 
    color: 'yellow',
    description: 'Consistent action toward goals'
  },
  'social-intelligence': { 
    name: 'Social Intelligence', 
    icon: '🤝', 
    color: 'pink',
    description: 'Reading and navigating social dynamics'
  }
};

export const getTraitColor = (traitKey, isDark = false) => {
  const trait = TRAITS[traitKey];
  if (!trait) return isDark ? 'text-gray-400' : 'text-gray-600';
  
  const colors = {
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
    orange: isDark ? 'text-orange-400' : 'text-orange-600',
    cyan: isDark ? 'text-cyan-400' : 'text-cyan-600',
    green: isDark ? 'text-green-400' : 'text-green-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
    yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
    pink: isDark ? 'text-pink-400' : 'text-pink-600',
  };
  
  return colors[trait.color] || (isDark ? 'text-gray-400' : 'text-gray-600');
};

export const getTraitBgColor = (traitKey, isDark = false) => {
  const trait = TRAITS[traitKey];
  if (!trait) return isDark ? 'bg-gray-500/20' : 'bg-gray-100';
  
  const colors = {
    blue: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
    purple: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
    orange: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
    cyan: isDark ? 'bg-cyan-500/20' : 'bg-cyan-100',
    green: isDark ? 'bg-green-500/20' : 'bg-green-100',
    red: isDark ? 'bg-red-500/20' : 'bg-red-100',
    yellow: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
    pink: isDark ? 'bg-pink-500/20' : 'bg-pink-100',
  };
  
  return colors[trait.color] || (isDark ? 'bg-gray-500/20' : 'bg-gray-100');
};

