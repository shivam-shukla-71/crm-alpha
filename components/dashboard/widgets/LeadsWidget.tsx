'use client';

import { useCRMStore } from '@/lib/store/store';
import DashboardWidget from '../DashboardWidget';

export default function LeadsWidget() {
  const { deals } = useCRMStore();
  const leads = deals.filter(deal => deal.stage === 'lead');
  const totalValue = leads.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <DashboardWidget title="Open Leads">
      <div className="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {leads.length}
          <span className="ml-2 text-sm font-medium text-gray-500">leads</span>
        </div>
        <div className="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
          ${totalValue.toLocaleString()}
        </div>
      </div>
      <div className="mt-4">
        <div className="space-y-2">
          {leads.slice(0, 3).map(lead => (
            <div key={lead.id} className="flex items-center justify-between text-sm">
              <div className="truncate">{lead.title}</div>
              <div className="ml-2 flex-shrink-0 text-gray-500">
                ${lead.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardWidget>
  );
}
