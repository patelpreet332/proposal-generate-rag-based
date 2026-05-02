import AskBox from '../components/AskBox'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="space-y-4 text-center">
          <p className="inline-flex rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
            AI-Powered Proposal Assistant
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
            ProposalIQ
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base text-slate-300 sm:text-lg">
            Generate client-ready proposals using your past work and AI
          </p>
        </header>

        <AskBox />
      </section>
    </main>
  )
}
