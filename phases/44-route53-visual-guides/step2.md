# Step 2: alias-examples

## 배경

`Route53AliasDiagram`(phase 43)은 두 연결 방식을 인스턴스 교체의 관점에서 대조한다. 하나는 이름을 ALB에 겨누는 별칭 레코드이고,
다른 하나는 이름을 인스턴스 공용 IP에 직접 묶는 방식이다. 그런데 맨 위 노드가 `도메인 이름`이라는 추상어라서, 모르고 보면 무엇이
무엇을 가리키는지 잡히지 않는다(사용자 지적, 2026-09-27). 이 step은 두 가지를 더한다(ADR-038).

1. **물음형 제목**: `인스턴스를 바꿔도 DNS 레코드를 고치지 않으려면?`
2. **본문에 있는 예시 값**
   - 이름을 `www.example.com`으로 보인다.
   - 공용 IP 직접 연결 장면에서 그 IP를 `52.123.25.11`로 보인다.
   - 두 값 모두 `route53.route53` 본문이 도메인과 IP의 예로 드는 것이다.

사용자 결정: 예시는 **데이터에 있는 것만** 쓴다. phase 43 step 2는 IP 숫자를 금지했지만, ADR-038이 본문의 이 예시에 한해 허용했다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037(phase 43 확장), ADR-038**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**(특히 「물음형 제목과 예시」)
- `phases/44-route53-visual-guides/index.json`의 step 0·1 `summary`
- `src/components/diagrams/DiagramFrame.tsx`: `question` prop
- `src/components/diagrams/Route53HealthDiagram.tsx`: step 1에서 예시 곁말을 처리한 방식. 같은 방식을 따른다.
- `src/components/diagrams/Route53AliasDiagram.tsx`, `src/components/diagrams/Route53AliasDiagram.test.tsx`
- `src/data/visuals/route53.json`의 `diagrams["alias-record"]`
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `route53.route53`, `route53.route53-alias-record`

## 작업

### JSON `diagrams["alias-record"]`

- `question`: `인스턴스를 바꿔도 DNS 레코드를 고치지 않으려면?`
- `nodes`: `record` → `www.example.com`. 다른 노드 라벨은 그대로 둔다.
- `notes`에 `public-ip`: `공용 IP 52.123.25.11`을 더한다. 다른 곁말은 그대로 둔다.
- `legend`는 파랑이 무엇인지 설명하는 부분을 `파랑: Route 53 레코드(www.example.com)`처럼 이름이 레코드임을 알 수 있게 고친다.
  청록 설명은 그대로 둔다.
- 캡션·`idleCaption`·`sources`는 바꾸지 않는다.

### 컴포넌트

- `DiagramFrame`에 `question`을 넘긴다.
- `public-ip`는 예시 값을 담았지만 **시나리오 곁말**이다. `direct-ip` 시나리오에서만 보인다. 자리는 `ec2` 노드 아래, `tg` 그룹 안이다.
  크기 9, `fill-muted`. 같은 자리의 `replaced` 곁말과는 서로 다른 시나리오라 겹치지 않는다.
- `record` 노드는 라벨이 영문이 되어 폭이 달라진다. `estimateTextWidth('www.example.com', 10) + 12 <= 노드 폭`을 지킨다.
  폭을 바꿨다면 경로가 노드를 뚫지 않는지 교차 검사로 확인한다.

### 테스트

**테스트를 먼저 고치고 더해서 실패하는 것을 확인한 뒤** 구현한다.

더할 테스트:

1. 물음 `인스턴스를 바꿔도 DNS 레코드를 고치지 않으려면?`이 보이고, 시나리오 버튼보다 앞에 있다.
2. `direct-ip`에서 `공용 IP 52.123.25.11`이 보이고 `tg` 그룹 박스 안에 있다. 다른 시나리오와 `전체`에서는 보이지 않는다.
3. `record` 노드의 라벨이 `www.example.com`이다.

**고쳐도 되는 기존 단언**: 이 step이 바꾸는 사실과 정면으로 부딪치는 것만 고친다.
- `record` 라벨을 `도메인 이름`으로 단언하는 곳 → 새 라벨.
- `direct-ip`의 곁말 집합 → `public-ip` 포함.
- JSON `nodes`·`notes`·`legend`를 통째로 비교하는 단언 → 새 값.

그 밖의 단언과 테스트는 건드리지 마라.

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
   - 새 값이 `www.example.com`과 `52.123.25.11`뿐인가.
   - 캡션·`idleCaption`이 그대로인가.
   - 다른 도식과 `DiagramFrame.tsx`, step 1 산출물을 바꾸지 않았는가.
3. `phases/44-route53-visual-guides/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 `record` 노드 폭, `public-ip` 곁말 좌표, 최종 `viewBox`, 고친 기존 단언 목록, 교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **새 인스턴스의 IP나 ALB의 IP를 지어내지 마라.** 이유: 데이터에 있는 IP 예시는 하나뿐이다(ADR-038).
- **A·CNAME 같은 레코드 유형이나 TTL을 쓰지 마라.** 이유: 데이터에 없다.
- **첫 시나리오를 미리 고르거나 `전체`에서 경로를 보이지 마라.** 이유: 사용자가 고르지 않은 안이다(ADR-038).
- **`DiagramFrame.tsx`·다른 도식·`topics.json`, step 1의 산출물을 고치지 마라.**
- 위에서 허용한 것 밖의 기존 테스트를 깨뜨리거나 고치지 마라.
