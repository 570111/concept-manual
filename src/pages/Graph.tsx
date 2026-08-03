import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { computeGraphLayout, categoryColor } from '../lib/graphLayout'
import { categoryOrder, categoryInfo, type Category } from '../data/concepts'
import { useContent } from '../lib/ContentContext'

const SIZE = 920

export default function Graph() {
  const { data } = useContent()
  const concepts = useMemo(() => data?.concepts ?? [], [data])
  const conceptContent = useMemo(() => data?.conceptContent ?? {}, [data])
  const { nodes, edges } = useMemo(() => computeGraphLayout(concepts, conceptContent, SIZE), [concepts, conceptContent])
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dimCategory, setDimCategory] = useState<Category | null>(null)

  const activeId = hoverId ?? selectedId

  const neighborIds = useMemo(() => {
    if (!activeId) return new Set<string>()
    const s = new Set<string>()
    for (const e of edges) {
      if (e.a === activeId) s.add(e.b)
      if (e.b === activeId) s.add(e.a)
    }
    return s
  }, [activeId, edges])

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  if (!data) return null

  const getConcept = (id: string) => concepts.find((c) => c.id === id)
  const selectedConcept = selectedId ? getConcept(selectedId) : null
  const selectedRelated = selectedId ? (conceptContent[selectedId]?.related ?? []) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">关系图谱</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          60个概念按分类围成一圈，连线代表它们互相关联。点一个节点看详情，也可以顺着连线摸到相关的概念继续探索。
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setDimCategory((c) => (c === cat ? null : cat))
              setSelectedId(null)
            }}
            className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors ${
              dimCategory === null || dimCategory === cat
                ? 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                : 'border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-900 dark:bg-slate-900/40 dark:text-slate-600'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColor[cat] }} />
            {categoryInfo[cat].label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="mx-auto block w-full max-w-[720px]"
            onClick={() => setSelectedId(null)}
          >
            {edges.map((e, i) => {
              const a = nodeById.get(e.a)
              const b = nodeById.get(e.b)
              if (!a || !b) return null
              const isActive = activeId !== null && (e.a === activeId || e.b === activeId)
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={isActive ? '#10b981' : '#94a3b8'}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={activeId ? (isActive ? 0.9 : 0.06) : 0.18}
                />
              )
            })}
            {nodes.map((n) => {
              const c = getConcept(n.id)
              if (!c) return null
              const isActive = activeId === n.id
              const isNeighbor = neighborIds.has(n.id)
              const isDimmedByCategory = dimCategory !== null && dimCategory !== n.category
              const faded = (activeId !== null && !isActive && !isNeighbor) || isDimmedByCategory
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="cursor-pointer"
                  opacity={faded ? 0.25 : 1}
                  role="button"
                  tabIndex={0}
                  aria-label={c.title}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(n.id)}
                  onBlur={() => setHoverId(null)}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setSelectedId(n.id)
                    setDimCategory(null)
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      ev.stopPropagation()
                      setSelectedId(n.id)
                      setDimCategory(null)
                    }
                  }}
                >
                  <circle
                    r={isActive || isNeighbor ? 20 : 16}
                    fill={categoryColor[n.category]}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={16}>
                    {c.icon}
                  </text>
                  {(isActive || isNeighbor) && (
                    <text
                      y={-28}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={700}
                      fill="currentColor"
                      className="pointer-events-none text-slate-900 dark:text-white"
                      style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                    >
                      {c.title}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          {selectedConcept ? (
            <div className="space-y-4 rounded-2xl border-2 border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${categoryColor[selectedConcept.category]}22` }}
                >
                  {selectedConcept.icon}
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: categoryColor[selectedConcept.category] }}>
                    {categoryInfo[selectedConcept.category].label}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{selectedConcept.title}</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedConcept.summary}</p>
              <Link to={`/concepts/${selectedConcept.id}`} className="btn-primary block text-center">
                进入学习 →
              </Link>
              {selectedRelated.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-bold text-slate-400">相关概念</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRelated.map((id) => {
                      const rc = getConcept(id)
                      if (!rc) return null
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedId(id)}
                          className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                        >
                          <span>{rc.icon}</span>
                          {rc.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              点击图上任意一个节点，看看它是什么、和哪些概念有关联。也可以点上方的分类标签，只看某一类的连线。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
