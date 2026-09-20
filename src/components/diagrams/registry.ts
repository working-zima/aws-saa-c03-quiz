import type { ComponentType } from 'react'
import { VpcPathsDiagram } from './VpcPathsDiagram'

// 개념 id → 그 개념 본문 바로 뒤에 붙는 도식.
// step 1~5가 여기에 한 줄씩 더한다.
export const diagramsByConceptId: Record<string, ComponentType> = { 'vpc-networking.comparison': VpcPathsDiagram }
