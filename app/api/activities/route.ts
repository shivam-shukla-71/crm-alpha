import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { Activity } from '@prisma/client';

type ActivityType = 'email' | 'call' | 'meeting';

const validateActivityData = (data: any): { isValid: boolean; error?: string } => {
  if (!data.type || !['email', 'call', 'meeting'].includes(data.type)) {
    return { isValid: false, error: 'Type must be one of: email, call, meeting' };
  }
  if (data.description && typeof data.description !== 'string') {
    return { isValid: false, error: 'Description must be a string' };
  }
  if (data.date && !(data.date instanceof Date || typeof data.date === 'string')) {
    return { isValid: false, error: 'Date must be a valid date' };
  }
  if (data.contactId && typeof data.contactId !== 'string') {
    return { isValid: false, error: 'Contact ID must be a string' };
  }
  if (data.dealId && typeof data.dealId !== 'string') {
    return { isValid: false, error: 'Deal ID must be a string' };
  }
  return { isValid: true };
};

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        contact: true,
        deal: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const validation = validateActivityData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        type: data.type,
        description: data.description || '',
        date: new Date(data.date || new Date()),
        contactId: data.contactId || null,
        dealId: data.dealId || null,
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validation = validateActivityData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Update activity
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        type: updateData.type,
        description: updateData.description || '',
        date: new Date(updateData.date || new Date()),
        contactId: updateData.contactId || null,
        dealId: updateData.dealId || null,
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
