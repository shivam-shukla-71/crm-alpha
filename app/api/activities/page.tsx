'use client';

import { Activity } from '@prisma/client';
import { useState } from 'react';
import { useCRMStore } from '@/lib/store/store';
import { PlusIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

type ActivityType = 'email' | 'call' | 'meeting';

const activityIcons: Record<ActivityType, typeof PhoneIcon> = {
  email: EnvelopeIcon,
  call: PhoneIcon,
  meeting: CalendarIcon,
};

const activityColors: Record<ActivityType, string> = {
  email: 'text-purple-600',
  call: 'text-blue-600',
  meeting: 'text-green-600',
};

export default function ActivitiesPage() {
  const { activities, contacts, deals, addActivity } = useCRMStore();
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filteredActivities = activities.filter((activity) =>
    filter === 'all' ? true : activity.type === filter
  );

  const getContactName = (contactId: string | null) => {
    if (!contactId) return '';
    const contact = contacts.find((c) => c.id === contactId);
    return contact ? contact.name : '';
  };

  const getDealTitle = (dealId: string | null) => {
    if (!dealId) return '';
    const deal = deals.find((d) => d.id === dealId);
    return deal ? deal.title : '';
  };

  const handleAddActivity = (type: ActivityType) => {
    const newActivity = {
      type,
      description: '',
      date: new Date(),
      contactId: contacts[0]?.id ?? null,
      dealId: deals[0]?.id ?? null,
    };
    addActivity(newActivity);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Activities</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddActivity('call')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PhoneIcon className="h-5 w-5 mr-2" />
            Log Call
          </button>
          <button
            onClick={() => handleAddActivity('email')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Log Email
          </button>
          <button
            onClick={() => handleAddActivity('meeting')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Log Meeting
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('call')}
          className={`px-4 py-2 rounded-md ${
            filter === 'call'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Calls
        </button>
        <button
          onClick={() => setFilter('email')}
          className={`px-4 py-2 rounded-md ${
            filter === 'email'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Emails
        </button>
        <button
          onClick={() => setFilter('meeting')}
          className={`px-4 py-2 rounded-md ${
            filter === 'meeting'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Meetings
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => {
            const Icon = activityIcons[activity.type as ActivityType];
            const colorClass = activityColors[activity.type as ActivityType];
            return (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 mr-3 ${colorClass}`} />
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </p>
                        <p className="ml-2 text-sm text-gray-500">
                          with {getContactName(activity.contactId)}
                        </p>
                        {activity.dealId && (
                          <p className="ml-2 text-sm text-gray-500">
                            for {getDealTitle(activity.dealId)}
                          </p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <div className="ml-6 flex items-center">
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
