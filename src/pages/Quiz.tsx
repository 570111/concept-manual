import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryOrder, categoryInfo, type Category, type ConceptMeta } from '../data/concepts'
import type { QuizQuestion } from '../data/quiz'
import { useContent } from '../lib/ContentContext'
import { getWrongAnswers, getBestScore } from '../lib/progress'
import QuizRunner from '../components/QuizRunner'

function scoreKey(category: Category) {
  return `category-${category}`
}

function questionsForCategory(concepts: ConceptMeta[], quizQuestions: QuizQuestion[], category: Category) {
  const ids = new Set(concepts.filter((c) => c.category === category).map((c) => c.id))
  return quizQuestions.filter((q) => ids.has(q.conceptId))
}

function countByDifficulty(qs: QuizQuestion[]) {
  return {
    basic: qs.filter((q) => q.difficulty === 'basic').length,
    advanced: qs.filter((q) => q.difficulty === 'advanced').length,
  }
}

function CategorySelect({
  concepts,
  quizQuestions,
  onSelect,
}: {
  concepts: ConceptMeta[]
  quizQuestions: QuizQuestion[]
  onSelect: (c: Category) => void
}) {
  const wrongCount = getWrongAnswers().length
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">测验练习</h1>
          <p className="mt-2 text-slate-400">
            选一个分类，把这一类下所有概念的题目混在一起练习。也可以去每个概念详情页里做单独的2题小测验。
          </p>
        </div>
        {wrongCount > 0 && (
          <span className="btn-secondary flex-none !px-3 !py-2 !text-amber-300">
            📓 错题 {wrongCount}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categoryOrder.map((c) => {
          const qs = questionsForCategory(concepts, quizQuestions, c)
          const counts = countByDifficulty(qs)
          const best = getBestScore(scoreKey(c))
          return (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className="tech-card flex items-center gap-4 p-5 text-left transition-colors hover:border-slate-700"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-slate-700 text-base font-bold text-white">
                {categoryInfo[c].numeral}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-white">{categoryInfo[c].label}</h2>
                <p className="mt-0.5 text-sm text-slate-400">
                  {qs.length} 道题目 · 🌱基础{counts.basic} → 🔥应用{counts.advanced}
                </p>
              </div>
              {best !== null && (
                <div className="flex-none rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                  最高 {best}%
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-center text-sm text-slate-400">
        还没学过对应的概念？先去 <Link to="/concepts" className="font-medium text-white hover:underline">概念地图</Link> 看看。
      </p>
    </div>
  )
}

export default function Quiz() {
  const { data } = useContent()
  const [category, setCategory] = useState<Category | null>(null)

  if (!data) return null
  const { concepts, quizQuestions } = data

  if (!category) {
    return <CategorySelect concepts={concepts} quizQuestions={quizQuestions} onSelect={setCategory} />
  }

  return (
    <QuizRunner
      title={categoryInfo[category].label}
      questions={questionsForCategory(concepts, quizQuestions, category)}
      scoreKey={scoreKey(category)}
      onExit={() => setCategory(null)}
      exitLabel="返回分类"
    />
  )
}
