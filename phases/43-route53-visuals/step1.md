# Step 1: health-diagram

## 배경

`route53` 주제에서 상태 검사가 답을 가르는 개념은 셋이다.

- `route53-failover-routing`: 상태 검사를 주 레코드에만 붙이고, 주 대상이 비정상이면 보조를 응답한다.
- `multi-region-failover-for-region-outage`: 리전을 늘려도 단순 라우팅이면 상태를 보지 않아 자동 전환이 되지 않는다.
- `multivalue-answer-details`: 정상 레코드만 최대 8개 무작위로 응답하고, 비정상인 곳은 응답에서 빠진다.

셋 모두 "리전 하나가 멈췄을 때 Route 53이 무엇을 응답하나"라는 같은 물음에 다른 답을 낸다. 이 step은 그 물음을 도식 하나로
그린다. **시나리오 셋은 모두 리전 A가 비정상인 상황으로 고정한다.** 정책 사이의 차이만 보이게 하려는 것이다(사용자 결정,
2026-09-27). 기록은 `docs/ADR.md` ADR-037 끝의 「2026-09-27 확장 — Route 53 주제(phase 43)」에 있다.

**앵커는 `route53.multivalue-answer-details`다.** 라우팅 정책 개념 무리의 마지막이라, 세 정책의 동작을 모두 읽은 뒤에 이 그림을 본다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**. 특히 「수량과 상태를 바꾸는 도식」의 장애 표시 규칙과
  Route 53 예외(`비정상`)
- `phases/43-route53-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`(`notes`), `src/data/index.ts`
- `src/data/visuals/route53.json`: step 0이 만든 파일이다. 여기에 `diagrams["health-answers"]`를 더한다.
- `src/components/diagrams/SgNaclLayersDiagram.tsx`: JSON에서 문구를 읽는 도식의 가장 최근 선례
- `src/components/diagrams/NatCountDiagram.tsx`: 무너진 대상을 흐리게 하고 곁말을 붙이는 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: `const nodes = [` 블록과 `'id': 'M…'` 경로를 정규식으로 읽는다.
  이 형식을 지켜라.
- `src/data/topics.json`의 `route53` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/Route53HealthDiagram.tsx`. 파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다.
- 문구: JSON `diagrams["health-answers"]`
- 매핑: `registry.ts`에 `'route53.multivalue-answer-details': Route53HealthDiagram` 한 줄을 더한다.

### 모양

위에서 아래로 그린다. 사용자가 Route 53에 묻고, Route 53이 응답으로 가리키는 대상이 아래 두 리전 가운데 하나 또는 둘이다.

```
        사용자
          ↓
       Route 53
     ↓          ↓
  리전 A       리전 B
  (비정상)
```

**노드**(`const nodes = [...]`, 높이 32):

| id | 라벨 | 색 | 자리 |
|---|---|---|---|
| `user` | 사용자 | `stroke-disabled` | 맨 위 가운데 |
| `route53` | Route 53 | `stroke-diagram-managed` | 가운데 |
| `region-a` | 리전 A | `stroke-diagram-resource` | 아래 왼쪽 열 |
| `region-b` | 리전 B | `stroke-diagram-resource` | 아래 오른쪽 열 |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리 | 보이는 시나리오 |
|---|---|---|---|
| `unhealthy` | 비정상 | `region-a` 아래 | 셋 모두 |
| `primary` | 주 · 상태 검사 | `region-a` 위 또는 옆 | `failover` |
| `secondary` | 보조 | `region-b` 위 또는 옆 | `failover` |
| `dropped` | 응답에서 빠짐 | `region-a` 위 또는 옆 | `multivalue` |

곁말의 글자는 `비정상`이다. `장애`라고 쓰지 마라(UI_GUIDE 예외). 비정상을 빨강 등 색으로 칠하지 마라.

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 구간 |
|---|---|
| `user-route53` | 사용자 → Route 53 (질의) |
| `route53-region-a` | Route 53 → 리전 A (응답이 가리키는 대상) |
| `route53-region-b` | Route 53 → 리전 B (응답이 가리키는 대상) |

어느 경로도 다른 노드 상자를 뚫지 않게 통로를 잡는다(교차 검사가 확인한다).

### 시나리오 셋

`region-a`는 셋 모두에서 흐리다(`0.25`). UI_GUIDE의 장애 표시 규칙을 따른 것이다. 단순 라우팅에서는 흐린 리전 A로 가는
경로가 **그대로 남는다.** 상태를 보지 않고 멈춘 대상을 응답한다는 것이 이 시나리오의 요점이다.

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|---|---|
| `simple` | 단순 | `user`, `route53` | `user-route53`, `route53-region-a` | `unhealthy` | 단순 라우팅은 리소스 하나를 응답하고 상태를 보지 않아, 비정상인 리전 A를 그대로 응답한다 | `route53.routing-policies`, `route53.multivalue-answer-details`, `route53.multi-region-failover-for-region-outage` |
| `failover` | 페일오버 | `user`, `route53`, `region-b` | `user-route53`, `route53-region-b` | `unhealthy`, `primary`, `secondary` | 상태 검사는 주 레코드에만 붙인다 · 주가 비정상이면 보조를 응답한다 · 보조에는 상태 검사가 필요 없다 | `route53.route53-failover-routing`, `route53.multi-region-failover-for-region-outage` |
| `multivalue` | 다중값 응답 | `user`, `route53`, `region-b` | `user-route53`, `route53-region-b` | `unhealthy`, `dropped` | 정상 레코드만 최대 8개까지 무작위로 응답하므로 비정상인 리전 A는 빠진다 · 사용자 위치는 보지 않는다 | `route53.multivalue-answer-details` |

- 캡션은 위 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **320px에서 두 줄 이하가 되도록 50자 안팎으로** 쓴다.
  phase 40 실측에서 50자를 넘으면 세 줄이 됐다. 사실이 다 들어가지 않으면 앞의 사실을 남긴다.
- `idleCaption`: 리전 A가 비정상일 때 정책마다 무엇을 응답하는지 시나리오로 고르라는 안내 한 문장.
- 도식의 `sources`: `route53.route53`, `route53.routing-policies`, `route53.route53-failover-routing`,
  `route53.multi-region-failover-for-region-outage`.
- `legend`: 파랑·청록·회색이 각각 무엇인지 한 줄로 쓴다. 파랑은 Route 53, 청록은 리전에 배포한 대상, 회색은 사용자다.
  화살표가 "Route 53이 응답으로 가리키는 대상"이라는 점도 함께 적는다.
- `label`: `상태 검사와 Route 53 응답 도식`, `svgLabel`: `상태 검사와 Route 53 응답`.

### 테스트: `Route53HealthDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 처음에는 노드 넷이 모두 선명하고, 경로와 곁말이 없다.
2. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
3. 셋 모두에서 `region-a`의 opacity가 `0.25`이고 곁말 `비정상`이 보인다. 어느 곁말에도 `장애`라는 글자가 없다.
4. `simple`에서는 `route53-region-a`가 보이고 `route53-region-b`는 없다. `failover`·`multivalue`에서는 그 반대다.
5. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다.
6. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
7. `ConceptList`에 `route53.multivalue-answer-details` 개념을 주면 본문 뒤에 이 도식이 온다.
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션에 근거 표 밖의 사실이 없는가.
   - 가중치·지연 시간·지리 정책이 도식에 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`topics.json`·step 0의 표가 그대로인가.
3. `phases/43-route53-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 노드와 곁말의 좌표, 캡션 셋의 글자 수, 교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **지연 시간·지리적 위치·가중치 시나리오를 더하지 마라.** 이유: 사용자별 응답을 그리려면 사용자와 리전이 둘씩 필요해 경로가
  엇갈린다. 그 차이는 step 0의 비교표가 맡는다(사용자 결정).
- **정상 상태 시나리오를 따로 두지 마라.** 이유: 셋 모두 리전 A 비정상으로 고정하기로 했다(사용자 결정).
- **비정상을 색으로 칠하거나 곁말을 `장애`로 쓰지 마라.** 이유: UI_GUIDE 「수량과 상태를 바꾸는 도식」과 그 Route 53 예외.
- **TTL·DNS 캐시·상태 검사 주기 같은 문구를 쓰지 마라.** 이유: 데이터에 없다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`·step 0의 표를 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
