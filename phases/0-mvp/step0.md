# Step 0: project-setup

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/CLAUDE.md` — 기술 스택 제약과 CRITICAL 규칙
- `/docs/ARCHITECTURE.md` — 디렉토리 구조
- `/docs/ADR.md` — ADR-001(Vite 선택), ADR-007(GitHub Pages 배포)

현재 저장소에는 harness 템플릿(`scripts/`, `docs/`, `phases/`)만 있고 앱 코드는 없다.

## 작업

저장소 루트에 Vite + React + TypeScript 프로젝트를 세운다.

### 1. 의존성

`npm create vite@latest`를 쓰지 마라. 대화형이고 최신 메이저를 끌어온다.
`package.json`을 직접 작성하고 아래 버전 범위로 설치한다.

**로컬 Node는 18.17.1이다. 아래 메이저를 넘기면 실행 자체가 안 된다.**

| 패키지 | 버전 |
|---|---|
| `vite` | `^5.4.0` |
| `@vitejs/plugin-react` | `^4.3.0` |
| `react`, `react-dom` | `^18.3.0` |
| `react-router-dom` | `^6.26.0` |
| `typescript` | `^5.5.0` |
| `tailwindcss` | `^3.4.0` |
| `postcss`, `autoprefixer` | tailwind 3 호환 최신 |
| `vitest` | `^1.6.0` |
| `jsdom` | `^24.0.0` |
| `@testing-library/react` | `^14.3.0` |
| `@testing-library/jest-dom` | `^6.4.0` |
| `@testing-library/user-event` | `^14.5.0` |
| `eslint` | `^8.57.0` |
| `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` | `^7.0.0` |
| `@types/react`, `@types/react-dom` | `^18` |

설치 후 `npm ls vite tailwindcss vitest` 로 실제 해석된 버전이 위 범위인지 확인하라.

### 2. 설정 파일

- `vite.config.ts`
  - `base: './'` — ADR-007. 절대 경로로 두면 GitHub Pages 서브경로 배포가 깨진다.
  - vitest 설정을 같은 파일에 둔다: `environment: 'jsdom'`, `globals: true`,
    `setupFiles: './src/setupTests.ts'`
- `tsconfig.json` — `strict: true`. `noUnusedLocals`, `noUnusedParameters`도 켠다.
- `tailwind.config.js` — `content: ['./index.html', './src/**/*.{ts,tsx}']`
- `postcss.config.js`
- `.eslintrc.cjs` — typescript-eslint recommended 기반
- `src/index.css` — tailwind 지시자 3줄. 여기서 `body` 배경을 `#0a0a0a`로 고정한다.
- `src/setupTests.ts` — `@testing-library/jest-dom` import

### 3. 최소 뼈대

- `index.html` — 언어 `ko`, 제목 "AWS SAA-C03 개념 학습"
- `src/main.tsx` — React 진입점
- `src/App.tsx` — "AWS SAA-C03" 한 줄만 렌더하는 자리표시자. 라우팅은 step 4에서 붙인다.
- `src/App.test.tsx` — App이 렌더되고 그 문자열이 보이는지 확인하는 테스트 1개

### 4. npm 스크립트

네 개 전부 등록해야 한다. verify-gate 훅이 턴마다 `lint` → `build` → `test`를 돌리므로,
하나라도 없으면 매 턴 `Missing script`로 실패한다.

```json
"dev": "vite",
"build": "tsc -b && vite build",
"lint": "eslint . --ext ts,tsx --max-warnings 0",
"test": "vitest run"
```

`test`는 반드시 `vitest run`이다. `vitest`만 쓰면 watch 모드로 떠서 훅이 영원히 끝나지 않는다.

## Acceptance Criteria

```bash
npm run lint     # 경고 0으로 통과
npm run build    # 타입 에러 없이 dist/ 생성
npm run test     # 통과하고 즉시 종료 (watch 모드로 멈추지 않음)
grep -q "base: './'" vite.config.ts && echo BASE_OK
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 설치된 주요 버전(vite/react/tailwind/vitest)을 적어라. 다음 step이 참고한다.

## 금지사항

- Next.js를 쓰지 마라. 이유: ADR-001에서 Vite를 선택했다.
- Node 20 이상을 요구하는 버전(vite 6+, tailwind 4+, vitest 2+)을 설치하지 마라.
  이유: 로컬 Node가 18.17.1이라 빌드가 통과해도 실행이 안 된다.
- `test` 스크립트를 watch 모드로 두지 마라. 이유: Stop 훅이 끝나지 않아 step이 타임아웃된다.
- 하위 디렉토리에 프로젝트를 만들지 마라. 이유: 훅과 execute.py가 저장소 루트 기준으로 동작한다.
- UI를 만들지 마라. 이 step은 툴체인만 세운다. 화면은 step 4부터다.
- `scripts/` 아래를 건드리지 마라. 이유: harness 인프라이고 파이썬 테스트라 `npm test` 대상이 아니다.
- 기존 테스트를 깨뜨리지 마라.
