// src/components/hooks/useThemeCustomizer.js
import { useLocalStorage } from './useLocalStorage';

export const useThemeCustomizer = () => {
  const [customTheme, setCustomTheme] = useLocalStorage('custom-theme', {
    mode: 'dark', // 'light', 'dark', 'auto'
    primaryColor: '#8b5cf6', // purple
    secondaryColor: '#ec4899', // pink
    accentColor: '#06b6d4', // cyan
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    borderRadius: 'rounded', // 'none', 'sm', 'rounded', 'lg', 'xl', 'full'
    fontSize: 'base', // 'sm', 'base', 'lg', 'xl'
    animations: true,
    particles: true,
    glassmorphism: true,
    gradients: true
  });

  const PRESET_THEMES = {
    default: {
      name: 'Purple Haze',
      mode: 'dark',
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      accentColor: '#06b6d4',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff'
    },
    ocean: {
      name: 'Ocean Breeze',
      mode: 'dark',
      primaryColor: '#0ea5e9',
      secondaryColor: '#06b6d4',
      accentColor: '#14b8a6',
      backgroundColor: '#0c1222',
      textColor: '#e0f2fe'
    },
    forest: {
      name: 'Forest',
      mode: 'dark',
      primaryColor: '#10b981',
      secondaryColor: '#22c55e',
      accentColor: '#84cc16',
      backgroundColor: '#0a1f15',
      textColor: '#f0fdf4'
    },
    sunset: {
      name: 'Sunset',
      mode: 'dark',
      primaryColor: '#f97316',
      secondaryColor: '#ef4444',
      accentColor: '#f59e0b',
      backgroundColor: '#1f1108',
      textColor: '#fff7ed'
    },
    lavender: {
      name: 'Lavender Dream',
      mode: 'light',
      primaryColor: '#a855f7',
      secondaryColor: '#d946ef',
      accentColor: '#c084fc',
      backgroundColor: '#faf5ff',
      textColor: '#1f1f1f'
    },
    mint: {
      name: 'Mint Fresh',
      mode: 'light',
      primaryColor: '#14b8a6',
      secondaryColor: '#06b6d4',
      accentColor: '#10b981',
      backgroundColor: '#f0fdfa',
      textColor: '#1f1f1f'
    },
    rose: {
      name: 'Rose Garden',
      mode: 'light',
      primaryColor: '#f43f5e',
      secondaryColor: '#ec4899',
      accentColor: '#fb7185',
      backgroundColor: '#fff1f2',
      textColor: '#1f1f1f'
    },
    midnight: {
      name: 'Midnight',
      mode: 'dark',
      primaryColor: '#4f46e5',
      secondaryColor: '#6366f1',
      accentColor: '#818cf8',
      backgroundColor: '#050510',
      textColor: '#e0e7ff'
    }
  };

  const applyPresetTheme = (presetName) => {
    const preset = PRESET_THEMES[presetName];
    if (preset) {
      setCustomTheme(prev => ({
        ...prev,
        ...preset
      }));
    }
  };

  const updateThemeProperty = (property, value) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const resetToDefault = () => {
    setCustomTheme({
      mode: 'dark',
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      accentColor: '#06b6d4',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      borderRadius: 'rounded',
      fontSize: 'base',
      animations: true,
      particles: true,
      glassmorphism: true,
      gradients: true
    });
  };

  const exportTheme = () => {
    const themeData = {
      ...customTheme,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitquest-theme-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.primaryColor && data.secondaryColor) {
        setCustomTheme({
          ...customTheme,
          ...data
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Theme import failed:', error);
      return false;
    }
  };

  const getCSSVariables = () => {
    return {
      '--color-primary': customTheme.primaryColor,
      '--color-secondary': customTheme.secondaryColor,
      '--color-accent': customTheme.accentColor,
      '--color-bg': customTheme.backgroundColor,
      '--color-text': customTheme.textColor
    };
  };

  const getRadiusClass = () => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      rounded: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      full: 'rounded-3xl'
    };
    return radiusMap[customTheme.borderRadius] || 'rounded-lg';
  };

  const getFontSizeClass = () => {
    const fontMap = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };
    return fontMap[customTheme.fontSize] || 'text-base';
  };

  return {
    customTheme,
    PRESET_THEMES,
    applyPresetTheme,
    updateThemeProperty,
    resetToDefault,
    exportTheme,
    importTheme,
    getCSSVariables,
    getRadiusClass,
    getFontSizeClass
  };
};