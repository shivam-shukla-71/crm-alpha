'use client';

import { useCRMStore } from '@/lib/store/store';
// import { useCRMStore } from "@/src/lib/store/store";
export default function DashboardMetrics() {
  const { deals, tasks, contacts } = useCRMStore();

  const metrics = [
    {
      name: 'Total Deals',
      value: deals.length,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Active Tasks',
      value: tasks.filter((task) => task.status === 'pending').length,
      change: '-1.39%',
      changeType: 'negative',
    },
    {
      name: 'Total Contacts',
      value: contacts.length,
      change: '+2.35%',
      changeType: 'positive',
    },
    {
      name: 'Pipeline Value',
      value: `$${deals.reduce((acc, deal) => acc + deal.value, 0).toLocaleString()}`,
      change: '+5.25%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {metric.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                metric.changeType === 'positive'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {metric.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}
