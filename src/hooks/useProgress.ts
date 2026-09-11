import { useCallback, useState } from 'react'
import { markForReview, markTopicRead, recordAnswer } from '../lib/progress'
import { loadProgress, saveProgress } from '../lib/storage'
import type { Progress } from '../types/progress'

export function useProgress(): { progress: Progress; markRead: (topicId: string) => void; answer: (questionId: string, correct: boolean) => void; setInReview: (questionId: string, marked: boolean) => void } {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const updateProgress = useCallback((update: (current: Progress) => Progress) => {
    setProgress((current) => {
      const next = update(current)
      saveProgress(next)
      return next
    })
  }, [])
  const markRead = useCallback((topicId: string) => updateProgress((current) => markTopicRead(current, topicId)), [updateProgress])
  const answer = useCallback((questionId: string, correct: boolean) => updateProgress((current) => recordAnswer(current, questionId, correct)), [updateProgress])
  const setInReview = useCallback((questionId: string, marked: boolean) => updateProgress((current) => markForReview(current, questionId, marked)), [updateProgress])
  return { progress, markRead, answer, setInReview }
}
