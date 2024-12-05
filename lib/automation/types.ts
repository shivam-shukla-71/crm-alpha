export type TriggerType = 
  | 'task_due' 
  | 'deal_stage_change'
  | 'task_assigned'
  | 'contact_inactive'
  | 'follow_up_needed';

export type ActionType = 
  | 'send_email'
  | 'create_task'
  | 'send_notification'
  | 'update_contact_status';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: {
    type: TriggerType;
    conditions: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }[];
  };
  actions: {
    type: ActionType;
    params: Record<string, any>;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}
