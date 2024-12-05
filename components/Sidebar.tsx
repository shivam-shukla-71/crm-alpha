'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Contacts', href: '/contacts' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Pipeline', href: '/pipeline' },
  { name: 'Activities', href: '/activities' },
  { name: 'Settings', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Modern CRM</h2>
      </div>
      <nav className="mt-5 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md
                ${isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
