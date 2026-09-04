import type { Progress } from '../types/progress'
import { emptyProgress } from './progress'

const PROGRESS_KEY = 'aws-quiz.progress'

interface ProgressV1 {
  version: 1
  read: Record<string, boolean>
  answers: Record<string, boolean>
}

// version 1에는 오답노트가 없었다. 그때까지 틀린 문항을 씨앗으로 넣어 기록을 잇는다.
function migrateFromV1(stored: ProgressV1): Progress {
  return {
    version: 2,
    read: stored.read,
    answers: stored.answers,
    wrong: Object.fromEntries(
      Object.entries(stored.answers)
        .filter(([, correct]) => correct === false)
        .map(([questionId]) => [questionId, true]),
    ),
  }
}

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
    ) {
      return emptyProgress()
    }

    if (parsed.version === 1) {
      return migrateFromV1(parsed as ProgressV1)
    }

    if (parsed.version !== 2) {
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
