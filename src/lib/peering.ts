// 모든 VPC가 서로 통신해야 할 때 1:1 피어링으로 필요한 연결 수
export function meshConnectionCount(vpcCount: number): number {
  return (vpcCount * (vpcCount - 1)) / 2
}

// 같은 VPC들을 허브 하나에 한 번씩 붙일 때의 연결 수
export function hubAttachmentCount(vpcCount: number): number {
  return vpcCount
}

// 원 위에 n개를 균등하게 놓는 좌표(12시 방향에서 시작, 시계 방향)
export function ringPoints(count: number, cx: number, cy: number, r: number): Array<{ x: number; y: number }> {
  return Array.from({ length: count }, (_, index) => {
    const angle = (2 * Math.PI * index) / count
    return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) }
  })
}
