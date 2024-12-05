import { create } from 'zustand';
import type { Contact, Deal, Task, Activity } from '@prisma/client';

// Define valid status types
type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

// Ensure Contact type matches Prisma schema
type ContactWithRelations = Contact & {
  deals?: Deal[];
  tasks?: Task[];
  activities?: Activity[];
};

type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed';

interface CRMStore {
  contacts: ContactWithRelations[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  searchTerm: string;
  
  // Data fetching
  fetchContacts: () => Promise<void>;
  fetchDeals: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  
  // Search
  setSearchTerm: (term: string) => void;
  
  // Contact actions
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Deal actions
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDeal: (id: string, newStage: DealStage) => Promise<void>;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (id: string, data: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useCRMStore = create<CRMStore>((set) => ({
  contacts: [],
  deals: [],
  tasks: [],
  activities: [],
  searchTerm: '',
  
  // Data fetching
  fetchContacts: async () => {
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const contacts = await response.json();
      set({ contacts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  },
  
  fetchDeals: async () => {
    try {
      const response = await fetch('/api/pipeline');
      if (!response.ok) throw new Error('Failed to fetch deals');
      const deals = await response.json();
      set({ deals });
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  },
  
  fetchTasks: async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      set({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },
  
  fetchActivities: async () => {
    try {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const activities = await response.json();
      set({ activities });
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  // Contact actions
  addContact: async (contact) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      if (!response.ok) throw new Error('Failed to create contact');
      const newContact = await response.json();
      set((state) => ({
        contacts: [...state.contacts, newContact],
      }));
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  
  updateContact: async (id, contact) => {
    try {
      if (!id) {
        throw new Error('Contact ID is required');
      }

      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...contact }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update contact');
      }
      
      const updatedContact = await response.json();
      set((state) => ({
        contacts: state.contacts.map((c) =>
          c.id === id ? { ...c, ...updatedContact } : c
        ),
      }));

      return updatedContact;
    } catch (error) {
      console.error('Error in updateContact:', error);
      throw error instanceof Error ? error : new Error('Failed to update contact');
    }
  },
  
  deleteContact: async (id) => {
    try {
      const response = await fetch('/api/contacts?' + new URLSearchParams({ id }), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete contact');
      }

      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error instanceof Error ? error : new Error('Failed to delete contact');
    }
  },
  
  // Deal actions
  addDeal: async (deal) => {
    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (!response.ok) throw new Error('Failed to create deal');
      const newDeal = await response.json();
      set((state) => ({
        deals: [...state.deals, newDeal],
      }));
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },
  
  updateDeal: async (id, deal) => {
    try {
      const response = await fetch(`/api/pipeline`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...deal }),
      });
      if (!response.ok) throw new Error('Failed to update deal');
      const updatedDeal = await response.json();
      set((state) => ({
        deals: state.deals.map((d) =>
          d.id === id ? updatedDeal : d
        ),
      }));
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  },
  
  deleteDeal: async (id) => {
    try {
      const response = await fetch(`/api/pipeline?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete deal');
      set((state) => ({
        deals: state.deals.filter((d) => d.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  },
  
  moveDeal: async (id, newStage) => {
    try {
      const response = await fetch(`/api/pipeline`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage: newStage }),
      });
      if (!response.ok) throw new Error('Failed to move deal');
      const updatedDeal = await response.json();
      set((state) => ({
        deals: state.deals.map((d) =>
          d.id === id ? updatedDeal : d
        ),
      }));
    } catch (error) {
      console.error('Error moving deal:', error);
      throw error;
    }
  },
  
  // Task actions
  addTask: async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      const newTask = await response.json();
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error instanceof Error ? error : new Error('Failed to create task');
    }
  },
  
  updateTask: async (id, task) => {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...task }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }
      
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updatedTask } : t
        ),
      }));

      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error instanceof Error ? error : new Error('Failed to update task');
    }
  },
  
  deleteTask: async (id) => {
    try {
      const response = await fetch('/api/tasks?' + new URLSearchParams({ id }), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error instanceof Error ? error : new Error('Failed to delete task');
    }
  },
  
  toggleTaskStatus: async (id) => {
    try {
      const state = useCRMStore.getState();
      const task = state.tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }

      const nextStatus = {
        'TODO': 'IN_PROGRESS',
        'IN_PROGRESS': 'DONE',
        'DONE': 'TODO'
      }[task.status] || 'TODO';

      await useCRMStore.getState().updateTask(id, {
        status: nextStatus
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error instanceof Error ? error : new Error('Failed to toggle task status');
    }
  },
  
  // Activity actions
  addActivity: async (activity) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      
      if (!response.ok) throw new Error('Failed to create activity');
      const newActivity = await response.json();
      
      set((state) => ({
        activities: [...state.activities, newActivity],
      }));
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  },
  
  updateActivity: async (id, data) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to update activity');
      const updatedActivity = await response.json();
      
      set((state) => ({
        activities: state.activities.map((activity) =>
          activity.id === id ? updatedActivity : activity
        ),
      }));
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  },
  
  deleteActivity: async (id) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) throw new Error('Failed to delete activity');
      
      set((state) => ({
        activities: state.activities.filter((activity) => activity.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  },
}));
