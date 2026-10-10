import { describe, expect, it } from 'vitest'
import { clampTooltipLeft, markFirstOccurrences } from './glossary'

const joined = (segments: { text: string }[]) => segments.map(({ text }) => text).join('')

describe('markFirstOccurrences', () => {
  it('같은 약어가 두 문단에 나오면 첫 문단의 첫 자리만 표시한다', () => {
    const texts = ['EC2로 운영하고 EC2가 병목이 된다', '뒤의 EC2가 타임아웃을 낸다']
    const [first, second] = markFirstOccurrences(texts, ['EC2'])

    expect(first).toEqual([{ text: 'EC2', term: 'EC2' }, { text: '로 운영하고 EC2가 병목이 된다' }])
    expect(second).toEqual([{ text: '뒤의 EC2가 타임아웃을 낸다' }])
  })

  it('NACL 안의 ACL은 표시하지 않고 단어로 선 ACL만 표시한다', () => {
    const [segments] = markFirstOccurrences(['NACL과 달리 버킷 정책이나 ACL로 한다'], ['ACL'])

    expect(segments.filter(({ term }) => term)).toEqual([{ text: 'ACL', term: 'ACL' }])
    expect(segments[0]).toEqual({ text: 'NACL과 달리 버킷 정책이나 ' })
  })

  it('대소문자를 구분한다', () => {
    expect(markFirstOccurrences(['iam과 Iam'], ['IAM'])).toEqual([[{ text: 'iam과 Iam' }]])
  })

  it('**강조** 안의 약어는 표시하지 않고 강조 밖의 첫 자리를 표시한다', () => {
    const [segments] = markFirstOccurrences(['**IAM 역할**을 쓰면 IAM 사용자가 필요 없다'], ['IAM'])

    expect(segments).toEqual([
      { text: '**IAM 역할**을 쓰면 ' },
      { text: 'IAM', term: 'IAM' },
      { text: ' 사용자가 필요 없다' },
    ])
  })

  it('백틱 안의 약어는 표시하지 않고 백틱 밖의 첫 자리를 표시한다', () => {
    expect(markFirstOccurrences(['`ACM Certificate` 이벤트는 ACM이 낸다'], ['ACM'])).toEqual([
      [{ text: '`ACM Certificate` 이벤트는 ' }, { text: 'ACM', term: 'ACM' }, { text: '이 낸다' }],
    ])
  })

  it('백틱 조각이 있어도 조각들을 이으면 원문과 같다', () => {
    const texts = ['`IAM` 정책은 IAM이 평가한다', '**VPN**과 `EC2:RunInstances`, EC2와 `ACL`']
    const result = markFirstOccurrences(texts, ['IAM', 'EC2', 'ACL', 'VPN'])

    expect(result.map(joined)).toEqual(texts)
    expect(result.flat().filter(({ term }) => term).map(({ term }) => term)).toEqual(['IAM', 'EC2'])
  })

  it('약어가 없는 텍스트는 조각 하나다', () => {
    expect(markFirstOccurrences(['약어가 없는 문장'], ['IAM', 'EC2'])).toEqual([[{ text: '약어가 없는 문장' }]])
  })

  it('조각들을 이으면 원문과 같다', () => {
    const texts = ['VPN과 IAM, EC2와 ACL', 'IAM은 다시 나오고 **VPN**도 나온다', '']
    const result = markFirstOccurrences(texts, ['IAM', 'EC2', 'ACL', 'VPN'])

    expect(result.map(joined)).toEqual(texts)
    expect(result.flat().filter(({ term }) => term).map(({ term }) => term)).toEqual(['VPN', 'IAM', 'EC2', 'ACL'])
  })
})

describe('clampTooltipLeft', () => {
  it('앵커 가운데에 맞춘다', () => {
    expect(clampTooltipLeft(160, 100, 320, 8)).toBe(110)
  })

  it('320 폭에서 왼쪽 끝 앵커는 8px 안쪽으로 붙잡는다', () => {
    expect(clampTooltipLeft(10, 200, 320, 8)).toBe(8)
  })

  it('320 폭에서 오른쪽 끝 앵커는 오른쪽 가장자리 8px 안쪽으로 붙잡는다', () => {
    expect(clampTooltipLeft(315, 200, 320, 8)).toBe(112)
  })
})
