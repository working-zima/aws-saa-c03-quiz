import questionsData from './questions.json'
import topicsData from './topics.json'
import backupDisasterRecoveryVisuals from './visuals/backup-disaster-recovery.json'
import vpcNetworkingVisuals from './visuals/vpc-networking.json'
import type { Question, Topic } from '../types/content'
import type { TopicVisuals } from '../types/visuals'

export const topics: Topic[] = topicsData as Topic[]
export const questions: Question[] = questionsData as Question[]
export const visualsByTopicId: Record<string, TopicVisuals> = {
  'backup-disaster-recovery': backupDisasterRecoveryVisuals,
  'vpc-networking': vpcNetworkingVisuals,
}
