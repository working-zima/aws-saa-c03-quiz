import type { Topic } from '../types/content'

export interface AdjacentTopics {
  prev: Topic | null
  next: Topic | null
}

export function adjacentTopics(
  topics: Topic[],
  topicId: string | undefined,
): AdjacentTopics {
  const index = topics.findIndex((topic) => topic.id === topicId)
  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? topics[index - 1] : null,
    next: index < topics.length - 1 ? topics[index + 1] : null,
  }
}
