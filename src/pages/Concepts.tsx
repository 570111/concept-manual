import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { concepts, categoryOrder, categoryInfo, getConceptsByCategory, type Category } from '../data/concepts'
import { getLearnedConcepts } from '../lib/progress'

function ConceptNode({
  concept,
  index,
  isDone,
  isNext,
  isLast,
}: {
  concept: (typeof concepts)[number]
  index: number
  isDone: boolean
  isNext: boolean
  isLast: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-bold ${
            isDone
              ? 'bg-emerald-500 text-white shadow-[0_3px_0_0_#047857]'
              : isNext
                ? 'animate-pulse bg-emerald-500 text-white shadow-[0_3px_0_0_#047857]'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}
        >
          {isDone ? '✓' : index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800" />}
      </div>

      <Link
        to={`/concepts/${concept.id}`}
        className={`group mb-4 flex flex-1 gap-4 rounded-2xl border-2 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md dark:bg-slate-900 ${
          isNext ? 'border-emerald-400 ring-2 ring-emerald-100 dark:border-emerald-600 dark:ring-emerald-900/40' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-50 text-lg dark:bg-emerald-900/40">
          {concept.icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white">{concept.title}</h3>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{concept.aka}</span>
            {isNext && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">继续学习</span>}
            {isDone && !isNext && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                已学完
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{concept.summary}</p>
        </div>
      </Link>
    </div>
  )
}

function CategorySection({ category, learned, nextConceptId }: { category: Category; learned: Set<string>; nextConceptId: string | null }) {
  const items = getConceptsByCategory(category)
  return (
    <section className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-800 text-base font-bold text-white dark:bg-slate-600">
          {categoryInfo[category].numeral}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{categoryInfo[category].label}</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{categoryInfo[category].desc}</p>
        </div>
      </div>

      <div className="space-y-0">
        {items.map((c, i) => (
          <ConceptNode
            key={c.id}
            concept={c}
            index={i}
            isDone={learned.has(c.id)}
            isNext={c.id === nextConceptId}
            isLast={i === items.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

export default function Concepts() {
  const [learned, setLearned] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLearned(getLearnedConcepts())
  }, [])

  const nextConceptId = concepts.find((c) => !learned.has(c.id))?.id ?? null

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">概念地图：{concepts.length}个看懂生活规则的思维工具</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          分成5大类：认知偏误关乎"你怎么想"，社会与人际关乎"一群人怎么处"，经济与决策关乎"怎么分配有限的东西"，
          博弈与影响关乎"人和人怎么过招"，系统与演化关乎"事情长期会往哪走"。每个概念都配一个生活场景，学完可以直接用。
        </p>
      </div>

      {categoryOrder.map((category) => (
        <CategorySection key={category} category={category} learned={learned} nextConceptId={nextConceptId} />
      ))}
    </div>
  )
}
