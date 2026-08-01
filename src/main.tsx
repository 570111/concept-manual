import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Concepts from './pages/Concepts.tsx'
import ConceptDetail from './pages/ConceptDetail.tsx'
import Quiz from './pages/Quiz.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="concepts" element={<Concepts />} />
          <Route path="concepts/:conceptId" element={<ConceptDetail />} />
          <Route path="quiz" element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
