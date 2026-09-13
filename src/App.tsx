import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import CollectionStoryPage from './pages/CollectionStoryPage'

function NotFound() {
  return <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <nav className="flex gap-4 border-b border-border bg-surface px-6 py-4">
          <Link to="/dashboard" className="hover:text-foreground/80">
            Dashboard
          </Link>
          <Link to="/collection-story" className="hover:text-foreground/80">
            Collection Story
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/collection-story" element={<CollectionStoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
