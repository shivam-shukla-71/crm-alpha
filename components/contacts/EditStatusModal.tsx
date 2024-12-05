'use client';

import { useState } from 'react';
import { useCRMStore } from '@/lib/store/store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Contact } from '@prisma/client';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  lead: 'bg-yellow-100 text-yellow-800',
  customer: 'bg-blue-100 text-blue-800',
  prospect: 'bg-purple-100 text-purple-800',
};

export default function EditStatusModal({ isOpen, onClose, contact }: EditStatusModalProps) {
  const { updateContact } = useCRMStore();
  const [status, setStatus] = useState<ContactStatus>(contact.status as ContactStatus);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await updateContact(contact.id, { status: status });
      onClose();
    } catch (error) {
      console.error('Error updating contact status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update contact status');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Update Status</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {(Object.keys(statusColors) as ContactStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => setStatus(statusOption)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  status === statusOption
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-transparent hover:border-gray-200'
                } ${statusColors[statusOption]}`}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
