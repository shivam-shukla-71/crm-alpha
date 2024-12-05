'use client';

import { useState, useRef } from 'react';
import { useSettingsStore } from '@/lib/settings/settingsStore';
import { availableLanguages } from '@/lib/settings/types';
import Image from 'next/image';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        updateSettings({ logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyNameChange = (companyName: string) => {
    updateSettings({ companyName });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-theme-primary">Settings</h1>

      {/* Theme Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-medium">Theme</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`px-4 py-2 rounded-md ${
              settings.theme === 'light'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          > 
            Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`px-4 py-2 rounded-md ${
              settings.theme === 'dark'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Language Settings */}
      <div className="white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-medium">Language</h2>
        <select
          value={settings.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
      </div>

      {/* Company Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-medium">Company Settings</h2>
        
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Logo
          </label>
          <div className="mt-2 flex items-center space-x-4">
            {logoPreview && (
              <div className="relative w-16 h-16">
                <Image
                  src={logoPreview}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary px-4 py-2 rounded-md"
            >
              {logoPreview ? 'Change Logo' : 'Upload Logo'}
            </button>
            {logoPreview && (
              <button
                onClick={() => {
                  setLogoPreview(undefined);
                  updateSettings({ logo: undefined });
                }}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          <p className="mt-1 text-sm text-gray-500">
            Recommended: 512x512px or larger, PNG or JPEG
          </p>
        </div>
      </div>
    </div>
  );
}
