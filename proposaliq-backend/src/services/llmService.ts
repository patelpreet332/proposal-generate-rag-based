import Groq from 'groq-sdk'
import { ENV } from '../config/env'

const groq = new Groq({
  apiKey: ENV.GROQ_API_KEY,
})

export const generateResponse = async (
  query: string,
  context: string,
): Promise<string> => {
  const prompt = `
You are generating a proposal based ONLY on the provided context.

Rules:
- Do NOT invent pricing, timelines, or assumptions
- Use only the given context
- Keep response concise and practical
- Focus on real capabilities and implementation

Context:
${context}

User Query:
${query}

Generate a professional proposal.
`

  const completion = await groq.chat.completions.create({
    model: ENV.GROQ_MODEL,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  })

  return completion.choices[0]?.message?.content || ''
}
