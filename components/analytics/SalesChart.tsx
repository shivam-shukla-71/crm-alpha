'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useCRMStore } from '@/lib/store/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  deals: Array<{
    id: string;
    title: string;
    stage: string;
    value: number;
    contactId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export default function SalesChart({ deals }: SalesChartProps) {
  // Group deals by stage and calculate total value for each stage
  const dealsByStage = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = 0;
    }
    acc[deal.stage] += deal.value;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(dealsByStage),
    datasets: [
      {
        label: 'Total Value',
        data: Object.values(dealsByStage),
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
        text: 'Sales Pipeline by Stage',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Value ($)',
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Bar options={options} data={data} />
    </div>
  );
}
