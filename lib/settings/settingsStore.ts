import { create } from 'zustand';
import { AppSettings } from './types';

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

// Load settings from localStorage or use defaults
const loadInitialSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    return {
      theme: 'light',
      language: 'en',
      companyName: 'My CRM',
    };
  }

  const savedSettings = localStorage.getItem('app_settings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }

  return {
    theme: 'light',
    language: 'en',
    companyName: 'My CRM',
  };
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: loadInitialSettings(),
  updateSettings: (newSettings) =>
    set((state) => {
      const updatedSettings = {
        ...state.settings,
        ...newSettings,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
      }
      return { settings: updatedSettings };
    }),
}));
