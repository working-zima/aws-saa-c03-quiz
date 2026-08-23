import type { Progress } from '../types/progress'
import { emptyProgress } from './progress'

const PROGRESS_KEY = 'aws-quiz.progress'

export function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (stored === null) {
      return emptyProgress()
    }

    const parsed: unknown = JSON.parse(stored)
    if (
      typeof parsed !== 'object'
      || parsed === null
      || !('version' in parsed)
      || parsed.version !== 1
    ) {
      return emptyProgress()
    }

    return parsed as Progress
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // 저장소가 차단되어도 메모리의 앱 상태는 계속 사용할 수 있다.
  }
}
