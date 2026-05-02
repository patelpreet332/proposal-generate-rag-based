export interface Source {
  content: string
  metadata: any
  similarity: number
}

export interface AskResponse {
  answer: string
  sources: Source[]
}
