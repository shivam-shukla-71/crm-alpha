# Modern CRM Application

A powerful Customer Relationship Management (CRM) application built with Next.js 14, TypeScript, and modern web technologies.

## Features

- 📊 Dashboard with activity overview and key metrics
- 👥 Contact management
- ✅ Task tracking and management
- 💼 Sales pipeline with drag-and-drop interface
- 📝 Activity logging
- ⚙️ Customizable settings

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (Database ORM)
- Chart.js (for analytics)
- Headless UI (for accessible components)
- Hero Icons
- React Beautiful DnD
- Zustand (state management)
- next-intl (internationalization)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the variables:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
crm-alpha/
├── app/               # Next.js 14 app directory
│   ├── activities/    # Activity management
│   ├── api/          # API routes
│   ├── automation/   # Automation rules
│   ├── contacts/     # Contact management
│   ├── pipeline/     # Sales pipeline
│   ├── settings/     # Application settings
│   └── tasks/        # Task management
├── components/        # Reusable components
├── lib/              # Utility functions
├── messages/         # Internationalization
├── prisma/          # Database schema and migrations
└── types/           # TypeScript types
```

## Development

- Run tests: `npm test`
- Format code: `npm run format`
- Lint code: `npm run lint`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
