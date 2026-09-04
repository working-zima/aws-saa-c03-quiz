import type { Question, Topic } from '../types/content'
import type { Progress } from '../types/progress'

export interface TopicStat {
  topicId: string
  read: boolean
  total: number
  answered: number
  correct: number
}

export function topicStats(
  topics: Topic[],
  questions: Question[],
  progress: Progress,
): TopicStat[] {
  return topics.map((topic) => {
    const topicQuestions = questions.filter((question) => question.topicId === topic.id)
    const answeredQuestions = topicQuestions.filter(
      (question) => question.id in progress.answers,
    )

    return {
      topicId: topic.id,
      read: progress.read[topic.id] === true,
      total: topicQuestions.length,
      answered: answeredQuestions.length,
      correct: answeredQuestions.filter(
        (question) => progress.answers[question.id] === true,
      ).length,
    }
  })
}

export function overallPercent(stats: TopicStat[]): number {
  const total = stats.reduce((sum, stat) => sum + stat.total, 0)
  if (total === 0) {
    return 0
  }

  const answered = stats.reduce((sum, stat) => sum + stat.answered, 0)
  return Math.round((answered / total) * 100)
}

// 마지막 채점 결과가 아니라 오답노트를 본다. 다시 맞혀도 사용자가 지우기 전에는 남는다 (ADR-017).
export function wrongQuestions(questions: Question[], progress: Progress): Question[] {
  return questions.filter((question) => question.id in progress.wrong)
}
