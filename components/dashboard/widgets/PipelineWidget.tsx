'use client';

import { useCRMStore } from '@/lib/store/store';
import DashboardWidget from '../DashboardWidget';

export default function PipelineWidget() {
  const { deals } = useCRMStore();

  const stageValues = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + deal.value;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = Object.values(stageValues).reduce((a, b) => a + b, 0);

  const stages = ['lead', 'proposal', 'negotiation', 'closed'];
  const stageColors = {
    lead: 'bg-blue-200',
    proposal: 'bg-yellow-200',
    negotiation: 'bg-purple-200',
    closed: 'bg-green-200',
  };

  return (
    <DashboardWidget title="Pipeline Overview">
      <div className="mt-1">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          ${totalValue.toLocaleString()}
          <span className="ml-2 text-sm font-medium text-gray-500">total pipeline value</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                Pipeline Progress
              </span>
            </div>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full">
            {stages.map(stage => {
              const percentage = ((stageValues[stage] || 0) / totalValue) * 100;
              return (
                <div
                  key={stage}
                  className={`${stageColors[stage as keyof typeof stageColors]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {stages.map(stage => (
              <div key={stage} className="text-xs text-gray-600">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-1 ${
                      stageColors[stage as keyof typeof stageColors]
                    }`}
                  />
                  <span className="capitalize">{stage}</span>
                </div>
                <div className="mt-1">${(stageValues[stage] || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}
