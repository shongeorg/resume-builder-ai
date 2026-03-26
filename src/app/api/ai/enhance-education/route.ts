import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { groq } from '@/lib/groq';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { school, degree, period } = await request.json();

    const prompt = `You are a professional resume writer. Generate realistic education data for a resume.

School/University: ${school || 'Not provided'}
Degree: ${degree || 'Not provided'}
Period: ${period || 'Not provided'}

If any field is empty or says "Not provided", generate realistic placeholder data.

Return a JSON object with these fields:
- school: realistic university/school name (e.g., "University of California, Berkeley")
- degree: realistic degree with field of study (e.g., "Bachelor of Science in Computer Science")
- period: graduation period in format "YYYY - YYYY" (e.g., "2018 - 2022")

Example response format:
{
  "school": "Stanford University",
  "degree": "Master of Science in Computer Science",
  "period": "2020 - 2022"
}

Return ONLY the JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return ONLY valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    try {
      // Remove markdown code blocks if present
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      return NextResponse.json({
        school: parsed.school || school,
        degree: parsed.degree || degree,
        period: parsed.period || period,
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({ school, degree, period });
    }
  } catch (error) {
    console.error('AI education enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance education data' },
      { status: 500 }
    );
  }
}
