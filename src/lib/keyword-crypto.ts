import type { EncryptedKeywords, Keyword } from '../types/keywords'

// 키워드 퀴즈 암호문을 브라우저에서 푼다. 규약은 ADR-040이다.
// Web Crypto만 쓴다 — 브라우저와 테스트(Node 18) 모두 globalThis.crypto.subtle을 갖는다.

export class WrongPassphraseError extends Error {}

function fromBase64(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function decryptKeywords(payload: EncryptedKeywords, passphrase: string): Promise<Keyword[]> {
  if (payload.version !== 1 || payload.kdf !== 'PBKDF2-SHA256' || payload.cipher !== 'AES-GCM-256') {
    throw new Error('지원하지 않는 암호문 형식이다')
  }
  const { subtle } = globalThis.crypto
  const base = await subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(payload.salt), iterations: payload.iterations },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  let plain: ArrayBuffer
  try {
    plain = await subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(payload.iv) }, key, fromBase64(payload.ciphertext))
  } catch (error) {
    // AES-GCM 인증 실패. 틀린 암호가 이 경우다.
    if (error instanceof Error && error.name === 'OperationError') throw new WrongPassphraseError('암호가 틀렸다')
    throw error
  }
  return JSON.parse(new TextDecoder().decode(plain)) as Keyword[]
}
