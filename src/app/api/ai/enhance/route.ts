import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { groq } from '@/lib/groq';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { position, description, company, period } = await request.json();

    const prompt = `You are a professional resume writer. I need you to:
1. Enhance the job description to make it more impactful and professional
2. Extract/normalize the company name, position title, and work period

Position: ${position || 'Not provided'}
Company: ${company || 'Not provided'}
Period: ${period || 'Not provided'}
Current description: ${description || 'No description provided'}

Return a JSON object with these fields:
- enhanced: 3-5 bullet points with achievements using action verbs and quantifiable results
- company: the company name (cleaned up if needed)
- position: the job title (professional format)
- period: work period in format "YYYY - YYYY" or "YYYY - Present"

Example response format:
{
  "enhanced": "* Achievement 1 with metrics\\n* Achievement 2 with metrics",
  "company": "Company Name",
  "position": "Job Title",
  "period": "2021 - Present"
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
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    try {
      // Remove markdown code blocks if present
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      return NextResponse.json({
        enhanced: parsed.enhanced || description,
        company: parsed.company || company,
        position: parsed.position || position,
        period: parsed.period || period,
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({ enhanced: responseText, company, position, period });
    }
  } catch (error) {
    console.error('AI enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance description' },
      { status: 500 }
    );
  }
}
