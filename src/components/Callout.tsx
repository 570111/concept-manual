import type { ReactNode } from 'react'

type Props = {
  tone?: 'info' | 'warn' | 'good'
  title?: string
  children: ReactNode
}

const toneStyles: Record<string, string> = {
  info: 'border-sky-500/25 bg-sky-500/5 text-sky-200 shadow-[0_0_24px_-14px_rgba(56,189,248,0.6)]',
  warn: 'border-amber-500/25 bg-amber-500/5 text-amber-200 shadow-[0_0_24px_-14px_rgba(245,158,11,0.6)]',
  good: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-200 shadow-[0_0_24px_-14px_rgba(16,185,129,0.6)]',
}

export default function Callout({ tone = 'info', title, children }: Props) {
  return (
    <div className={`rounded-2xl border p-4 text-sm ${toneStyles[tone]}`}>
      {title && <div className="mb-1 font-semibold text-white">{title}</div>}
      <div className="leading-relaxed text-slate-300">{children}</div>
    </div>
  )
}
