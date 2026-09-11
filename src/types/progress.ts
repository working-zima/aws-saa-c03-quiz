export interface Progress {
  version: 3
  read: Record<string, boolean>
  answers: Record<string, boolean>
  // 복습 목록. 사용자가 문제를 푼 뒤 직접 넣고 뺀다. 채점 결과로는 들어오지도 빠지지도 않는다 (ADR-032).
  review: Record<string, true>
}
