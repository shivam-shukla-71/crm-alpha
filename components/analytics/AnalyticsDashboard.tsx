'use client';

import { useState } from 'react';
import { useCRMStore } from '@/lib/store/store';
import SalesChart from './SalesChart';
import TeamProductivity from './TeamProductivity';
import { CustomerEngagement } from './CustomerEngagement';

export default function AnalyticsDashboard() {
  const { deals, contacts } = useCRMStore();
  const [salesRepFilter, setSalesRepFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  // Get unique sales reps and companies
  const salesReps = [...new Set(contacts.map(contact => contact.name))];
  const companies = [...new Set(contacts.map(contact => contact.company || 'Unknown'))];

  // Filter deals based on selected filters
  const filteredDeals = deals.filter(deal => {
    // Skip deals without contactId when filtering by sales rep or company
    if (!deal.contactId && (salesRepFilter !== 'all' || companyFilter !== 'all')) {
      return false;
    }

    const contact = contacts.find(c => c.id === deal.contactId);
    if (!contact && (salesRepFilter !== 'all' || companyFilter !== 'all')) {
      return false;
    }

    const matchesSalesRep = salesRepFilter === 'all' || (contact && contact.name === salesRepFilter);
    const matchesCompany = companyFilter === 'all' || (contact && contact.company === companyFilter);

    return matchesSalesRep && matchesCompany;
  });

  // Calculate summary metrics using filtered deals
  const totalDeals = filteredDeals.length;
  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
  const winRate = filteredDeals.filter(deal => deal.stage === 'closed').length / totalDeals * 100 || 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sales Rep</label>
          <select
            value={salesRepFilter}
            onChange={(e) => setSalesRepFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Sales Reps</option>
            {salesReps.map((rep) => (
              <option key={rep} value={rep}>
                {rep}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalDeals}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalValue.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Deal Size</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${avgDealSize.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{winRate.toFixed(1)}%</dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Pipeline</h3>
          <SalesChart deals={filteredDeals} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Productivity</h3>
          <TeamProductivity deals={filteredDeals} contacts={contacts} />
        </div>
      </div>

      {/* Customer Engagement */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Engagement</h3>
        <CustomerEngagement deals={filteredDeals} contacts={contacts} />
      </div>
    </div>
  );
}
