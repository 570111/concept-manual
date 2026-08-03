import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession } from '../lib/auth'

const links = [
  { to: '/', label: '首页' },
  { to: '/concepts', label: '概念地图' },
  { to: '/graph', label: '关系图谱' },
  { to: '/quiz', label: '测验' },
]

export default function NavBar() {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="text-xl">🔭</span>
          破局手册
        </NavLink>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-1 rounded-full px-3.5 py-1.5 text-sm font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  )
}
