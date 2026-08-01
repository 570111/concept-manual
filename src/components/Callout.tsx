import type { ReactNode } from 'react'

type Props = {
  tone?: 'info' | 'warn' | 'good'
  title?: string
  children: ReactNode
}

const toneStyles: Record<string, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
  warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  good: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
}

export default function Callout({ tone = 'info', title, children }: Props) {
  return (
    <div className={`rounded-2xl border-2 p-4 text-sm ${toneStyles[tone]}`}>
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
