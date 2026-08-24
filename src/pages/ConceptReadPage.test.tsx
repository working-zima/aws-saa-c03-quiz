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

function renderPage(path: string, markRead = vi.fn()) {
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/topic/:topicId"
          element={<ConceptReadPage markRead={markRead} topics={testTopics} />}
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
    const actionBar = quizLink.parentElement
    expect(quizLink).toHaveAttribute('href', '/topic/storage-topic/quiz')
    expect(quizLink).toHaveClass('min-h-[44px]')
    expect(actionBar).toHaveClass('sticky', 'bottom-0', 'bg-page', 'border-t')
    expect(container.querySelector('section')?.lastElementChild).toBe(actionBar)
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
