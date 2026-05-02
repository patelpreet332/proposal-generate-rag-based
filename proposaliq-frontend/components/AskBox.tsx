'use client'

import { ReactNode } from 'react'
import { useState } from 'react'
import { askQuestion } from '../services/api'
import { AskResponse } from '../types'

const getRelevanceLabel = (similarity: number) => {
  if (similarity > 0.9) return 'Highly Relevant'
  if (similarity > 0.75) return 'Relevant'
  return 'Somewhat Relevant'
}

const renderBoldInline = (line: string) => {
  const pattern = /\*\*(.*?)\*\*/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  match = pattern.exec(line)
  while (match !== null) {
    const [fullMatch, boldText] = match
    const start = match.index

    if (start > lastIndex) {
      parts.push(line.slice(lastIndex, start))
    }

    parts.push(
      <strong key={`${start}-${boldText}`} className="font-semibold text-slate-100">
        {boldText}
      </strong>
    )
    lastIndex = start + fullMatch.length
    match = pattern.exec(line)
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex))
  }

  return parts.length > 0 ? parts : line
}

const renderFormattedAnswer = (text: string) =>
  text.split('\n').map((line, idx) => (
    <p key={`answer-line-${idx}`} className="min-h-6">
      {line.length > 0 ? renderBoldInline(line) : '\u00A0'}
    </p>
  ))

export default function AskBox() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AskResponse | null>(null)
  const safeSources = Array.isArray(data?.sources) ? data.sources : []

  const handleAsk = async () => {
    if (!query) return

    setLoading(true)
    try {
      const res = await askQuestion(query)
      setData(res)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 rounded-2xl border border-slate-700/70 bg-slate-900/85 p-5 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.9)] backdrop-blur sm:p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">Generate Proposal</h2>
        <p className="text-sm text-slate-400 sm:text-base">
          Describe the project or requirement, and we will draft an informed response using similar past work.
        </p>
        <p className="text-sm text-slate-400 sm:text-base">
          The system retrieves relevant past proposals and generates a grounded response.
        </p>
      </div>

      <div className="space-y-4">
        <label htmlFor="proposal-query" className="text-sm font-medium text-slate-300">
          Describe your requirement
        </label>
        <textarea
          id="proposal-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Build an AI chatbot for ecommerce customer support with automation"
          className="h-32 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/30 sm:text-base"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="inline-flex min-w-28 items-center justify-center rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {loading ? 'Generating proposal...' : 'Generate Proposal'}
        </button>
        <p className="text-xs text-slate-400 sm:text-sm">
          Responses are based on retrieved past work, not generic generation.
        </p>
      </div>

      {data && (
        <div className="space-y-5 border-t border-slate-700/70 pt-6">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-100">AI Response</h3>
            <div className="text-sm leading-7 text-slate-200 sm:text-base">{renderFormattedAnswer(data.answer)}</div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-100">Relevant Past Work Used</h3>
            <div className="space-y-3">
              {safeSources.length > 0 ? (
                safeSources.map((s, i) => (
                  <article
                    key={i}
                    className="rounded-xl border border-slate-700/80 bg-slate-950/50 p-4 transition hover:border-slate-500"
                  >
                    <p className="text-sm leading-6 text-slate-200 sm:text-base">{s.content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-emerald-300">
                        {getRelevanceLabel(s.similarity)}
                      </span>
                      <p className="text-xs font-medium tracking-wide text-emerald-300">
                        Similarity: {s.similarity.toFixed(2)}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-slate-700/80 bg-slate-950/50 p-4 text-sm text-slate-300">
                  No retrieved context is available for this response.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
