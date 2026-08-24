import { NavLink, Outlet } from 'react-router-dom'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-[44px] items-center px-4 py-2 text-sm transition-colors hover:text-title ${isActive ? 'text-title' : 'text-muted'}`

export function Layout() {
  return (
    <div className="min-h-screen bg-page text-body">
      <header className="border-b border-border">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <NavLink className="inline-flex min-h-[44px] items-center text-base font-medium text-title" to="/">AWS SAA-C03</NavLink>
          <nav aria-label="주요 내비게이션" className="flex items-center gap-1">
            <NavLink className={linkClassName} end to="/">주제 목록</NavLink>
            <NavLink className={linkClassName} to="/review">복습</NavLink>
          </nav>
        </div>
      </header>
      <main className="px-5 py-8 sm:px-8"><Outlet /></main>
    </div>
  )
}
