'use client';

import { useEffect } from 'react';
import { useCRMStore } from '@/lib/store/store';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { contacts, deals, tasks, activities, fetchContacts, fetchDeals, fetchTasks, fetchActivities } = useCRMStore();

  useEffect(() => {
    fetchContacts();
    fetchDeals();
    fetchTasks();
    fetchActivities();
  }, [fetchContacts, fetchDeals, fetchTasks, fetchActivities]);

  // Calculate stats
  const totalContacts = contacts.length;
  const activeDeals = deals.filter(deal => deal.stage !== 'closed').length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const pendingTasks = tasks.filter(task => task.status === 'TODO').length;
  const recentActivities = activities.slice(0, 5);
  const upcomingTasks = tasks
    .filter(task => task.status !== 'DONE')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Contacts Card */}
        <Link href="/contacts" className="group">
          <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalContacts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Deals Card */}
        <Link href="/pipeline" className="group">
          <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Deals</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activeDeals}</div>
                    <div className="ml-2 text-sm text-gray-600">
                      ${totalValue.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Tasks Card */}
        <Link href="/tasks" className="group">
          <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{pendingTasks}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Activities Card */}
        <Link href="/activities" className="group">
          <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Activities</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activities.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activities and Upcoming Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="flex items-center text-lg font-medium text-gray-900">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Recent Activities
            </h2>
            <div className="mt-4 flow-root">
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {recentActivities.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="flex items-center text-lg font-medium text-gray-900">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-gray-500" />
              Upcoming Tasks
            </h2>
            <div className="mt-4 flow-root">
              <ul className="divide-y divide-gray-200">
                {upcomingTasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{task.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
