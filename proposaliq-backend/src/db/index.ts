import { Pool } from 'pg'
import { ENV } from '../config/env'

const databaseUrl = ENV.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Please configure it in your environment or .env file.',
  )
}

export const pool = new Pool({
  connectionString: databaseUrl,
})

export const connectDB = async (): Promise<void> => {
  const client = await pool.connect()
  client.release()
  console.log('Database connection established')
}
