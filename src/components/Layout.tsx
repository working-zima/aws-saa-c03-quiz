import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useMatch, useNavigationType } from 'react-router-dom'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-[44px] items-center px-4 py-2 text-sm transition-colors hover:text-title ${isActive ? 'text-title' : 'text-muted'}`

export function Layout() {
  const { key } = useLocation()
  const quizMatch = useMatch('/topic/:topicId/quiz')
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP') return

    window.scrollTo(0, 0)
  }, [key, navigationType])

  return (
    <div className="min-h-screen bg-page text-body">
      <header className="sticky top-0 border-b border-border bg-page">
        <div className="px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <NavLink className="inline-flex min-h-[44px] items-center text-base font-medium text-title" to="/">AWS SAA-C03</NavLink>
            <nav aria-label="주요 내비게이션" className="flex items-center gap-1">
              {quizMatch
                ? <NavLink className={linkClassName} to={`/topic/${quizMatch.params.topicId}`}>근거 개념</NavLink>
                : <NavLink className={linkClassName} to="/search">검색</NavLink>}
              <NavLink className={linkClassName} to="/review">복습</NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl"><Outlet /></div>
      </main>
    </div>
  )
}
