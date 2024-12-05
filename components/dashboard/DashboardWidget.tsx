'use client';

import { ReactNode } from 'react';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
}

export default function DashboardWidget({
  title,
  children,
  className = '',
  onRemove,
}: DashboardWidgetProps) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
