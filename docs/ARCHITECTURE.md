# 아키텍처

## 디렉토리 구조

```
src/
├── main.tsx           # 진입점
├── App.tsx            # 라우터 정의
├── pages/             # 화면 단위 (라우트 하나 = 파일 하나)
├── components/        # 재사용 UI 컴포넌트
├── data/              # 빌드 타임 정적 학습 데이터 (JSON)
├── types/             # TypeScript 타입 정의 (단일 출처)
└── lib/               # 순수 로직. React 의존 없음.
```

`src/services/`는 두지 않는다. 외부 API를 호출하지 않으므로 감쌀 대상이 없다.

## 데이터 모델

`src/types/content.ts`에 정의한다. 데이터 JSON은 이 타입을 만족해야 한다.

```ts
type Importance = 3 | 2;              // ★★★ = 3, ★★☆ = 2

interface Topic {
  id: string;                          // kebab-case. 예: "s3-storage-classes"
  title: string;                       // "S3 스토리지 클래스 유형"
  importance: Importance;
  sourcePages: [number, number];       // concepts-raw.md 근거 페이지 범위
  concepts: Concept[];
}

interface Concept {
  id: string;                          // 전역 유일. 예: "s3-storage-classes.standard-ia"
  name: string;                        // "S3 Standard-IA"
  summary: string;                     // 한 줄 요약
  paragraphs: string[];                // 설명 본문. 문단 단위 평문.
}

interface Question {
  id: string;                          // "q001"
  topicId: string;
  conceptId: string;                   // 근거 개념. 해설 → 개념 이동에 쓴다.
  prompt: string;
  choices: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}
```

`src/types/progress.ts`:

```ts
interface Progress {
  version: 1;                                  // 스키마 변경 시 올린다
  read: Record<string, boolean>;               // topicId → 개념을 끝까지 읽었는가
  answers: Record<string, boolean>;            // questionId → 마지막 시도가 정답이었는가
}
```

## 라우트

`HashRouter`를 쓴다. 실제 URL은 `.../#/topic/s3-storage-classes` 형태다 (ADR-007).
아래 표의 경로는 해시 뒤의 경로를 뜻한다.

| 경로 | 화면 |
|---|---|
| `/` | 주제 목록 (22개, 중요도·진행 상태 표시) |
| `/topic/:topicId` | 개념 읽기 |
| `/topic/:topicId/quiz` | 확인 문제 |
| `/review` | 복습 — 틀린 문제가 속한 개념 모아보기 |

## 데이터 흐름

```
docs/source/concepts-raw.md          (원본 PDF 추출본, 커밋됨)
        │
        │  빌드 전 1회. harness step에서 사람이 검수하며 생성한다.
        │  앱 런타임이나 npm 스크립트에서 자동 생성하지 않는다.
        ▼
src/data/topics.json, src/data/questions.json   (커밋됨)
        │
        │  import — 번들에 정적 포함. fetch 없음.
        ▼
pages/*  ──읽기──▶  lib/progress.ts  ──▶  localStorage
        ◀──상태──
```

핵심: **런타임에 네트워크를 타는 경로가 하나도 없다.** 새 코드가 `fetch`를
쓰고 있다면 설계에서 벗어난 것이다.

## 상태 관리

- 학습 데이터: import한 상수. 불변. 전역 상태 라이브러리를 쓰지 않는다.
- 진행 상태: `lib/progress.ts`가 localStorage를 읽고 쓴다. 화면에서는 `useProgress` 훅으로 접근한다.
- 화면 내 일시 상태(선택한 보기, 정답 공개 여부 등): `useState`. 그 이상 필요 없다.

`lib/`는 localStorage에 직접 접근하는 유일한 계층이다. 컴포넌트에서
`localStorage`를 직접 부르지 마라. 이유: 저장소 접근을 DOM 없이 테스트하기 위해서다.

## 테스트 경계

| 대상 | 방식 |
|---|---|
| `lib/*` (채점·진행률·저장소) | Vitest 단위 테스트. DOM 불필요. |
| `src/data/*.json` | 스키마 검증 테스트 — 타입 일치, id 유일성, `conceptId` 참조 무결성, `answerIndex` 범위 |
| `pages/`, `components/` | @testing-library/react. 사용자 관점 동작만. |
