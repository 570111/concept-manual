import { NavLink, useNavigate } from 'react-router-dom'
import { useContent } from '../lib/ContentContext'

const links = [
  { to: '/', label: '首页' },
  { to: '/concepts', label: '概念地图' },
  { to: '/graph', label: '关系图谱' },
  { to: '/quiz', label: '测验' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const { logout } = useContent()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-sm font-medium tracking-wide text-white">
          <span className="text-lg">🔭</span>
          破局手册
        </NavLink>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-1 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-500 transition-colors hover:text-slate-300"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  )
}
