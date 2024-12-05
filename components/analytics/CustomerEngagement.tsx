'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface CustomerEngagementProps {
  deals: Array<{
    id: string;
    title: string;
    stage: string;
    value: number;
    contactId: string | null;
    createdAt: Date;
    updatedAt: Date;
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
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export function CustomerEngagement({ deals, contacts }: CustomerEngagementProps) {
  const regionData = deals
    .reduce((acc, deal) => {
      const contact = contacts.find(c => c.id === deal.contactId);
      if (contact) {
        const region = contact.company || 'Unknown';
        if (!acc[region]) {
          acc[region] = {
            count: 0,
            value: 0,
          };
        }
        acc[region].count += 1;
        acc[region].value += deal.value;
      }
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

  const regions = Object.keys(regionData);
  const dealCounts = regions.map(region => regionData[region].count);
  const dealValues = regions.map(region => regionData[region].value);

  const chartData = {
    labels: regions,
    datasets: [
      {
        label: 'Number of Deals',
        data: dealCounts,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Total Value ($)',
        data: dealValues,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Deals',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Total Value ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Customer Engagement by Region',
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
}
