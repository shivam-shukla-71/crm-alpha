'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/settings/settingsStore';

export function ThemeLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Theme handling
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
    }

    // Language handling
    document.documentElement.lang = settings.language;
  }, [settings.theme, settings.language]);

  return <>{children}</>;
}
