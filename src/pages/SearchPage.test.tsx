import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Topic } from '../types/content'
import { SearchPage } from './SearchPage'

const testTopics: Topic[] = [
  {
    id: 'database',
    title: 'Aurora·DynamoDB·ElastiCache',
    importance: 3,
    sourcePages: [1, 2],
    concepts: [
      {
        id: 'database.aurora',
        name: 'Aurora',
        summary: 'MySQL·PostgreSQL과 호환되는 관계형 데이터베이스다',
        paragraphs: ['읽기 전용 복제본을 최대 15개까지 둔다.'],
      },
    ],
  },
  {
    id: 'storage',
    title: 'S3 스토리지 클래스 유형',
    importance: 2,
    sourcePages: [3, 4],
    concepts: [
      {
        id: 'storage.deep-archive',
        name: 'S3 Glacier Deep Archive',
        summary: '**장기** 보관에 쓰는 가장 저렴한 클래스다',
        paragraphs: ['조회에 12시간이 걸린다.'],
      },
    ],
  },
]

// 'aurora'는 개념 이름과 주제 제목 양쪽에 걸린다. 개념 카드만 집어내는 이름은 한 줄 요약이다.
const AURORA_CONCEPT_LINK = { name: /MySQL·PostgreSQL과 호환되는 관계형 데이터베이스다$/ }

function renderPage(path = '/search') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SearchPage topics={testTopics} />
    </MemoryRouter>,
  )
}

// 돌아가기가 실제로 어느 화면에 닿는지 보려면 검색 화면 밖의 라우트가 있어야 한다.
function renderWithHistory(entries: string[]) {
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      <Routes>
        <Route element={<p>주제 목록 화면</p>} path="/" />
        <Route element={<p>개념 읽기 화면</p>} path="/topic/database" />
        <Route element={<SearchPage topics={testTopics} />} path="/search" />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SearchPage', () => {
  it('질의가 없으면 안내 문구만 보이고 결과 카드가 없다', () => {
    renderPage()

    expect(
      screen.getByText('개념 이름이나 주제 이름을 입력하면 결과가 여기에 나옵니다.'),
    ).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.queryByText(/결과 \d+개/)).not.toBeInTheDocument()
  })

  it('입력에 글자를 치면 결과가 나타난다', async () => {
    renderPage()

    await userEvent.type(screen.getByLabelText('개념·주제 검색'), 'aurora')

    expect(screen.getByRole('link', AURORA_CONCEPT_LINK)).toBeInTheDocument()
  })

  it('?q=가 붙은 주소로 들어가면 결과와 입력값이 처음부터 보인다', () => {
    renderPage('/search?q=aurora')

    expect(screen.getByLabelText('개념·주제 검색')).toHaveValue('aurora')
    expect(screen.getByRole('link', AURORA_CONCEPT_LINK)).toBeInTheDocument()
  })

  it('개념 히트 카드가 그 개념이 속한 주제로 링크한다', () => {
    renderPage('/search?q=aurora')

    expect(screen.getByRole('link', AURORA_CONCEPT_LINK)).toHaveAttribute('href', '/topic/database')
  })

  it('맞는 것이 없는 질의에는 결과 없음 문구를 보여준다', () => {
    renderPage('/search?q=존재하지않는개념')

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('결과 개수 표시가 실제 카드 수와 같다', () => {
    renderPage('/search?q=s3')

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByText('결과 2개')).toBeInTheDocument()
  })

  it('한 줄 요약의 강조 마커를 화면에 그대로 내보내지 않는다', () => {
    renderPage('/search?q=장기')

    expect(screen.getByText('장기 보관에 쓰는 가장 저렴한 클래스다')).toBeInTheDocument()
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument()
  })

  it('돌아가기를 누르면 검색 화면에 들어오기 전 화면으로 간다', async () => {
    renderWithHistory(['/topic/database', '/search'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('개념 읽기 화면')).toBeInTheDocument()
  })

  it('글자를 친 뒤에 눌러도 한 글자씩 되감기지 않고 직전 화면으로 간다', async () => {
    renderWithHistory(['/topic/database', '/search'])

    await userEvent.type(screen.getByLabelText('개념·주제 검색'), 'aurora')
    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('개념 읽기 화면')).toBeInTheDocument()
  })

  it('검색 화면을 직접 열었으면 주제 목록으로 보낸다', async () => {
    renderWithHistory(['/search'])

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('주제 목록 화면')).toBeInTheDocument()
  })

  it('직접 연 검색 화면에서 글자를 친 뒤에도 주제 목록으로 보낸다', async () => {
    renderWithHistory(['/search'])

    await userEvent.type(screen.getByLabelText('개념·주제 검색'), 'aurora')
    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('주제 목록 화면')).toBeInTheDocument()
  })
})
