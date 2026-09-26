import { describe, expect, it } from 'vitest'
import { hubAttachmentCount, meshConnectionCount, ringPoints } from './peering'

describe('meshConnectionCount', () => {
  it.each([[2, 1], [3, 3], [6, 15], [10, 45], [100, 4950]])('VPC %i개를 모두 1:1로 이으면 %i개다', (vpcCount, expected) => {
    expect(meshConnectionCount(vpcCount)).toBe(expected)
  })
})

describe('hubAttachmentCount', () => {
  it.each([2, 3, 6, 10, 100])('VPC %i개를 허브에 붙이면 VPC 수와 같다', (vpcCount) => {
    expect(hubAttachmentCount(vpcCount)).toBe(vpcCount)
  })
})

describe('ringPoints', () => {
  it('점 수는 count이고 첫 점은 12시 방향이다', () => {
    const points = ringPoints(6, 140, 110, 72)

    expect(points).toHaveLength(6)
    expect(points[0].x).toBeCloseTo(140)
    expect(points[0].y).toBeCloseTo(110 - 72)
  })

  it('시계 방향으로 돌고 모든 점이 중심에서 반지름만큼 떨어져 있다', () => {
    const points = ringPoints(4, 0, 0, 10)

    expect(points[1].x).toBeCloseTo(10)
    expect(points[1].y).toBeCloseTo(0)
    expect(points[2].y).toBeCloseTo(10)
    for (const { x, y } of points) expect(Math.hypot(x, y)).toBeCloseTo(10)
  })
})
