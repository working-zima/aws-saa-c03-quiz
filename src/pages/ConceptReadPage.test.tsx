import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Topic } from '../types/content'
import { ConceptReadPage } from './ConceptReadPage'

const testTopics: Topic[] = [
  {
    id: 'storage-topic',
    title: '스토리지 주제',
    importance: 3,
    sourcePages: [8, 9],
    concepts: [
      {
        id: 'storage-topic.classes',
        name: '스토리지 클래스',
        summary: '접근 방식에 맞는 저장소를 선택한다.',
        paragraphs: ['첫 번째 설명이다.', '항목 1\n항목 2'],
      },
      {
        id: 'storage-topic.object-lock',
        name: '객체 잠금',
        summary: '**규정 준수 모드**는 루트 사용자도 막는다.',
        paragraphs: ['보존 모드는 **거버넌스 모드**와 **규정 준수 모드**로 나뉜다.'],
      },
    ],
  },
]

const navigationTestTopics: Topic[] = [
  {
    id: 'first-topic',
    title: '첫 번째 주제',
    importance: 3,
    sourcePages: [1, 1],
    concepts: [
      {
        id: 'first-topic.concept',
        name: '첫 번째 개념',
        summary: '첫 번째 요약',
        paragraphs: ['첫 번째 설명'],
      },
    ],
  },
  {
    id: 'middle-topic',
    title: '가운데 주제',
    importance: 2,
    sourcePages: [2, 2],
    concepts: [
      {
        id: 'middle-topic.concept',
        name: '가운데 개념',
        summary: '가운데 요약',
        paragraphs: ['가운데 설명'],
      },
    ],
  },
  {
    id: 'last-topic',
    title: '마지막 주제',
    importance: 0,
    sourcePages: [3, 3],
    concepts: [
      {
        id: 'last-topic.concept',
        name: '마지막 개념',
        summary: '마지막 요약',
        paragraphs: ['마지막 설명'],
      },
    ],
  },
]

function renderPage(path: string, markRead = vi.fn(), topics = testTopics) {
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/topic/:topicId"
          element={<ConceptReadPage markRead={markRead} topics={topics} />}
        />
      </Routes>
    </MemoryRouter>,
  )

  return { ...result, markRead }
}

describe('ConceptReadPage', () => {
  it.each(['/topic/storage-topic', '/topic/missing-topic'])(
    '%s의 최상위 section에 한글 단어와 긴 문자열 줄바꿈 클래스를 함께 적용한다',
    (path) => {
      const { container } = renderPage(path)

      expect(container.querySelector('section')).toHaveClass('break-keep', 'break-anywhere')
    },
  )

  it('주어진 주제의 개념 이름, 요약, 본문을 렌더한다', () => {
    renderPage('/topic/storage-topic')

    expect(screen.getByRole('heading', { name: '스토리지 클래스' })).toBeInTheDocument()
    expect(screen.getByText('접근 방식에 맞는 저장소를 선택한다.')).toBeInTheDocument()
    expect(screen.getByText('첫 번째 설명이다.')).toBeInTheDocument()
    expect(screen.getByText(/항목 1\s+항목 2/)).toHaveClass('whitespace-pre-line')
  })

  it('존재하지 않는 주제에서는 안내 문구와 주제 목록 링크를 렌더한다', () => {
    renderPage('/topic/missing-topic')

    expect(screen.getByText('주제를 찾을 수 없습니다.')).toBeInTheDocument()
    const topicListLink = screen.getByRole('link', { name: '주제 목록으로 돌아가기' })
    expect(topicListLink).toHaveAttribute('href', '/')
    expect(topicListLink).toHaveClass('min-h-[44px]')
  })

  it('확인 문제 링크가 해당 주제의 퀴즈 경로를 가리킨다', () => {
    const { container } = renderPage('/topic/storage-topic')

    const quizLink = screen.getByRole('link', { name: '확인 문제 풀기' })
    const actionBar = quizLink.parentElement?.parentElement
    expect(quizLink).toHaveAttribute('href', '/topic/storage-topic/quiz')
    expect(quizLink).toHaveClass('min-h-[44px]')
    expect(actionBar).toHaveClass('sticky', 'bottom-0', 'bg-page', 'border-t')
    expect(actionBar).toHaveClass('-mx-5', 'px-5', 'sm:mx-0', 'sm:px-0')
    expect(actionBar).not.toHaveClass('sm:-mx-8')
    expect(container.querySelector('section')?.lastElementChild).toBe(actionBar)
  })

  it('가운데 주제에서 이전·다음 주제 링크와 확인 문제 링크를 렌더한다', () => {
    renderPage('/topic/middle-topic', vi.fn(), navigationTestTopics)

    expect(screen.getByLabelText('이전 주제')).toHaveAttribute('href', '/topic/first-topic')
    expect(screen.getByLabelText('다음 주제')).toHaveAttribute('href', '/topic/last-topic')
    expect(screen.getByRole('link', { name: '확인 문제 풀기' })).toHaveAttribute(
      'href',
      '/topic/middle-topic/quiz',
    )
  })

  it('첫 주제에서 이전 주제 링크 없이 다음 주제 링크와 확인 문제 링크를 렌더한다', () => {
    renderPage('/topic/first-topic', vi.fn(), navigationTestTopics)

    expect(screen.queryByLabelText('이전 주제')).toBeNull()
    expect(screen.getByLabelText('다음 주제')).toHaveAttribute('href', '/topic/middle-topic')
    expect(screen.getByRole('link', { name: '확인 문제 풀기' })).toHaveAttribute(
      'href',
      '/topic/first-topic/quiz',
    )
  })

  it('마지막 주제에서 다음 주제 링크 없이 이전 주제 링크와 확인 문제 링크를 렌더한다', () => {
    renderPage('/topic/last-topic', vi.fn(), navigationTestTopics)

    expect(screen.getByLabelText('이전 주제')).toHaveAttribute('href', '/topic/middle-topic')
    expect(screen.queryByLabelText('다음 주제')).toBeNull()
    expect(screen.getByRole('link', { name: '확인 문제 풀기' })).toHaveAttribute(
      'href',
      '/topic/last-topic/quiz',
    )
  })

  it('본문과 요약의 키워드 표기를 굵고 밝은 강조로 렌더한다', () => {
    renderPage('/topic/storage-topic')

    const emphasized = screen.getAllByText('규정 준수 모드')

    expect(emphasized).toHaveLength(2)
    emphasized.forEach((node) => {
      expect(node.tagName).toBe('STRONG')
      expect(node).toHaveClass('font-medium', 'text-neutral-100')
    })
    expect(screen.getByText('거버넌스 모드')).toHaveClass('font-medium', 'text-neutral-100')
  })

  it('강조 표기 기호를 화면에 노출하지 않는다', () => {
    const { container } = renderPage('/topic/storage-topic')

    expect(container.textContent).not.toContain('**')
    expect(screen.getByText(/보존 모드는/)).toHaveTextContent('보존 모드는 거버넌스 모드와 규정 준수 모드로 나뉜다.')
  })

  it('화면 진입 시 해당 주제를 읽음 처리한다', () => {
    const { markRead } = renderPage('/topic/storage-topic')

    expect(markRead).toHaveBeenCalledOnce()
    expect(markRead).toHaveBeenCalledWith('storage-topic')
  })
})
