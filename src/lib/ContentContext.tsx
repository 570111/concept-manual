import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabaseClient'
import type { ConceptMeta } from '../data/concepts'
import type { ConceptContent } from '../data/conceptContent'
import type { QuizQuestion } from '../data/quiz'

const STORAGE_KEY = 'concept-manual-key'

export type ContentData = {
  concepts: ConceptMeta[]
  conceptContent: Record<string, ConceptContent>
  quizQuestions: QuizQuestion[]
  label: string
}

type RpcResult = {
  ok: boolean
  label?: string
  concepts?: ConceptMeta[]
  content?: Record<string, ConceptContent>
  quiz?: QuizQuestion[]
}

type ContentContextValue = {
  data: ContentData | null
  loading: boolean
  error: string | null
  login: (key: string) => Promise<boolean>
  logout: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, '')
}

async function fetchContent(key: string): Promise<ContentData | null> {
  const { data, error } = await supabase.rpc('verify_key_and_get_content', { input_key: key })
  if (error) {
    console.error('verify_key_and_get_content failed:', error.message)
    return null
  }
  const result = data as RpcResult
  if (!result?.ok || !result.concepts || !result.content || !result.quiz || !result.label) return null
  return { concepts: result.concepts, conceptContent: result.content, quizQuestions: result.quiz, label: result.label }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setLoading(false)
      return
    }
    fetchContent(stored).then((result) => {
      if (!result) localStorage.removeItem(STORAGE_KEY)
      setData(result)
      setLoading(false)
    })
  }, [])

  async function login(inputKey: string): Promise<boolean> {
    const normalized = normalizeKey(inputKey)
    if (!normalized) return false
    setError(null)
    const result = await fetchContent(normalized)
    if (!result) {
      setError('密钥不正确，检查一下有没有输错或漏了字符')
      return false
    }
    localStorage.setItem(STORAGE_KEY, normalized)
    setData(result)
    return true
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setData(null)
  }

  return <ContentContext.Provider value={{ data, loading, error, login, logout }}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
