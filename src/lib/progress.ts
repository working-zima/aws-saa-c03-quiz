import type { Progress } from '../types/progress'

export function emptyProgress(): Progress {
  return {
    version: 2,
    read: {},
    answers: {},
    wrong: {},
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
    // 맞혔다고 오답노트에서 빼지 않는다. 찍어서 맞힌 것과 익힌 것을 앱이 구분할 수
    // 없으므로, 무엇을 뺄지는 사용자가 정한다 (ADR-017).
    wrong: correct ? progress.wrong : { ...progress.wrong, [questionId]: true },
  }
}

export function forgetWrong(progress: Progress, questionId: string): Progress {
  return {
    ...progress,
    wrong: Object.fromEntries(
      Object.entries(progress.wrong).filter(([id]) => id !== questionId),
    ),
  }
}
