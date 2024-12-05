'use client';

import { useSettingsStore } from '@/lib/settings/settingsStore';
import { SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

export function ThemeLanguageSwitch() {
  const { settings, updateSettings } = useSettingsStore();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const changeLanguage = (lang: string) => {
    updateSettings({ language: lang });
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {settings.theme === 'light' ? (
          <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div className="relative">
        <select
          value={settings.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="appearance-none bg-transparent pl-8 pr-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <LanguageIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 absolute left-2 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  );
}
