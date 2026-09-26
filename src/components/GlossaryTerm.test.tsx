import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { GlossaryTerm as GlossaryEntry } from '../types/visuals'
import { GlossaryTerm } from './GlossaryTerm'

const iam: GlossaryEntry = {
  term: 'IAM',
  expansion: 'Identity And Access Management',
  meaning: 'AWS 리소스의 접근 권한을 관리한다.',
  sourceConceptId: 'iam-permissions.iam',
}
const vpn: GlossaryEntry = { term: 'VPN', meaning: '인터넷 위에 암호화된 경로를 만든다.', sourceConceptId: 'hybrid-connectivity.site-to-site-vpn' }

function renderTerm(entry: GlossaryEntry = iam) {
  return render(
    <p>
      앞 문장 <GlossaryTerm entry={entry} /> 뒤 문장 <span>바깥</span>
    </p>,
  )
}

describe('GlossaryTerm', () => {
  it('처음에는 툴팁 없이 점선 밑줄 버튼만 있다', () => {
    renderTerm()

    const button = screen.getByRole('button', { name: 'IAM' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('underline', 'decoration-dotted')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('초점을 주면 툴팁이 보이고 aria-describedby가 그 id를 가리킨다', () => {
    renderTerm()

    const button = screen.getByRole('button', { name: 'IAM' })
    fireEvent.focus(button)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent('IAM = Identity And Access Management')
    expect(tooltip).toHaveTextContent('AWS 리소스의 접근 권한을 관리한다.')
    expect(button).toHaveAttribute('aria-describedby', tooltip.id)
    expect(button).toHaveAccessibleDescription(/Identity And Access Management/)
  })

  it('Escape로 닫힌다', () => {
    renderTerm()

    fireEvent.focus(screen.getByRole('button', { name: 'IAM' }))
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('누르면 열리고 바깥을 누르면 닫힌다', () => {
    renderTerm()

    fireEvent.click(screen.getByRole('button', { name: 'IAM' }))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.pointerDown(screen.getByText('바깥'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('초점이 떠나거나 스크롤하면 닫힌다', () => {
    renderTerm()
    const button = screen.getByRole('button', { name: 'IAM' })

    fireEvent.focus(button)
    fireEvent.blur(button)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    fireEvent.focus(button)
    fireEvent.scroll(window)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('풀네임이 없는 약어는 `약어 =`가 나오지 않는다', () => {
    renderTerm(vpn)

    fireEvent.focus(screen.getByRole('button', { name: 'VPN' }))

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).not.toHaveTextContent('VPN =')
    expect(tooltip).toHaveTextContent('VPN')
    expect(tooltip).toHaveTextContent('인터넷 위에 암호화된 경로를 만든다.')
  })
})
