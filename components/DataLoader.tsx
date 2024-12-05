'use client';

import { useEffect } from 'react';
import { useCRMStore } from '@/lib/store/store';

export default function DataLoader({ children }: { children: React.ReactNode }) {
  const { fetchContacts, fetchDeals, fetchTasks, fetchActivities } = useCRMStore();

  useEffect(() => {
    fetchContacts();
    fetchDeals();
    fetchTasks();
    fetchActivities();
  }, [fetchContacts, fetchDeals, fetchTasks, fetchActivities]);

  return <>{children}</>;
}
