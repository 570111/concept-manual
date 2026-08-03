import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useContent } from '../lib/ContentContext'

export default function Login() {
  const [key, setKey] = useState('')
  const [checking, setChecking] = useState(false)
  const { data, error, login } = useContent()
  const navigate = useNavigate()
  const location = useLocation()

  if (data) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) return
    setChecking(true)
    const ok = await login(key)
    setChecking(false)
    if (ok) {
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-3xl">🔭</div>
          <h1 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">破局手册</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">输入访问密钥继续</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="PJSC-XXXX-XXXX-XXXX"
            autoFocus
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-center font-mono text-sm tracking-wider text-slate-900 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={checking} className="btn-primary w-full">
            {checking ? '验证中…' : '进入'}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400">没有密钥？联系提供给你这份资料的人获取。</p>
      </div>
    </div>
  )
}
