import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();

  // Create sample contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'John Doe',
        email: 'john@techcorp.com',
        phone: '123-456-7890',
        company: 'Tech Corp',
        position: 'CEO',
        status: 'active',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@designco.com',
        phone: '098-765-4321',
        company: 'Design Co',
        position: 'Designer',
        status: 'active',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike@innovate.com',
        phone: '555-123-4567',
        company: 'Innovate Inc',
        position: 'CTO',
        status: 'active',
      },
    }),
  ]);

  // Create sample deals
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: 'Enterprise Software License',
        value: 50000,
        stage: 'proposal',
        description: 'Annual enterprise license renewal',
        contactId: contacts[0].id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Website Redesign Project',
        value: 25000,
        stage: 'negotiation',
        description: 'Complete website overhaul',
        contactId: contacts[1].id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Cloud Migration Service',
        value: 75000,
        stage: 'lead',
        description: 'AWS cloud migration project',
        contactId: contacts[2].id,
      },
    }),
  ]);

  // Create sample tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Follow up on proposal',
        description: 'Send detailed pricing breakdown',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'TODO',
        priority: 'medium',
        contactId: contacts[0].id,
        dealId: deals[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Schedule design review',
        description: 'Review website mockups with client',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'IN_PROGRESS',
        priority: 'medium',
        contactId: contacts[1].id,
        dealId: deals[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare migration plan',
        description: 'Document current infrastructure and plan migration steps',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'DONE',
        priority: 'high',
        contactId: contacts[2].id,
        dealId: deals[2].id,
      },
    }),
  ]);

  // Create sample activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'call',
        description: 'Initial discovery call',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        contactId: contacts[0].id,
        dealId: deals[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'email',
        description: 'Sent proposal draft',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        contactId: contacts[0].id,
        dealId: deals[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'meeting',
        description: 'Design requirements gathering',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        contactId: contacts[1].id,
        dealId: deals[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'call',
        description: 'Technical discussion',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        contactId: contacts[2].id,
        dealId: deals[2].id,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
