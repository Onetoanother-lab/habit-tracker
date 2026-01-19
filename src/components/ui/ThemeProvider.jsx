// src/components/ui/ThemeProvider.jsx
import { createContext, useContext } from 'react';
import { getTheme, isDarkTheme } from '../constants/theme';
import { useXPAndLevel } from '../hooks/useXPAndLevel';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { level } = useXPAndLevel();
  const theme = getTheme(level);
  const isDark = isDarkTheme(level);

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);