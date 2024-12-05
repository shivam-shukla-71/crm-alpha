'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { ThemeLanguageSwitch } from '@/components/settings/ThemeLanguageSwitch';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Pipeline', href: '/pipeline', icon: ChartBarIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-800 dark:bg-gray-900 w-64 fixed left-0 top-0">
      <div className="flex items-center justify-center h-16 bg-gray-900 dark:bg-gray-950">
        <span className="text-white text-xl font-bold">CRM Demo</span>
      </div>
      <nav className="mt-5 flex-1">
        <div className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-gray-900 dark:bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        <ThemeLanguageSwitch />
      </div>
    </div>
  );
}
