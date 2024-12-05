export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  logo?: string;
  companyName: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const availableLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];
