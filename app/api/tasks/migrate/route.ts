import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST() {
  try {
    // Get all tasks
    const tasks = await prisma.task.findMany();

    // Update each task
    const updates = tasks.map(task => {
      const newStatus = task.status === 'completed' ? 'DONE' : 
                       task.status === 'pending' ? 'TODO' : 
                       task.status || 'TODO';
      
      const newPriority = task.priority || 'MEDIUM';

      return prisma.task.update({
        where: { id: task.id },
        data: {
          status: newStatus,
          priority: newPriority
        }
      });
    });

    // Execute all updates
    await Promise.all(updates);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${tasks.length} tasks` 
    });
  } catch (error) {
    console.error('Error migrating tasks:', error);
    return NextResponse.json(
      { error: 'Failed to migrate tasks' },
      { status: 500 }
    );
  }
}
