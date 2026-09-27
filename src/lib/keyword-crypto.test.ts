// @vitest-environment node

// @ts-expect-error: 이 저장소에는 @types/node가 없다. 테스트에서 Web Crypto를 채우는 데만 쓴다.
import { webcrypto } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import type { EncryptedKeywords } from '../types/keywords'
import { WrongPassphraseError, decryptKeywords } from './keyword-crypto'

// Node 18은 globalThis.crypto를 기본으로 두지 않는다(19부터). 브라우저에는 있으므로 테스트에서만 채운다.
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })

const PASSPHRASE = 'test-passphrase'
const ITERATIONS = 1000

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

async function makePayload(plain: unknown, passphrase: string): Promise<EncryptedKeywords> {
  const { subtle } = globalThis.crypto
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const base = await subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )
  const data = new TextEncoder().encode(JSON.stringify(plain))
  const ciphertext = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, key, data))
  return {
    version: 1,
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    cipher: 'AES-GCM-256',
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  }
}

const keywords = [
  { id: 'k1', term: '가상 용어', summary: '지어낸 설명이다', section: '가상 단원', page: 1 },
  { id: 'k2', term: 'Fake Term', summary: 'made up', section: '가상 단원', page: 2 },
]

describe('decryptKeywords', () => {
  it('규약대로 만든 암호문을 풀면 원래 키워드가 나온다', async () => {
    const payload = await makePayload(keywords, PASSPHRASE)
    await expect(decryptKeywords(payload, PASSPHRASE)).resolves.toEqual(keywords)
  })

  it('틀린 암호면 WrongPassphraseError를 던진다', async () => {
    const payload = await makePayload(keywords, PASSPHRASE)
    await expect(decryptKeywords(payload, 'wrong')).rejects.toBeInstanceOf(WrongPassphraseError)
  })

  it.each([
    ['version', { version: 2 }],
    ['kdf', { kdf: 'scrypt' }],
    ['cipher', { cipher: 'AES-CBC-256' }],
  ])('%s가 규약과 다르면 WrongPassphraseError가 아닌 에러를 던진다', async (_field, patch) => {
    const payload = { ...(await makePayload(keywords, PASSPHRASE)), ...patch } as unknown as EncryptedKeywords
    const error = await decryptKeywords(payload, PASSPHRASE).then(
      () => null,
      (e: unknown) => e,
    )
    expect(error).toBeInstanceOf(Error)
    expect(error).not.toBeInstanceOf(WrongPassphraseError)
  })
})
