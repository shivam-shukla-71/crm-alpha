# Technical Documentation

## Component Architecture

### State Management
The application uses Zustand for state management with the following stores:

```typescript
// Main CRM Store
interface CRMStore {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  searchTerm: string;
  // ... actions
}

// Settings Store
interface SettingsStore {
  theme: 'light' | 'dark';
  language: string;
  companySettings: CompanySettings;
  // ... actions
}
```

### Key Components

#### 1. Dashboard Widgets
Each widget is a self-contained component with its own state management:
```typescript
interface WidgetProps {
  id: string;
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isCollapsed?: boolean;
}
```

#### 2. Pipeline Board
Uses react-beautiful-dnd for drag-and-drop functionality:
```typescript
interface PipelineStage {
  id: string;
  title: string;
  deals: Deal[];
}

interface DealCard {
  id: string;
  title: string;
  value: number;
  stage: string;
  contactId?: string;
}
```

#### 3. Analytics Components
Chart.js integration with custom configurations:
```typescript
interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  data: ChartData;
  options: ChartOptions;
}
```

## API Integration

### Data Fetching
Using Next.js 13 server components and API routes:

```typescript
// Server Component Example
async function DealsOverview() {
  const deals = await fetchDeals();
  return <DealsDisplay deals={deals} />;
}

// API Route Example
export async function GET(request: Request) {
  const deals = await db.deals.findMany();
  return Response.json(deals);
}
```

### Error Handling
Centralized error handling with custom error boundaries:

```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
```

## Database Schema

### Core Entities

#### Contacts
```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  lastContact?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Deals
```typescript
interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'proposal' | 'negotiation' | 'closed';
  contactId?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Tasks
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Database Implementation

### Overview
The CRM application uses SQLite as its local database, managed through Prisma ORM. This provides a lightweight, file-based database solution that requires no external services while maintaining data persistence.

### Database Schema

#### Contact Model
```prisma
model Contact {
  id          String    @id @default(uuid())
  name        String
  email       String    @unique
  phone       String?
  company     String?
  position    String?
  lastContact DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deals       Deal[]
  tasks       Task[]
  activities  Activity[]
}
```

#### Deal Model
```prisma
model Deal {
  id          String    @id @default(uuid())
  title       String
  value       Float
  stage       String
  contact     Contact?  @relation(fields: [contactId], references: [id])
  contactId   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  activities  Activity[]
}
```

#### Task Model
```prisma
model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime
  status      String
  priority    String
  contact     Contact?  @relation(fields: [contactId], references: [id])
  contactId   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Activity Model
```prisma
model Activity {
  id          String    @id @default(uuid())
  type        String
  description String
  date        DateTime  @default(now())
  contact     Contact?  @relation(fields: [contactId], references: [id])
  contactId   String?
  deal        Deal?     @relation(fields: [dealId], references: [id])
  dealId      String?
  createdAt   DateTime  @default(now())
}
```

### Data Access Layer
The application uses a centralized store pattern with Zustand, enhanced with Prisma client for database operations. Key features include:

- Asynchronous CRUD operations for all models
- Automatic timestamp management (createdAt, updatedAt)
- Relationship handling between models
- Type-safe database queries
- Optimistic updates for better UX

### Database Location
The SQLite database file is stored at `prisma/dev.db`. This file contains all application data and should be included in backups but excluded from version control.

### Data Migrations
Database schema changes are managed through Prisma migrations. To create a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

### Seeding
Initial data can be populated using the seed script at `lib/db/seed.ts`. To run the seeder:

```bash
npx ts-node lib/db/seed.ts
```

### Type Safety
The database schema is automatically synchronized with TypeScript types through Prisma's code generation. After any schema changes, run:

```bash
npx prisma generate
```

## Performance Optimizations

### 1. Data Caching
- Implementation of React Query for server state management
- Local storage caching for user preferences
- Memoization of expensive calculations

### 2. Code Splitting
- Dynamic imports for large components
- Route-based code splitting
- Lazy loading of images and charts

### 3. Bundle Optimization
- Tree shaking of unused code
- Minification and compression
- Image optimization with Next.js Image component

## Testing Strategy

### Unit Tests
```typescript
describe('Deal Component', () => {
  it('should render deal details correctly', () => {
    // Test implementation
  });

  it('should handle status changes', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('Pipeline Flow', () => {
  it('should move deals between stages', () => {
    // Test implementation
  });
});
```

### E2E Tests
Using Cypress for end-to-end testing:
```typescript
describe('CRM Workflow', () => {
  it('should complete a full deal cycle', () => {
    // Test implementation
  });
});
```

## Security Measures

### 1. Input Validation
- Server-side validation using Zod
- Client-side form validation
- Sanitization of user inputs

### 2. Authentication
- JWT-based authentication
- Role-based access control
- Secure session management

### 3. Data Protection
- Encryption of sensitive data
- Secure API endpoints
- Rate limiting and request validation

## Deployment

### Production Build
```bash
# Build steps
npm run build
npm run start

# Environment variables
DATABASE_URL=
JWT_SECRET=
API_KEY=
```

### Monitoring
- Integration with logging services
- Performance monitoring
- Error tracking and reporting

## Maintenance

### 1. Updates
- Regular dependency updates
- Security patches
- Feature enhancements

### 2. Backup
- Database backup strategy
- Code repository backup
- Configuration backup

### 3. Monitoring
- System health checks
- Performance metrics
- Error logging and alerts
