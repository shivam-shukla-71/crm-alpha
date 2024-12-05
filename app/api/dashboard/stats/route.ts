import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [contacts, tasks, deals, activities] = await Promise.all([
      prisma.contact.count(),
      prisma.task.count(),
      prisma.deal.count(),
      prisma.activity.count(),
    ]);

    return NextResponse.json({
      contacts,
      tasks,
      deals,
      activities,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
