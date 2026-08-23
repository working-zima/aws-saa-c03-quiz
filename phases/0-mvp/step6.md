# Step 6: concept-read-page

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/PRD.md` — 핵심 기능 2(개념 읽기)
- `/docs/UI_GUIDE.md` — **"레이아웃"과 "타이포그래피" 절이 이 화면의 핵심이다**
- 이전 step 산출물: `src/pages/ConceptReadPage.tsx`(자리표시자), `src/pages/TopicListPage.tsx`,
  `src/hooks/useProgress.ts`, `src/data/index.ts`, `src/types/content.ts`

`TopicListPage.tsx`를 먼저 읽고 카드·타이포그래피 사용 방식을 맞춰라.

## 작업

`src/pages/ConceptReadPage.tsx`를 구현한다. 이 앱에서 **가장 오래 머무는 화면**이다.
읽기 편한 것이 다른 모든 것보다 우선한다.

### 보여줄 것

`useParams`로 받은 `topicId`의 주제를 렌더한다.

1. 주제 제목과 중요도
2. 개념 목록 — `topic.concepts` 순서대로. 각 개념에:
   - `name` — 개념 이름
   - `summary` — 한 줄 요약. 이름 바로 아래, 보조 색으로.
   - `paragraphs` — 본문. 문단마다 `<p>` 하나.

     CRITICAL: **문단 문자열 안에 줄바꿈(`\n`)이 들어 있다.** 전체 문단의 약 35%가 그렇다.
     원본의 목록 구조(`[특징]` 아래 항목들, `1. / 2. / 3.` 나열, 스토리지 클래스 목록 등)가
     줄바꿈으로 표현돼 있기 때문이다. 그냥 `<p>`에 넣으면 HTML이 줄바꿈을 공백으로 접어
     한 줄로 뭉갠다 — 목록이 통째로 읽을 수 없게 된다.

     `whitespace-pre-line`을 적용해 줄바꿈을 살려라. 마크다운 렌더러를 쓰거나
     문자열을 `\n`으로 쪼개 `<br>`을 끼워 넣지 마라. CSS 한 줄로 끝나는 일이다.
3. 화면 하단에 `/topic/:topicId/quiz`로 가는 "확인 문제 풀기" 버튼

### 읽음 처리

이 화면에 들어오면 해당 주제를 읽음으로 표시한다 (`useProgress`의 `markRead`).
스크롤 끝까지 내렸는지 판정하지 마라 — 복잡한 것에 비해 얻는 게 없다.

### 존재하지 않는 topicId

URL의 `topicId`가 데이터에 없으면 안내 문구와 주제 목록으로 가는 링크를 보여준다.
**앱이 깨지거나 빈 화면이 되면 안 된다.**

### UI 규칙 (UI_GUIDE)

- 최대 너비 `max-w-2xl`. **이 값을 넘기지 마라.** 한 줄이 길어지면 읽기가 무너진다.
- 본문은 `text-[15px] text-neutral-300 leading-7`
- 한글 본문에 `break-keep`을 적용한다. 기본 줄바꿈은 한글 단어를 중간에서 끊는다.
- 개념 사이 간격은 `space-y-8`
- 좌측 정렬. 본문을 중앙 정렬하지 마라.

### 화면 내 이동 링크

앱 안에서 다른 화면으로 가는 링크는 **반드시 `react-router-dom`의 `Link`(또는 `NavLink`)를 써라.**
`<a href="#/...">`처럼 해시 경로를 직접 박아 넣지 마라.

이유: `Link`는 현재 라우터에 맞는 href를 알아서 만든다. `HashRouter`에서는 `#/topic/abc`,
`MemoryRouter`(테스트)에서는 `/topic/abc`가 나온다. 해시를 손으로 박으면 컴포넌트가
`HashRouter`에 고정되고, ADR-007이 열어 둔 `BrowserRouter` 전환 경로가 조용히 막힌다.
`Layout.tsx`가 이미 `NavLink`를 쓰고 있으니 그 방식에 맞춰라.

### 테스트

`src/pages/ConceptReadPage.test.tsx`:

- 주어진 `topicId`의 개념 이름·요약·본문이 렌더된다
- 없는 `topicId`에서 안내 문구가 뜨고 앱이 죽지 않는다
- 확인 문제 링크의 href가 `/topic/{id}/quiz`를 가리킨다 (`MemoryRouter` 기준)
- 화면 진입 시 읽음 처리가 호출된다

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 최대 너비가 `max-w-2xl`인가?
   - 본문에 `break-keep`과 `whitespace-pre-line`이 둘 다 적용됐는가?
   - 줄바꿈이 든 문단(예: `s3-storage-classes`의 스토리지 클래스 목록)이 여러 줄로 보이는가?
   - `localStorage`를 직접 부르지 않는가?
   - UI_GUIDE 금지 사항을 어기지 않았는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 마크다운 렌더러를 설치하지 마라. 이유: `paragraphs`는 평문 배열이다. 파싱할 게 없다.
- 목차·앵커·접기 기능을 만들지 마라. 이유: PRD에 없다. 개념 몇 개짜리 화면이다.
- 스크롤 위치 추적으로 읽음을 판정하지 마라. 이유: 복잡도에 비해 얻는 게 없다.
- 데이터 파일을 수정하지 마라.
- 다른 페이지를 건드리지 마라.
- 내부 이동 링크에 `<a href="#/...">`를 쓰지 마라. 이유: 라우터 구현에 컴포넌트가 고정된다. `Link`를 써라.
- 기존 테스트를 깨뜨리지 마라.
