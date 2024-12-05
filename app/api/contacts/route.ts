import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { Contact } from '@prisma/client';

type ContactStatus = 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';

const validateContactData = (data: any, isUpdate: boolean = false): { isValid: boolean; error?: string } => {
  // For updates, only validate the fields that are present
  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string') {
      return { isValid: false, error: 'Name is required and must be a string' };
    }
    if (!data.email || typeof data.email !== 'string') {
      return { isValid: false, error: 'Email is required and must be a string' };
    }
  } else {
    if (data.name !== undefined && typeof data.name !== 'string') {
      return { isValid: false, error: 'Name must be a string' };
    }
    if (data.email !== undefined && typeof data.email !== 'string') {
      return { isValid: false, error: 'Email must be a string' };
    }
  }
  
  if (data.phone && typeof data.phone !== 'string') {
    return { isValid: false, error: 'Phone must be a string' };
  }
  if (data.company && typeof data.company !== 'string') {
    return { isValid: false, error: 'Company must be a string' };
  }
  if (data.position && typeof data.position !== 'string') {
    return { isValid: false, error: 'Position must be a string' };
  }
  if (data.status && !['active', 'inactive', 'lead', 'customer', 'prospect'].includes(data.status)) {
    return { isValid: false, error: 'Invalid status value' };
  }
  return { isValid: true };
};

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        deals: true,
        tasks: true,
        activities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const validation = validateContactData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingContact = await prisma.contact.findFirst({
      where: { email: data.email },
    });

    if (existingContact) {
      return NextResponse.json(
        { error: 'A contact with this email already exists' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        status: (data.status as ContactStatus) || 'active',
      },
      include: {
        deals: true,
        tasks: true,
        activities: true,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
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
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Validate update data if present
    if (Object.keys(updateData).length > 0) {
      const validation = validateContactData(updateData, true);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Check if email is being updated and already exists
    if (updateData.email) {
      const existingContact = await prisma.contact.findFirst({
        where: {
          email: updateData.email,
          NOT: {
            id: id
          }
        },
      });

      if (existingContact) {
        return NextResponse.json(
          { error: 'A contact with this email already exists' },
          { status: 400 }
        );
      }
    }
    
    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        deals: true,
        tasks: true,
        activities: true,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
