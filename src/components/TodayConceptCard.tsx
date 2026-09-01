import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ConceptMeta } from '../data/concepts'
import { getTodaysConcept, formatTodayLabel, hasDrawnToday, markDrawnToday } from '../lib/dailyConcept'
import { isConceptLearned } from '../lib/progress'
import { useContent } from '../lib/ContentContext'

const TILE_W = 172 // 每个卡片格的宽度（px）
const VISIBLE = 3 // 视窗里同时露出几格，中间那格是"中奖位"
const REEL_LEN = 28 // 整条跑道的格子总数
const TARGET_INDEX = REEL_LEN - 5 // 目标概念停在跑道的第几格（留几格余量）
const SPIN_MS = 2400

type Phase = 'idle' | 'drawing' | 'revealed'

function buildReel(pool: ConceptMeta[], target: ConceptMeta): ConceptMeta[] {
  const reel: ConceptMeta[] = []
  for (let i = 0; i < REEL_LEN; i++) {
    reel.push(i === TARGET_INDEX ? target : pool[Math.floor(Math.random() * pool.length)])
  }
  return reel
}

function offsetFor(index: number): number {
  // 让第 index 格停在视窗正中间那一格
  return -(index - Math.floor(VISIBLE / 2)) * TILE_W
}

export default function TodayConceptCard() {
  const { data } = useContent()
  const [learned, setLearned] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [offset, setOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const concept = data ? getTodaysConcept(data.concepts) : null
  const reel = useMemo(() => (data && concept ? buildReel(data.concepts, concept) : []), [data, concept?.id])

  useEffect(() => {
    if (concept) setLearned(isConceptLearned(concept.id))
  }, [concept?.id])

  useEffect(() => {
    if (hasDrawnToday()) {
      setOffset(offsetFor(TARGET_INDEX))
      setPhase('revealed')
    }
  }, [])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  if (!concept || !data || reel.length === 0) return null

  function draw() {
    if (phase === 'drawing') return
    setPhase('drawing')
    setOffset(0)
    setTransitioning(false)
    // 先回到起点（不带动画），下一帧再打开动画开关滑到目标格，触发 CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioning(true)
        setOffset(offsetFor(TARGET_INDEX))
      })
    })
    timerRef.current = setTimeout(() => {
      markDrawnToday()
      setPhase('revealed')
    }, SPIN_MS)
  }

  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-[10px] border border-slate-800 bg-slate-900/70 p-5">
      {/* 唯一的一处氛围光晕，呼应整站极简的科技感 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(96,165,250,0.16), transparent)' }}
      />
      <div className="relative flex items-center justify-between">
        <span className="eyebrow">今日概念抽取 · {formatTodayLabel()}</span>
        {phase === 'revealed' && learned && (
          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">已读</span>
        )}
      </div>

      <div className="relative mx-auto mt-4" style={{ width: VISIBLE * TILE_W, height: 64 }}>
        {/* 中奖位标记 */}
        <div
          className="pointer-events-none absolute top-0 z-20 h-full rounded-[10px] border border-slate-500"
          style={{ width: TILE_W, left: Math.floor(VISIBLE / 2) * TILE_W }}
        />
        <div
          className="relative h-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <div
            className="flex h-full items-center"
            style={{
              transform: `translateX(${offset}px)`,
              transition: transitioning ? `transform ${SPIN_MS}ms cubic-bezier(0.12,0.72,0.29,1)` : 'none',
            }}
          >
            {reel.map((c, i) => (
              <div key={i} className="flex flex-none items-center justify-center" style={{ width: TILE_W }}>
                <span className="max-w-[156px] truncate text-lg font-semibold tracking-wide text-white">
                  {c.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* 左右渐暗，让视线自然聚焦到中间那格 */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.9), transparent 32%, transparent 68%, rgba(0,0,0,0.9))',
          }}
        />
      </div>

      {phase !== 'revealed' ? (
        <div className="relative mt-5 flex justify-center">
          <button onClick={draw} disabled={phase === 'drawing'} className="btn-primary">
            {phase === 'drawing' ? '扫描中…' : '启动抽取'}
          </button>
        </div>
      ) : (
        <Link to={`/concepts/${concept.id}`} className="group relative mt-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-white">{concept.title}</h3>
            <p className="mt-0.5 truncate text-sm text-slate-400">{concept.summary}</p>
          </div>
          <span className="flex-none text-sm font-medium text-white transition-transform group-hover:translate-x-1">
            去看看 →
          </span>
        </Link>
      )}
    </div>
  )
}
