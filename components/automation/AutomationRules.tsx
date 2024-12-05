'use client';

import { useState, useEffect } from 'react';
import { AutomationRule, TriggerType, ActionType } from '@/lib/automation/types';
import { automationEngine } from '@/lib/automation/automationEngine';

export default function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    isActive: true,
    trigger: {
      type: 'task_due',
      conditions: [],
    },
    actions: [],
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && !initialized) {
      const savedRulesStr = localStorage.getItem('automationRules');
      let loadedRules: AutomationRule[] = [];
      
      if (savedRulesStr) {
        try {
          loadedRules = JSON.parse(savedRulesStr);
        } catch (e) {
          console.error('Failed to parse saved rules:', e);
        }
      }

      setRules(loadedRules);
      loadedRules.forEach(rule => automationEngine.addRule(rule));
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    // Only save rules after initialization
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem('automationRules', JSON.stringify(rules));
    }
  }, [rules, initialized]);

  const triggerTypes: TriggerType[] = [
    'task_due',
    'deal_stage_change',
    'task_assigned',
    'contact_inactive',
    'follow_up_needed',
  ];

  const actionTypes: ActionType[] = [
    'send_email',
    'create_task',
    'send_notification',
    'update_contact_status',
  ];

  const handleSaveRule = () => {
    if (newRule.name && newRule.trigger && newRule.actions) {
      const savedRule = automationEngine.addRule(newRule as AutomationRule);
      setRules([...rules, savedRule]);
      setShowNewRule(false);
      setNewRule({
        name: '',
        description: '',
        isActive: true,
        trigger: {
          type: 'task_due',
          conditions: [],
        },
        actions: [],
      });
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    automationEngine.deleteRule(ruleId);
    setRules(rules.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, isActive: !rule.isActive };
      }
      return rule;
    });
    setRules(updatedRules);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-theme-primary">Automation Rules</h1>
        <button
          onClick={() => setShowNewRule(true)}
          className="btn-primary rounded-md px-4 py-2"
        >
          Create New Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="bg-theme-primary p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{rule.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-3 py-1 rounded ${
                    rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-theme-secondary">{rule.description}</p>
            <div className="text-sm">
              <span className="font-medium">Trigger:</span> {rule.trigger.type}
            </div>
            <div className="text-sm">
              <span className="font-medium">Actions:</span>{' '}
              {rule.actions.map(action => action.type).join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* New Rule Modal */}
      {showNewRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Automation Rule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newRule.description}
                  onChange={e => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trigger Type</label>
                <select
                  value={newRule.trigger?.type}
                  onChange={e =>
                    setNewRule({
                      ...newRule,
                      trigger: { ...newRule.trigger!, type: e.target.value as TriggerType },
                    })
                  }
                  className="w-full rounded-md border-gray-300"
                >
                  {triggerTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Actions</label>
                <div className="space-y-2">
                  {newRule.actions?.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={action.type}
                        onChange={e => {
                          const newActions = [...(newRule.actions || [])];
                          newActions[index] = {
                            type: e.target.value as ActionType,
                            params: {},
                          };
                          setNewRule({ ...newRule, actions: newActions });
                        }}
                        className="rounded-md border-gray-300"
                      >
                        {actionTypes.map(type => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const newActions = [...(newRule.actions || [])];
                          newActions.splice(index, 1);
                          setNewRule({ ...newRule, actions: newActions });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setNewRule({
                        ...newRule,
                        actions: [
                          ...(newRule.actions || []),
                          { type: 'send_notification', params: {} },
                        ],
                      })
                    }
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Action
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewRule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="btn-primary px-4 py-2 rounded-md"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
