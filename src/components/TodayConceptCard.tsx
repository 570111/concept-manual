import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTodaysConcept, formatTodayLabel } from '../lib/dailyConcept'
import { isConceptLearned } from '../lib/progress'

export default function TodayConceptCard() {
  const [learned, setLearned] = useState(false)
  const concept = getTodaysConcept()

  useEffect(() => {
    setLearned(isConceptLearned(concept.id))
  }, [concept.id])

  return (
    <Link
      to={`/concepts/${concept.id}`}
      className="group mx-auto flex max-w-xl items-center gap-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md dark:border-amber-900 dark:bg-amber-950/30"
    >
      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-900/50">
        {concept.icon}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          <span>📅 今日一个概念 · {formatTodayLabel()}</span>
          {learned && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              已读
            </span>
          )}
        </div>
        <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{concept.title}</h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{concept.summary}</p>
      </div>
      <span className="flex-none text-sm font-medium text-amber-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-amber-400">
        去看看 →
      </span>
    </Link>
  )
}
