import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { Deal } from '@prisma/client';

type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed';

const validateDealData = (data: any): { isValid: boolean; error?: string } => {
  if (!data.title || typeof data.title !== 'string') {
    return { isValid: false, error: 'Title is required and must be a string' };
  }
  if (data.value !== undefined && (typeof data.value !== 'number' || data.value < 0)) {
    return { isValid: false, error: 'Value must be a non-negative number' };
  }
  if (data.stage && !['lead', 'proposal', 'negotiation', 'closed'].includes(data.stage)) {
    return { isValid: false, error: 'Invalid stage value' };
  }
  if (data.contactId && typeof data.contactId !== 'string') {
    return { isValid: false, error: 'Contact ID must be a string' };
  }
  return { isValid: true };
};

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        contact: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching pipeline deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const validation = validateDealData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify contact exists if contactId is provided
    if (data.contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: data.contactId },
      });
      if (!contact) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
    }

    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        value: data.value,
        stage: (data.stage as DealStage) || 'lead',
        contactId: data.contactId || null,
      },
      include: {
        contact: true,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, stage } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Verify deal exists
    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });
    
    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // If stage is provided, validate it
    if (stage && !['lead', 'proposal', 'negotiation', 'closed'].includes(stage)) {
      return NextResponse.json(
        { error: 'Invalid stage value' },
        { status: 400 }
      );
    }

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { stage },
      include: {
        contact: true,
      },
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Verify deal exists
    const deal = await prisma.deal.findUnique({
      where: { id },
    });
    
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
