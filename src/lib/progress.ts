import type { Progress } from '../types/progress'

export function emptyProgress(): Progress {
  return {
    version: 1,
    read: {},
    answers: {},
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
