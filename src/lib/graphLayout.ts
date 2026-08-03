import { concepts, categoryOrder, type Category } from '../data/concepts'
import { conceptContent } from '../data/conceptContent'

export const categoryColor: Record<Category, string> = {
  bias: '#f97316',
  social: '#0ea5e9',
  economy: '#10b981',
  strategy: '#f43f5e',
  systems: '#8b5cf6',
  thinking: '#eab308',
  communication: '#ec4899',
}

export type GraphNode = {
  id: string
  x: number
  y: number
  category: Category
}

export type GraphEdge = {
  a: string
  b: string
}

const GAP_DEG = 5

export function computeGraphLayout(size = 900) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.42

  const nodes: GraphNode[] = []
  const totalGap = GAP_DEG * categoryOrder.length
  const usableDeg = 360 - totalGap

  let cursorDeg = -90
  for (const category of categoryOrder) {
    const items = concepts.filter((c) => c.category === category)
    const arcDeg = (items.length / concepts.length) * usableDeg
    const step = items.length > 1 ? arcDeg / (items.length - 1) : 0
    items.forEach((c, i) => {
      const deg = items.length > 1 ? cursorDeg + step * i : cursorDeg + arcDeg / 2
      const rad = (deg * Math.PI) / 180
      nodes.push({
        id: c.id,
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
        category,
      })
    })
    cursorDeg += arcDeg + GAP_DEG
  }

  const edgeSet = new Map<string, GraphEdge>()
  for (const c of concepts) {
    const content = conceptContent[c.id]
    if (!content) continue
    for (const relatedId of content.related) {
      if (!concepts.some((x) => x.id === relatedId)) continue
      const key = [c.id, relatedId].sort().join('|')
      if (!edgeSet.has(key)) edgeSet.set(key, { a: c.id, b: relatedId })
    }
  }

  return { nodes, edges: Array.from(edgeSet.values()), cx, cy, size }
}
