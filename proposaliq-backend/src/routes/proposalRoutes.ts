import express from 'express'
import {
  insertProposal,
  searchSimilarProposals,
  generateProposalAnswer,
} from '../services/proposalService'

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const { content, metadata } = req.body

    await insertProposal(content, metadata)

    res.json({ message: 'Proposal stored successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Insert failed' })
  }
})

router.post('/search', async (req, res) => {
  try {
    const { query } = req.body

    const results = await searchSimilarProposals(query)

    res.json({ results })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Search failed' })
  }
})

//Full RAG
router.post('/ask', async (req, res) => {
  try {
    const { query } = req.body

    const response = await generateProposalAnswer(query)

    res.json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'RAG failed' })
  }
})

export default router
