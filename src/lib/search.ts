import type { Concept, Topic } from '../types/content'

export type SearchHit =
  | { kind: 'topic'; topic: Topic }
  | { kind: 'concept'; topic: Topic; concept: Concept }

// 필드 우선순위. 낮을수록 앞에 온다 (ADR-013).
const RANK_CONCEPT_NAME = 0
const RANK_TOPIC_TITLE = 1
const RANK_CONCEPT_SUMMARY = 2
const RANK_CONCEPT_BODY = 3

// 요약·본문에 든 `**강조**` 마커를 지운다. 검색 비교와 화면 출력이 같은 규칙을 쓴다.
export function stripEmphasis(text: string): string {
  return text.replace(/\*\*/g, '')
}

function normalize(text: string): string {
  return stripEmphasis(text).toLowerCase()
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

function hasAllTokens(text: string, tokens: string[]): boolean {
  return tokens.every((token) => text.includes(token))
}

function hasAnyToken(text: string, tokens: string[]): boolean {
  return tokens.some((token) => text.includes(token))
}

function conceptRank(concept: Concept, tokens: string[]): number {
  if (hasAnyToken(normalize(concept.name), tokens)) {
    return RANK_CONCEPT_NAME
  }
  if (hasAnyToken(normalize(concept.summary), tokens)) {
    return RANK_CONCEPT_SUMMARY
  }
  return RANK_CONCEPT_BODY
}

export function searchContent(topics: Topic[], query: string): SearchHit[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) {
    return []
  }

  const ranked: { rank: number; hit: SearchHit }[] = []

  for (const topic of topics) {
    if (hasAllTokens(normalize(topic.title), tokens)) {
      ranked.push({ rank: RANK_TOPIC_TITLE, hit: { kind: 'topic', topic } })
    }

    for (const concept of topic.concepts) {
      // 주제 제목은 여기에 넣지 않는다. 넣으면 주제 제목에 걸린 질의가
      // 그 주제의 개념 전부를 끌고 온다.
      const text = normalize(
        [concept.name, concept.summary, ...concept.paragraphs].join('\n'),
      )
      if (hasAllTokens(text, tokens)) {
        ranked.push({
          rank: conceptRank(concept, tokens),
          hit: { kind: 'concept', topic, concept },
        })
      }
    }
  }

  // sort는 안정 정렬이므로 순위가 같으면 topics·concepts 배열 순서가 그대로 남는다.
  return ranked.sort((a, b) => a.rank - b.rank).map((entry) => entry.hit)
}
