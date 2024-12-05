'use client';

import { Activity } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useCRMStore } from '@/lib/store/store';
import { PlusIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ActivityModal from '@/components/activities/ActivityModal';

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
  const { activities, contacts, deals, deleteActivity, fetchActivities, fetchContacts, fetchDeals } = useCRMStore();
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchActivities(),
          fetchContacts(),
          fetchDeals()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchActivities, fetchContacts, fetchDeals]);

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
    setSelectedActivity(undefined);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No activities found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const Icon = activityIcons[activity.type as ActivityType];
            const colorClass = activityColors[activity.type as ActivityType];
            
            return (
              <div
                key={activity.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`${colorClass} mt-1`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {activity.description}
                      </div>
                      {(activity.contactId || activity.dealId) && (
                        <div className="mt-1 text-sm text-gray-500">
                          {activity.contactId && (
                            <span className="mr-2">Contact: {getContactName(activity.contactId)}</span>
                          )}
                          {activity.dealId && (
                            <span>Deal: {getDealTitle(activity.dealId)}</span>
                          )}
                        </div>
                      )}
                      <div className="mt-1 text-sm text-gray-500">
                        {new Date(activity.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <ActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activity={selectedActivity}
          contacts={contacts}
          deals={deals}
        />
      )}
    </div>
  );
}
