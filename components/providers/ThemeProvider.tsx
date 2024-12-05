'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/settings/settingsStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  return <>{children}</>;
}
