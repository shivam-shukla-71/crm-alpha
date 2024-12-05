'use client';

import { useCRMStore } from '@/lib/store/store';
import DashboardWidget from '../DashboardWidget';

export default function TasksWidget() {
  const { tasks } = useCRMStore();
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <DashboardWidget title="Tasks">
      <div className="mt-1">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {pendingTasks.length}
          <span className="ml-2 text-sm font-medium text-gray-500">pending tasks</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="space-y-2">
          {pendingTasks.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center text-sm">
              <div className="flex-1 truncate">{task.title}</div>
              <div className="ml-2 flex-shrink-0 text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardWidget>
  );
}
