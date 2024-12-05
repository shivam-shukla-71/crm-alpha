'use client';

import { useState, useEffect } from 'react';
import { useCRMStore } from '@/lib/store/store';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import TaskModal from '@/components/tasks/TaskModal';
import type { Task } from '@prisma/client';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export default function TasksPage() {
  const { tasks, updateTask, contacts, deals, fetchTasks, fetchContacts, fetchDeals } = useCRMStore();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
    fetchContacts();
    fetchDeals();
  }, [fetchTasks, fetchContacts, fetchDeals]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <XMarkIcon className="mr-2 h-4 w-4" />;
      case 'IN_PROGRESS':
        return <ClockIcon className="mr-2 h-4 w-4" />;
      case 'DONE':
        return <CheckIcon className="mr-2 h-4 w-4" />;
      default:
        return <XMarkIcon className="mr-2 h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'text-gray-600';
      case 'MEDIUM':
        return 'text-orange-600';
      case 'HIGH':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <button 
          onClick={() => {
            setSelectedTask(undefined);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Task
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('TODO')}
          className={`px-4 py-2 rounded-md ${
            filter === 'TODO'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-4 py-2 rounded-md ${
            filter === 'IN_PROGRESS'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('DONE')}
          className={`px-4 py-2 rounded-md ${
            filter === 'DONE'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Done
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <li key={task.id} onClick={() => handleEditTask(task)} className="hover:bg-gray-50 cursor-pointer">
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className={`font-medium truncate ${getPriorityColor(task.priority as TaskPriority)}`}>
                        {task.title}
                      </p>
                      {task.contactId && (
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          for {getContactName(task.contactId)}
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>{task.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex space-x-4">
                      <div
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${getStatusColor(task.status)}`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        mode={selectedTask ? 'edit' : 'create'}
        taskId={selectedTask?.id}
      />
    </div>
  );
}
