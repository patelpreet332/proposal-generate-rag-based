import { pipeline } from '@xenova/transformers'

let extractor: any = null

const loadModel = async () => {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const model = await loadModel()

  const result = await model(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(result.data)
}
