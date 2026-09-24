import type { ComponentType } from 'react'
import { EdgeToOriginDiagram } from './EdgeToOriginDiagram'
import { HybridPathsDiagram } from './HybridPathsDiagram'
import { MessagingShapesDiagram } from './MessagingShapesDiagram'
import { S3ClassMapDiagram } from './S3ClassMapDiagram'
import { SgNaclBoundaryDiagram } from './SgNaclBoundaryDiagram'
import { VpcPathsDiagram } from './VpcPathsDiagram'

// 개념 id → 그 개념 본문 바로 뒤에 붙는 도식.
// step 1~5가 여기에 한 줄씩 더한다.
export const diagramsByConceptId: Record<string, ComponentType> = {
  'vpc-networking.comparison': VpcPathsDiagram,
  'hybrid-connectivity.vpn-vs-direct-connect': HybridPathsDiagram,
  'cloudfront-global-accelerator.global-accelerator-vs-dns-failover': EdgeToOriginDiagram,
  's3-storage-classes.s3-storage-class-cost-order': S3ClassMapDiagram,
  'security-groups-nacl.security-group-stateful-vs-nacl-stateless': SgNaclBoundaryDiagram,
  'sqs-sns-eventbridge.sqs': MessagingShapesDiagram,
}
