import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { ENV } from './config/env'
import proposalRoutes from './routes/proposalRoutes'
import { connectDB } from './db'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ProposalIQ API is running')
})

app.use('/api/proposals', proposalRoutes)

const PORT = Number(ENV.PORT) || 5000

const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

void startServer()
