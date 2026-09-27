# Step 2: alias-diagram

## 배경

`route53.route53-alias-record`는 두 가지 연결 방식을 대조한다.

- **별칭 레코드**는 도메인 이름을 ALB 같은 AWS 리소스에 겨눈다. ALB가 안정적인 접속 지점이 되고, 그 뒤의 대상 그룹이
  인스턴스 등록을 맡는다. 그래서 인스턴스가 교체되어도 대상 그룹만 바뀌고 DNS 레코드는 그대로다.
- **이름을 인스턴스의 공용 IP에 직접 묶으면** 교체될 때마다 사람이 레코드를 고쳐야 한다.

이 step은 이 대조를 도식 하나로 그린다. 사용자 결정(2026-09-27)은 `docs/ADR.md` ADR-037 끝의
「2026-09-27 확장 — Route 53 주제(phase 43)」에 기록돼 있다.

**앵커는 `route53.route53-alias-record`다.**

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/43-route53-visuals/index.json`의 step 0·1 `summary`
- `src/types/visuals.ts`(`groups`, `notes`), `src/data/index.ts`
- `src/data/visuals/route53.json`: 여기에 `diagrams["alias-record"]`를 더한다. step 0·1이 넣은 항목은 건드리지 마라.
- `src/components/diagrams/Route53HealthDiagram.tsx`: step 1의 도식이다. 같은 주제이므로 색·곁말 처리를 맞춘다.
- `src/components/diagrams/SgNaclLayersDiagram.tsx`: 그룹 박스 안 노드와 곁말의 선례
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드·경로 선언 형식을 지켜라.
- `src/data/topics.json`의 `route53.route53-alias-record`와 `elastic-load-balancing.elb`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/Route53AliasDiagram.tsx`
- 문구: JSON `diagrams["alias-record"]`
- 매핑: `registry.ts`에 `'route53.route53-alias-record': Route53AliasDiagram` 한 줄을 더한다.

### 모양

```
      도메인 이름 ───────────┐   (공용 IP로 직접: 옆 통로)
          ↓                  │
         ALB                 │
          ↓                  │
┌ 대상 그룹 ─────────────────┼┐
│   새 EC2          EC2  ←───┘│
└─────────────────────────────┘
```

`record`에서 `ec2`로 곧장 가는 경로는 ALB를 지나지 않는 **옆 통로**를 쓴다. 그래서 `ec2`를 옆 통로 쪽 열에 둔다. 위 그림은
오른쪽 예다. 좌우는 바꿔도 된다.

**노드**(`const nodes = [...]`, 높이 32):

| id | 라벨 | 색 | 자리 |
|---|---|---|---|
| `record` | 도메인 이름 | `stroke-diagram-managed` | 맨 위 |
| `alb` | ALB | `stroke-diagram-resource` | 가운데 |
| `ec2` | EC2 | `stroke-diagram-resource` | `tg` 그룹 안, 옆 통로 쪽 열 |
| `ec2-new` | 새 EC2 | `stroke-diagram-resource` | `tg` 그룹 안, 다른 열 |

**그룹 박스**(흐려지지 않는다):

| id | 라벨 | 선 색 |
|---|---|---|
| `tg` | 대상 그룹 | `stroke-diagram-resource` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리 | 보이는 시나리오 |
|---|---|---|---|
| `replaced` | 교체됨 | `ec2` 아래 | `replace` |
| `record-same` | 레코드 그대로 | `record` 옆 | `replace` |
| `record-edit` | 교체마다 수정 | `record` 옆 | `direct-ip` |

**경로**(`paths` 맵, 직교 M/H/V만):

| id | 구간 |
|---|---|
| `record-alb` | 도메인 이름 → ALB |
| `alb-ec2` | ALB → EC2 |
| `alb-ec2-new` | ALB → 새 EC2 |
| `record-ec2` | 도메인 이름 → EC2 (ALB를 지나지 않는 옆 통로) |

어느 경로도 다른 노드 상자를 뚫지 않게 한다. 특히 `record-ec2`가 `alb`·`ec2-new`를 지나면 안 된다.

### 시나리오 셋

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|---|---|
| `alias` | 별칭 레코드 | `record`, `alb`, `ec2` | `record-alb`, `alb-ec2` | 없음 | 이름을 ALB에 겨누면 ALB가 고정 접속 지점이 되고, 인스턴스 등록은 대상 그룹이 맡는다 | `route53.route53-alias-record`, `elastic-load-balancing.elb` |
| `replace` | 인스턴스 교체 | `record`, `alb`, `ec2-new` | `record-alb`, `alb-ec2-new` | `replaced`, `record-same` | 인스턴스가 교체되면 대상 그룹만 바뀌고 DNS 레코드는 고치지 않는다 | `route53.route53-alias-record` |
| `direct-ip` | 공용 IP에 직접 | `record`, `ec2` | `record-ec2` | `record-edit` | 이름을 인스턴스 공용 IP에 직접 묶으면, 교체될 때마다 사람이 레코드를 고쳐야 한다 | `route53.route53-alias-record` |

- `replace`에서 `ec2`는 흐리다(`0.25`). 교체되어 나간 인스턴스라서다.
- 캡션은 위 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **50자 안팎으로** 쓴다.
- `idleCaption`: 시나리오를 고르면 별칭 레코드와 공용 IP 직접 연결이 인스턴스 교체에 어떻게 다른지 볼 수 있다는 안내 한 문장.
- 도식의 `sources`: `route53.route53-alias-record`, `elastic-load-balancing.elb`.
- `legend`: 파랑·청록이 각각 무엇인지 한 줄로 쓴다. 파랑은 Route 53 레코드, 청록은 로드 밸런서와 대상 그룹 안 인스턴스다.
- `label`: `별칭 레코드 도식`, `svgLabel`: `별칭 레코드와 공용 IP 직접 연결`.

### 테스트: `Route53AliasDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 처음에는 노드 넷이 모두 선명하고, 경로와 곁말이 없다.
2. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
3. `direct-ip`에서는 `alb`가 흐리고, 보이는 경로가 `record-ec2` 하나뿐이다.
4. `ec2`·`ec2-new`는 `tg` 그룹 박스 안에 있고, `record`·`alb`는 그 밖에 있다.
5. 관문 5·6·7(viewBox 안, 라벨 폭, 폭 280)을 통과한다.
6. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
7. `ConceptList`에 `route53.route53-alias-record` 개념을 주면 본문 뒤에 이 도식이 온다.
8. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

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
   - 캡션에 위 사실 밖의 내용이 없는가.
   - 호스트 이름 리스너 규칙·IP 주소 숫자·레코드 유형(A·CNAME)이 없는가.
   - `DiagramFrame.tsx`·`topics.json`, step 0·1의 산출물이 그대로인가.
3. `phases/43-route53-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 옆 통로의 x 좌표와 방향(좌/우), 캡션 셋의 글자 수, 교차 검사 결과를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **A·CNAME 같은 레코드 유형, 별칭 레코드의 요금·TTL을 쓰지 마라.** 이유: 데이터에 없다.
- **호스트 이름 리스너 규칙 시나리오를 더하지 마라.** 이유: 본문의 마지막 문장이지만 ELB 리스너의 일이라 이 도식의 대조 밖이다.
- **`52.123.25.11` 같은 IP 숫자를 노드나 곁말에 쓰지 마라.** 이유: 이 도식의 요점은 주소 값이 아니라 교체에 따른 레코드 수정 여부다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`, step 0·1의 산출물을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
