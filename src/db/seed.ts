import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, resumes } from './schema';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const emptyResumeBody = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    github: '',
  },
  experience: [] as Array<{ id: number; company: string; position: string; period: string; desc: string }>,
  education: [] as Array<{ id: number; school: string; degree: string; period: string }>,
  skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Node.js'],
  languages: 'English, Ukrainian',
};

async function seed() {
  console.log('Starting seed...');

  // Clear existing data
  await sql`TRUNCATE TABLE resumes, users RESTART IDENTITY CASCADE`;
  console.log('Cleared existing data');

  // Create 10 test users
  const hashedPassword = await bcrypt.hash('user123', 10);
  
  for (let i = 1; i <= 10; i++) {
    const email = `user${i}@gmail.com`;
    
    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
    }).returning();
    
    console.log(`Created user: ${email}`);
    
    // Create empty resume for each user
    await db.insert(resumes).values({
      userId: user.id,
      body: emptyResumeBody,
    });
    
    console.log(`Created empty resume for user: ${email}`);
  }

  console.log('Seed completed successfully!');
  console.log('Test credentials: user1@gmail.com ... user10@gmail.com / user123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
