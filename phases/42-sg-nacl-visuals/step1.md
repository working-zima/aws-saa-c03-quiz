# Step 1: layer-diagram

## 배경

`security-groups-nacl` 주제의 개념들은 거르는 장치를 하나씩 설명한다. 서브넷 경계의 NACL, 리소스마다 붙는 보안 그룹,
보안 그룹끼리의 참조가 그것이고, 마지막 개념 `web-acl-vs-nacl`은 이름이 닮은 WAF의 Web ACL과 NACL을 구분한다.
따로 읽으면 목록이지만, 인터넷에서 EC2까지 가는 요청 하나 위에 놓으면 **어느 층이 무엇을 거르는지**가 보인다.

사용자가 가져온 층 그림은 `인터넷 → WAF → NACL → ALB → 보안 그룹 → EC2`를 한 줄로 그린다. 이 step은 그 그림을 세 곳
바로잡아 이 앱의 도식 규약으로 다시 그린다(사용자 결정, 2026-09-26. 기록은 `docs/ADR.md` ADR-037 끝의
「2026-09-26 확장 — 보안 그룹·NACL 주제(phase 42)」).

1. **ALB에도 보안 그룹이 있다.** EC2 보안 그룹이 ALB 보안 그룹을 소스로 참조하는 구성이 이 주제의 핵심이다.
2. **ALB는 퍼블릭 서브넷, EC2는 프라이빗 서브넷**에 둔다. 서브넷마다 NACL이 있다.
3. **WAF는 화살표 줄에 넣지 않는다.** 데이터는 WAF가 ALB·CloudFront에 붙는다고만 말하고(`elastic-load-balancing.elb`,
   `elastic-load-balancing.alb-routing-conditions`, `waf-shield.waf-attach-targets`), NACL·보안 그룹보다 먼저 검사한다고는
   말하지 않는다. 그래서 WAF는 **ALB 옆에 붙은 노드**로 그리고, 요청 화살표는 WAF를 지나지 않는다.

**앵커는 `security-groups-nacl.web-acl-vs-nacl`**(주제의 마지막 개념)이다. 주제를 다 읽은 뒤의 정리 그림이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 둘까지)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/42-sg-nacl-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts`(`groups`, `notes`), `src/data/index.ts`
- `src/data/visuals/security-groups-nacl.json` — step 0이 만든 파일. 여기 `diagrams["sg-nacl-layers"]`를 더한다.
- `src/components/diagrams/BackupFlowDiagram.tsx` — JSON에서 문구를 읽고 그룹 박스를 그리는 도식의 선례
- `src/components/diagrams/VpcPathsDiagram.tsx` — 서브넷 그룹 안의 ALB·EC2, `notes` 곁말의 선례
- `src/components/diagrams/SgNaclBoundaryDiagram.tsx` — 같은 주제의 기존 도식(색 쓰임: NACL 회색, 보안 그룹 청록)
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs` — `const nodes = [` 블록과 `'id': 'M…'` 경로를 정규식으로 읽는다.
  이 형식을 지켜라.
- `src/data/topics.json`의 `security-groups-nacl` 주제 전부와 `waf-shield.waf`, `waf-shield.waf-attach-targets`,
  `waf-shield.waf-rule-types`, `elastic-load-balancing.elb`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/SgNaclLayersDiagram.tsx` (파일 이름이 `Diagram.tsx`로 끝나야 교차 검사 대상이 된다)
- 문구: JSON `diagrams["sg-nacl-layers"]`
- 매핑: `registry.ts`에 `'security-groups-nacl.web-acl-vs-nacl': SgNaclLayersDiagram` 한 줄

### 모양

위에서 아래로 한 줄기다. 두 서브넷 그룹은 **왼쪽 넓은 열**(대략 x 8~188)을 쓰고, **오른쪽 좁은 열**은 서브넷 밖의 WAF와
곁말 자리다.

```
 인터넷
   ↓
┌ 퍼블릭 서브넷 ──────────┐
│ NACL                    │
│ ┌ ALB 보안 그룹 ┐       │
│ │ ALB           │───────┼─ WAF     (곁말: ALB에 붙음)
│ └───────────────┘       │
└─────────────────────────┘
   ↓
┌ 프라이빗 서브넷 ────────┐
│ NACL                    │
│ ┌ EC2 보안 그룹 ┐       │   (곁말: 소스 = ALB 보안 그룹)
│ │ EC2           │       │
│ └───────────────┘       │
└─────────────────────────┘
```

**노드**(`const nodes = [...]`, 높이 32):

| id | 라벨 | 색 | 자리 |
|---|---|---|---|
| `internet` | 인터넷 | `stroke-disabled` | 그룹 밖 맨 위 |
| `nacl-public` | NACL | `stroke-disabled` | `public` 그룹 안, `alb-sg` 그룹 위 |
| `alb` | ALB | `stroke-diagram-resource` | `alb-sg` 그룹 안 |
| `waf` | WAF | `stroke-diagram-managed` | **서브넷 그룹 밖** 오른쪽 열, `alb`와 같은 높이 |
| `nacl-private` | NACL | `stroke-disabled` | `private` 그룹 안, `ec2-sg` 그룹 위 |
| `ec2` | EC2 | `stroke-diagram-resource` | `ec2-sg` 그룹 안 |

**그룹 박스**(흐려지지 않는다):

| id | 라벨 | 선 색 |
|---|---|---|
| `public` | 퍼블릭 서브넷 | `stroke-disabled` |
| `alb-sg` | ALB 보안 그룹 | `stroke-diagram-resource` |
| `private` | 프라이빗 서브넷 | `stroke-disabled` |
| `ec2-sg` | EC2 보안 그룹 | `stroke-diagram-resource` |

**곁말**(`notes`, 크기 9, `fill-muted`):

| id | 문구 | 자리 |
|---|---|---|
| `waf-attach` | ALB에 붙음 | `waf` 노드 아래 |
| `sg-source` | 소스 = ALB 보안 그룹 | `ec2-sg` 옆 오른쪽 열. 폭이 모자라면 `소스 =` / `ALB 보안 그룹` 두 줄로 나눈다. 글자 크기를 줄이지 마라 |

**`alb`와 `waf`를 잇는 선**: 화살표가 없는 짧은 가로선이다. 요청 경로가 아니라 "붙어 있다"는 표시이므로 `paths` 맵에 넣지
말고 JSX에 정적으로 그린다. 선은 `stroke-disabled`, 굵기 1이다. `waf` 노드와 같은 opacity를 따른다.

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 구간 |
|---|---|
| `internet-nacl-public` | 인터넷 → 퍼블릭 NACL |
| `nacl-public-alb` | 퍼블릭 NACL → ALB (ALB 보안 그룹 경계를 지나 들어간다) |
| `alb-nacl-private` | ALB → 프라이빗 NACL (퍼블릭 서브넷을 나와 프라이빗 서브넷으로) |
| `nacl-private-ec2` | 프라이빗 NACL → EC2 (EC2 보안 그룹 경계를 지나 들어간다) |

어느 경로도 다른 노드 상자를 뚫지 않게 통로를 잡는다(교차 검사가 확인한다). 세로는 얼마든 늘려도 된다.

### 시나리오 다섯

| id | label | 선명한 노드 | 보이는 경로 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|---|
| `flow` | 요청 흐름 | 여섯 모두 | 넷 모두 | 서브넷 경계마다 NACL을, 리소스마다 보안 그룹을 지나 EC2에 닿는다 | `security-groups-nacl.security-group`, `security-groups-nacl.nacl` |
| `waf` | WAF | `internet`, `alb`, `waf` | `internet-nacl-public`, `nacl-public-alb` | SQL Injection·XSS·국가처럼 요청 내용을 본다 · ALB와 CloudFront에는 붙고 NLB에는 붙지 않는다 | `waf-shield.waf`, `waf-shield.waf-attach-targets` |
| `nacl` | NACL | `nacl-public`, `nacl-private` | 없음 | 서브넷 경계에서 IP로 허용·차단한다 · 상태를 기억하지 않아 응답 방향에도 규칙이 필요하다 | `security-groups-nacl.nacl`, `security-groups-nacl.security-group-stateful-vs-nacl-stateless` |
| `sg-ref` | 보안 그룹 참조 | `alb`, `ec2` | `alb-nacl-private`, `nacl-private-ec2` | EC2 보안 그룹의 인바운드 소스를 ALB 보안 그룹 ID로 두면 ALB를 거친 요청만 받는다 · IP가 바뀌어도 따라간다 | `security-groups-nacl.security-group-referencing`, `security-groups-nacl.alb-security-group-outbound-and-health-check-port` |
| `block-ip` | IP 하나 막기 | `waf`, `nacl-public`, `nacl-private` | 없음 | 보안 그룹에는 차단 규칙이 없어 NACL이나 WAF가 막는다 · 수만 개 IP나 국가 단위 차단은 NACL이 아니라 WAF의 몫이다 | `security-groups-nacl.security-group-stateful-vs-nacl-stateless`, `security-groups-nacl.nacl-rule-limit` |

- 캡션은 위 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **320px에서 두 줄 이하가 되도록 50자 안팎으로**
  쓴다(phase 40 실측: 50자를 넘으면 세 줄이 됐다). 두 사실이 다 들어가지 않으면 앞의 사실을 남긴다.
- `idleCaption`: 시나리오를 고르면 층마다 무엇을 거르는지 볼 수 있다는 안내 한 문장.
- 도식의 `sources`: `security-groups-nacl.security-group`, `security-groups-nacl.nacl`, `security-groups-nacl.web-acl-vs-nacl`,
  `elastic-load-balancing.elb`.
- `legend`: 파랑·청록·회색이 각각 무엇인지 한 줄. 예: 파랑은 AWS 관리 서비스, 청록은 보안 그룹과 그 안의 리소스,
  회색은 서브넷 경계·NACL·바깥.
- `label`: `보안 그룹·NACL·WAF 층 도식`, `svgLabel`: `보안 그룹·NACL·WAF 층`.

### 테스트 — `SgNaclLayersDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 처음에는 노드 여섯이 모두 선명하고 경로가 없다.
2. 시나리오마다 선명한 노드 집합과 보이는 경로가 위 표와 같다.
3. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안)·6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`)·7(폭 280).
4. 노드마다 자기 그룹 박스 안에 있다: `nacl-public`·`alb`는 `public` 안, `alb`는 `alb-sg` 안, `nacl-private`·`ec2`는
   `private` 안, `ec2`는 `ec2-sg` 안. **`waf`는 `public`·`private` 어느 그룹 박스와도 겹치지 않는다.**
5. `paths` 맵에 `waf`가 들어간 경로 id가 없다 — 요청 화살표는 WAF를 지나지 않는다.
6. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
7. `ConceptList`에 `security-groups-nacl.web-acl-vs-nacl` 개념을 주면 본문 뒤에 이 도식이 온다.
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
2. 확인한다: WAF가 서브넷 박스 밖에 있고 요청 화살표에 끼지 않는가, 인터넷 게이트웨이 노드가 없는가, 캡션에 근거 표 밖
   사실이 없는가, 이모지·O/X·빨강·애니메이션이 없는가, `DiagramFrame.tsx`·`SgNaclBoundaryDiagram.tsx`·`topics.json`이
   그대로인가.
3. `phases/42-sg-nacl-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, WAF·곁말의 자리(좌표), `sg-source` 곁말을 두 줄로 나눴는지, 캡션 다섯의 글자 수,
     교차 검사 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **WAF를 요청 화살표 줄에 넣거나 NACL보다 앞에 두지 마라.** 이유: 데이터는 WAF가 ALB·CloudFront에 붙는다고만 말한다.
  검사 순서를 그리면 근거 없는 사실이 된다(ADR-036 「도식은 콘텐츠다」, ADR-037 phase 42 확장).
- **WAF를 서브넷 그룹 박스 안에 두지 마라.** 이유: WAF는 VPC 안 자원이 아니라 AWS 관리 서비스다(ADR-036 색 구분과 같은 선).
- **인터넷 게이트웨이·CloudFront·Shield 노드를 더하지 마라.** 이유: 이 그림의 일은 거르는 층을 보이는 것이다. 경로는
  VPC 주제의 도식이 맡는다.
- **"같은 서브넷 안 통신은 NACL을 지나지 않는다", "규칙 번호 순 평가" 같은 문구를 쓰지 마라.** 이유: 데이터에 없다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **약어 툴팁을 더하지 마라.** 이유: VPC 주제에만 둔다(ADR-037).
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`SgNaclBoundaryDiagram.tsx`·`topics.json`·step 0의 표를 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
