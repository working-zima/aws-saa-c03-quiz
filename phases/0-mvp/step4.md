# Step 4: app-shell

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` — "라우트" 절
- `/docs/ADR.md` — **ADR-007(HashRouter + base './')가 이 step의 핵심이다**
- `/docs/UI_GUIDE.md` — 색상 토큰, 레이아웃, 금지 사항 전부
- 이전 step 산출물: `src/App.tsx`, `src/lib/storage.ts`, `src/lib/progress.ts`, `src/data/index.ts`

## 작업

라우팅과 공통 레이아웃을 세운다. 각 화면의 알맹이는 step 5, 6, 8, 9에서 채운다.

### 1. `src/App.tsx` — 라우터

CRITICAL: `HashRouter`를 쓴다. `BrowserRouter`가 아니다.
이유: GitHub Pages에는 SPA fallback이 없어서 `BrowserRouter`로는 새로고침 시 404가 난다 (ADR-007).

| 경로 | 컴포넌트 |
|---|---|
| `/` | `TopicListPage` |
| `/topic/:topicId` | `ConceptReadPage` |
| `/topic/:topicId/quiz` | `QuizPage` |
| `/review` | `ReviewPage` |
| 그 외 | `/`로 리다이렉트 |

이 step에서는 네 페이지를 `src/pages/`에 **자리표시자**로 만든다.
각각 자기 이름과, `useParams`로 받은 값을 화면에 뿌리는 정도면 된다.

### 2. `src/components/Layout.tsx`

모든 화면을 감싸는 셸.

- 상단에 앱 이름과 `/`(주제 목록), `/review`(복습)로 가는 링크
- `UI_GUIDE.md`의 레이아웃 규칙을 따른다: 좌측 정렬, 최대 너비는 화면별로 다르므로
  Layout은 가로 패딩만 주고 최대 너비는 각 페이지가 정한다
- 현재 위치를 링크에 표시한다 (`NavLink` 활용)

### 3. `src/hooks/useProgress.ts`

진행 상태를 화면에서 쓰기 위한 훅. `src/lib/`의 함수만 호출한다.

```ts
export function useProgress(): {
  progress: Progress;
  markRead: (topicId: string) => void;
  answer: (questionId: string, correct: boolean) => void;
}
```

- 최초 렌더에서 `loadProgress()`로 초기화한다.
- 갱신 시 상태를 바꾸고 `saveProgress()`를 호출한다.
- CRITICAL: `localStorage`를 직접 부르지 마라. 반드시 `src/lib/storage.ts`를 통해라.

### 4. 스타일 토큰

`UI_GUIDE.md`의 색상표를 `tailwind.config.js`의 `theme.extend.colors`에 등록해
클래스에서 이름으로 쓸 수 있게 한다. 하드코딩된 헥스값이 컴포넌트에 흩어지지 않게 하는 게 목적이다.

다크모드 고정이다. 라이트/다크 토글을 만들지 마라.

### 5. 훅 린트 규칙

step 0의 eslint 설정에는 React 훅 규칙이 빠져 있다. 이 step에서 훅(`useProgress`)이 처음 등장하므로
여기서 채운다.

- `eslint-plugin-react-hooks`(`^4.6.0`)를 devDependency로 설치한다.
- `.eslintrc.cjs`의 `extends`에 `plugin:react-hooks/recommended`를 추가한다.
- 추가 후 `npm run lint`가 경고 0으로 통과해야 한다.
  `exhaustive-deps` 경고가 뜨면 의존성 배열을 고쳐라. **규칙을 끄거나 주석으로 무시하지 마라.**

### 6. 테스트

- 라우팅 테스트: `/`가 주제 목록을, `/review`가 복습 화면을 렌더한다
- 알 수 없는 경로가 `/`로 리다이렉트된다
- Layout의 내비게이션 링크가 렌더된다

`MemoryRouter`로 테스트하되, **`App.tsx`는 `HashRouter`를 쓰고 있어야 한다.**
라우트 정의를 별도 컴포넌트로 빼서 테스트에서 재사용하면 둘 다 만족한다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
grep -q "HashRouter" src/App.tsx && echo ROUTER_OK
grep -q "react-hooks" .eslintrc.cjs && echo HOOKS_LINT_OK
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `HashRouter`를 쓰는가? `BrowserRouter`가 코드 어디에도 없는가?
   - `vite.config.ts`의 `base`가 여전히 `'./'`인가?
   - `localStorage`를 직접 부르는 곳이 `src/lib/storage.ts`뿐인가?
   - UI_GUIDE 금지 사항(glass morphism, gradient text, 이모지 아이콘 등)을 어기지 않았는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `BrowserRouter`를 쓰지 마라. 이유: GitHub Pages에서 새로고침 시 404가 난다 (ADR-007).
- `vite.config.ts`의 `base`를 바꾸지 마라. 이유: 서브경로 배포가 깨진다.
- 각 페이지의 실제 내용을 구현하지 마라. 이 step은 자리표시자까지다.
  이유: 화면별로 step이 따로 있다.
- 다크/라이트 토글을 만들지 마라. 이유: PRD에서 다크 고정으로 정했다.
- 아이콘 라이브러리를 설치하지 마라. 이유: UI_GUIDE에서 필요한 것만 직접 그리라고 정했다.
- 기존 테스트를 깨뜨리지 마라.
