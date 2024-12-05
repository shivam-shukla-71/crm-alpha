'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCRMStore } from '@/lib/store/store';
import DealModal from '@/components/pipeline/DealModal';
import type { Deal, Activity } from '@prisma/client';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed';
const stages: DealStage[] = ['lead', 'proposal', 'negotiation', 'closed'];

const stageNames: Record<DealStage, string> = {
  lead: 'Leads',
  proposal: 'Proposals',
  negotiation: 'Negotiation',
  closed: 'Closed Deals',
};

const stageColors: Record<DealStage, string> = {
  lead: 'bg-gray-100',
  proposal: 'bg-blue-50',
  negotiation: 'bg-yellow-50',
  closed: 'bg-green-50',
};

export default function PipelinePage() {
  const { deals, activities, contacts, moveDeal, searchTerm, setSearchTerm, fetchDeals, fetchContacts } = useCRMStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([fetchDeals(), fetchContacts()]);
      } catch (error) {
        console.error('Error loading pipeline data:', error);
        setError('Failed to load pipeline data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchDeals, fetchContacts]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Drop outside the list
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      const newStage = destination.droppableId as DealStage;
      await moveDeal(draggableId, newStage);
    } catch (error) {
      console.error('Error moving deal:', error);
      setError('Failed to move deal. Please try again.');
    }
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter((deal) => deal.stage === stage);
    return acc;
  }, {} as Record<DealStage, Deal[]>);

  const getTotalValue = (deals: Deal[]) =>
    deals.reduce((sum, deal) => sum + deal.value, 0);

  const getActivitiesForDeal = (dealId: string) => {
    return activities.filter(activity => activity.dealId === dealId);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading pipeline data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              className="ml-2 border-0 focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {showAnalytics ? 'Show Pipeline' : 'Show Analytics'}
          </button>
          <button
            onClick={() => {
              setSelectedDeal(undefined);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Deal
          </button>
        </div>
      </div>

      {showAnalytics ? (
        <AnalyticsDashboard />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {stages.map((stage) => (
              <div key={stage} className="flex flex-col rounded-lg bg-white p-4 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">{stageNames[stage]}</h2>
                  <span className="text-sm text-gray-500">
                    ${getTotalValue(dealsByStage[stage]).toLocaleString()}
                  </span>
                </div>
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2 min-h-[200px] p-2 rounded-md transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      {dealsByStage[stage]?.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={`rounded-md p-4 bg-white transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                              }`}
                              onClick={() => handleEditDeal(deal)}
                            >
                              <div className="mb-2 text-sm font-medium text-gray-900">
                                {deal.title}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                  ${deal.value.toLocaleString()}
                                </span>
                                {deal.contactId && (
                                  <span className="text-sm text-gray-500">
                                    {contacts.find((c) => c.id === deal.contactId)?.name}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <h4 className="text-sm font-medium text-gray-500">Recent Activities</h4>
                                <ul className="mt-1 space-y-1">
                                  {getActivitiesForDeal(deal.id).slice(0, 3).map((activity) => (
                                    <li key={activity.id} className="text-sm text-gray-600">
                                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} - {activity.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      <DealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeal(undefined);
        }}
        deal={selectedDeal}
      />
    </div>
  );
}
