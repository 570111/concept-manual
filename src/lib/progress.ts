// 本地学习进度、错题本状态的存储（全部基于 localStorage，仅存在于当前浏览器）

const LEARNED_KEY = 'concept-progress-learned'
const LAST_CONCEPT_KEY = 'concept-progress-last-concept'
const WRONG_ANSWERS_KEY = 'concept-progress-wrong-answers'

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function writeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)))
}

export function getLearnedConcepts(): Set<string> {
  return readSet(LEARNED_KEY)
}

export function markConceptLearned(conceptId: string) {
  const set = readSet(LEARNED_KEY)
  set.add(conceptId)
  writeSet(LEARNED_KEY, set)
  localStorage.setItem(LAST_CONCEPT_KEY, conceptId)
}

export function isConceptLearned(conceptId: string): boolean {
  return getLearnedConcepts().has(conceptId)
}

export type WrongAnswerRecord = {
  questionId: string
  lastWrongAt: number
}

export function getWrongAnswers(): WrongAnswerRecord[] {
  try {
    const raw = localStorage.getItem(WRONG_ANSWERS_KEY)
    return raw ? (JSON.parse(raw) as WrongAnswerRecord[]) : []
  } catch {
    return []
  }
}

export function addWrongAnswer(questionId: string) {
  const list = getWrongAnswers().filter((r) => r.questionId !== questionId)
  list.push({ questionId, lastWrongAt: Date.now() })
  localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(list))
}

export function removeWrongAnswer(questionId: string) {
  const list = getWrongAnswers().filter((r) => r.questionId !== questionId)
  localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(list))
}

function bestScoreKey(key: string) {
  return `concept-quiz-best-${key}`
}

export function getBestScore(key: string): number | null {
  const raw = localStorage.getItem(bestScoreKey(key))
  return raw ? Number(raw) : null
}

export function setBestScore(key: string, score: number, total: number) {
  const pct = Math.round((score / total) * 100)
  const current = getBestScore(key)
  if (current === null || pct > current) {
    localStorage.setItem(bestScoreKey(key), String(pct))
  }
}
