import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
      <NavBar />
      <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="relative border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        本站概念解读为通俗化学习内容，不构成专业心理咨询、法律或投资建议
      </footer>
    </div>
  )
}

export default App
