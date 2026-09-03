import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { topics as defaultTopics } from '../data'
import { searchContent, stripEmphasis } from '../lib/search'
import type { Topic } from '../types/content'

interface SearchPageProps {
  topics?: Topic[]
}

const backIcon = (
  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="20">
    <path d="M15 19l-7-7 7-7" />
  </svg>
)

// -ml-4로 px-4를 상쇄해야 화살표가 아래의 제목·입력과 같은 세로선(320px에서 20px)에 선다.
const backButtonClass = '-ml-4 inline-flex min-h-[44px] items-center gap-2 rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-100'

const cardClass = 'block rounded-lg border border-neutral-800 bg-panel p-5 transition-colors hover:border-neutral-700'

export function SearchPage({ topics = defaultTopics }: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { key } = useLocation()
  // 새 탭이나 공유 링크로 검색 화면을 직접 열면 돌아갈 앱 화면이 없다(첫 항목의 키가 'default').
  // 타이핑의 replace가 키를 갈아치우므로 진입 시점 값을 붙잡아 둔다.
  const [hasPreviousScreen] = useState(() => key !== 'default')
  const query = searchParams.get('q') ?? ''
  const hasQuery = query.trim().length > 0
  const hits = searchContent(topics, query)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    // replace가 없으면 글자 수만큼 히스토리가 쌓여 뒤로 가기가 한 글자씩 되감긴다.
    setSearchParams(next === '' ? {} : { q: next }, { replace: true })
  }

  function handleBack() {
    if (hasPreviousScreen) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <section className="max-w-3xl space-y-8 break-keep break-anywhere">
      <div className="space-y-3">
        <button className={backButtonClass} onClick={handleBack} type="button">
          {backIcon}
          돌아가기
        </button>
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-title">검색</h1>
          {hasQuery && <span className="text-sm text-neutral-500">결과 {hits.length}개</span>}
        </div>
        <input
          aria-label="개념·주제 검색"
          autoFocus
          className="w-full rounded-md border border-neutral-800 bg-[#141414] px-4 py-3 text-[15px] text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          onChange={handleChange}
          placeholder="개념·주제 검색"
          type="text"
          value={query}
        />
      </div>

      {!hasQuery ? (
        <p className="text-[15px] leading-7 text-neutral-400">
          개념 이름이나 주제 이름을 입력하면 결과가 여기에 나옵니다.
        </p>
      ) : hits.length === 0 ? (
        <p className="text-[15px] leading-7 text-neutral-400">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid gap-3">
          {hits.map((hit) =>
            hit.kind === 'concept' ? (
              <Link className={cardClass} key={hit.concept.id} to={`/topic/${hit.topic.id}`}>
                <span className="block text-base font-medium text-neutral-100">
                  {hit.concept.name}
                </span>
                <span className="mt-1 block text-xs text-neutral-500">{hit.topic.title}</span>
                <span className="mt-2 block text-sm text-neutral-400">
                  {stripEmphasis(hit.concept.summary)}
                </span>
              </Link>
            ) : (
              <Link className={cardClass} key={hit.topic.id} to={`/topic/${hit.topic.id}`}>
                <span className="block text-lg font-medium text-neutral-100">{hit.topic.title}</span>
                <span className="mt-1 block text-xs text-neutral-500">주제</span>
              </Link>
            ),
          )}
        </div>
      )}
    </section>
  )
}
