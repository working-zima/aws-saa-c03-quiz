export const RANDOM_QUIZ_COUNTS = [10, 20, 30] as const

export type RandomQuizCount = (typeof RANDOM_QUIZ_COUNTS)[number]

export function parseQuizCount(
  value: string | undefined,
): RandomQuizCount | null {
  return RANDOM_QUIZ_COUNTS.find((count) => String(count) === value) ?? null
}
