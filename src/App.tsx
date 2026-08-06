import React, { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useSettingsStore } from './stores/useSettingsStore';

export const App: React.FC = () => {
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Sync dark/light theme class on document body
    const root = document.documentElement;
    if (settings.general.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [settings.general.theme]);

  return <AppShell />;
};

export default App;
