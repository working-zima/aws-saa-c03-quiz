import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { markFirstOccurrences } from '../lib/glossary'
import type { GlossaryTerm as GlossaryEntry } from '../types/visuals'
import { EmphasizedText } from './EmphasizedText'

const iam: GlossaryEntry = {
  term: 'IAM',
  expansion: 'Identity And Access Management',
  meaning: 'AWS 리소스의 접근 권한을 관리한다.',
  sourceConceptId: 'iam-permissions.iam',
}

describe('본문 속 코드 표기 (ADR-044)', () => {
  it('백틱 한 쌍을 백틱 없는 code 요소로 그리고 글꼴과 크기만 바꾼다', () => {
    const { container } = render(<p><EmphasizedText text="`NotAction`은 나머지 작업을 가리킨다" /></p>)

    const code = container.querySelector('code')
    expect(code).not.toBeNull()
    expect(code).toHaveTextContent(/^NotAction$/)
    expect(code?.className.split(' ').sort()).toEqual(['font-mono', 'text-[0.9em]'])
  })

  it('렌더한 글에 백틱 기호가 남지 않는다', () => {
    const { container } = render(<p><EmphasizedText text="`aws:RequestedRegion` 조건 키와 `/api/*` 경로" /></p>)

    expect(container.textContent).toBe('aws:RequestedRegion 조건 키와 /api/* 경로')
    expect(container.querySelectorAll('code')).toHaveLength(2)
  })

  it('한 문단에 강조와 코드 표기가 함께 있으면 strong과 code가 하나씩 생긴다', () => {
    const { container } = render(<p><EmphasizedText text="**명시적 거부**가 `Allow`보다 앞선다" /></p>)

    expect(container.querySelectorAll('strong')).toHaveLength(1)
    expect(container.querySelector('strong')).toHaveTextContent(/^명시적 거부$/)
    expect(container.querySelectorAll('code')).toHaveLength(1)
    expect(container.querySelector('code')).toHaveTextContent(/^Allow$/)
  })

  it('백틱 안의 약어는 버튼이 되지 않고 백틱 밖에 처음 나온 약어가 버튼이 된다', () => {
    const text = '`IAM` 정책 이름과 달리 IAM 사용자는 사람이다'
    const [segments] = markFirstOccurrences([text], ['IAM'])
    const { container } = render(<p><EmphasizedText glossary={{ segments, terms: [iam] }} text={text} /></p>)

    const code = container.querySelector('code')
    expect(code).toHaveTextContent(/^IAM$/)
    expect(within(code as HTMLElement).queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'IAM' })).toHaveLength(1)
    expect(container.textContent).not.toContain('`')
  })
})
