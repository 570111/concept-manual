import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { categoryInfo } from '../data/concepts'
import { useContent } from '../lib/ContentContext'
import { markConceptLearned } from '../lib/progress'
import StoryCard from '../components/StoryCard'
import Callout from '../components/Callout'
import QuizRunner from '../components/QuizRunner'

export default function ConceptDetail() {
  const { conceptId } = useParams<{ conceptId: string }>()
  const { data } = useContent()
  const [quizOpen, setQuizOpen] = useState(false)

  useEffect(() => {
    if (conceptId) markConceptLearned(conceptId)
    setQuizOpen(false)
  }, [conceptId])

  if (!data) return null

  const concept = conceptId ? data.concepts.find((c) => c.id === conceptId) : undefined
  const content = conceptId ? data.conceptContent[conceptId] : undefined

  if (!concept || !content) {
    return <Navigate to="/concepts" replace />
  }

  const index = data.concepts.findIndex((c) => c.id === concept.id)
  const prev = data.concepts[index - 1]
  const next = data.concepts[index + 1]
  const questions = data.quizQuestions.filter((q) => q.conceptId === concept.id)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/concepts" className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400">← 概念地图</Link>
        <span>·</span>
        <span>{categoryInfo[concept.category].label}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-900/40">
          {concept.icon}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{concept.title}</h1>
          <p className="mt-0.5 text-sm text-slate-400">{concept.aka}</p>
        </div>
      </div>

      <StoryCard>
        <p>{content.story}</p>
      </StoryCard>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">这是什么</h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{content.explain}</p>
      </section>

      <Callout tone="good" title={`📚 ${content.realCase.title}`}>
        {content.realCase.body}
      </Callout>

      <Callout tone="good" title={`🔁 ${content.secondCase.title}`}>
        {content.secondCase.body}
      </Callout>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">怎么用</h2>
        <div className="space-y-3">
          {content.apply.map((tip, i) => (
            <div key={i} className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{tip.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tip.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="info" title="✍️ 自测小任务">
        {content.selfTask}
      </Callout>

      {content.misconceptions.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-400">常见误解</h2>
          <ul className="space-y-2">
            {content.misconceptions.map((m, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-2xl border-2 border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <span className="flex-none text-slate-300 dark:text-slate-600">✗</span>
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Callout tone="warn" title="⚠️ 别用错了">
        {content.pitfall}
      </Callout>

      <section className="rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {content.furtherReading.type}
          </span>
          <h3 className="font-semibold text-slate-900 dark:text-white">{content.furtherReading.title}</h3>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{content.furtherReading.note}</p>
      </section>

      {content.related.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-400">关联概念</h2>
          <div className="flex flex-wrap gap-2">
            {content.related.map((id) => {
              const rc = data.concepts.find((c) => c.id === id)
              if (!rc) return null
              return (
                <Link
                  key={id}
                  to={`/concepts/${id}`}
                  className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                >
                  <span>{rc.icon}</span>
                  {rc.title}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {questions.length > 0 && (
        <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          {!quizOpen ? (
            <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/30">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">🎯 小测验：{questions.length}道题巩固一下</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">答错会自动收进错题本，方便回来复习。</p>
              </div>
              <button onClick={() => setQuizOpen(true)} className="btn-primary flex-none">
                开始
              </button>
            </div>
          ) : (
            <QuizRunner
              title={concept.title}
              questions={questions}
              scoreKey={`concept-${concept.id}`}
              onExit={() => setQuizOpen(false)}
              exitLabel="收起测验"
            />
          )}
        </section>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
        {prev ? (
          <Link to={`/concepts/${prev.id}`} className="font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/concepts/${next.id}`} className="font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
