import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Concepts from './pages/Concepts.tsx'
import ConceptDetail from './pages/ConceptDetail.tsx'
import Quiz from './pages/Quiz.tsx'
import Graph from './pages/Graph.tsx'
import Login from './pages/Login.tsx'
import Preview from './pages/Preview.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import { ContentProvider } from './lib/ContentContext.tsx'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="preview" element={<Preview />} />
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route element={<App />}>
              <Route index element={<Home />} />
              <Route path="concepts" element={<Concepts />} />
              <Route path="concepts/:conceptId" element={<ConceptDetail />} />
              <Route path="graph" element={<Graph />} />
              <Route path="quiz" element={<Quiz />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  </StrictMode>,
)
