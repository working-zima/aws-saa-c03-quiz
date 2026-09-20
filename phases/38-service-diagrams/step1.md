# Step 1: vpc-paths

## 배경

`vpc-networking` 주제의 개념 20개는 전부 "무엇이 어떤 경로로 무엇에 닿는가"다.
인터넷 게이트웨이·NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링이 각각 어디에 붙고
무엇을 지나는지가 본체인데, 지금은 그 배치를 학습자가 글만 읽고 머릿속에 세워야 한다.

**이 step은 phase 38의 관문이다.** 다섯 장 중 노드가 가장 많은 도식을 먼저 그려,
좁은 화면 규약이 실제로 성립하는지 여기서 판정한다. 여기서 규약이 깨지면 step 2~5는
그리기 전에 다시 짠다. 그래서 이 step의 `summary`에는 **실측값을 남겨야 한다**(아래 「기록」).

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md` — 껍데기 규약. 특히 색 규칙과 금지사항.
- `src/components/diagrams/DiagramFrame.tsx` — step 0이 만든 껍데기.
- `src/lib/svg-bounds.ts` — `boxesOutsideViewBox`, `estimateTextWidth`.
- `docs/UI_GUIDE.md` — 「레이아웃」의 '모바일'(기준 폭 320px), 「색상」, 「AI 슬롭 안티패턴」.
- `src/data/topics.json`의 **아래 개념들.** 도식에 담는 사실은 전부 여기서 나온다.

## 자리

- 컴포넌트: `src/components/diagrams/VpcPathsDiagram.tsx`
- 매핑: `registry.ts`에 `'vpc-networking.comparison': VpcPathsDiagram` 한 줄.

앵커가 `comparison`(NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링)인 이유:
주제를 정리하는 개념이라 그 자리까지 읽고 나면 도식의 노드 이름이 전부 아는 말이 된다.
주제 맨 앞에 두면 처음 보는 이름 열몇 개가 한꺼번에 쏟아진다.

## 좁은 화면 규약 — 이 step이 정하고 step 2~5가 따른다

- **`viewBox`의 폭은 280이다.** 근거: UI_GUIDE의 모바일 기준 폭이 320px이고
  `Layout`의 `main`이 `px-5`(좌우 20px씩)를 물고 있으므로 본문 폭이 280px이다.
  이 값이면 320px 화면에서 도식이 **1:1**로 그려진다.
- **세로(`viewBox` 높이)는 필요한 만큼 늘려라.** 이 앱은 세로 스크롤만 있는 앱이다.
  세로로 길어지는 것은 허용이고, 가로로 넘치는 것은 버그다.
- SVG를 감싸는 요소는 **`w-full max-w-[380px]`**. `mx-auto`를 붙이지 마라 —
  UI_GUIDE 「레이아웃」이 본문 좌측 정렬을 규정한다. 상한 380px을 두는 이유는,
  본문이 `max-w-2xl`(672px)이라 상한이 없으면 데스크톱에서 2.4배로 확대돼
  글자만 커진 그림이 되기 때문이다.
- 글자 크기는 **노드 라벨 10, 그룹 라벨 9**(viewBox 단위). 380px 폭에서 각각 13.6px·12.2px이다.
- **라벨을 줄이지 마라.** 라벨이 노드 폭에 안 들어가면 노드를 넓혀라. 필요하면 그 노드를
  한 줄 전체 폭으로 펴라. 개념 이름을 축약하거나 영문 약어로 바꾸지 마라 —
  본문에 쓰인 말과 도식에 쓰인 말이 달라지면 도식이 본문을 가리키지 못한다.
- **가로 2열이 기본, 긴 라벨은 1열.** 280 폭에 중첩 박스 여백을 빼면 안쪽 폭이 230 남짓이라
  2열은 열당 105~110이다. 한글 10자가 넘는 라벨은 2열에 들어가지 않는다.

## 도식 내용

예시로 받은 `aws_connection_paths_explorer.html`과 같은 구조를 **세로로 다시 배치한 것**이다.
그 파일을 참고 자료로 열지 말고, 아래 명세와 `topics.json`의 개념 본문만 보고 그려라.

### 그룹(바깥부터)

1. `인터넷` · `온프레미스` — 리전 박스 **바깥**, 맨 위.
2. `리전` 박스 — 점선 테두리. 그 안에 다시 `AWS 관리 영역` 라벨을 단 영역.
3. `VPC` 박스 — 리전 안. 점선 테두리.
4. `퍼블릭 서브넷` / `프라이빗 서브넷` 박스 — VPC 안. 더 촘촘한 점선.

### 노드 (`id`는 아래 그대로 쓴다)

| id | 라벨 | 자리 | 색 |
|---|---|---|---|
| `internet` | 인터넷 | 리전 밖 | 무채색(`disabled` 테두리) |
| `onprem` | 온프레미스 | 리전 밖 | 무채색 |
| `lambda` | Lambda 실행 환경 | AWS 관리 영역 | `diagram-managed` |
| `logs` | CloudWatch Logs | AWS 관리 영역 | `diagram-managed` |
| `s3` | S3 | AWS 관리 영역 | `diagram-managed` |
| `igw` | 인터넷 게이트웨이 | VPC, 서브넷 밖 | 무채색 |
| `vgw` | 가상 프라이빗 게이트웨이 | VPC, 서브넷 밖 | 무채색 |
| `alb` | ALB | 퍼블릭 서브넷 | `diagram-resource` |
| `nat` | NAT 게이트웨이 | 퍼블릭 서브넷 | `diagram-resource` |
| `eni` | Lambda ENI | 프라이빗 서브넷 | `diagram-resource` |
| `ec2` | EC2 | 프라이빗 서브넷 | `diagram-resource` |
| `efs` | EFS 탑재 대상 | 프라이빗 서브넷 | `diagram-resource` |
| `rds` | RDS | 프라이빗 서브넷 | `diagram-resource` |
| `endpoint` | S3 게이트웨이 엔드포인트 | VPC, 서브넷 밖 | 무채색 |

`S3`가 **리전 박스 안이되 VPC 박스 밖**인 것이 이 도식의 핵심 한 수다.
근거는 `vpc-networking.s3-is-regional`("S3는 VPC나 서브넷 안에 만들 수 없고, 보안 그룹도 쓰지 않는다").

### 시나리오 일곱

각 시나리오의 `caption`은 **아래 개념 본문의 사실에서 네가 직접 써라.** 본문 문장을
그대로 옮기지 마라(CLAUDE.md 「원본 데이터」). 두 줄을 넘기지 마라.

| id | label | 경로 | 근거 개념 id |
|---|---|---|---|
| `s1` | 사용자 → EC2 | internet → igw → alb → ec2 | `vpc-networking.internet-gateway`, `vpc-networking.vpc-subnet`, `elastic-load-balancing.elb` |
| `s2` | Lambda → EC2 | lambda → eni → ec2 | `lambda.lambda-vpc-access`, `security-groups-nacl.security-group-referencing` |
| `s3` | 프라이빗 → 인터넷 | ec2 → nat → igw → internet | `vpc-networking.nat-gateway`, `vpc-networking.nat-gateway-elastic-ip`, `vpc-networking.nat-gateway-traffic-uses-public-endpoints` |
| `s4` | VPC → S3 | ec2 → endpoint → s3 | `vpc-networking.vpc-endpoint`, `vpc-networking.endpoint-pricing`, `vpc-networking.s3-is-regional` |
| `s5` | Lambda → 로그 | lambda → logs | `lambda.lambda-execution-role-logs` |
| `s6` | Lambda → EFS | lambda → eni → efs | `lambda.lambda-efs-mount` |
| `s7` | 온프레미스 → VPC | onprem → vgw → rds | `hybrid-connectivity.site-to-site-vpn`, `hybrid-connectivity.virtual-private-gateway` |

`s5`는 노드 둘이 모두 AWS 관리 영역에 있어 VPC 박스 밖에서 끝나는 유일한 시나리오다. 빼지 마라.

> **2026-09-20 정정(step 7).** 이 자리에 원래 "VPC를 하나도 지나지 않는 경로라서"라고 적혀
> 있었다. `lambda.lambda-execution-role-logs` 본문에 그런 말이 없으므로 근거 없는 주장이었다.
> 배치는 그대로 두고, 캡션에는 그 개념이 실제로 말하는 것만 쓴다. step 7이 캡션을 고쳤다.

범례: 색 두 가지와 무채색이 각각 무엇인지 한 줄. 위치로도 읽히므로 범례는 거들 뿐이다.

## 강조 방식

- 시나리오를 고르면 **그 시나리오의 `nodes`에 없는 노드는 흐려지고**(opacity 0.25),
  `paths`에 있는 경로만 보인다. 고르지 않았을 때는 모든 노드가 선명하고 경로는 전부 숨는다.
- 경로는 `title`(#fafafa) 색 2px 선에 화살표 마커. 색으로 경로를 구분하지 마라 —
  한 번에 한 시나리오만 보이므로 구분할 것이 없다.
- 그룹 박스(리전·VPC·서브넷)는 **흐려지지 않는다.** 지도의 틀이기 때문이다.
- `transition-colors` 외의 애니메이션을 넣지 마라. opacity 전환도 넣지 마라.

## 테스트

`src/components/diagrams/VpcPathsDiagram.test.tsx`를 **먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 시나리오를 고르지 않으면 노드 14개가 모두 흐려지지 않은 상태다.
2. `프라이빗 → 인터넷`을 누르면 `ec2`·`nat`·`igw`·`internet`만 선명하고 나머지는 흐리다.
3. 같은 버튼을 누른 뒤 캡션이 그 시나리오의 설명으로 바뀐다.
4. `전체`를 누르면 흐린 노드가 하나도 없고 보이는 경로도 없다.
5. **경계**: 렌더한 SVG의 모든 `rect`에서 `x`/`y`/`width`/`height`를 긁어
   `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`가 빈 배열이다.
6. **글자 넘침**: 노드 14개 각각에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`이다.
7. `viewBox`의 폭이 정확히 `280`이다. (step 2~5가 따를 규약의 회귀 테스트다.)

5·6·7이 이 step의 관문 검사다. **통과하지 못하면 노드를 넓히거나 세로로 펴서 다시 배치해라.**
글자 크기를 10 밑으로 내리거나 라벨을 줄여서 통과시키지 마라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 기록 — `summary`에 반드시 넣는다

step 2~5가 같은 규약으로 그리려면 이 step의 실측이 필요하다. `index.json`의 `summary`에
아래를 한 줄로 적어라.

- 최종 `viewBox` (`0 0 280 <높이>`)
- 노드 14개 중 **가장 긴 라벨**과 그 `estimateTextWidth(라벨, 10)` 값, 그 노드에 준 폭
- 2열로 배치한 노드 수와 1열 전체 폭으로 편 노드 수
- 관문 검사 5·6·7의 통과 여부

## 금지사항

- **`registry.ts`에 두 줄 이상 더하지 마라.** 이 step의 도식은 하나다.
- **다른 도식을 만들지 마라.** step 2~5의 범위다.
- **`DiagramFrame.tsx`를 고치지 마라.** 껍데기가 모자라면 고치지 말고, 무엇이 모자랐는지를
  `summary`에 적어라. 다섯 장이 공유하는 파일이므로 step 1이 혼자 바꾸면 규약이 흔들린다.
- **`src/data/` 아래 JSON을 고치지 마라.** 도식과 개념 본문이 어긋나 보이면 본문을 고치지 말고
  `summary`에 적어라. 본문 수정은 이 phase의 범위가 아니다.
- **개념 본문 문장을 도식이나 캡션에 그대로 옮기지 마라.** 사실만 가져오고 문장은 직접 쓴다.
- **없는 사실을 그리지 마라.** 위 표에 근거 개념 id가 없는 노드나 경로를 더하지 마라.
  예: Transit Gateway·PrivateLink·피어링은 이 도식에 넣지 마라 — 한 장에 다 넣으면
  280 폭에서 읽을 수 없고, 앵커 개념이 그 넷을 글로 비교하고 있다.
- 기존 테스트를 깨뜨리지 마라.
