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
    <header className="sticky top-0 z-20 bg-[#08090a]/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2 text-sm font-medium text-white">
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
                `rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-white/[0.06] text-white' : 'text-[#8a8f98] hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-1 rounded-[8px] px-3 py-1.5 text-[13px] font-medium text-[#8a8f98] transition-colors hover:text-white"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  )
}
