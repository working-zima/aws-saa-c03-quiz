import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { boxesOutsideViewBox, estimateTextWidth } from '../../lib/svg-bounds'
import { ConceptList } from '../ConceptList'
import { S3ClassMapDiagram } from './S3ClassMapDiagram'

const labels = {
  standard: 'S3 Standard',
  tiering: 'S3 Intelligent-Tiering',
  'standard-ia': 'S3 Standard-IA',
  'one-zone-ia': 'S3 One Zone-IA',
  'glacier-instant': 'S3 Glacier Instant Retrieval',
  'glacier-flexible': 'S3 Glacier Flexible Retrieval',
  'glacier-deep': 'S3 Glacier Deep Archive',
  express: 'S3 Express One Zone',
}

function diagram() {
  return screen.getByRole('img', { name: 'S3 스토리지 클래스 분류' })
}

function readBox(rect: Element) {
  return {
    id: rect.parentElement?.getAttribute('data-node') ?? rect.getAttribute('data-group') ?? '',
    x: Number(rect.getAttribute('x')),
    y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')),
    height: Number(rect.getAttribute('height')),
  }
}

function nodeBox(id: string) {
  return readBox(diagram().querySelector(`[data-node="${id}"] rect`)!)
}

function groupBox(id: string) {
  return readBox(diagram().querySelector(`[data-group="${id}"]`)!)
}

function inside(id: string, group: string) {
  const box = groupBox(group)
  return boxesOutsideViewBox([nodeBox(id)], [box.x, box.y, box.width, box.height]).length === 0
}

describe('S3ClassMapDiagram', () => {
  it('정적 도식이라 시나리오 버튼을 하나도 그리지 않는다', () => {
    render(<S3ClassMapDiagram />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.queryByRole('group', { name: '통신 시나리오' })).toBeNull()
    expect(diagram().querySelectorAll('[data-path]')).toHaveLength(0)
  })

  it('클래스 여덟 개가 모두 제 이름으로 그려진다', () => {
    render(<S3ClassMapDiagram />)

    const nodes = diagram().querySelectorAll('[data-node]')
    expect(nodes).toHaveLength(8)
    expect(Array.from(nodes, (node) => node.getAttribute('data-node')).sort()).toEqual(Object.keys(labels).sort())
    for (const [id, label] of Object.entries(labels)) {
      expect(diagram().querySelector(`[data-node="${id}"] text`), id).toHaveTextContent(label)
    }
  })

  it('S3 Express One Zone은 즉시 조회에도 대기 조회에도 속하지 않는다', () => {
    render(<S3ClassMapDiagram />)

    expect(inside('express', 'immediate')).toBe(false)
    expect(inside('express', 'waiting')).toBe(false)
    expect(inside('express', 'outside')).toBe(true)
    const express = nodeBox('express')
    const immediate = groupBox('immediate')
    const waiting = groupBox('waiting')
    expect(express.y).toBeGreaterThanOrEqual(immediate.y + immediate.height)
    expect(express.y).toBeGreaterThanOrEqual(waiting.y + waiting.height)
  })

  it('기다려야 하는 두 클래스는 대기 조회의 장기 보관 칸 안에 있다', () => {
    render(<S3ClassMapDiagram />)

    for (const id of ['glacier-flexible', 'glacier-deep']) {
      expect(inside(id, 'waiting'), id).toBe(true)
      expect(inside(id, 'longterm-waiting'), id).toBe(true)
    }
    for (const id of ['standard', 'tiering', 'standard-ia', 'one-zone-ia', 'glacier-instant', 'express']) {
      expect(inside(id, 'waiting'), id).toBe(false)
    }
  })

  it('즉시 조회에서는 Glacier Instant Retrieval만 장기 보관 칸에 든다', () => {
    render(<S3ClassMapDiagram />)

    for (const id of ['standard', 'tiering', 'standard-ia', 'one-zone-ia', 'glacier-instant']) {
      expect(inside(id, 'immediate'), id).toBe(true)
    }
    expect(inside('glacier-instant', 'longterm-immediate')).toBe(true)
    for (const id of ['standard', 'tiering', 'standard-ia', 'one-zone-ia']) {
      expect(inside(id, 'longterm-immediate'), id).toBe(false)
    }
  })

  it('대기 조회의 장기 보관 바깥 칸은 글자 없이 비어 있다', () => {
    render(<S3ClassMapDiagram />)
    const waiting = groupBox('waiting')
    const longterm = groupBox('longterm-waiting')

    expect(longterm.y - waiting.y).toBeGreaterThanOrEqual(40)
    for (const node of diagram().querySelectorAll('[data-node]')) {
      const box = nodeBox(node.getAttribute('data-node')!)
      const inGap = box.y >= waiting.y && box.y + box.height <= longterm.y
      expect(inGap, node.getAttribute('data-node')!).toBe(false)
    }
    const gapText = Array.from(diagram().querySelectorAll('text')).filter((text) => {
      const y = Number(text.getAttribute('y'))
      return y > waiting.y + 20 && y < longterm.y
    })
    expect(gapText).toHaveLength(0)
  })

  it('본문이 말하는 곁말만 붙이고 Glacier Instant Retrieval에는 붙이지 않는다', () => {
    render(<S3ClassMapDiagram />)
    const noteOf = (id: string) => diagram().querySelector(`[data-note="${id}"]`)

    expect(noteOf('standard')).toHaveTextContent('기본값 · 접근이 잦은 데이터')
    expect(noteOf('tiering')).toHaveTextContent('접근 시점을 예측하기 어려울 때 · 검색 요금 없음')
    expect(noteOf('standard-ia')).toHaveTextContent('검색 요금 있음')
    expect(noteOf('one-zone-ia')).toHaveTextContent('단일 AZ · 검색 요금 있음')
    expect(noteOf('glacier-flexible')).toHaveTextContent('표준 검색 3~5시간')
    expect(noteOf('glacier-deep')).toHaveTextContent('최대 12시간')
    expect(noteOf('express')).toHaveTextContent('1밀리초 미만 · 단일 AZ')
    expect(noteOf('glacier-instant')).toBeNull()
    for (const note of diagram().querySelectorAll('[data-note]')) {
      expect(note).toHaveAttribute('font-size', '9')
      expect(note.getAttribute('class')).toContain('fill-muted')
    }
  })

  it('장기 보관 칸 두 개가 법·감사·규정 준수를 라벨에 담는다', () => {
    render(<S3ClassMapDiagram />)
    const labelOf = (group: string) => diagram().querySelector(`[data-group-label="${group}"]`)

    for (const group of ['longterm-immediate', 'longterm-waiting']) {
      expect(labelOf(group), group).toHaveTextContent('장기 보관 목적')
      expect(labelOf(group)!.textContent, group).toMatch(/법.*감사.*규정 준수/)
    }
    expect(labelOf('immediate')).toHaveTextContent('즉시 조회')
    expect(labelOf('waiting')).toHaveTextContent('대기 조회')
    expect(labelOf('outside')).toHaveTextContent('두 기준 밖')
  })

  it('캡션이 두 기준과 기준 밖 클래스를 함께 말한다', () => {
    const { container } = render(<S3ClassMapDiagram />)
    const caption = container.querySelector('figcaption')!

    expect(caption).toHaveTextContent(/기다/)
    expect(caption.textContent).toMatch(/법.*감사.*규정/)
    expect(caption).toHaveTextContent('S3 Express One Zone')
    expect(caption.textContent!.length).toBeGreaterThan(40)
  })

  it('비용은 축이 아니라 본문에 있는 세 관계로만 적는다', () => {
    const { container } = render(<S3ClassMapDiagram />)
    const costLine = container.querySelector('[data-cost-order]')!

    expect(costLine.closest('svg')).toBeNull()
    expect(costLine).toHaveTextContent('S3 Standard-IA')
    expect(costLine).toHaveTextContent('S3 Glacier Flexible Retrieval')
    expect(costLine).toHaveTextContent('S3 Glacier Deep Archive')
    for (const absent of ['One Zone-IA', 'Intelligent-Tiering', 'Instant Retrieval', 'Express One Zone']) {
      expect(costLine.textContent, absent).not.toContain(absent)
    }
  })

  it('클래스 상자는 모두 AWS 관리 색이고 기준 밖 칸만 점선이다', () => {
    render(<S3ClassMapDiagram />)
    const groupRect = (id: string) => diagram().querySelector(`[data-group="${id}"]`)

    for (const id of Object.keys(labels)) {
      expect(diagram().querySelector(`[data-node="${id}"] rect`)!.getAttribute('class'), id).toContain('stroke-diagram-managed')
    }
    for (const group of ['immediate', 'waiting', 'longterm-immediate', 'longterm-waiting']) {
      expect(groupRect(group), group).not.toHaveAttribute('stroke-dasharray')
    }
    expect(groupRect('outside')).toHaveAttribute('stroke-dasharray')
    expect(diagram().querySelector('[data-group]')!.parentElement!.getAttribute('class')).toContain('stroke-disabled')
  })

  it('모든 rect가 280폭 viewBox 경계 안에 있다', () => {
    render(<S3ClassMapDiagram />)
    const viewBox = diagram().getAttribute('viewBox')!.split(' ').map(Number)
    const boxes = Array.from(diagram().querySelectorAll('rect'), readBox)

    expect(boxes.length).toBeGreaterThan(10)
    expect(boxesOutsideViewBox(boxes, [0, 0, 280, viewBox[3]])).toEqual([])
  })

  it('축약하지 않은 여덟 라벨이 글자 크기 10과 좌우 여백 12로 노드 안에 들어간다', () => {
    render(<S3ClassMapDiagram />)

    for (const [id, label] of Object.entries(labels)) {
      const text = diagram().querySelector(`[data-node="${id}"] text`)!
      expect(text).toHaveAttribute('font-size', '10')
      expect(estimateTextWidth(label, 10) + 12, label).toBeLessThanOrEqual(nodeBox(id).width)
    }
  })

  it('viewBox 폭은 280이고 SVG 래퍼는 좌측 정렬에 최대 380px이다', () => {
    render(<S3ClassMapDiagram />)

    expect(diagram().getAttribute('viewBox')!.split(' ').map(Number)[2]).toBe(280)
    expect(diagram().parentElement).toHaveClass('w-full', 'max-w-[380px]', '-mx-4', 'sm:mx-0', 'max-sm:w-[calc(100%+2rem)]')
    expect(diagram().parentElement).not.toHaveClass('mx-auto')
  })

  it('공유 본문에서 s3-storage-class-cost-order 뒤에만 실등록 도식을 표시한다', () => {
    render(<ConceptList headingLevel={4} concepts={[
      { id: 's3-storage-classes.retrieval-time', name: '즉시 조회와 대기 조회', summary: '요약', paragraphs: ['앞 본문'] },
      { id: 's3-storage-classes.s3-storage-class-cost-order', name: '아카이브 계열의 비용 순서', summary: '요약', paragraphs: ['비용 본문'] },
    ]} />)

    const figure = screen.getByRole('figure', { name: 'S3 스토리지 클래스 분류 도식' })
    expect(figure.closest('article')).toHaveAttribute('id', 's3-storage-classes.s3-storage-class-cost-order')
    expect(figure.previousElementSibling).toHaveTextContent('비용 본문')
    expect(screen.getAllByRole('figure')).toHaveLength(1)
  })
})
