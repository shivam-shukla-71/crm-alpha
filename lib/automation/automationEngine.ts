import { AutomationRule, TriggerType, ActionType } from './types';
import { useCRMStore } from '../store/store';
import { Task, Contact, Deal } from '../store/mockDb';

class AutomationEngine {
  private rules: AutomationRule[] = [];

  constructor() {
    // Load saved rules from localStorage
    this.loadRules();
    this.initializeEventListeners();
  }

  private loadRules() {
    if (typeof window === 'undefined') return;
    const savedRules = localStorage.getItem('automation_rules');
    if (savedRules) {
      this.rules = JSON.parse(savedRules);
    }
  }

  private saveRules() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('automation_rules', JSON.stringify(this.rules));
  }

  private initializeEventListeners() {
    if (typeof window === 'undefined') return;
    // Check for due tasks every minute
    setInterval(() => this.checkDueTasks(), 60000);
    
    // Check for inactive contacts daily
    setInterval(() => this.checkInactiveContacts(), 86400000);
  }

  private async executeAction(action: { type: ActionType; params: Record<string, any> }, context: any) {
    const store = useCRMStore.getState();

    switch (action.type) {
      case 'send_email':
        await this.sendEmail(action.params.template, context);
        break;

      case 'create_task':
        store.addTask({
          title: this.interpolateTemplate(action.params.title, context),
          description: this.interpolateTemplate(action.params.description, context),
          dueDate: this.calculateDueDate(action.params.dueDays),
          status: 'pending',
          contactId: context.contactId,
          priority: 'medium',
        });
        break;

      case 'send_notification':
        this.showNotification(
          this.interpolateTemplate(action.params.title, context),
          this.interpolateTemplate(action.params.message, context)
        );
        break;

      case 'update_contact_status':
        if (context.contactId) {
          store.updateContact(context.contactId, {
            status: action.params.status,
          });
        }
        break;
    }
  }

  private async sendEmail(template: string, context: any) {
    // In a real application, this would connect to an email service
    console.log('Sending email:', {
      template,
      context,
    });
  }

  private showNotification(title: string, message: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }

  private interpolateTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '');
  }

  private calculateDueDate(daysFromNow: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  }

  private checkDueTasks() {
    const store = useCRMStore.getState();
    const now = new Date();

    store.tasks.forEach(task => {
      if (task.status === 'pending' && new Date(task.dueDate) <= now) {
        this.processTrigger('task_due', { task });
      }
    });
  }

  private checkInactiveContacts() {
    const store = useCRMStore.getState();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    store.contacts.forEach(contact => {
      if (contact.lastContact && new Date(contact.lastContact) < thirtyDaysAgo) {
        this.processTrigger('contact_inactive', { contact });
      }
    });
  }

  public processTrigger(triggerType: TriggerType, context: any) {
    this.rules
      .filter(rule => rule.isActive && rule.trigger.type === triggerType)
      .forEach(rule => {
        const conditionsMet = rule.trigger.conditions.every(condition => {
          const fieldValue = this.getFieldValue(context, condition.field);
          return this.evaluateCondition(fieldValue, condition.operator, condition.value);
        });

        if (conditionsMet) {
          rule.actions.forEach(action => this.executeAction(action, context));
        }
      });
  }

  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }

  private evaluateCondition(fieldValue: any, operator: string, compareValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === compareValue;
      case 'not_equals':
        return fieldValue !== compareValue;
      case 'contains':
        return String(fieldValue).includes(String(compareValue));
      case 'greater_than':
        return fieldValue > compareValue;
      case 'less_than':
        return fieldValue < compareValue;
      default:
        return false;
    }
  }

  public addRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRule: AutomationRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rules.push(newRule);
    this.saveRules();
    return newRule;
  }

  public deleteRule(ruleId: string) {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
    this.saveRules();
  }

  public updateRule(ruleId: string, updates: Partial<AutomationRule>) {
    this.rules = this.rules.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, ...updates, updatedAt: new Date().toISOString() };
      }
      return rule;
    });
    this.saveRules();
  }

  public getRules(): AutomationRule[] {
    return this.rules;
  }
}

export const automationEngine = new AutomationEngine();
