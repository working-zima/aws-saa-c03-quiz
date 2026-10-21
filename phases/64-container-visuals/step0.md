# Step 0: container-basics

## 배경

`ecs-eks-fargate` 주제(ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk)는 `컨테이너`와 `쿠버네티스`를 계속 쓰면서 그것이 무엇인지 한 번도 말하지 않는다.
사용자가 "나는 컨테이너나 쿠버네티스가 뭔지도 몰라"라고 했다. 이 step은 **ADR-049**대로 주제 맨 앞(`ecs` 바로 앞)에 **기본 개념 둘**을 넣고, 개념마다 **새 문항
하나씩(q740·q741)**을 문항 파일 끝에 붙인다. 정의는 AWS 공식 문서와 소개 페이지에서 가져왔다(ADR-039 「2026-10-21 확장」, `docs/source/aws-docs.md`
「컨테이너·컨테이너 이미지·레지스트리, 컨테이너 오케스트레이션·쿠버네티스」). 결과는 개념 633 → 635개, 문항 739 → 741개다.

뒤의 step 1~9가 이 주제에 비교표 넷과 도식 여덟을 붙인다. 그중 둘(이미지 흐름 도식, 오케스트레이션 표)의 앵커가 이 step이 만드는 개념이다.

무엇을 바꾸는지는 **`phases/64-container-visuals/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 판정하거나 문장을 다듬지 마라.
문장은 사용자가 미리보기(https://claude.ai/artifact/EvvHzi8LhpQLP9r5R9ZU23 의 「00」)로 승인한 것이다.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `newConcepts` | 새 개념. `before` 개념(`ecs-eks-fargate.ecs`) 바로 앞에 배열 순서대로 넣는다 | 2 |
| `parents` | 없다(새 개념은 딸린 개념이 없는 기본 개념이다) | 0 |
| `newQuestions` | 새 문항. 문항 파일 끝(q739 뒤)에 이 순서대로 붙인다 | 2 |

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-049**(이 step의 결정), **ADR-039 끝의 「2026-10-21 확장」**, **ADR-043**(같은 방식의 선례)
- `phases/64-container-visuals/changes.json`
- `phases/64-container-visuals/verify-content.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `phases/64-container-visuals/data-test.patch` — 아래 「1」에서 적용할 테스트 변경
- `src/data/topics.json`의 `ecs-eks-fargate.ecs` 줄 — 넣을 자리와 줄의 모양
- `src/data/questions.json`의 마지막 두 줄(q738·q739)과 닫는 `]` — 문항을 붙일 자리
- `scripts/topics-baseline.json`의 `ecs-eks-fargate.ecs` 항목 — 스냅샷 쪽 모양
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs` 머리 주석 — 스냅샷을 왜 손으로 고치는지
- `phases/55-sourced-block-heads/step0.md` — 같은 작업의 선례

## 작업

### 1. 테스트를 먼저 — 패치 하나

```bash
git apply phases/64-container-visuals/data-test.patch
```

`src/data/data.test.ts`의 테스트 두 블록이 바뀐다. 개념 수 단언(「네트워크 데이터 주제는 원본 항목 수만큼 개념을 가진다」, ecs-eks-fargate 24 → 26)과
순서 단언(「컨테이너 주제가 ECS·Fargate·EKS·ECR·Batch·Elastic Beanstalk·App2Container 블록 순서로 개념을 둔다」)이다. 패치를 고치거나 다른 줄을 더
바꾸지 마라.

적용한 뒤 `npm test`를 돌려 **정확히 이 둘이 실패하는지** 확인한다(데이터가 아직 옛 상태다). 다른 테스트가 실패하거나 둘 중 하나라도 통과하면 멈추고
`"status": "error"`, `"error_message"`에 테스트 이름을 적는다.

### 2. `src/data/topics.json`

- `newConcepts` 둘: `ecs-eks-fargate.ecs` 개념 줄 바로 위에 `      `(공백 6칸) + `JSON.stringify(concept)` + `,` 한 줄씩을 배열 순서대로 넣는다.
  결과 순서는 `container` → `container-orchestration` → `ecs`다. 키 순서는 `id`, `name`, `summary`, `paragraphs`이고 `parentId`가 없다.
- **줄 단위 텍스트 치환으로만 한다.** `JSON.parse` → `JSON.stringify`로 파일을 다시 쓰지 마라.

### 3. `src/data/questions.json`

- 마지막 문항 줄(`{"id":"q739",…}`) 끝에 쉼표 하나를 붙인다.
- 그 바로 뒤, 닫는 `]` 앞에 `newQuestions` 둘을 이 순서대로 `JSON.stringify(question)` 한 줄씩 넣는다. 마지막(q741) 줄에는 쉼표를 붙이지 않는다.
  키 순서는 `id`, `topicId`, `conceptId`, `prompt`, `choices`, `answerIndex`, `explanation`이다.
- 기존 문항 줄은 q739 끝의 쉼표 말고 한 글자도 바꾸지 않는다.

### 4. `scripts/topics-baseline.json`

`sync-baseline.mjs`는 개념 개수·id가 다르면 거부하므로 손으로 고친다. 형식은 지금 파일 그대로(1칸 들여쓰기 블록)다.

- 새 개념 둘: `ecs-eks-fargate.ecs` 항목(`    {`부터 `    },`까지) 바로 위에 배열 순서대로 아래 모양의 항목을 넣는다.

  ```
      {
       "id": "<id>",
       "name": "<name>"
      },
  ```
- `"conceptLineCount": 633`을 `635`로, `"questionsSha256"`을 바뀐 `src/data/questions.json`의 sha256으로 바꾼다.
  sha256을 고친 뒤 `node scripts/sync-baseline.mjs --dry-run`이 「갱신할 것이 없다」를 내야 맞다.

치환에 쓸 일회성 스크립트는 저장소 밖(임시 폴더)에 두고 끝나면 지운다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/64-container-visuals/verify-content.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — 93개 파일, 2245개 테스트 통과(새 테스트는 없다).
   - `check-structure.mjs` — 「구조 이상 없음」.
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-content.mjs` — 「새 개념 2개, 새 문항 2개. 개념 635줄」.
2. `verify-content.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 기대값을 만드는 규칙은 그 파일의 머리 주석이다.
   샌드박스에서 `git`을 실행할 수 없으면 그 사실을 `"summary"`에 적는다. 사람이 다시 돌린다.
3. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts` 넷과 phase
   메타데이터뿐인지 확인한다.
4. `phases/64-container-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 새 개념 둘의 id, 새 문항 둘, 바뀐 테스트 둘, 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문장·위치·문항을 바꾸거나 더하지 마라.** 이유: 사용자가 미리보기로 승인한 내용이다. 이상해 보이면 고치지 말고 `"summary"`에 적어라.
- **기존 개념과 기존 문항을 고치지 마라.** 이유: ADR-049는 새 개념·새 문항만 더한다. 다른 주제가 `컨테이너`를 풀이 없이 쓰는 것은 ADR-049 「남겨 둔 것」이다.
- **새 개념에 분류 문장(「AWS 분류로는 … 쪽 서비스다」)을 넣지 마라.** 이유: 서비스 개념이 아니다(ADR-049 「자리」).
- **`topics.json`·`questions.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨져 가드레일이 진짜 사고와 구분하지 못한다.
- **`data-test.patch` 밖의 테스트를 고치지 마라.** 패치를 적용해도 다른 테스트가 실패하면 멈춰라. 이유: 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- **`src/` 아래 코드(`.ts`·`.tsx` 중 테스트가 아닌 것), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이 step은 데이터와 그 단언만 바꾼다. 근거 문서는 설계 커밋이
  이미 남겼다.
- **시각 자료 JSON·도식·표를 만들지 마라.** 이유: step 1~9의 범위다.
- 기존 테스트를 깨뜨리지 마라.
