'use client';

import { useCRMStore } from '@/lib/store/store';
import { Deal } from '@/lib/store/mockDb';

interface PipelineStageProps {
  title: string;
  stage: Deal['stage'];
  deals: Deal[];
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stage: Deal['stage']) => void;
}

export default function PipelineStage({
  title,
  stage,
  deals,
  onDragStart,
  onDragOver,
  onDrop
}: PipelineStageProps) {
  const stageDeals = deals.filter(deal => deal.stage === stage);
  const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div
      className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-xs font-medium text-gray-500">
          ${totalValue.toLocaleString()}
        </span>
      </div>
      <div className="space-y-3">
        {stageDeals.map((deal) => (
          <div
            key={deal.id}
            draggable
            onDragStart={(e) => onDragStart(e, deal)}
            className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
          >
            <h4 className="text-sm font-medium text-gray-900">{deal.title}</h4>
            <p className="text-sm text-gray-500 mt-1">
              ${deal.value.toLocaleString()}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {new Date(deal.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
