import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-[44px] items-center px-4 py-2 text-sm transition-colors hover:text-title ${isActive ? 'text-title' : 'text-muted'}`

export function Layout() {
  const { hash, key } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP') return
    // 목적지가 앵커를 지정했으면 스크롤 주인은 그 화면이다(ADR-020).
    // 여기서 0으로 되돌리면 착지 직후 개념 위치가 지워진다.
    if (hash) return

    window.scrollTo(0, 0)
  }, [hash, key, navigationType])

  return (
    <div className="min-h-screen bg-page text-body">
      <header className="sticky top-0 border-b border-border bg-page">
        <div className="px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <NavLink className="inline-flex min-h-[44px] items-center text-base font-medium text-title" to="/">AWS SAA-C03</NavLink>
            <nav aria-label="주요 내비게이션" className="flex items-center gap-1">
              <NavLink className={linkClassName} to="/search">검색</NavLink>
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
