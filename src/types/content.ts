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
  name: string
  summary: string
  paragraphs: string[]
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
