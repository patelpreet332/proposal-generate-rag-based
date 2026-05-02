import { pool } from '../db'
import { generateEmbedding } from './embeddingService'
import { generateResponse } from './llmService'

interface ProposalResult {
  content: string
  metadata: any
  similarity: number
}

export const insertProposal = async (content: string, metadata: any = {}) => {
  const embedding = await generateEmbedding(content)

  const formattedEmbedding = `[${embedding.join(',')}]`

  const query = `
    INSERT INTO proposals (content, embedding, metadata)
    VALUES ($1, $2, $3)
  `

  await pool.query(query, [content, formattedEmbedding, metadata])
}

export const searchSimilarProposals = async (
  query: string,
): Promise<ProposalResult[]> => {
  const embedding = await generateEmbedding(query)

  const formattedEmbedding = `[${embedding.join(',')}]`

  const sql = `
    SELECT content, metadata,
    1 - (embedding <=> $1) AS similarity
    FROM proposals
    ORDER BY embedding <=> $1
    LIMIT 5;
  `

  const result = await pool.query(sql, [formattedEmbedding])

  return result.rows
}

export const generateProposalAnswer = async (query: string) => {
  const results = await searchSimilarProposals(query)

  const MIN_SIMILARITY = 0.5

  const filteredResults = results.filter((r) => r.similarity >= MIN_SIMILARITY)

  const sortedResults = filteredResults.sort(
    (a, b) => b.similarity - a.similarity,
  )

  const topResults = sortedResults.slice(0, 3)

  if (!topResults.length || topResults[0].similarity < 0.6) {
    return {
      answer: 'I don’t have enough relevant data to answer this.',
      sources: [],
    }
  }

  const context = topResults.map((r) => r.content).join('\n---\n')

  const answer = await generateResponse(query, context)

  return {
    answer,
    sources: topResults,
  }
}
