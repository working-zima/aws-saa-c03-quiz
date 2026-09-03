import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
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
})
