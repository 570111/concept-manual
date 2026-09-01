import type { ReactNode } from 'react'

export default function StoryCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="tech-card p-5">
      <div className="eyebrow mb-2 flex items-center gap-2">
        <span>📖</span>
        <span>{title ?? '生活场景'}</span>
      </div>
      <div className="space-y-3 leading-relaxed text-neutral-200">{children}</div>
    </div>
  )
}
