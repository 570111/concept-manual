import type { ReactNode } from 'react'

export default function StoryCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-400 dark:text-slate-500">
        <span>📖</span>
        <span>{title ?? '生活场景'}</span>
      </div>
      <div className="space-y-3 leading-relaxed text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  )
}
