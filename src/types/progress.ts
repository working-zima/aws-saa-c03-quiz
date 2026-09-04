export interface Progress {
  version: 2
  read: Record<string, boolean>
  answers: Record<string, boolean>
  // 오답노트. 한 번 틀리면 들어오고, 사용자가 지울 때만 빠진다 (ADR-017).
  wrong: Record<string, true>
}
