# Step 1: health-examples

## 배경

`Route53HealthDiagram`(phase 43)은 리전 A가 비정상일 때 단순·페일오버·다중값 응답이 각각 무엇을 응답하는지 보인다. 도식을 모르고 보면
이 그림이 어떤 물음에 답하는지 알 수 없다(사용자 지적, 2026-09-27). 이 step은 두 가지를 더한다(ADR-038).

1. **물음형 제목**: `리전 A가 멈추면 Route 53은 어디를 알려 줄까?`
2. **본문에 있는 예시 값**
   - 사용자가 묻는 이름을 `www.example.com`으로 보인다(`route53.route53`).
   - 두 리전의 대상을 ALB로 보인다. 페일오버의 주 레코드가 ALB를 가리키는 예가 `route53.route53-failover-routing`에 있다.

사용자 결정: 예시는 **데이터에 있는 것만** 쓴다. 리전 이름은 `A`·`B`로 둔다. 서울·도쿄 같은 가상 리전이나 가상 IP는 쓰지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037(phase 43 확장), ADR-038**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**(특히 「물음형 제목과 예시」, 「수량과 상태를 바꾸는 도식」의 Route 53 예외)
- `phases/44-route53-visual-guides/index.json`의 step 0 `summary`
- `src/components/diagrams/DiagramFrame.tsx`: step 0이 더한 `question` prop
- `src/components/diagrams/Route53HealthDiagram.tsx`, `src/components/diagrams/Route53HealthDiagram.test.tsx`
- `src/data/visuals/route53.json`의 `diagrams["health-answers"]`
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `route53.route53`, `route53.route53-failover-routing`

## 작업

### JSON `diagrams["health-answers"]`

- `question`: `리전 A가 멈추면 Route 53은 어디를 알려 줄까?`
- `nodes`: `region-a` → `리전 A의 ALB`, `region-b` → `리전 B의 ALB`. `user`·`route53`은 그대로 둔다.
- `notes`에 `query`: `www.example.com의 주소는?`을 더한다. 다른 곁말 문구는 그대로 둔다.
- 캡션·`idleCaption`·`legend`·`sources`는 바꾸지 않는다.

### 컴포넌트

- `DiagramFrame`에 `question`을 넘긴다.
- `query` 곁말은 **예시 곁말**이다. `전체`를 포함해 **늘 보인다.** 자리는 `user`→`route53` 화살표의 오른쪽, 두 노드 사이 높이다.
  크기 9, `fill-muted`이고 `user` 노드의 opacity를 따른다(`user`는 늘 선명하므로 사실상 늘 1이다).
- 리전 노드는 라벨이 길어졌어도 폭 116에 들어간다(`estimateTextWidth('리전 A의 ALB', 10) + 12` ≈ 75). 폭이 모자라면 노드를 넓히되
  글자 크기를 줄이지 마라.
- 좌표를 옮겼다면 경로가 노드 상자를 뚫지 않는지 교차 검사로 확인한다.

### 테스트

**테스트를 먼저 고치고 더해서 실패하는 것을 확인한 뒤** 구현한다.

더할 테스트:

1. 물음 `리전 A가 멈추면 Route 53은 어디를 알려 줄까?`가 보이고, 시나리오 버튼보다 앞에 있다.
2. `query` 곁말 `www.example.com의 주소는?`이 `전체`와 세 시나리오 모두에서 보이고, `viewBox` 안에 있다(`getBBox`가 아니라
   좌표·추정 폭으로 단언한다: `x + estimateTextWidth(문구, 9) <= 280`).

**고쳐도 되는 기존 단언**: 이 step이 바꾸는 사실과 정면으로 부딪치는 것만 고친다.
- 리전 라벨을 `리전 A`·`리전 B`로 단언하는 곳 → 새 라벨.
- "곁말 없이", "곁말을 모두 숨긴다", 시나리오별 곁말 집합처럼 `query`가 늘 보이면 틀리게 되는 단언 → `query`를 포함하도록.
- JSON `notes`·`nodes`를 통째로 비교하는 단언 → 새 값.
- 위 단언이 든 테스트의 이름에 "곁말 없이"가 있으면 "예시 곁말만"처럼 새 동작에 맞게 바꿔도 된다.

그 밖의 단언과 테스트는 건드리지 마라. 특히 흐림(`0.25`)·경로·`비정상` 곁말에 관한 단언은 그대로 통과해야 한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.**

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 새로 넣은 값이 `www.example.com`과 `ALB`뿐인가. 가상 리전 이름·IP가 없는가.
   - 캡션·`idleCaption`이 그대로인가.
   - 다른 도식과 `DiagramFrame.tsx`를 바꾸지 않았는가.
3. `phases/44-route53-visual-guides/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 `query` 곁말의 좌표, 리전 노드 폭, 최종 `viewBox`, 고친 기존 단언 목록, 교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **서울·도쿄 같은 리전 이름, `52.123.25.11` 외의 IP, 응답 IP를 지어내지 마라.** 이유: 사용자 결정은 데이터에 있는 예시만이다(ADR-038).
  이 도식에는 IP를 쓰지 않는다. 본문의 IP 예시는 리전 A·B 어느 쪽의 주소라고도 말하지 않는다.
- **리전 B를 S3 정적 웹사이트로 바꾸지 마라.** 이유: 세 시나리오가 같은 두 리전을 공유한다. 다중 리전 개념의 대상과 맞추려고
  두 리전 모두 ALB로 두기로 했다(사용자 결정).
- **첫 시나리오를 미리 고르거나 `전체`에서 경로를 보이지 마라.** 이유: 사용자가 고르지 않은 안이다(ADR-038).
- **`DiagramFrame.tsx`·다른 도식·`topics.json`을 고치지 마라.**
- 위에서 허용한 것 밖의 기존 테스트를 깨뜨리거나 고치지 마라.
