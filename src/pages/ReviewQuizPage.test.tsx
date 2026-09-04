import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../types/content'
import type { Progress } from '../types/progress'
import { ReviewQuizPage } from './ReviewQuizPage'

const testQuestions: Question[] = [
  { id: 'q001', topicId: 'storage', conceptId: 'storage.s3', prompt: '질문 1', choices: ['정답 1', '오답 A 1', '오답 B 1', '오답 C 1'], answerIndex: 0, explanation: '해설 1' },
  { id: 'q002', topicId: 'storage', conceptId: 'storage.ebs', prompt: '질문 2', choices: ['정답 2', '오답 A 2', '오답 B 2', '오답 C 2'], answerIndex: 0, explanation: '해설 2' },
  { id: 'q003', topicId: 'database', conceptId: 'database.rds', prompt: '질문 3', choices: ['정답 3', '오답 A 3', '오답 B 3', '오답 C 3'], answerIndex: 0, explanation: '해설 3' },
]

const noShuffle = (items: Question[]) => items

const allWrong: Progress = {
  version: 2,
  read: {},
  answers: { q001: false, q003: false },
  wrong: { q001: true, q003: true },
}

function renderPage(path: string, progress: Progress = allWrong) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          element={<ReviewQuizPage answer={vi.fn()} progress={progress} questions={testQuestions} shuffle={noShuffle} />}
          path="/review/quiz"
        />
        <Route
          element={<ReviewQuizPage answer={vi.fn()} progress={progress} questions={testQuestions} shuffle={noShuffle} />}
          path="/review/quiz/:topicId"
        />
      </Routes>
    </MemoryRouter>,
  )
}

async function answerCorrectly(label: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: label }))
  await user.click(screen.getByRole('button', { name: label }))
}

describe('ReviewQuizPage', () => {
  it('오답노트에 있는 문항만 낸다', () => {
    renderPage('/review/quiz')

    expect(screen.getByRole('heading', { name: '오답 다시 풀기' })).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByText('질문 1')).toBeInTheDocument()
  })

  it('주제가 붙으면 그 주제의 오답만 낸다', () => {
    renderPage('/review/quiz/database')

    expect(screen.getByText('1 / 1')).toBeInTheDocument()
    expect(screen.getByText('질문 3')).toBeInTheDocument()
  })

  // 푸는 도중 오답노트가 바뀌어도 세트가 흔들리면 안 된다. 진입 시점에 한 번만 고른다.
  it('푸는 도중 오답노트가 비어도 세트를 그대로 유지한다', () => {
    const { rerender } = renderPage('/review/quiz')
    expect(screen.getByText('1 / 2')).toBeInTheDocument()

    rerender(
      <MemoryRouter initialEntries={['/review/quiz']}>
        <Routes>
          <Route
            element={(
              <ReviewQuizPage
                answer={vi.fn()}
                progress={{ version: 2, read: {}, answers: {}, wrong: {} }}
                questions={testQuestions}
                shuffle={noShuffle}
              />
            )}
            path="/review/quiz"
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('세트를 끝내면 완료 화면과 오답노트로 가는 링크를 준다', async () => {
    renderPage('/review/quiz')

    await answerCorrectly('정답 1')
    await answerCorrectly('정답 3')

    expect(screen.getByRole('heading', { name: '오답 다시 풀기 완료' })).toBeInTheDocument()
    expect(screen.getByText('맞힌 개수 2 / 2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '오답노트로 돌아가기' })).toHaveAttribute('href', '/review')
  })

  it('다시 풀 오답이 없으면 안내와 오답노트 링크를 보여준다', () => {
    renderPage('/review/quiz', { version: 2, read: {}, answers: { q001: true }, wrong: {} })

    expect(screen.getByRole('heading', { name: '오답 다시 풀기' })).toBeInTheDocument()
    expect(screen.getByText('다시 풀 오답이 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '오답노트로 돌아가기' })).toHaveAttribute('href', '/review')
  })
})
