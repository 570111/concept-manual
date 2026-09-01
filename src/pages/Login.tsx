import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="tech-card w-full max-w-sm p-10">
        <div className="text-center">
          <div className="text-2xl">🔭</div>
          <h1 className="mt-2 text-base font-medium text-white">破局手册</h1>
          <p className="eyebrow mt-2">输入访问密钥继续</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="PJSC-XXXX-XXXX-XXXX"
            autoFocus
            className="w-full rounded-full border border-neutral-700 bg-transparent px-4 py-2.5 text-center font-mono text-sm tracking-wider text-white outline-none placeholder:text-neutral-600 focus:border-neutral-400"
          />
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={checking} className="btn-primary w-full">
            {checking ? '验证中…' : '进入'}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-neutral-500">
          没有密钥？
          <Link to="/preview" className="font-medium text-white hover:underline">
            先免费试读3个概念 →
          </Link>
        </p>
      </div>
    </div>
  )
}
