import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryOrder, categoryInfo, type ConceptMeta } from '../data/concepts'
import { useContent } from '../lib/ContentContext'
import { getLearnedConcepts } from '../lib/progress'
import TodayConceptCard from '../components/TodayConceptCard'

function ContinueLearningCard({ concepts }: { concepts: ConceptMeta[] }) {
  const [learned, setLearned] = useState<Set<string> | null>(null)

  useEffect(() => {
    setLearned(getLearnedConcepts())
  }, [])

  if (learned === null) return null

  const doneCount = learned.size
  const nextConcept = concepts.find((c) => !learned.has(c.id))

  if (doneCount === 0) {
    return (
      <div className="tech-card mx-auto flex max-w-xl items-center justify-between gap-4 p-4">
        <div className="text-left">
          <div className="text-sm font-semibold text-white">还没开始学习</div>
          <div className="text-xs text-neutral-400">从第一个概念开始，每个只要5分钟</div>
        </div>
        <Link to={`/concepts/${concepts[0].id}`} className="btn-primary flex-none">
          开始学习
        </Link>
      </div>
    )
  }

  if (!nextConcept) {
    return (
      <div className="tech-card mx-auto flex max-w-xl items-center justify-between gap-4 p-4">
        <div className="text-left">
          <div className="text-sm font-semibold text-white">已经学完全部 {concepts.length} 个概念</div>
          <div className="text-xs text-neutral-400">去测验页检验一下掌握程度吧</div>
        </div>
        <Link to="/quiz" className="btn-primary flex-none">
          去测验
        </Link>
      </div>
    )
  }

  return (
    <div className="tech-card mx-auto flex max-w-xl items-center justify-between gap-4 p-4">
      <div className="text-left">
        <div className="text-xs text-neutral-400">已学完 {doneCount} / {concepts.length} 个 · 继续学习</div>
        <div className="text-sm font-semibold text-white">{nextConcept.icon} {nextConcept.title}</div>
      </div>
      <Link to={`/concepts/${nextConcept.id}`} className="btn-primary flex-none">
        继续 →
      </Link>
    </div>
  )
}

export default function Home() {
  const { data } = useContent()
  if (!data) return null
  const { concepts } = data

  const rows = [
    {
      to: '/concepts',
      tag: '概念地图',
      title: '每个概念，一个生活场景讲透',
      desc: `${concepts.length}个概念分${categoryOrder.length}大类，从一个具体场景引入，讲清楚是什么、怎么用、常见误用的边界在哪。`,
    },
    {
      to: '/graph',
      tag: '关系图谱',
      title: '概念之间不是孤立的',
      desc: '一张图看清楚这些概念怎么互相关联——从一个概念顺藤摸瓜，学到相关的另一个。',
    },
    {
      to: '/quiz',
      tag: '测验练习',
      title: '学完不是看看就过',
      desc: '按分类混合练习，或者在每个概念页单独测验，答错自动收进错题本，方便回来复习。',
    },
  ]

  return (
    <div className="space-y-32">
      <section>
        <p className="eyebrow">[ {concepts.length}个思维模型 · {categoryOrder.length}大类 ]</p>
        <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
          看懂生活里
          <br />
          那些说不清的规则
        </h1>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-400">
          为什么排队的人越多你越想排？为什么道歉的话术总能戳中你？这些现象背后都有名字、有原理——每个概念用一个生活场景讲透，讲完告诉你怎么用。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/concepts" className="btn-secondary">概念地图 ↗</Link>
          <Link to="/graph" className="btn-secondary">关系图谱 ↗</Link>
          <Link to="/quiz" className="btn-secondary">测验练习 ↗</Link>
        </div>
      </section>

      <section className="space-y-4">
        <TodayConceptCard />
        <ContinueLearningCard concepts={concepts} />
      </section>

      <section className="divide-y divide-neutral-900 border-y border-neutral-900">
        {rows.map((r) => (
          <Link key={r.to} to={r.to} className="group flex items-center justify-between gap-8 py-10">
            <div className="min-w-0">
              <p className="eyebrow">[ {r.tag} ]</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{r.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">{r.desc}</p>
            </div>
            <span className="flex-none text-sm font-medium text-neutral-500 transition-colors group-hover:text-white">
              开始 →
            </span>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">[ 分类总览 ]</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{categoryOrder.length}大类，{concepts.length}个概念</h2>
          </div>
          <Link to="/concepts" className="btn-secondary">查看全部 ↗</Link>
        </div>
        <div className="mt-10 divide-y divide-neutral-900 border-t border-neutral-900">
          {categoryOrder.map((cat, i) => {
            const count = concepts.filter((c) => c.category === cat).length
            return (
              <Link
                key={cat}
                to="/concepts"
                className="group flex items-center justify-between gap-6 py-7 transition-colors hover:bg-neutral-950"
              >
                <div className="flex min-w-0 items-baseline gap-5">
                  <span className="flex-none font-mono text-xs text-neutral-600">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{categoryInfo[cat].label}</h3>
                    <p className="mt-1.5 max-w-xl text-sm text-neutral-400">{categoryInfo[cat].desc}</p>
                  </div>
                </div>
                <span className="flex-none text-xs text-neutral-500">{count}个</span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
