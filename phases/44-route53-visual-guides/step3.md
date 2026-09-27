# Step 3: hybrid-dns-examples

## 배경

`Route53HybridDnsDiagram`(phase 43)은 Resolver의 아웃바운드와 인바운드, 전달 규칙, 프라이빗 호스팅 영역을 한 그림에 모은다.
본문의 예시 이름 `db.corp.local`(사내 이름)과 `app.internal.aws`(VPC 전용 이름)는 지금 각 시나리오에서만 보인다. 그래서 `전체`로
처음 보면 상자가 무엇을 찾는지 알 수 없다(사용자 지적, 2026-09-27). 이 step은 두 가지를 더한다(ADR-038).

1. **물음형 제목**: `VPC와 사내망은 서로의 이름을 어떻게 찾을까?`
2. **예시 이름을 늘 보이게 한다.** `db.corp.local`은 사내 DNS 서버 곁에, `app.internal.aws`는 프라이빗 호스팅 영역 곁에 둔다.
   근거는 `route53.resolver`다.

사용자 결정: 예시는 **데이터에 있는 것만** 쓴다. 새 이름을 지어내지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037(phase 43 확장), ADR-038**
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**(특히 「물음형 제목과 예시」)
- `phases/44-route53-visual-guides/index.json`의 step 0~2 `summary`
- `src/components/diagrams/DiagramFrame.tsx`: `question` prop
- `src/components/diagrams/Route53HealthDiagram.tsx`: step 1에서 예시 곁말이 늘 보이게 처리한 방식. 같은 방식을 따른다.
- `src/components/diagrams/Route53HybridDnsDiagram.tsx`, `src/components/diagrams/Route53HybridDnsDiagram.test.tsx`
- `src/data/visuals/route53.json`의 `diagrams["hybrid-dns"]`
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `route53.resolver`

## 작업

### JSON `diagrams["hybrid-dns"]`

- `question`: `VPC와 사내망은 서로의 이름을 어떻게 찾을까?`
- `nodes`·`notes`의 문구는 바꾸지 않는다. `corp-domain`(`db.corp.local`)과 `aws-domain`(`app.internal.aws`)은 이미 있다.
- 캡션·`idleCaption`·`legend`·`sources`는 바꾸지 않는다.

### 컴포넌트

- `DiagramFrame`에 `question`을 넘긴다.
- `corp-domain`과 `aws-domain`을 **예시 곁말**로 바꾼다. `전체`를 포함해 **늘 보이고**, 각자 붙은 노드의 opacity를 따른다.
  `corp-domain`은 `onprem-dns`를, `aws-domain`은 `phz`를 따른다. 예를 들어 `인바운드`에서는 `onprem-dns`가 흐리므로 `db.corp.local`도
  함께 흐리다.
- 자리는 지금 자리를 유지한다. 늘 보이게 되면서 다른 곁말(`rule`, `rule-vpc-a`, `rule-vpc-b`, `vpc-only`)이나 경로선과 겹치면 옮긴다.
  특히 `phz` 시나리오에서 `vpc-only`와 `aws-domain`은 둘 다 `phz` 가까이 있으므로 두 줄이 겹치지 않게 한다.
- 나머지 곁말은 지금처럼 시나리오 곁말이다.

### 테스트

**테스트를 먼저 고치고 더해서 실패하는 것을 확인한 뒤** 구현한다.

더할 테스트:

1. 물음 `VPC와 사내망은 서로의 이름을 어떻게 찾을까?`가 보이고, 시나리오 버튼보다 앞에 있다.
2. `전체`와 네 시나리오 모두에서 `db.corp.local`과 `app.internal.aws`가 보인다.
3. 예시 곁말의 opacity가 붙은 노드와 같다. `인바운드`에서 `db.corp.local`은 `0.25`, `app.internal.aws`는 `1`이다. `아웃바운드`에서는
   그 반대다.
4. `phz` 시나리오에서 `vpc-only`와 `aws-domain`의 y 좌표가 9 이상 떨어져 있다(두 줄이 겹치지 않는다).

**고쳐도 되는 기존 단언**: 이 step이 바꾸는 사실과 정면으로 부딪치는 것만 고친다.
- "곁말 없이", "전체에서는 노드만 남는다"처럼 예시 곁말이 늘 보이면 틀리게 되는 단언 → 예시 곁말 둘만 남는다는 단언으로.
- 시나리오별 곁말 집합 → 예시 곁말 둘을 포함하도록.
- 위 단언이 든 테스트의 이름을 새 동작에 맞게 바꿔도 된다.

그 밖의 단언과 테스트는 건드리지 마라. 특히 방향(아웃바운드는 위, 인바운드는 아래), 그룹 포함 관계, 정적 연결선에 관한 단언은
그대로 통과해야 한다.

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
   - 새 이름을 지어내지 않았는가.
   - 캡션·`idleCaption`·곁말 문구가 그대로인가.
   - 다른 도식과 `DiagramFrame.tsx`, step 1·2 산출물을 바꾸지 않았는가.
3. `phases/44-route53-visual-guides/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 예시 곁말 둘의 좌표(옮겼다면 전후), `phz` 시나리오에서 `vpc-only`와 `aws-domain`의 간격, 고친 기존 단언 목록,
     교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **예시 이름을 더 지어내지 마라**(예: `corp.example.com`, IP 대역). 이유: 사용자 결정은 데이터에 있는 예시만이다(ADR-038).
- **첫 시나리오를 미리 고르거나 `전체`에서 경로를 보이지 마라.** 이유: 사용자가 고르지 않은 안이다(ADR-038).
- **엔드포인트를 VPC 박스 안으로 옮기거나 VPN·Direct Connect 노드를 더하지 마라.** 이유: ADR-037 phase 43 확장.
- **`DiagramFrame.tsx`·다른 도식·`topics.json`, step 1·2의 산출물을 고치지 마라.**
- 위에서 허용한 것 밖의 기존 테스트를 깨뜨리거나 고치지 마라.
