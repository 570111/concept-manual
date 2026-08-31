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
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <Link to="/concepts" className="font-medium hover:text-emerald-400">← 概念地图</Link>
        <span>·</span>
        <span>{categoryInfo[concept.category].label}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
          {concept.icon}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">{concept.title}</h1>
          <p className="mt-0.5 text-sm text-neutral-400">{concept.aka}</p>
        </div>
      </div>

      <StoryCard>
        <p>{content.story}</p>
      </StoryCard>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">这是什么</h2>
        <p className="leading-relaxed text-neutral-300">{content.explain}</p>
      </section>

      <Callout tone="good" title={`📚 ${content.realCase.title}`}>
        {content.realCase.body}
      </Callout>

      <Callout tone="good" title={`🔁 ${content.secondCase.title}`}>
        {content.secondCase.body}
      </Callout>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">怎么用</h2>
        <div className="space-y-3">
          {content.apply.map((tip, i) => (
            <div key={i} className="tech-card p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{tip.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-300">{tip.body}</p>
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
          <h2 className="text-sm font-bold text-neutral-400">常见误解</h2>
          <ul className="space-y-2">
            {content.misconceptions.map((m, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 text-sm leading-relaxed text-neutral-300"
              >
                <span className="flex-none text-neutral-300">✗</span>
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Callout tone="warn" title="⚠️ 别用错了">
        {content.pitfall}
      </Callout>

      <section className="tech-card p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-0.5 text-xs font-bold text-neutral-300">
            {content.furtherReading.type}
          </span>
          <h3 className="font-semibold text-white">{content.furtherReading.title}</h3>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{content.furtherReading.note}</p>
      </section>

      {content.related.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-neutral-400">关联概念</h2>
          <div className="flex flex-wrap gap-2">
            {content.related.map((id) => {
              const rc = data.concepts.find((c) => c.id === id)
              if (!rc) return null
              return (
                <Link
                  key={id}
                  to={`/concepts/${id}`}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-sm font-medium text-neutral-300 transition hover:border-emerald-500/40 hover:text-emerald-400"
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
        <section className="space-y-3 border-t border-neutral-800 pt-6">
          {!quizOpen ? (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5">
              <div>
                <h2 className="font-bold text-white">🎯 小测验：{questions.length}道题巩固一下</h2>
                <p className="mt-1 text-sm text-neutral-300">答错会自动收进错题本，方便回来复习。</p>
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

      <div className="flex items-center justify-between border-t border-neutral-800 pt-6 text-sm">
        {prev ? (
          <Link to={`/concepts/${prev.id}`} className="font-medium text-neutral-300 hover:text-emerald-400">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/concepts/${next.id}`} className="font-medium text-neutral-300 hover:text-emerald-400">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
