// src/App.jsx
import { StrictMode } from 'react';
import HabitTracker from './components/parts/HabitTracker';
import { ThemeProvider } from './components/ui/ThemeProvider';

function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <HabitTracker />
      </ThemeProvider>
    </StrictMode>
  );
}
 
export default App;
