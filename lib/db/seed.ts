const { PrismaClient } = require('@prisma/client');
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
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@designco.com',
        phone: '098-765-4321',
        company: 'Design Co',
        position: 'Designer',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike@innovate.com',
        phone: '555-123-4567',
        company: 'Innovate Inc',
        position: 'CTO',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Sarah Williams',
        email: 'sarah@marketpro.com',
        phone: '777-888-9999',
        company: 'Market Pro',
        position: 'Marketing Director',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'David Brown',
        email: 'david@salesforce.com',
        phone: '111-222-3333',
        company: 'Sales Force',
        position: 'Sales Manager',
      },
    }),
  ]);

  // Create sample deals with different stages
  const deals = await Promise.all([
    // Tech Corp Deals
    prisma.deal.create({
      data: {
        title: 'Enterprise Software License',
        value: 50000,
        stage: 'proposal',
        contactId: contacts[0].id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Cloud Migration Project',
        value: 75000,
        stage: 'negotiation',
        contactId: contacts[0].id,
      },
    }),
    // Design Co Deals
    prisma.deal.create({
      data: {
        title: 'Website Redesign',
        value: 25000,
        stage: 'closed',
        contactId: contacts[1].id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Mobile App Design',
        value: 35000,
        stage: 'lead',
        contactId: contacts[1].id,
      },
    }),
    // Innovate Inc Deals
    prisma.deal.create({
      data: {
        title: 'AI Implementation',
        value: 120000,
        stage: 'proposal',
        contactId: contacts[2].id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Data Analytics Platform',
        value: 85000,
        stage: 'negotiation',
        contactId: contacts[2].id,
      },
    }),
    // Market Pro Deals
    prisma.deal.create({
      data: {
        title: 'Digital Marketing Campaign',
        value: 45000,
        stage: 'closed',
        contactId: contacts[3].id,
      },
    }),
    // Sales Force Deals
    prisma.deal.create({
      data: {
        title: 'CRM Integration',
        value: 65000,
        stage: 'lead',
        contactId: contacts[4].id,
      },
    }),
  ]);

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Follow up meeting',
        description: 'Discuss proposal details for Enterprise Software License',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'high',
        contactId: contacts[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Send contract draft',
        description: 'Prepare and send contract for Website Redesign',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'completed',
        priority: 'medium',
        contactId: contacts[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Technical review',
        description: 'Review AI implementation requirements',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'high',
        contactId: contacts[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Campaign planning',
        description: 'Plan digital marketing campaign strategy',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        contactId: contacts[3].id,
      },
    }),
  ]);

  // Create sample activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'call',
        description: 'Initial discussion about Enterprise Software License',
        contactId: contacts[0].id,
        dealId: deals[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'email',
        description: 'Sent Website Redesign proposal',
        contactId: contacts[1].id,
        dealId: deals[2].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'meeting',
        description: 'Technical discussion for AI Implementation',
        contactId: contacts[2].id,
        dealId: deals[4].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'call',
        description: 'Follow-up call about Digital Marketing Campaign',
        contactId: contacts[3].id,
        dealId: deals[6].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'email',
        description: 'Sent CRM Integration requirements document',
        contactId: contacts[4].id,
        dealId: deals[7].id,
      },
    }),
  ]);

  console.log('Sample data seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
