'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCRMStore } from '@/lib/store/store';
import type { Deal } from '@prisma/client';

type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal;
}

export default function DealModal({ isOpen, onClose, deal }: DealModalProps) {
  const { contacts, addDeal, updateDeal, deleteDeal } = useCRMStore();
  const [formData, setFormData] = useState<{
    title: string;
    value: number;
    stage: DealStage;
    contactId: string | null;
    description: string;
  }>({
    title: '',
    value: 0,
    stage: 'lead',
    contactId: null,
    description: '',
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value,
        stage: deal.stage as DealStage,
        contactId: deal.contactId,
        description: deal.description || '',
      });
    } else {
      setFormData({
        title: '',
        value: 0,
        stage: 'lead',
        contactId: null,
        description: '',
      });
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (deal) {
        await updateDeal(deal.id, formData);
      } else {
        await addDeal(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
      // You could add a toast notification here
    }
  };

  const handleDelete = async () => {
    if (!deal) return;
    try {
      await deleteDeal(deal.id);
      onClose();
    } catch (error) {
      console.error('Error deleting deal:', error);
      // You could add a toast notification here
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {deal ? 'Edit Deal' : 'New Deal'}
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="value"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Value
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="value"
                            id="value"
                            required
                            min="0"
                            step="0.01"
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={formData.value}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                value: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="stage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Stage
                        </label>
                        <select
                          id="stage"
                          name="stage"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          value={formData.stage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stage: e.target.value as DealStage,
                            })
                          }
                        >
                          <option value="lead">Lead</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Contact
                        </label>
                        <select
                          id="contact"
                          name="contact"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          value={formData.contactId || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactId: e.target.value || null,
                            })
                          }
                        >
                          <option value="">Select a contact</option>
                          {contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                              {contact.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {deal ? 'Update' : 'Create'}
                        </button>
                        {deal && (
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
