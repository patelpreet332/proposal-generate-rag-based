const BASE_URL = 'http://localhost:5000/api/proposals'

export const askQuestion = async (query: string) => {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  return res.json()
}
