import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

export async function POST(req: NextRequest) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json(
            { error: 'OPENROUTER_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const { messages, courseContext } = await req.json();

    const systemPrompt = `You are an expert course creation assistant for SafePulse Academy — a professional online learning platform focused on health, performance, longevity, and harm reduction.

Your job is to help admin users create high-quality courses. You are knowledgeable, direct, and practical.

Current course being built:
- Title: ${courseContext?.title || 'Not set yet'}
- Category: ${courseContext?.category || 'Not set'}
- Level: ${courseContext?.level || 'Not set'}
- Sections: ${courseContext?.sections || 0}
- Tags: ${courseContext?.tags?.join(', ') || 'None yet'}

You can help with:
- Suggesting course titles, descriptions, and taglines
- Structuring curriculum (sections, lessons, learning outcomes)
- Writing quiz questions for specific topics
- Pricing recommendations based on course length and depth
- Tag suggestions for discoverability
- Best practices for online course production

Keep responses concise and actionable. Use bullet points where helpful. Don't use excessive markdown — this is a chat interface.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://safepulse-academy-production.up.railway.app',
            'X-Title': 'SafePulse Academy Course Assistant',
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            max_tokens: 600,
            temperature: 0.7,
            stream: false,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('OpenRouter error:', error);
        return NextResponse.json(
            { error: 'Failed to get AI response' },
            { status: response.status }
        );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';

    return NextResponse.json({ content });
}
