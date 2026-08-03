import { concepts, type ConceptMeta } from '../data/concepts'

// 固定的起始日期，用来把日期换算成一个稳定的索引——同一天，所有人看到的"今日概念"都一样
const EPOCH = new Date(2026, 0, 1).getTime()
const DAY_MS = 24 * 60 * 60 * 1000

export function getTodaysConcept(date: Date = new Date()): ConceptMeta {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const daysSinceEpoch = Math.round((today - EPOCH) / DAY_MS)
  const index = ((daysSinceEpoch % concepts.length) + concepts.length) % concepts.length
  return concepts[index]
}

export function formatTodayLabel(date: Date = new Date()): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${weekdays[date.getDay()]}`
}
