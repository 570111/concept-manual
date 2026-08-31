import type { ReactNode } from 'react'

type Props = {
  tone?: 'info' | 'warn' | 'good'
  title?: string
  children: ReactNode
}

const toneStyles: Record<string, string> = {
  info: 'border-sky-800/60 bg-sky-950/40 text-sky-200',
  warn: 'border-amber-800/60 bg-amber-950/40 text-amber-200',
  good: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-200',
}

export default function Callout({ tone = 'info', title, children }: Props) {
  return (
    <div className={`rounded-2xl border p-4 text-sm ${toneStyles[tone]}`}>
      {title && <div className="mb-1 font-semibold text-white">{title}</div>}
      <div className="leading-relaxed text-neutral-300">{children}</div>
    </div>
  )
}
