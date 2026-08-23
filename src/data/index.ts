import questionsData from './questions.json'
import topicsData from './topics.json'
import type { Question, Topic } from '../types/content'

export const topics: Topic[] = topicsData as Topic[]
export const questions: Question[] = questionsData as Question[]
