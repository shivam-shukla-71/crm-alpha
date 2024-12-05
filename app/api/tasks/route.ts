import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { Task } from '@prisma/client';

const validateTaskData = (data: any, isUpdate: boolean = false): { isValid: boolean; error?: string } => {
  if (!isUpdate) {
    if (!data.title || typeof data.title !== 'string') {
      return { isValid: false, error: 'Title is required and must be a string' };
    }
    if (!data.dueDate || !(data.dueDate instanceof Date || typeof data.dueDate === 'string')) {
      return { isValid: false, error: 'Due date is required and must be a valid date' };
    }
    if (!data.status || typeof data.status !== 'string' || !['TODO', 'IN_PROGRESS', 'DONE'].includes(data.status)) {
      return { isValid: false, error: 'Status must be one of: TODO, IN_PROGRESS, DONE' };
    }
    if (!data.priority || typeof data.priority !== 'string' || !['LOW', 'MEDIUM', 'HIGH'].includes(data.priority)) {
      return { isValid: false, error: 'Priority must be one of: LOW, MEDIUM, HIGH' };
    }
  } else {
    if (data.title !== undefined && typeof data.title !== 'string') {
      return { isValid: false, error: 'Title must be a string' };
    }
    if (data.dueDate !== undefined && !(data.dueDate instanceof Date || typeof data.dueDate === 'string')) {
      return { isValid: false, error: 'Due date must be a valid date' };
    }
    if (data.status !== undefined && (typeof data.status !== 'string' || !['TODO', 'IN_PROGRESS', 'DONE'].includes(data.status))) {
      return { isValid: false, error: 'Status must be one of: TODO, IN_PROGRESS, DONE' };
    }
    if (data.priority !== undefined && (typeof data.priority !== 'string' || !['LOW', 'MEDIUM', 'HIGH'].includes(data.priority))) {
      return { isValid: false, error: 'Priority must be one of: LOW, MEDIUM, HIGH' };
    }
  }

  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    return { isValid: false, error: 'Description must be a string' };
  }
  if (data.contactId !== undefined && data.contactId !== null && typeof data.contactId !== 'string') {
    return { isValid: false, error: 'Contact ID must be a string' };
  }

  return { isValid: true };
};

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        contact: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input data
    const validation = validateTaskData(data);
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

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: new Date(data.dueDate),
        status: data.status,
        priority: data.priority,
        contactId: data.contactId || null,
      },
      include: {
        contact: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Validate input data
    const validation = validateTaskData(data, true);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
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

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.contactId !== undefined) updateData.contactId = data.contactId;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
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
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
