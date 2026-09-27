export interface Keyword {
  id: string
  term: string
  summary: string
  section: string
  page: number
  parentId?: string // 묶음 제목·[기능]·[유형] 아래의 하위 항목이면 그 부모 키워드
  features?: KeywordFeature[] // [특징] 문장. 키워드 이름은 ○○로 가려져 있다.
}

// [특징] 문장 하나. 부모 키워드와 다른 단원에 나올 수 있어서(Lambda) 단원을 따로 든다.
export interface KeywordFeature {
  text: string
  section: string
  page: number
}

// 키워드 퀴즈의 암호문 파일 형식. 규약은 ADR-040이다.
export interface EncryptedKeywords {
  version: 1
  kdf: 'PBKDF2-SHA256'
  iterations: number
  cipher: 'AES-GCM-256'
  salt: string // base64, 16바이트
  iv: string // base64, 12바이트
  ciphertext: string // base64. AES-GCM 인증 태그를 포함한다(Web Crypto의 기본 출력 그대로).
}

// summary-to-term은 [특징] 문장 문항도 섞어 낸다(buildTermQuestions).
export type KeywordQuizMode = 'summary-to-term' | 'term-to-summary' | 'flashcard'
export type KeywordChoiceMode = Exclude<KeywordQuizMode, 'flashcard'>

export interface KeywordQuestion {
  keywordId: string
  prompt: string
  choices: [string, string, string, string]
  choiceKeywordIds: [string, string, string, string] // 보기마다 그 보기가 가리키는 키워드. 고른 오답을 풀어 보여 주는 데 쓴다.
  answerIndex: 0 | 1 | 2 | 3
}
