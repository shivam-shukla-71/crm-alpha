export interface Contact {
  region: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead';
  lastContact: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'proposal' | 'negotiation' | 'closed';
  contactId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  contactId?: string;
  dealId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting';
  description: string;
  date: string;
  contactId: string;
  dealId?: string;
  createdAt?: string;
}

// Mock Data
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'ABC Corp',
    status: 'active',
    region: 'North America',
    lastContact: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    company: 'XYZ Inc',
    status: 'active',
    region: 'Europe',
    lastContact: '2024-01-02T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    value: 50000,
    stage: 'proposal',
    contactId: '1',
    description: 'Annual enterprise license renewal',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Consulting Project',
    value: 25000,
    stage: 'negotiation',
    contactId: '2',
    description: 'Digital transformation consulting',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'New Lead - Software Integration',
    value: 15000,
    stage: 'lead',
    description: 'Potential integration project',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'Hardware Upgrade Deal',
    value: 75000,
    stage: 'closed',
    contactId: '1',
    description: 'Complete hardware infrastructure upgrade',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up on proposal',
    description: 'Send follow-up email regarding the enterprise software proposal',
    status: 'pending',
    dueDate: '2024-01-10T00:00:00Z',
    contactId: '1',
    dealId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Schedule demo',
    description: 'Arrange product demonstration for potential client',
    status: 'completed',
    dueDate: '2024-01-05T00:00:00Z',
    contactId: '2',
    dealId: '2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '3',
    title: 'Prepare contract',
    description: 'Draft contract for software integration project',
    status: 'pending',
    dueDate: '2024-01-15T00:00:00Z',
    dealId: '3',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    description: 'Initial discovery call about enterprise software needs',
    date: '2024-01-01T10:00:00Z',
    contactId: '1',
    dealId: '1',
    createdAt: '2024-01-01T11:00:00Z',
  },
  {
    id: '2',
    type: 'email',
    description: 'Sent proposal and pricing details',
    date: '2024-01-02T14:30:00Z',
    contactId: '2',
    dealId: '2',
    createdAt: '2024-01-02T14:35:00Z',
  },
  {
    id: '3',
    type: 'meeting',
    description: 'Product demo and technical discussion',
    date: '2024-01-03T15:00:00Z',
    contactId: '1',
    dealId: '1',
    createdAt: '2024-01-03T16:30:00Z',
  },
];

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with John',
    description: 'Discuss software requirements',
    dueDate: '2024-03-15',
    status: 'pending',
    contactId: '1',
    dealId: '1',
  },
  {
    id: '2',
    title: 'Send proposal to Jane',
    description: 'Prepare and send consulting proposal',
    dueDate: '2024-03-14',
    status: 'pending',
    contactId: '2',
    dealId: '2',
  },
];

export const activities: Activity[] = [
  {
    id: '1',
    type: 'call',
    description: 'Initial discussion about requirements',
    date: '2024-03-10',
    contactId: '1',
    dealId: '1',
  },
  {
    id: '2',
    type: 'email',
    description: 'Sent project timeline',
    date: '2024-03-11',
    contactId: '2',
    dealId: '2',
  },
];
