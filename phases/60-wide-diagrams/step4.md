# Step 4: vpc-paths-wide

## 배경

화면 폭 768px 이상에서 도식을 가로형으로 그린다(ADR-047). 이 step은 시범의 마지막이자 가장 긴 VPC 통신 경로 도식(`VpcPathsDiagram`, 세로 1120,
노드 19·경로 22·시나리오 11)에 가로형을 더한다. step 2·3이 세운 패턴을 그대로 따른다.

가로형은 위에서 아래로 이렇게 놓는다.

1. 리전 밖: 인터넷(인터넷 게이트웨이 바로 위), 온프레미스(가상 프라이빗 게이트웨이 바로 위)
2. VPC 윗줄: 인터넷 게이트웨이, 가상 프라이빗 게이트웨이
3. VPC 가운데: 퍼블릭 서브넷(ALB 오른쪽 위, NAT 게이트웨이 왼쪽 아래)과 프라이빗 서브넷(EC2·RDS / Lambda ENI·EFS 탑재 대상)을 나란히
4. VPC 아랫줄: S3 게이트웨이 엔드포인트(서브넷 밖), 엔드포인트용 프라이빗 서브넷(PrivateLink 엔드포인트 위, 인터페이스 엔드포인트 아래)
5. VPC 밖·리전 안: AWS 관리 영역(S3는 게이트웨이 엔드포인트 바로 아래, Lambda 실행 환경, CloudWatch Logs는 인터페이스 엔드포인트 아래)
6. 맨 아래: VPC 피어링, 다른 VPC(다른 VPC의 앱), Transit Gateway

EC2에서 나가는 경로 여섯 갈래(NAT·세 엔드포인트·피어링·Transit Gateway)와 Lambda 실행 환경 → Lambda ENI는 **두 서브넷 사이 통로(x 210)**를
함께 쓴다. 피어링은 왼쪽 바깥 통로(x 8), Transit Gateway와 PrivateLink → 다른 VPC의 앱은 오른쪽 바깥 통로(x 432)를 쓴다. 같은 시나리오 안에서는
경로끼리 겹치지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037, ADR-047**
- `docs/UI_GUIDE.md`의 「도식」 전체, 특히 **「넓은 화면의 가로형 (ADR-047)」**
- `phases/60-wide-diagrams/index.json`의 step 0~3 `summary`
- `src/hooks/useWideDiagram.ts`
- `src/components/diagrams/EventBridgeRoutingDiagram.tsx`와 그 테스트: **step 3의 가로형 선례(경로가 있는 도식). 상수 이름·배치를 고르는
  자리·테스트 묶음 방식을 맞춰라.** `VpcDestinationDiagram.tsx`도 함께 본다.
- `src/components/diagrams/VpcPathsDiagram.tsx`, `src/components/diagrams/VpcPathsDiagram.test.tsx`: 고칠 파일
- `src/data/visuals/vpc-networking.json`의 `diagrams["vpc-paths"]`: 노드·그룹 라벨과 시나리오 문구. **고치지 마라.**
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`

## 작업

### 컴포넌트

- `useWideDiagram()`이 `false`면 **지금의 세로형을 한 글자도 바꾸지 않고** 그린다. 기존 테스트가 손대지 않고 통과해야 한다.
- 가로형 좌표는 `wideNodes`·`widePaths`·`wideGroups` 상수로 둔다.
  - `wideNodes`는 `{ id: '…', x: N, y: N, width: N }` 한 줄씩 **열아홉 줄을 그대로 적는다.** 색은 세로형 `nodes`에서, 라벨은 지금처럼
    JSON(`text.nodes`)에서 가져온다.
  - `widePaths`는 `'id': 'M…'` 한 줄씩 **스물두 줄을 그대로 적는다.** 키 집합은 세로형 `paths`와 같다.
  - 반복문이나 계산으로 만들지 마라 — 교차 검사기가 이 줄들을 글자로 읽는다.
- 그룹 라벨 글은 지금처럼 `text.groups`에서 가져온다. 프라이빗 서브넷 박스는 세로형처럼 둘이고 둘 다 `data-group="private"`다.
- 가로형 래퍼 `div`의 클래스는 `w-full` 하나다. SVG의 `className`·`role`·`aria-label`, 화살표 마커(`useId`), 경로의 굵기·색·`markerEnd`,
  노드 높이(32)·글자 자리, 그룹 박스의 `rx`와 점선은 세로형과 같다(리전·VPC·다른 VPC는 `rx` 6·점선 `6 4`, 서브넷은 `rx` 4·점선 `2 3`,
  AWS 관리 영역은 `rx` 4·실선).
- `vpcPathScenarios`(내보낸 시나리오)·캡션·범례·접근성 이름은 두 배치가 함께 쓴다. 고른 시나리오는 배치가 바뀌어도 유지된다.

### 가로형 좌표 (출발점)

설계 때 경계·라벨 폭(어림값과 Chrome 실측)·경로 교차·그룹 라벨 침범·같은 시나리오 안의 경로 겹침·그룹 소속을 스크립트로 맞추고,
열한 시나리오를 브라우저에서 눌러 본 값이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.

`viewBox`는 `0 0 440 640`이다.

**그룹 박스**(`wideGroups`, 이 순서로 그린다 — 세로형의 DOM 순서와 같다. 라벨은 크기 9·`fill-muted`):

| id | 라벨 | 박스 x, y, 폭, 높이 | 점선 | 라벨 자리 x, y |
|---|---|---|---|---|
| `region` | 리전 | 4, 60, 432, 568 | `6 4` | 14, 74 |
| `managed` | AWS 관리 영역 | 12, 452, 380, 70 | 없음 | 24, 466 |
| `vpc` | VPC | 12, 82, 416, 354 | `6 4` | 24, 98 |
| `public` | 퍼블릭 서브넷 | 20, 160, 184, 118 | `2 3` | 28, 174 |
| `private` | 프라이빗 서브넷 | 216, 160, 204, 118 | `2 3` | 224, 174 |
| `private` | 프라이빗 서브넷 | 224, 294, 196, 118 | `2 3` | 232, 308 |
| `other-vpc` | 다른 VPC | 116, 546, 112, 70 | `6 4` | 124, 560 |

**노드**(`wideNodes`, 높이 32):

| id | 라벨 | x, y, 폭 |
|---|---|---|
| `internet` | 인터넷 | 80, 12, 108 |
| `onprem` | 온프레미스 | 316, 12, 80 |
| `igw` | 인터넷 게이트웨이 | 80, 108, 108 |
| `vgw` | 가상 프라이빗 게이트웨이 | 280, 108, 140 |
| `alb` | ALB | 140, 186, 56 |
| `nat` | NAT 게이트웨이 | 28, 234, 96 |
| `ec2` | EC2 | 232, 186, 56 |
| `rds` | RDS | 328, 186, 56 |
| `eni` | Lambda ENI | 232, 234, 80 |
| `efs` | EFS 탑재 대상 | 324, 234, 88 |
| `endpoint` | S3 게이트웨이 엔드포인트 | 20, 320, 144 |
| `pl-endpoint` | PrivateLink 엔드포인트 | 232, 320, 136 |
| `interface-endpoint` | 인터페이스 엔드포인트 | 232, 368, 128 |
| `s3` | S3 | 100, 478, 48 |
| `lambda` | Lambda 실행 환경 | 160, 478, 104 |
| `logs` | CloudWatch Logs | 276, 478, 108 |
| `peering` | VPC 피어링 | 20, 572, 80 |
| `other-app` | 다른 VPC의 앱 | 124, 572, 96 |
| `tgw` | Transit Gateway | 244, 572, 108 |

`가상 프라이빗 게이트웨이`는 어림값 121 + 여백 12 = 133이라 폭이 140이다.

**경로**(`widePaths`, 직교 M/H/V만):

| id | `d` |
|---|---|
| `internet-igw` | `M134 44 V108` |
| `igw-alb` | `M168 140 V186` |
| `alb-ec2` | `M196 202 H232` |
| `lambda-eni` | `M210 478 V250 H232` |
| `eni-ec2` | `M260 234 V218` |
| `ec2-nat` | `M232 210 H210 V250 H124` |
| `nat-igw` | `M100 234 V140` |
| `igw-internet` | `M134 108 V44` |
| `ec2-endpoint` | `M232 210 H210 V336 H164` |
| `endpoint-s3` | `M124 352 V478` |
| `lambda-logs` | `M264 494 H276` |
| `eni-efs` | `M312 250 H324` |
| `onprem-vgw` | `M356 44 V108` |
| `vgw-rds` | `M356 140 V186` |
| `ec2-interface-endpoint` | `M232 210 H210 V384 H232` |
| `interface-endpoint-logs` | `M320 400 V478` |
| `ec2-pl-endpoint` | `M232 210 H210 V336 H232` |
| `pl-endpoint-other-app` | `M368 336 H432 V538 H200 V572` |
| `ec2-peering` | `M232 210 H210 V424 H8 V588 H20` |
| `peering-other-app` | `M100 588 H124` |
| `ec2-tgw` | `M232 210 H210 V424 H432 V588 H352` |
| `tgw-other-app` | `M244 588 H220` |

### 테스트: `VpcPathsDiagram.test.tsx`

**가로형 테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다. 기존 테스트는 고치지 않는다. step 2·3처럼 `describe('가로형 (768px 이상)', …)`
하나로 묶고 그 안에서만 `matchMedia`를 모의한다.

1. `viewBox`가 `0 0 440 640`이고, 래퍼에 `w-full`이 있으며 `max-w-[380px]`·`-mx-4`가 없다.
2. 노드 id 집합이 세로형과 같다(19개). 열한 시나리오를 차례로 골랐을 때 나타나는 경로 id의 합집합이 세로형의 22개와 같다.
3. 모든 `rect`가 `boxesOutsideViewBox(…, [0, 0, 440, 640])`로 안에 있다.
4. 축약하지 않은 라벨 19개가 `estimateTextWidth(라벨, 10) + 12 <= 폭`이다. 그룹 라벨 일곱이 `라벨 x + estimateTextWidth(라벨, 9)` ≤ 자기 박스
   오른쪽 끝이다.
5. 기존 「`%s`는 지정한 노드와 방향의 경로만 표시한다」의 열한 경우를 가로형에서도 같은 기대값으로 통과한다.
6. 소속이 세로형과 같다(기존 「S3는 리전 안·VPC 밖에 있고…」와 「새 엔드포인트는…」의 가로형판).
   - `managed` 안: `lambda`, `logs`, `s3`. `vpc` 안: `igw`, `vgw`, `endpoint`. `public` 안: `alb`, `nat`. 첫 `private` 안: `eni`, `ec2`, `efs`, `rds`.
   - `interface-endpoint`·`pl-endpoint`는 어느 `private` 박스 안에 있고 `vpc` 안에 있으며 청록(`stroke-diagram-resource`)이다.
   - `endpoint`는 어느 `private` 박스 안에도 없다.
   - `region` 안: `managed`, `vpc`, `public`, 두 `private`, `peering`, `tgw`, `other-vpc`. `other-app`은 `other-vpc` 안이고 청록이다.
   - `peering`·`tgw`·`other-vpc`·`s3`는 `vpc` 박스와 **겹치지 않는다.** (세로형의 「VPC보다 아래」·「VPC보다 위」는 가로형에서 「겹치지 않는다」로
     바꾼다 — ADR-047 배치 원칙.) `peering`·`tgw`는 회색(`stroke-disabled`)이다.
   - `internet`·`onprem`은 `region` 박스보다 위에 있다. `other-vpc`의 점선이 `vpc`와 같다.
7. 피어링과 Transit Gateway가 서로 다른 쪽 통로를 쓴다. `VPC ⇄ VPC 피어링`의 경로 꼭짓점 가운데 VPC 박스 아래 끝보다 아래인 것들의 최대 x가,
   `Transit Gateway`의 같은 꼭짓점들의 최소 x보다 작다.
8. 같은 시나리오 안의 경로끼리 같은 직선 위에서 길이를 갖고 겹치지 않는다. 열한 시나리오를 차례로 골라, 보이는 경로들의 선분을 짝지어 검사한다.
   선분을 펴는 방법은 `SnsFanoutDiagram.test.tsx`의 `segments`를 본다.
9. **폭이 바뀌어도 선택이 유지된다.** 세로형으로 렌더해 `Transit Gateway`를 고른 뒤 `matches: true`로 바꾸면(`act`) `viewBox` 폭이 440이 되고,
   그 버튼이 여전히 눌려 있으며 `ec2-tgw`·`tgw-other-app` 두 경로가 보이고 캡션이 그대로다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 48개·경로 37개'
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff`에서 세로형 좌표·클래스·DOM 구조가 바뀌지 않았는가. 기존 `it`이 그대로인가.
   - 바뀐 파일이 `VpcPathsDiagram.tsx`, `VpcPathsDiagram.test.tsx`, `phases/60-wide-diagrams/index.json`뿐인가.
   - 캡션·라벨·범례가 JSON 그대로인가(`vpc-networking.json` 무변경).
3. `phases/60-wide-diagrams/index.json`의 step 4를 갱신한다.
   - 성공 → `"summary"`에 가로형 `viewBox`, 출발점에서 바꾼 좌표(없으면 없다고), 교차 검사 통과 줄, 새 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **세로형을 고치지 마라.** 이유: 768px 미만의 화면은 지금 그대로여야 한다(ADR-047).
- **SVG 두 개를 겹쳐 두고 CSS로 하나를 숨기지 마라.** 이유: ADR-047 「대안」.
- **기준 폭 문자열을 이 파일에 쓰지 마라.** 이유: 판정은 `useWideDiagram()` 한 곳에 둔다.
- **노드를 더하거나 빼지 마라. JSON 문구·시나리오·색을 바꾸지 마라.** 이유: 이 phase는 배치만 바꾼다.
- **S3를 VPC 안에, 피어링·Transit Gateway를 VPC 안에 두지 마라.** 이유: 세로형과 같은 소속이 이 도식이 가르치는 내용이다(S3에는 VPC·서브넷
  배치가 없다는 캡션, ADR-037).
- **흐르는 점 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ConceptList.tsx`·`registry.ts`·다른 도식을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
