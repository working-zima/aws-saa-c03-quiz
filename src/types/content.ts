export type Importance = 3 | 2 | 0 // ★★★ = 3, ★★☆ = 2, 별점 없음(기초) = 0

export interface Topic {
  id: string
  title: string
  importance: Importance
  sourcePages: [number, number]
  concepts: Concept[]
}

export interface Concept {
  id: string
  parentId?: string // 딸린 개념만. 같은 주제 안 머리 개념의 id (ADR-041)
  name: string
  summary: string
  paragraphs: string[]
}

// 머리 개념 하나와 그 바로 뒤에 이어지는 딸린 개념들. 딸린 개념이 없으면 children은 빈 배열이다.
export interface ConceptGroup {
  concept: Concept
  children: Concept[]
}

export interface Question {
  id: string
  topicId: string
  conceptId: string
  prompt: string
  choices: [string, string, string, string]
  answerIndex: 0 | 1 | 2 | 3
  explanation: string
}
