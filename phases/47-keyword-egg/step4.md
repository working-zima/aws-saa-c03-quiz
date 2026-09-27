# Step 4: keyword-page

## 배경

키워드 퀴즈(ADR-040)의 화면을 완성한다. 암호를 입력하면 복호화하고, 모드와 문항 수를 고른 뒤 step 3의 컴포넌트로 푼다.
`#/keywords` 라우트를 등록하고, 헤더 로고를 연속으로 탭하면 들어가게 한다. **앱의 다른 곳에는 이 화면으로 가는 링크를 두지 않는다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-040**
- `docs/ARCHITECTURE.md`의 「라우트」, 「헤더는 모든 화면에서 같다」(로고 연속 탭 문단 포함), 「상태 관리」, 「테스트 경계」
- `docs/UI_GUIDE.md`의 「버튼」, 「랜덤 문제 시작 화면」, 「검색 입력」(입력 필드 스타일), 「상단 고정 헤더」, 「터치 영역」
- `src/types/keywords.ts`, `src/lib/keyword-crypto.ts`, `src/lib/keyword-quiz.ts`,
  `src/components/KeywordQuizRunner.tsx`, `src/components/KeywordFlashcards.tsx`: step 1~3 산출물
- `src/data/keywords.enc.json`: step 1 산출물(암호문)
- `src/App.tsx`, `src/App.test.tsx`, `src/components/Layout.tsx`, `src/components/Layout.test.tsx`
- `src/pages/RandomStartPage.tsx`: 선택 버튼 스타일 선례

## 작업

### 1. `src/pages/KeywordQuizPage.tsx`

```tsx
interface KeywordQuizPageProps {
  encrypted?: EncryptedKeywords   // 기본값: src/data/keywords.enc.json
  rng?: () => number              // 기본값: Math.random
}
export function KeywordQuizPage(props: KeywordQuizPageProps): JSX.Element
```

화면은 세 단계다. 단계와 데이터는 모두 이 컴포넌트의 `useState`에만 둔다.

1. **잠김**: 제목 `키워드 퀴즈`를 두고, 그 아래에 `암호` 라벨이 붙은 `type="password"` 입력과 "열기" 버튼을 둔다(form submit, Enter로도 연다).
   - 여는 동안에는 버튼을 비활성화하고 "여는 중"으로 표시한다. PBKDF2가 폰에서 1초 가까이 걸릴 수 있다.
   - `WrongPassphraseError`가 나면 `암호가 맞지 않습니다.`를 보여 주고, 입력을 비우고, 입력에 포커스를 둔다.
   - `globalThis.crypto?.subtle`이 없으면 `이 주소에서는 열 수 없습니다. HTTPS나 localhost에서 열어 주세요.`를 보여 준다(ADR-040 「트레이드오프」).
   - 그 밖의 에러가 나면 `열 수 없습니다.`를 보여 준다.
   - 성공하면 입력한 암호를 state에서 지운다. 키워드 배열만 남긴다.
2. **선택**: `키워드 N개`를 표시하고, 모드 셋(`요약 보고 키워드 고르기` · `키워드 보고 요약 고르기` · `플래시카드`)과
   문항 수 셋(`10` · `20` · `전체`)을 고른 뒤 "시작"을 누른다. 모드와 문항 수의 기본 선택은 첫 번째 것이다.
   선택 상태는 `aria-pressed`나 라디오로 드러낸다.
3. **풀기**: `buildKeywordQuestions`나 `buildFlashcards`로 한 판을 만들어 step 3의 컴포넌트에 넘긴다.
   `onRestart`는 같은 모드·문항 수로 새 판을 만들고, `onExit`는 선택 단계로 돌아간다. 잠김 단계로는 돌아가지 않는다.

- 화면을 벗어나면(언마운트) 키워드가 사라지고, 다시 들어오면 잠김 단계부터 시작한다. 이것이 의도한 동작이다(사용자 결정: 매번 입력).
- 이 화면에는 `BackButton`을 두지 않는다. 헤더 로고로 나간다.

### 2. `src/App.tsx`

`Layout` 안에 `<Route path="keywords" element={<KeywordQuizPage />} />`를 더한다. `*` 라우트보다 앞에 둔다.

### 3. `src/components/Layout.tsx`: 로고 연속 탭

- 로고 `NavLink`에 `onClick`을 단다. 탭 시각 배열은 `useRef`에 두고, `registerLogoTap(ref.current, Date.now())`로 판정한다.
- `unlocked`이면 `event.preventDefault()`를 하고 `navigate('/keywords')`로 간다. 아니면 지금처럼 `/`로 간다. 기본 동작을 막지 않는다.
- 헤더의 모양·링크·클래스는 바꾸지 않는다. **어느 화면인지 판별하는 분기를 넣지 마라**(ARCHITECTURE 「헤더는 모든 화면에서 같다」).

### 4. 테스트 (먼저 쓴다)

**`src/pages/KeywordQuizPage.test.tsx`**: `vi.mock('../lib/keyword-crypto', …)`로 `decryptKeywords`를 mock한다. jsdom에는 `crypto.subtle`이 없어서
실제 복호화를 돌릴 수 없다. `WrongPassphraseError`는 실제 클래스를 그대로 내보낸다(`vi.importActual`).
`crypto.subtle` 존재 검사는 `vi.stubGlobal`로 제어한다. 가짜 키워드 픽스처를 쓴다.

- 처음에는 암호 입력만 보이고 키워드 내용은 보이지 않는다.
- 틀린 암호: `암호가 맞지 않습니다.`가 보이고 입력이 비워진다.
- `crypto.subtle`이 없으면 안내 문구가 보이고 `decryptKeywords`를 부르지 않는다.
- 맞는 암호: 선택 단계로 간다. `키워드 N개`가 보이고 암호 입력은 사라진다.
- 세 모드 각각으로 시작하면 해당 컴포넌트가 나온다. 문항 수 `10`이 적용되는지도 본다(픽스처를 10개보다 많이 둔다).
- "처음으로"를 누르면 선택 단계로 돌아가고, 암호를 다시 묻지 않는다.
- 이 화면이 `localStorage`에 아무것도 쓰지 않는다(`Storage.prototype.setItem` spy가 한 번도 불리지 않는다).

**`src/components/Layout.test.tsx`**에 테스트를 더한다. 기존 테스트는 고치지 마라.
- `vi.useFakeTimers()`와 `vi.setSystemTime`으로 시각을 제어한다(`user-event`는 `advanceTimers: vi.advanceTimersByTime` 옵션으로 만든다).
- 로고를 짧은 간격으로 다섯 번 누르면 `/keywords`에 도착한다. 네 번이면 `/`에 머문다. 간격이 1.5초 이상이면 다섯 번을 눌러도 `/`에 머문다.

**`src/App.test.tsx`**에 테스트를 더한다: `#/keywords`로 들어가면 암호 입력 화면이 나온다. 헤더와 주요 내비게이션에 `/keywords`로 가는 링크가 없다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
! grep -rl "EGG_PASSPHRASE" dist src
! grep -rn "keywords" src/pages/SearchPage.tsx src/pages/TopicListPage.tsx src/lib/search.ts
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `KeywordQuizPage`가 `localStorage`·`useProgress`를 참조하지 않는다.
   - `Layout.tsx`의 diff가 로고 `onClick`과 거기에 필요한 import·ref·navigate뿐이다.
   - `dist/`는 커밋 대상이 아니다(`.gitignore`).
3. `phases/47-keyword-egg/index.json`의 step 4를 갱신한다.
   - 성공 → `"summary"`에 라우트, 화면 단계, 에러 문구 셋, 로고 탭 연결 방식, 더한 테스트를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **이 화면으로 가는 링크를 헤더·주제 목록·검색·랜덤·복습 어디에도 두지 마라.** 이유: 숨은 화면이다(ADR-040).
- **키워드·암호·결과를 localStorage·sessionStorage·URL·쿼리 문자열에 넣지 마라.** 이유: 기록 없음, 매번 입력이 사용자 결정이다(ADR-040).
- **암호문 파일을 `fetch`로 불러오지 마라.** 이유: 학습 데이터는 빌드 타임 정적 JSON이다(CLAUDE.md). `import`한다.
- **`BrowserRouter`로 바꾸지 마라.** 이유: GitHub Pages에는 SPA fallback이 없다(CLAUDE.md).
- **`src/data/keywords.enc.json`과 `docs/source/keywords-raw.json`을 고치거나 다시 만들지 마라.** 이유: step 1의 산출물이다.
  다시 만들면 암호를 다시 읽게 된다.
- 기존 테스트를 깨뜨리지 마라.
