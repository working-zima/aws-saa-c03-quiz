export interface Keyword {
  id: string
  term: string
  summary: string
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
