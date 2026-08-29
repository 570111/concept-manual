import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ConceptMeta } from '../data/concepts'
import { getTodaysConcept, formatTodayLabel, hasDrawnToday, markDrawnToday } from '../lib/dailyConcept'
import { isConceptLearned } from '../lib/progress'
import { useContent } from '../lib/ContentContext'

// 抽取动画每一步的间隔（毫秒），逐渐变慢，模拟"转盘慢下来"的手感
const SPIN_STEPS = [70, 70, 80, 90, 100, 120, 140, 170, 210, 260, 320, 400]

type Phase = 'idle' | 'drawing' | 'revealed'

export default function TodayConceptCard() {
  const { data } = useContent()
  const [learned, setLearned] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [spinConcept, setSpinConcept] = useState<ConceptMeta | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const concept = data ? getTodaysConcept(data.concepts) : null

  useEffect(() => {
    if (concept) setLearned(isConceptLearned(concept.id))
  }, [concept?.id])

  useEffect(() => {
    if (hasDrawnToday()) setPhase('revealed')
  }, [])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  if (!concept || !data) return null

  function draw() {
    if (phase === 'drawing') return
    setPhase('drawing')
    const pool = data!.concepts
    let step = 0
    const tick = () => {
      setSpinConcept(pool[Math.floor(Math.random() * pool.length)])
      step += 1
      if (step < SPIN_STEPS.length) {
        timerRef.current = setTimeout(tick, SPIN_STEPS[step])
      } else {
        markDrawnToday()
        setPhase('revealed')
      }
    }
    timerRef.current = setTimeout(tick, SPIN_STEPS[0])
  }

  if (phase !== 'revealed') {
    const showing = phase === 'drawing' ? spinConcept : null
    return (
      <div className="mx-auto flex max-w-xl items-center gap-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-left shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
        <div
          className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-900/50 ${
            phase === 'drawing' ? 'animate-pulse' : ''
          }`}
        >
          {phase === 'drawing' ? showing?.icon ?? '🎁' : '🎁'}
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
            📅 今日一个概念 · {formatTodayLabel()}
          </div>
          <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
            {phase === 'drawing' ? showing?.title ?? '抽取中…' : '还没抽今天的概念'}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {phase === 'drawing' ? '手气不错的话……' : '点一下，看看今天抽到哪个概念'}
          </p>
        </div>
        <button
          onClick={draw}
          disabled={phase === 'drawing'}
          className="btn-primary flex-none disabled:translate-y-0 disabled:opacity-70 disabled:shadow-[0_4px_0_0_#047857]"
        >
          {phase === 'drawing' ? '抽取中…' : '🎲 抽一个'}
        </button>
      </div>
    )
  }

  return (
    <Link
      to={`/concepts/${concept.id}`}
      className="group relative mx-auto flex max-w-xl items-center gap-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md dark:border-amber-900 dark:bg-amber-950/30"
    >
      <div className="relative flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-900/50">
        <span className="animate-pop-in inline-block">{concept.icon}</span>
        <span className="animate-sparkle pointer-events-none absolute -right-1 -top-1 text-sm">✨</span>
        <span className="animate-sparkle pointer-events-none absolute -left-1 top-0 text-xs" style={{ animationDelay: '0.15s' }}>
          ⭐
        </span>
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
