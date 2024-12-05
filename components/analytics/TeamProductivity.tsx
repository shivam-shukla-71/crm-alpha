'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface TeamProductivityProps {
  deals: Array<{
    id: string;
    stage: string;
    value: number;
    contactId: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    position: string | null;
    lastContact: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
);

export default function TeamProductivity({ deals, contacts }: TeamProductivityProps) {
  // Calculate deals per sales rep - only include deals with valid contactId
  const salesRepDeals = deals
    .filter(deal => deal.contactId) // Filter out deals without contactId
    .reduce((acc, deal) => {
      const contact = contacts.find(c => c.id === deal.contactId);
      if (contact) {
        acc[contact.name] = (acc[contact.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(salesRepDeals),
    datasets: [
      {
        label: 'Number of Deals',
        data: Object.values(salesRepDeals),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Deals by Sales Representative',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar options={options} data={data} height={300} />
    </div>
  );
}
