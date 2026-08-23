import type { Question } from '../types/content'

export function isCorrect(question: Question, choiceIndex: number): boolean {
  return question.answerIndex === choiceIndex
}
