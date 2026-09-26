# Step 6: comparison-tables

## 배경

VPC 주제에는 헷갈리는 짝이 여럿 있다. 게이트웨이 엔드포인트와 인터페이스 엔드포인트, NAT 인스턴스와
NAT 게이트웨이, PrivateLink·피어링·Transit Gateway, 플로우 로그와 CloudTrail. 그리고 "엘라스틱 IP를
어디에 붙이나", "S3에 보안 그룹을 붙이나" 같은 **붙이는 대상** 함정이 있다.

사용자가 가져온 HTML은 이것들을 비교표로 정리했다. 이 step은 **비교표 컴포넌트 하나**와 **표 다섯**을
만든다. 비교표는 이 앱의 새 요소이며 규칙은 UI_GUIDE 「비교표」와 ADR-037에 있다.

원본의 VPN vs Direct Connect 표는 옮기지 않는다 — `hybrid-connectivity` 주제의 내용이다(ADR-037).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**
- `docs/UI_GUIDE.md`의 **「비교표」**, 「도식」, 「색상」
- `phases/40-vpc-visuals/index.json`의 step 0~5 `summary`
- `src/types/visuals.ts` — `ComparisonTable`, `ComparisonTableRow`
- `src/data/visuals/vpc-networking.json`, `src/data/visuals.test.ts`
- `src/components/diagrams/DiagramFrame.tsx` — `figure`의 테두리·패딩·모바일 여백 클래스를 **읽기만** 한다.
  비교표 틀이 같은 클래스를 쓴다. **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 아래 표마다 적힌 근거 개념들

## 작업

### 1. 컴포넌트 — `src/components/diagrams/ComparisonTableFigure.tsx`

```ts
interface ComparisonTableFigureProps { table: ComparisonTable }
export function ComparisonTableFigure({ table }: ComparisonTableFigureProps): JSX.Element
```

- `figure`(`aria-label`=`table.label`) 안에 `table`. 틀의 클래스는 `DiagramFrame`의 `figure`와 같게 한다.
- 표 제목은 `figure` 안에 작은 글자(`text-sm`, `text-title`)로 한 줄. **헤딩 태그를 쓰지 마라** — 도식과 같은
  이유다(UI_GUIDE 「도식」: `ConceptList`가 화면에 따라 헤딩 레벨을 바꾼다).
- `thead`에 `columns`, `tbody`의 각 행은 `th scope="row"`(행 머리) + `td`들.
- `table-fixed w-full break-keep`, `text-sm`, 행 구분선 `border-disabled`. 줄무늬 배경 없음.
- **판정 칸의 `가능`/`불가`는 `font-medium`만 준다. 색을 바꾸지 마라.**
- `overflow-x-auto`로 감싸지 마라. 320px에서 넘치면 문구를 줄여서 해결한다.

### 2. 표 다섯 — JSON `tables`

문장은 아래 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). 칸은 짧게 쓴다 — 320px에서 세 열이
한 화면에 들어가야 한다.

#### `attach-targets` — 무엇을 어디에 붙이나 → `vpc-networking.s3-is-regional` 뒤

열: `붙이는 것 → 대상` · `판정` · `이유`

| 행 머리 | 판정 | 이유에 담을 사실 | 근거 |
|---|---|---|---|
| 엘라스틱 IP → NAT 게이트웨이 | 가능 | 만들 때 하나를 연결해야 출구가 생긴다 | `vpc-networking.nat-gateway-elastic-ip` |
| 엘라스틱 IP → 인터넷 게이트웨이 | 불가 | 인터넷 게이트웨이는 VPC에 연결하는 장치다 | `vpc-networking.nat-gateway-elastic-ip` |
| NAT 게이트웨이 → 프라이빗 서브넷 | 불가 | 퍼블릭 서브넷에 둔다 | `vpc-networking.nat-gateway` |
| 엔드포인트 정책 → VPC 엔드포인트 | 가능 | 어떤 주체가 어떤 리소스에 닿을지 좁힌다 | `vpc-networking.vpc-endpoint-policy` |
| 보안 그룹 → S3 | 불가 | S3는 버킷 정책이나 ACL로 막는다 | `vpc-networking.s3-is-regional` |

앵커가 `s3-is-regional`인 이유: 다섯 행의 근거 개념이 모두 이 자리까지 나왔다(개념 3·7·10·11).

#### `endpoint-types` — 게이트웨이 vs 인터페이스 엔드포인트 → `vpc-networking.endpoint-pricing` 뒤

열: (빈 머리) · `게이트웨이` · `인터페이스`. 행: `대상`, `비용`, `고를 때`.
사실: 게이트웨이는 S3·DynamoDB, 인터페이스는 그 밖의 서비스(S3도 가능) · 게이트웨이는 무료, 인터페이스는
시간당 요금이지만 NAT보다 데이터 처리 비용이 싸다 · S3 비용 효율이면 게이트웨이, 여러 종류 서비스면 인터페이스.
DynamoDB는 게이트웨이로만 닿는다.
근거: `vpc-networking.vpc-endpoint`, `vpc-networking.endpoint-pricing`.

#### `nat-instance-vs-gateway` — NAT 인스턴스 vs NAT 게이트웨이 → `vpc-networking.nat-instance` 뒤

열: (빈 머리) · `NAT 인스턴스` · `NAT 게이트웨이`. 행: `운영`, `트래픽이 몰리면`, `확장·장애 조치`.
사실: 인스턴스는 EC2로 직접 운영, 게이트웨이는 관리형 · 인스턴스는 사양에 묶여 병목이 되고 뒤의 Lambda·EC2가
간헐적으로 타임아웃 · 인스턴스로 되돌리면 확장과 장애 조치를 사람이 떠안는다.
근거: `vpc-networking.nat-instance`, `vpc-networking.nat-gateway-count-by-environment`.

S3로 가는 트래픽이면 NAT를 키우지 말고 게이트웨이 엔드포인트로 빼라는 처방은 **표에 넣지 않는다** —
세 열 규칙을 깨는 합친 칸이 필요하고, 본문이 바로 위에서 말한다.

#### `private-connectivity` — PrivateLink vs 피어링 vs Transit Gateway → `vpc-networking.privatelink-endpoint-service` 뒤

열: (빈 머리) · `열어 주는 범위` · `라우팅 테이블`. 행: `PrivateLink`, `VPC 피어링`, `Transit Gateway`.
사실: PrivateLink는 애플리케이션 하나를 열고 엔드포인트 정책으로 좁히며 라우팅 테이블을 건드리지 않는다 ·
피어링은 두 VPC 전체를 열고 VPC가 늘수록 연결과 경로가 함께 는다 · Transit Gateway는 연결을 열 뿐 앱 단위
제한 장치가 아니다.
근거: `vpc-networking.privatelink-endpoint-service`, `vpc-networking.vpc-peering`, `hybrid-connectivity.transit-gateway`.
Transit Gateway 행의 `라우팅 테이블` 칸에 근거 없는 말("허브에서 관리")을 쓰지 마라. 근거가 없으면 `—`로 둔다.

#### `flow-logs-vs-cloudtrail` — 플로우 로그 vs CloudTrail → `vpc-networking.vpc-flow-logs` 뒤

열: (빈 머리) · `플로우 로그` · `CloudTrail`. 행: `기록하는 것`, `쌓이는 곳`.
사실: 플로우 로그는 네트워크 인터페이스를 오가는 트래픽의 메타데이터(출발지·목적지·포트·허용 여부, 패킷
내용 아님), CloudTrail은 누가 어떤 API를 불렀는가 · 플로우 로그는 CloudWatch Logs 같은 로그 대상에 쌓이고
트레일에는 실리지 않는다.
근거: `vpc-networking.vpc-flow-logs`.

### 3. 매핑 — `registry.ts`

표마다 `ComparisonTableFigure`에 JSON의 표를 넘기는 작은 컴포넌트를 만들어 위 앵커 개념에 붙인다.
그 작은 컴포넌트들은 `src/components/diagrams/vpcTables.tsx` 한 파일에 둔다. 앵커 다섯 가운데 이미 도식이
붙은 개념은 없으므로 모두 단일 값으로 더한다.

### 4. 테스트 — `ComparisonTableFigure.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. `figure`의 접근성 이름이 `table.label`이다. 헤딩 태그가 없다.
2. 열 머리 수가 `columns.length`, 각 행에 `th scope="row"` 하나와 `td` `columns.length - 1`개.
3. 다섯 표 각각이 앵커 개념의 `ConceptList` 렌더 결과에 나온다.
4. `가능`/`불가` 칸의 클래스에 색 유틸리티(`text-green`·`text-red`·`text-correct`·`text-wrong` 등 정답/오답
   토큰)가 없다. 프로젝트의 실제 정답/오답 토큰 이름은 `tailwind.config`에서 확인해 단언에 쓴다.
5. `overflow-x-auto`가 없다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 모든 표가 세 열 이하인가(데이터 테스트가 잡는다), 판정에 색이 없는가, 근거 밖 문장이 없는가.
3. `phases/40-vpc-visuals/index.json`의 step 6을 갱신한다.
   - 성공 → `"summary"`: 표 다섯의 id와 앵커, 가장 긴 칸의 글자 수, 판정 표시 방식.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **VPN vs Direct Connect 표를 만들지 마라.** 이유: `hybrid-connectivity` 주제의 내용이다(ADR-037).
- **네 열 이상, 합친 칸(`colSpan`)을 쓰지 마라.** 이유: 320px에서 가로 넘침이 생긴다(UI_GUIDE 「비교표」).
- **판정을 초록·빨강·아이콘으로 표시하지 마라.** 이유: ADR-036.
- **표 문구에 근거 개념이 말하지 않는 사실을 쓰지 마라**("수 주", "라우팅 테이블의 대상", "허브에서 관리" 등).
- **`DiagramFrame.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
