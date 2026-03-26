import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
    }).returning();

    // Create empty resume for the new user
    const emptyResumeBody = {
      personal: {
        fullName: '',
        title: '',
        email: email,
        phone: '',
        location: '',
        github: '',
      },
      experience: [] as Array<{ id: number; company: string; position: string; period: string; desc: string }>,
      education: [] as Array<{ id: number; school: string; degree: string; period: string }>,
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Node.js'],
      languages: 'English, Ukrainian',
    };

    await db.insert(resumes).values({
      userId: newUser.id,
      body: emptyResumeBody,
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { id: newUser.id.toString(), email: newUser.email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
