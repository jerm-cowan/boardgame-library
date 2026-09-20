import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import DashboardPage from './pages/DashboardPage'
import CollectionStoryPage from './pages/CollectionStoryPage'

function NotFound() {
  return <Navigate to="/dashboard" replace />
}

// Route changes don't reset scroll position by default in react-router.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-0.5 text-sm transition-colors ${
    isActive
      ? 'border-foreground font-medium text-foreground'
      : 'border-transparent text-muted-foreground hover:text-foreground'
  }`

// Every page shares the same max-w-6xl content container, so the nav lines up with
// (and resizes with) the page below it without needing to branch per route.
function NavBar() {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-wide text-foreground">Board Room</span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
        </div>
        <div className="flex gap-5">
          <NavLink to="/dashboard" className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/collection-story" className={navLinkClassName}>
            Collection Story
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollToTop />
        <NavBar />
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
