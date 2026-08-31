import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { QuizQuestion } from '../data/quiz'
import { addWrongAnswer, removeWrongAnswer, setBestScore } from '../lib/progress'

function shuffleOptions(options: string[]): { text: string; originalIndex: number }[] {
  const arr = options.map((text, originalIndex) => ({ text, originalIndex }))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export type QuizRunnerProps = {
  title: string
  questions: QuizQuestion[]
  scoreKey: string
  onExit: () => void
  exitLabel?: string
  reviewLink?: { to: string; label: string }
}

export default function QuizRunner({ title, questions, scoreKey, onExit, exitLabel = '返回', reviewLink }: QuizRunnerProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[index]
  const shuffled = useMemo(() => shuffleOptions(q.options), [q.id])

  function handleSelect(originalIdx: number) {
    if (selected !== null) return
    setSelected(originalIdx)
    if (originalIdx === q.correctIndex) {
      setScore((s) => s + 1)
      removeWrongAnswer(q.id)
    } else {
      addWrongAnswer(q.id)
    }
  }

  function handleNext() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setBestScore(scoreKey, score, questions.length)
      setFinished(true)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-neutral-300">暂时没有可用的题目。</p>
        <button onClick={onExit} className="btn-secondary">
          {exitLabel}
        </button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const good = pct >= 80
    return (
      <div className="mx-auto max-w-md space-y-5 text-center">
        <div className={`text-6xl ${good ? 'animate-bounce' : ''}`}>{good ? '🎉' : pct >= 50 ? '🙂' : '📖'}</div>
        <h2 className="text-xl font-bold text-white">{title} 完成！</h2>
        <p className="text-neutral-300">
          得分：<span className="font-semibold text-white">{score} / {questions.length}</span>（{pct}%）
        </p>
        {!good && (
          <p className="text-sm text-neutral-300">
            答错的题目已经自动收进错题本，建议回顾一下相关概念再来挑战一次。
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setIndex(0)
              setSelected(null)
              setScore(0)
              setFinished(false)
            }}
            className="btn-primary"
          >
            再来一次
          </button>
          {reviewLink && (
            <Link to={reviewLink.to} className="btn-secondary">
              {reviewLink.label}
            </Link>
          )}
          <button onClick={onExit} className="btn-secondary">
            {exitLabel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center justify-between text-sm text-neutral-300">
        <button onClick={onExit} className="font-medium hover:text-emerald-400">← {exitLabel}</button>
        <span className="font-medium">
          {title} · 第 {index + 1} / {questions.length} 题
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="tech-card p-6">
        <h3 className="text-base font-semibold text-white">{q.question}</h3>
        <div className="mt-4 space-y-2">
          {shuffled.map(({ text, originalIndex }, displayIdx) => {
            const isCorrect = originalIndex === q.correctIndex
            const isSelected = originalIndex === selected
            let style = 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/60'
            if (selected !== null) {
              if (isCorrect) style = 'border-emerald-400/60 bg-emerald-500/10'
              else if (isSelected) style = 'border-red-400/60 bg-red-500/10'
              else style = 'border-neutral-800 opacity-50'
            }
            return (
              <button
                key={originalIndex}
                onClick={() => handleSelect(originalIndex)}
                disabled={selected !== null}
                className={`w-full rounded-2xl border p-3 text-left text-sm font-medium text-neutral-200 transition-all active:scale-[0.99] ${style}`}
              >
                <span className="mr-2 font-bold text-emerald-400">{String.fromCharCode(65 + displayIdx)}.</span>
                {text}
                {selected !== null && isCorrect && <span className="ml-2">✓</span>}
                {selected !== null && isSelected && !isCorrect && <span className="ml-2">✗</span>}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-800/40 p-4 text-sm text-neutral-300">
            <span className="font-semibold text-white">解析：</span>
            {q.explanation}
          </div>
        )}
      </div>

      {selected !== null && (
        <div className="flex justify-end">
          <button onClick={handleNext} className="btn-primary">
            {index + 1 < questions.length ? '下一题 →' : '查看结果'}
          </button>
        </div>
      )}
    </div>
  )
}
