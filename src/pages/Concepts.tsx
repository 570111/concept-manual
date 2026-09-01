import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryOrder, categoryInfo, type Category, type ConceptMeta } from '../data/concepts'
import { useContent } from '../lib/ContentContext'
import { getLearnedConcepts } from '../lib/progress'

function ConceptNode({
  concept,
  index,
  isDone,
  isNext,
  isLast,
}: {
  concept: ConceptMeta
  index: number
  isDone: boolean
  isNext: boolean
  isLast: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border text-sm font-bold ${
            isDone
              ? 'border-white bg-white text-slate-950'
              : isNext
                ? 'border-white text-white'
                : 'border-slate-800 text-slate-500'
          }`}
        >
          {isDone ? '✓' : index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-800" />}
      </div>

      <Link
        to={`/concepts/${concept.id}`}
        className={`group mb-4 flex flex-1 gap-4 rounded-2xl border bg-slate-900/50 p-5 transition-colors hover:border-slate-600 ${
          isNext ? 'border-slate-500' : 'border-slate-800'
        }`}
      >
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-900 text-lg">
          {concept.icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-white">{concept.title}</h3>
            <span className="text-xs font-medium text-slate-500">{concept.aka}</span>
            {isNext && <span className="rounded-full border border-white px-2 py-0.5 text-[11px] font-bold text-white">继续学习</span>}
            {isDone && !isNext && (
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                已学完
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">{concept.summary}</p>
        </div>
      </Link>
    </div>
  )
}

function CategorySection({
  category,
  concepts,
  learned,
  nextConceptId,
}: {
  category: Category
  concepts: ConceptMeta[]
  learned: Set<string>
  nextConceptId: string | null
}) {
  const items = concepts.filter((c) => c.category === category)
  return (
    <section className="space-y-6">
      <div className="tech-card flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-700 text-base font-bold text-white">
          {categoryInfo[category].numeral}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">{categoryInfo[category].label}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{categoryInfo[category].desc}</p>
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
  const { data } = useContent()
  const [learned, setLearned] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLearned(getLearnedConcepts())
  }, [])

  if (!data) return null
  const { concepts } = data

  const nextConceptId = concepts.find((c) => !learned.has(c.id))?.id ?? null

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">概念地图：{concepts.length}个看懂生活规则的思维工具</h1>
        <p className="mt-2 text-slate-400">
          分成{categoryOrder.length}大类：认知偏误关乎"你怎么想"，社会与人际关乎"一群人怎么处"，经济与决策关乎"怎么分配有限的东西"，
          博弈与影响关乎"人和人怎么过招"，系统与演化关乎"事情长期会往哪走"，思维与决策方法是主动能拿来用的推理工具，
          沟通与关系关乎"话该怎么说、情绪从哪来"。每个概念都配一个生活场景，学完可以直接用。
        </p>
      </div>

      {categoryOrder.map((category) => (
        <CategorySection key={category} category={category} concepts={concepts} learned={learned} nextConceptId={nextConceptId} />
      ))}
    </div>
  )
}
