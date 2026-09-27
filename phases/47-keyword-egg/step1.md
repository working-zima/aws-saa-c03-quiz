# Step 1: keyword-crypto

## 배경

키워드 퀴즈의 데이터는 원문 그대로라서 암호문으로만 커밋·배포한다(ADR-040). step 0이 평문 `docs/source/keywords-raw.json`
(gitignore 대상)을 만들었다. 이 step은 세 가지를 한다.

- 평문을 암호화하는 스크립트를 만든다.
- 브라우저에서 복호화하는 `lib`를 만든다.
- 스크립트를 실제로 돌려 암호문을 커밋한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-040**(암호 규약), ADR-009
- `docs/ARCHITECTURE.md`의 「상태 관리」, 「테스트 경계」
- `docs/source/keywords-raw.json`: step 0 산출물. 구조만 확인하고 **내용을 출력하거나 다른 파일에 옮겨 적지 마라.**
- `scripts/check-keywords.mjs`, `phases/47-keyword-egg/keywords-report.md`: step 0 산출물
- `src/types/content.ts`: 타입 파일의 형식 선례
- `src/lib/storage.test.ts` 등 `src/lib/*.test.ts`: `@vitest-environment node` 선례

## 작업

### 1. `src/types/keywords.ts`

```ts
export interface Keyword {
  id: string
  term: string
  summary: string
  section: string
  page: number
}

export interface EncryptedKeywords {
  version: 1
  kdf: 'PBKDF2-SHA256'
  iterations: number
  cipher: 'AES-GCM-256'
  salt: string       // base64, 16바이트
  iv: string         // base64, 12바이트
  ciphertext: string // base64. AES-GCM 인증 태그를 포함한다(Web Crypto의 기본 출력 그대로).
}
```

### 2. `src/lib/keyword-crypto.ts`

```ts
export class WrongPassphraseError extends Error {}
export async function decryptKeywords(payload: EncryptedKeywords, passphrase: string): Promise<Keyword[]>
```

- `globalThis.crypto.subtle`만 쓴다. 브라우저와 Node 18(테스트) 모두에 있다. `node:crypto` import나 외부 라이브러리를 쓰지 마라.
- 규약은 ADR-040 그대로다. passphrase를 UTF-8로 인코딩하고 PBKDF2-SHA256(`payload.iterations`회, `payload.salt`)으로 256비트 AES-GCM 키를
  유도한 뒤, `payload.iv`로 복호화한다. 결과는 UTF-8 JSON이며 `Keyword[]`로 파싱한다.
- AES-GCM 인증에 실패하면(Web Crypto가 `OperationError`를 던진다) `WrongPassphraseError`를 던진다. 틀린 암호가 이 경우다.
- `version`·`kdf`·`cipher`가 위 값이 아니면 일반 `Error`를 던진다.

### 3. `scripts/encrypt-keywords.mjs`

```js
export async function encryptKeywords(keywords, passphrase, { iterations = 600000 } = {})  // → EncryptedKeywords 모양의 객체
```

- 암호화는 `globalThis.crypto.subtle`로 한다. salt 16바이트와 iv 12바이트는 `crypto.getRandomValues`로 **매번 새로** 만든다.
- 파일로 직접 실행할 때(`node scripts/encrypt-keywords.mjs`)만 아래를 한다. import할 때는 아무것도 하지 않는다.
  1. 암호를 읽는다. `process.env.EGG_PASSPHRASE`가 있으면 그것을 쓰고, 없으면 저장소 루트의 `.env`에서 `EGG_PASSPHRASE=` 줄을 직접
     파싱한다. Node 18에는 `--env-file`이 없고, dotenv 의존성을 들이지 않는다. 값을 감싼 작은따옴표나 큰따옴표는 벗긴다.
     없거나 비어 있으면 `EGG_PASSPHRASE가 없다`만 출력하고 exit 1로 끝난다.
  2. `docs/source/keywords-raw.json`을 읽는다. 없으면 exit 1.
  3. 암호화해서 `src/data/keywords.enc.json`에 쓴다(2칸 들여쓰기, 끝에 줄바꿈).
  4. 쓴 파일을 다시 읽어 복호화하고, 원본 배열과 깊은 비교를 한다. 다르면 exit 1.
  5. `N개 암호화, 복호화 확인`만 출력한다.
- **암호 값은 어떤 경로로도 출력하지 마라.** 에러 메시지, 디버그 로그, 예외 스택도 포함한다.

### 4. 테스트 (먼저 쓰고, 실패를 확인한 뒤 구현한다)

**`scripts/encrypt-keywords.test.mjs`** (첫 줄 `// @vitest-environment node`). vitest 기본 include가 이 파일을 잡는다.
- 스크립트의 `encryptKeywords`로 암호화한 것을 `src/lib/keyword-crypto.ts`의 `decryptKeywords`로 풀면 원본과 같다.
  테스트용 암호와 가짜 키워드 2~3개를 쓰고, `iterations`는 1000으로 낮춰 속도를 낸다.
- 틀린 암호로 풀면 `WrongPassphraseError`가 난다.
- 같은 입력을 두 번 암호화하면 `salt`·`iv`·`ciphertext`가 모두 다르다.
- 기본 `iterations`가 600000이다.
- 한글이 들어간 키워드를 암호화한 결과 객체의 JSON 문자열에 한글이 없다.

**`src/lib/keyword-crypto.test.ts`** (첫 줄 `// @vitest-environment node`)
- `version`·`kdf`·`cipher`가 규약과 다르면 `WrongPassphraseError`가 **아닌** 에러가 난다.
- 암호문 픽스처는 테스트 안에서 `crypto.subtle`로 직접 만든다. 이 파일은 `scripts/`를 import하지 않는다(tsc가 `.mjs`를 보지 않는다).

**`src/data/keywords-enc.test.ts`**: 커밋된 `src/data/keywords.enc.json`을 검사하는 가드다.
- 필드가 `EncryptedKeywords`의 일곱 개이고, `version: 1`, `kdf: 'PBKDF2-SHA256'`, `cipher: 'AES-GCM-256'`, `iterations: 600000`이다.
- `salt`·`iv`·`ciphertext`가 base64이고, 디코딩하면 salt가 16바이트, iv가 12바이트다.
- **파일 전체 텍스트에 한글(`/[ᄀ-ᇿ㄰-㆏가-힣]/`)과 `○`가 없다.** 평문이 새어 들어가지 않았는지 막는 가드다.

### 5. 암호문 만들기

`node scripts/encrypt-keywords.mjs`를 실행해 `src/data/keywords.enc.json`을 만들고 커밋 대상에 둔다. 출력된 개수가
`node scripts/check-keywords.mjs`의 개수와 같아야 한다.

## Acceptance Criteria

```bash
node scripts/check-keywords.mjs | grep -q "통과"
node scripts/encrypt-keywords.mjs | grep -q "복호화 확인"
git check-ignore -q docs/source/keywords-raw.json
! git ls-files --error-unmatch docs/source/keywords-raw.json 2>/dev/null
! grep -rn "VITE_EGG" src scripts
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git status`에 새로 생긴 것이 `src/types/keywords.ts`, `src/lib/keyword-crypto.ts`, `src/lib/keyword-crypto.test.ts`,
     `src/data/keywords.enc.json`, `src/data/keywords-enc.test.ts`, `scripts/encrypt-keywords.mjs`, `scripts/encrypt-keywords.test.mjs`뿐이다.
   - `.env`와 `docs/source/keywords-raw.json`이 `git status`에 보이지 않는다.
3. `phases/47-keyword-egg/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 만든 파일과 공개 함수 시그니처, 암호화한 키워드 수를 적는다.
   - `.env`에 `EGG_PASSPHRASE`가 없어 스크립트가 exit 1이면 → `"status": "blocked"`, `"blocked_reason": ".env에 EGG_PASSPHRASE 없음"` 후 즉시 중단.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **`.env`를 `cat`·`Read`·`grep`하거나 그 내용을 출력하지 마라.** 파일이 있는지는 `test -f .env`로만 확인한다. 이유: 암호가 로그에 남는다.
  암호는 스크립트만 읽는다.
- **테스트에서 실제 `.env`나 실제 암호를 쓰지 마라.** 이유: 같다. 테스트용 암호는 테스트 안의 고정 문자열이다.
- **변수에 `VITE_` 접두사를 붙이지 마라.** 이유: Vite가 `VITE_*`를 클라이언트 번들에 평문으로 넣는다.
- **암호화 스크립트를 `npm run build`·`npm test`·`package.json` scripts에 엮지 마라.** 이유: 빌드할 때마다 암호가 필요해진다(ADR-040).
- **의존성을 추가하지 마라.** 이유: Web Crypto로 충분하다.
- **평문 키워드나 그 일부를 테스트 픽스처·주석·커밋 파일에 옮겨 적지 마라.** 이유: ADR-009. 테스트의 가짜 키워드는 지어낸 값을 쓴다.
- 기존 테스트를 깨뜨리지 마라.
