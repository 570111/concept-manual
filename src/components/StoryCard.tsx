import type { ReactNode } from 'react'

export default function StoryCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="tech-card p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-emerald-400/80">
        <span>📖</span>
        <span>{title ?? '生活场景'}</span>
      </div>
      <div className="space-y-3 leading-relaxed text-slate-200">{children}</div>
    </div>
  )
}
