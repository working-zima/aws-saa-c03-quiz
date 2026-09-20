import type { ComponentType } from 'react'
import { EdgeToOriginDiagram } from './EdgeToOriginDiagram'
import { HybridPathsDiagram } from './HybridPathsDiagram'
import { VpcPathsDiagram } from './VpcPathsDiagram'

// 개념 id → 그 개념 본문 바로 뒤에 붙는 도식.
// step 1~5가 여기에 한 줄씩 더한다.
export const diagramsByConceptId: Record<string, ComponentType> = {
  'vpc-networking.comparison': VpcPathsDiagram,
  'hybrid-connectivity.vpn-vs-direct-connect': HybridPathsDiagram,
  'cloudfront-global-accelerator.global-accelerator-vs-dns-failover': EdgeToOriginDiagram,
}
