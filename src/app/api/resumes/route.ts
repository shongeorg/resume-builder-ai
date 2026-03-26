import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const userResumes = await db.query.resumes.findMany({
    where: eq(resumes.userId, userId),
  });

  return NextResponse.json(userResumes);
}
