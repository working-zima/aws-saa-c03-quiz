export const RANDOM_QUIZ_COUNTS = [10, 20, 30, 50, 100] as const

export const RANDOM_QUIZ_ALL = 'all'

export type RandomQuizCount = (typeof RANDOM_QUIZ_COUNTS)[number]

// 전체는 숫자 허용값으로 두지 않는다. 문제 은행이 늘면 그 숫자가 곧 낡기 때문에
// 세그먼트를 따로 두고 문항 수는 은행 크기에서 읽는다 (ADR-018).
export function parseQuizCount(
  value: string | undefined,
  total: number,
): number | null {
  if (value === RANDOM_QUIZ_ALL) {
    return total
  }

  return RANDOM_QUIZ_COUNTS.find((count) => String(count) === value) ?? null
}
