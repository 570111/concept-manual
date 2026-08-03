import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { concepts, categoryOrder, categoryInfo } from '../data/concepts'
import { getLearnedConcepts } from '../lib/progress'
import TodayConceptCard from '../components/TodayConceptCard'

const modules = [
  {
    to: '/concepts',
    icon: '🗺️',
    title: '概念地图',
    desc: `${concepts.length}个概念分${categoryOrder.length}大类，每个都配一个生活场景 + 应用方法，讲清楚是什么、怎么用、别用错。`,
  },
  {
    to: '/graph',
    icon: '🕸️',
    title: '关系图谱',
    desc: '这些概念之间怎么互相关联，用一张图看清楚——从一个概念顺藤摸瓜学到相关的另一个。',
  },
  {
    to: '/quiz',
    icon: '✏️',
    title: '测验练习',
    desc: '每学完几个概念做几道题，检验自己是不是真的理解了，答错自动收进错题本。',
  },
]

function ContinueLearningCard() {
  const [learned, setLearned] = useState<Set<string> | null>(null)

  useEffect(() => {
    setLearned(getLearnedConcepts())
  }, [])

  if (learned === null) return null

  const doneCount = learned.size
  const nextConcept = concepts.find((c) => !learned.has(c.id))

  if (doneCount === 0) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">还没开始学习</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">从第一个概念开始，每个只要5分钟</div>
        </div>
        <Link to={`/concepts/${concepts[0].id}`} className="btn-primary flex-none">
          开始学习
        </Link>
      </div>
    )
  }

  if (!nextConcept) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">🎉 已经学完全部 {concepts.length} 个概念</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">去测验页检验一下掌握程度吧</div>
        </div>
        <Link to="/quiz" className="btn-primary flex-none">
          去测验
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
      <div className="text-left">
        <div className="text-xs text-slate-500 dark:text-slate-400">已学完 {doneCount} / {concepts.length} 个 · 继续学习</div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{nextConcept.icon} {nextConcept.title}</div>
      </div>
      <Link to={`/concepts/${nextConcept.id}`} className="btn-primary flex-none">
        继续 →
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          用{concepts.length}个思维模型，看懂生活里那些说不清的规则
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
          为什么排队的人越多你越想排？为什么道歉的话术总能戳中你？为什么有些老规矩明明不方便却一直没人改？
          这些现象背后都有名字、有原理。每个概念用一个生活场景讲透，讲完还告诉你怎么在自己的生活里用上。
        </p>
        <div className="mt-6 space-y-3">
          <TodayConceptCard />
          <ContinueLearningCard />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="group rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-3xl">{m.icon}</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{m.title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{m.desc}</p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-600 group-hover:underline dark:text-emerald-400">
              开始 →
            </span>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{categoryOrder.length}大类，{concepts.length}个概念一览</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryOrder.map((cat) => (
            <div key={cat} className="rounded-2xl border-2 border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{categoryInfo[cat].label}</div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{categoryInfo[cat].desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {concepts
                  .filter((c) => c.category === cat)
                  .map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {c.icon} {c.title}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
