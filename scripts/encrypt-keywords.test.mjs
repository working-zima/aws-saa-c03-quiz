// @vitest-environment node

import { webcrypto } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { encryptKeywords } from './encrypt-keywords.mjs'
import { WrongPassphraseError, decryptKeywords } from '../src/lib/keyword-crypto'

// Node 18은 globalThis.crypto를 기본으로 두지 않는다(19부터). 브라우저에는 있으므로 테스트에서만 채운다.
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })

const PASSPHRASE = 'test-passphrase'
const FAST = { iterations: 1000 }

// 지어낸 값이다. 실제 키워드를 옮겨 적지 마라(ADR-009).
const keywords = [
  { id: 'k1', term: '가상 용어', summary: '테스트용으로 지어낸 설명이다', section: '가상 단원', page: 1 },
  { id: 'k2', term: 'Fake Term', summary: 'made up for tests', section: '가상 단원', page: 2 },
  { id: 'k3', term: '또 다른 용어', summary: '○ 기호가 든 설명', section: '다른 단원', page: 3 },
]

describe('encryptKeywords', () => {
  it('암호화한 것을 decryptKeywords로 풀면 원본과 같다', async () => {
    const payload = await encryptKeywords(keywords, PASSPHRASE, FAST)
    await expect(decryptKeywords(payload, PASSPHRASE)).resolves.toEqual(keywords)
  })

  it('틀린 암호로 풀면 WrongPassphraseError가 난다', async () => {
    const payload = await encryptKeywords(keywords, PASSPHRASE, FAST)
    await expect(decryptKeywords(payload, 'wrong')).rejects.toBeInstanceOf(WrongPassphraseError)
  })

  it('같은 입력을 두 번 암호화하면 salt·iv·ciphertext가 모두 다르다', async () => {
    const a = await encryptKeywords(keywords, PASSPHRASE, FAST)
    const b = await encryptKeywords(keywords, PASSPHRASE, FAST)
    expect(a.salt).not.toBe(b.salt)
    expect(a.iv).not.toBe(b.iv)
    expect(a.ciphertext).not.toBe(b.ciphertext)
  })

  it('기본 iterations는 600000이다', async () => {
    const payload = await encryptKeywords(keywords.slice(0, 1), PASSPHRASE)
    expect(payload.iterations).toBe(600000)
  })

  it('결과 객체의 JSON에 한글이 없다', async () => {
    const payload = await encryptKeywords(keywords, PASSPHRASE, FAST)
    expect(JSON.stringify(payload)).not.toMatch(/[ᄀ-ᇿ㄰-㆏가-힣]/)
  })
})
