import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        本站概念解读为通俗化学习内容，不构成专业心理咨询、法律或投资建议
      </footer>
    </div>
  )
}

export default App
