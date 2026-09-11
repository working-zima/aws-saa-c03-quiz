import type { Progress } from '../types/progress'

export function emptyProgress(): Progress {
  return {
    version: 3,
    read: {},
    answers: {},
    review: {},
  }
}

export function markTopicRead(progress: Progress, topicId: string): Progress {
  return {
    ...progress,
    read: {
      ...progress.read,
      [topicId]: true,
    },
  }
}

// 채점은 복습 목록을 건드리지 않는다. 틀렸다고 넣지도, 맞혔다고 빼지도 않는다 — 찍어서 맞힌 것과
// 익힌 것을 앱이 구분할 수 없으므로 무엇을 복습할지는 사용자가 정한다 (ADR-017·ADR-032).
export function recordAnswer(
  progress: Progress,
  questionId: string,
  correct: boolean,
): Progress {
  return {
    ...progress,
    answers: {
      ...progress.answers,
      [questionId]: correct,
    },
  }
}

export function markForReview(
  progress: Progress,
  questionId: string,
  marked: boolean,
): Progress {
  return {
    ...progress,
    review: marked
      ? { ...progress.review, [questionId]: true }
      : Object.fromEntries(
        Object.entries(progress.review).filter(([id]) => id !== questionId),
      ),
  }
}
