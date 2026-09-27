# Step 3: hybrid-dns-diagram

## 배경

`route53` 주제의 하이브리드 DNS 개념 넷은 모두 **방향**을 가르는 이야기다.

- `resolver`: 방향은 AWS를 기준으로 가른다. 아웃바운드는 VPC에서 온프레미스로 향한다. EC2가 `db.corp.local` 같은 사내 이름을
  물을 때 쓴다. 인바운드는 온프레미스에서 VPC로 들어온다. 사내 서버가 `app.internal.aws` 같은 VPC 전용 이름을 물을 때 쓴다.
- `route53-resolver-forward-rule`: 아웃바운드 엔드포인트만으로는 부족하고, 어떤 도메인을 어느 DNS 서버로 넘길지 정한
  Forward 유형 규칙이 있어야 한다. 규칙은 쓰려는 VPC마다 연결한다. 엔드포인트는 하나면 여러 VPC가 함께 쓴다.
- `private-hosted-zone`: 프라이빗 호스팅 영역은 VPC 안에서만 통하는 이름을 관리한다.
- `private-hosted-zone-vpc-only`: 프라이빗 호스팅 영역은 VPC에만 연결되고 온프레미스 네트워크에는 연결되지 않는다. 그래서
  사내 DNS의 이름을 VPC에서 푸는 일은 아웃바운드 엔드포인트와 전달 규칙이 맡는다.

이 step은 네 개념을 도식 하나에 모은다. 사용자 결정(2026-09-27)은 `docs/ADR.md` ADR-037 끝의
「2026-09-27 확장 — Route 53 주제(phase 43)」에 기록돼 있다. **Resolver 엔드포인트는 특정 VPC 안이 아니라
`Route 53 Resolver` 그룹 박스에 그린다.** 엔드포인트가 어느 VPC에 놓이는지는 데이터에 없기 때문이다.

**앵커는 `route53.private-hosted-zone-vpc-only`다.** 아웃바운드·인바운드·프라이빗 호스팅 영역이 한 개념에 모두 나오고,
주제 안에서 Resolver·전달 규칙·프라이빗 호스팅 영역 개념을 다 읽은 뒤의 자리다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/43-route53-visuals/index.json`의 step 0~2 `summary`
- `src/types/visuals.ts`(`groups`, `notes`), `src/data/index.ts`
- `src/data/visuals/route53.json`: 여기에 `diagrams["hybrid-dns"]`를 더한다. 앞 step이 넣은 항목은 건드리지 마라.
- `src/components/diagrams/Route53HealthDiagram.tsx`, `src/components/diagrams/Route53AliasDiagram.tsx`: 같은 주제의 도식이다.
- `src/components/diagrams/SgNaclLayersDiagram.tsx`: 화살표 없는 "붙어 있음" 선(WAF–ALB)을 JSX에 정적으로 그린 선례
- `src/components/diagrams/HybridPathsDiagram.tsx`: 온프레미스 그룹을 그린 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드·경로 선언 형식을 지켜라.
- `src/data/topics.json`의 `route53` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/Route53HybridDnsDiagram.tsx`
- 문구: JSON `diagrams["hybrid-dns"]`
- 매핑: `registry.ts`에 `'route53.private-hosted-zone-vpc-only': Route53HybridDnsDiagram` 한 줄을 더한다.

### 모양

두 열, 네 층이다. **왼쪽 열은 나가는 방향(아웃바운드), 오른쪽 열은 들어오는 방향(인바운드)이다.**

```
┌ 온프레미스 ─────────────────────────┐
│ 사내 DNS 서버          사내 서버     │
└─────────────────────────────────────┘
        ↑                    ↓
┌ Route 53 Resolver ──────────────────┐
│ 아웃바운드 엔드포인트  인바운드 엔드포인트 │
└─────────────────────────────────────┘
        ↑                    ↓
┌ VPC A ───────┐   │   ┌ VPC B ───────┐
│ EC2          │   │   │ EC2          │
└──────────────┘   │   └──────────────┘
       ╎           ↓          ╎
   프라이빗 호스팅 영역 (한 줄 전체 폭)
```

- `ec2-b`에서 아웃바운드 엔드포인트로 가는 경로는 Resolver 그룹과 VPC 줄 **사이의 통로**로 왼쪽 열까지 건너간 뒤 올라간다.
  마지막 구간이 `ec2-a`의 경로와 겹쳐도 된다.
- 인바운드 엔드포인트에서 프라이빗 호스팅 영역으로 가는 경로는 **VPC A와 VPC B 사이의 가운데 통로**로 내려간다.
- `phz`와 두 VPC 그룹을 잇는 선(그림의 `╎`)은 화살표가 없는 짧은 세로선이다. 요청 경로가 아니라 "이 VPC에 연결됨"이라는
  표시이므로 `paths` 맵에 넣지 말고 JSX에 정적으로 그린다. 선은 `stroke-disabled`, 굵기 1이고, `phz` 노드와 같은 opacity를 따른다.
- 라벨이 들어가지 않으면 노드를 넓힌다. 글자 크기를 줄이거나 `EP` 같은 약어로 바꾸지 마라(UI_GUIDE).
  예: `아웃바운드 엔드포인트`는 `estimateTextWidth` 기준 폭 118 이상이 필요하다.

**노드**(`const nodes = [...]`, 높이 32):

| id | 라벨 | 색 | 자리 |
|---|---|---|---|
| `onprem-dns` | 사내 DNS 서버 | `stroke-disabled` | `onprem` 그룹 안, 왼쪽 |
| `onprem-server` | 사내 서버 | `stroke-disabled` | `onprem` 그룹 안, 오른쪽 |
| `outbound` | 아웃바운드 엔드포인트 | `stroke-diagram-managed` | `resolver` 그룹 안, 왼쪽 |
| `inbound` | 인바운드 엔드포인트 | `stroke-diagram-managed` | `resolver` 그룹 안, 오른쪽 |
| `ec2-a` | EC2 | `stroke-diagram-resource` | `vpc-a` 그룹 안 |
| `ec2-b` | EC2 | `stroke-diagram-resource` | `vpc-b` 그룹 안 |
| `phz` | 프라이빗 호스팅 영역 | `stroke-diagram-managed` | 모든 그룹 밖, 맨 아래 |

**그룹 박스**(흐려지지 않는다):

| id | 라벨 | 선 색 |
|---|---|---|
| `onprem` | 온프레미스 | `stroke-disabled` |
| `resolver` | Route 53 Resolver | `stroke-diagram-managed` |
| `vpc-a` | VPC A | `stroke-diagram-resource` |
| `vpc-b` | VPC B | `stroke-diagram-resource` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리 | 보이는 시나리오 |
|---|---|---|---|
| `corp-domain` | db.corp.local | `onprem-dns` 가까이 | `outbound` |
| `aws-domain` | app.internal.aws | `phz` 가까이 | `inbound` |
| `rule` | 전달 규칙 | `outbound` 가까이 | `outbound`, `forward-rule` |
| `rule-vpc-a` | 규칙 연결 | `vpc-a` 그룹 라벨 옆 | `forward-rule` |
| `rule-vpc-b` | 규칙 연결 | `vpc-b` 그룹 라벨 옆 | `forward-rule` |
| `vpc-only` | 온프레미스에는 연결 불가 | `phz` 가까이 | `phz` |

**경로**(`paths` 맵, 직교 M/H/V만):

| id | 구간 |
|---|---|
| `ec2-a-outbound` | VPC A의 EC2 → 아웃바운드 엔드포인트 |
| `ec2-b-outbound` | VPC B의 EC2 → 아웃바운드 엔드포인트 (행 사이 통로로 건너감) |
| `outbound-onprem-dns` | 아웃바운드 엔드포인트 → 사내 DNS 서버 |
| `onprem-server-inbound` | 사내 서버 → 인바운드 엔드포인트 |
| `inbound-phz` | 인바운드 엔드포인트 → 프라이빗 호스팅 영역 (가운데 통로) |

어느 경로도 다른 노드 상자를 뚫지 않게 한다(교차 검사가 확인한다).

### 시나리오 넷

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|---|---|
| `outbound` | 아웃바운드 | `ec2-a`, `outbound`, `onprem-dns` | `ec2-a-outbound`, `outbound-onprem-dns` | `corp-domain`, `rule` | VPC의 EC2가 사내 전용 이름을 물으면 아웃바운드 엔드포인트가 전달 규칙에 따라 사내 DNS로 넘긴다 | `route53.resolver`, `route53.route53-resolver-forward-rule` |
| `inbound` | 인바운드 | `onprem-server`, `inbound`, `phz` | `onprem-server-inbound`, `inbound-phz` | `aws-domain` | 사내 서버가 VPC 전용 이름을 물을 때는 인바운드 엔드포인트로 들어온다 · 방향은 AWS 기준이다 | `route53.resolver`, `route53.private-hosted-zone-vpc-only` |
| `forward-rule` | 규칙 공유 | `ec2-a`, `ec2-b`, `outbound`, `onprem-dns` | `ec2-a-outbound`, `ec2-b-outbound`, `outbound-onprem-dns` | `rule`, `rule-vpc-a`, `rule-vpc-b` | 아웃바운드 엔드포인트는 하나면 되고, 전달 규칙을 쓰려는 VPC마다 연결한다 | `route53.route53-resolver-forward-rule` |
| `phz` | 프라이빗 호스팅 영역 | `phz`, `ec2-a`, `ec2-b` | 없음 | `vpc-only` | 프라이빗 호스팅 영역은 VPC에만 연결되어 사내 DNS의 이름을 풀지 못한다 · 그 일은 아웃바운드 엔드포인트가 맡는다 | `route53.private-hosted-zone`, `route53.private-hosted-zone-vpc-only` |

- 캡션은 위 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **50자 안팎으로** 쓰고, 사실이 다 들어가지 않으면 앞의
  사실을 남긴다.
- `idleCaption`: 시나리오를 고르면 이름 질의가 어느 방향으로 어느 엔드포인트를 지나는지 볼 수 있다는 안내 한 문장.
- 도식의 `sources`: `route53.resolver`, `route53.route53-resolver-forward-rule`, `route53.private-hosted-zone`,
  `route53.private-hosted-zone-vpc-only`.
- `legend`: 파랑·청록·회색이 각각 무엇인지 한 줄로 쓴다. 파랑은 Route 53의 기능(Resolver 엔드포인트·호스팅 영역), 청록은 VPC와
  그 안의 리소스, 회색은 온프레미스다.
- `label`: `하이브리드 DNS 방향 도식`, `svgLabel`: `Route 53 Resolver 인바운드와 아웃바운드`.

### 테스트: `Route53HybridDnsDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 처음에는 노드 일곱이 모두 선명하고, 경로와 곁말이 없다.
2. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
3. 노드마다 자기 그룹 박스 안에 있다. `onprem-dns`·`onprem-server`는 `onprem` 안, `outbound`·`inbound`는 `resolver` 안,
   `ec2-a`는 `vpc-a` 안, `ec2-b`는 `vpc-b` 안이다. **`outbound`·`inbound`는 `vpc-a`·`vpc-b`와 겹치지 않고, `phz`는 어느 그룹 박스와도
   겹치지 않는다.**
4. 방향을 확인한다. 아웃바운드 쪽 경로(`ec2-a-outbound`, `ec2-b-outbound`, `outbound-onprem-dns`)의 끝점은 시작점보다 위에 있고,
   인바운드 쪽 경로(`onprem-server-inbound`, `inbound-phz`)의 끝점은 시작점보다 아래에 있다.
5. `paths` 맵에 `phz`와 VPC 그룹을 잇는 경로 id가 없다. 그 연결은 화살표 없는 정적 선이다.
6. 관문 5·6·7(viewBox 안, 라벨 폭, 폭 280)을 통과한다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `route53.private-hosted-zone-vpc-only` 개념을 주면 본문 뒤에 이 도식이 온다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

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
   - 엔드포인트가 VPC 그룹 안에 있지 않은가.
   - 캡션에 위 사실 밖의 내용이 없는가.
   - VPN·Direct Connect·Active Directory 노드가 없는가.
   - 이모지·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`topics.json`, step 0~2의 산출물이 그대로인가.
3. `phases/43-route53-visuals/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 두 통로(행 사이·가운데)의 좌표, 엔드포인트 노드 폭, 캡션 넷의 글자 수,
     교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **Resolver 엔드포인트를 VPC 그룹 박스 안에 그리지 마라.** 이유: 엔드포인트가 어느 VPC에 놓이는지는 데이터에 없다(ADR-037
  phase 43 확장).
- **VPN·Direct Connect 노드나 연결선을 더하지 마라.** 이유: 이 주제의 데이터는 온프레미스와 VPC 사이의 연결 수단을 말하지 않는다.
  연결 수단은 `hybrid-connectivity` 주제의 `HybridPathsDiagram`이 맡는다.
- **Active Directory·퍼블릭 호스팅 영역 노드를 더하지 마라.** 이유: 본문에서 AD 도메인은 프라이빗 호스팅 영역으로 풀리지 않는 요구의 예로, 퍼블릭 호스팅 영역은 답이 아닌 구성으로만
  나온다. 그림에 넣으면 정답 구성으로 읽힌다.
- **`EP`·`PHZ` 같은 약어를 라벨에 쓰지 마라.** 이유: UI_GUIDE는 라벨을 영문 약어로 바꾸지 말라고 한다. 본문도 약어를 쓰지 않는다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`, step 0~2의 산출물을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
