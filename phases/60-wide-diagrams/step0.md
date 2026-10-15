# Step 0: wide-diagram-hook

## 배경

화면 폭이 768px 이상이면 도식을 가로형 배치로 그리기로 했다(ADR-047). 시범 세 장(VPC 목적지, EventBridge 이벤트 경로, VPC 경로)이
뒤 step에서 이 판정을 쓴다. 이 step은 그 판정 하나만 만든다. **도식 컴포넌트는 건드리지 않는다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-047** 전부
- `docs/UI_GUIDE.md`의 「도식」 중 **「넓은 화면의 가로형 (ADR-047)」**, 「레이아웃」의 「데스크톱」 마지막 두 문단
- `docs/ARCHITECTURE.md`의 디렉토리 구조(`hooks/`)와 「테스트 경계」
- `src/hooks/useProgress.ts`, `src/hooks/useProgress.test.tsx`: 이 폴더의 훅과 테스트 선례
- `src/setupTests.ts`: jsdom에 없는 API를 다루는 방식의 선례(`scrollIntoView`)
- `vite.config.ts`: 테스트 환경은 jsdom이고 `globals: true`다

## 작업

### 파일

- `src/hooks/useWideDiagram.ts`
- `src/hooks/useWideDiagram.test.tsx` — **이 파일을 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

### 인터페이스

```ts
export const WIDE_DIAGRAM_QUERY = '(min-width: 768px)'
export function useWideDiagram(): boolean
```

- `window.matchMedia(WIDE_DIAGRAM_QUERY).matches`를 돌려준다.
- `matchMedia`의 `change` 이벤트로 값이 바뀌면 다시 그린다. 언마운트하면 구독을 푼다.
- **`window.matchMedia`가 함수가 아니면 `false`다.** jsdom에는 `matchMedia`가 없다. 이 값이 `false`여야 기존 도식 테스트
  수백 개가 지금처럼 세로형을 그린다.
- `useSyncExternalStore`를 쓰든 `useState`+`useEffect`를 쓰든 재량이다. 단 **첫 렌더부터** 실제 값을 돌려줘야 한다. 첫 렌더에
  `false`를 냈다가 effect에서 `true`로 바꾸면 데스크톱에서 세로형이 한 번 번쩍인다.
- 기준 폭은 이 파일 한 곳에만 둔다. 도식 컴포넌트가 `'(min-width: 768px)'` 문자열을 따로 쓰지 않게 하려는 것이다(UI_GUIDE).

### 테스트: `useWideDiagram.test.tsx`

`renderHook`(`@testing-library/react`)과 `vi.stubGlobal('matchMedia', …)`을 쓴다. `afterEach`에서 `vi.unstubAllGlobals()`로 되돌린다.
모의 `MediaQueryList`는 `matches`, `media`, `addEventListener`, `removeEventListener`만 있으면 된다. 테스트 파일 안에 둔다.

1. `matchMedia`가 없으면 `false`다.
2. `matchMedia`가 `matches: true`를 돌려주면 `true`, `false`를 돌려주면 `false`다.
3. `matchMedia`에 넘긴 질의가 정확히 `'(min-width: 768px)'`이고 `WIDE_DIAGRAM_QUERY`와 같다.
4. 렌더 뒤 `change` 이벤트로 `matches`가 바뀌면 훅 값이 따라 바뀐다(`act`로 감싼다). 반대 방향도 확인한다.
5. 언마운트하면 등록한 `change` 리스너가 해제된다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `src/components/`·`src/pages/`·`src/lib/`·`src/data/`에 바뀐 파일이 없는가.
   - 전체 테스트 수가 이 step 전(1386개)보다 이 step이 더한 수만큼만 늘었는가.
3. `phases/60-wide-diagrams/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 만든 파일 두 개, 고른 구현 방식(`useSyncExternalStore` 여부), 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`.

## 금지사항

- **도식 컴포넌트·`DiagramFrame.tsx`·`ConceptList.tsx`를 고치지 마라.** 이유: 도식은 step 2~4가 한 장씩 바꾼다.
- **`src/setupTests.ts`에 `matchMedia` 전역 모의를 넣지 마라.** 이유: 모든 테스트가 그 값을 물려받아, `matchMedia`가 없는 기본 상태
  (세로형)를 검사하는 기존 도식 테스트의 전제가 바뀐다. 모의는 필요한 테스트 파일 안에서만 건다.
- **기준 폭을 640px(`sm:`)이나 1024px로 바꾸지 마라.** 이유: 사용자가 태블릿을 포함하는 768px을 골랐다(ADR-047). 640~735px에서는
  본문 폭이 672px에 못 미쳐 가로형의 배율이 줄어든다.
- **컨테이너 폭(ResizeObserver)으로 판정하지 마라.** 이유: ADR-047 「대안」.
- 새 의존성을 추가하지 마라.
- 기존 테스트를 깨뜨리지 마라.
