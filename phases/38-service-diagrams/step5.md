# Step 5: sg-nacl-boundary

## 배경

`security-groups-nacl`의 개념 `security-group-stateful-vs-nacl-stateless`는 두 기능이
**세 축에서 갈린다**고 말한다 — 적용 범위(리소스 대 서브넷), 규칙의 종류(허용만 대 허용·차단),
상태 추적(저장 대 비저장). 셋 중 첫째는 **위치**이고 셋째는 **왕복**이다.
둘 다 그림이 글보다 빠른 종류다.

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md`, `step1.md` — 규약과 금지사항.
- `src/components/diagrams/DiagramFrame.tsx`, `src/lib/svg-bounds.ts`.
- `src/data/topics.json`의 `security-groups-nacl` 개념 **전부.**

## 자리

- 컴포넌트: `src/components/diagrams/SgNaclBoundaryDiagram.tsx`
- 매핑: `registry.ts`에 `'security-groups-nacl.security-group-stateful-vs-nacl-stateless': SgNaclBoundaryDiagram`

앵커가 그 개념인 이유: 세 축을 한자리에 모으는 개념이고 주제의 끝쪽(9개 중 8번째)이라
보안 그룹·NACL·차단 규칙·서브넷 방향이 모두 읽힌 뒤다.

## 도식 내용

### 위쪽 — 경계 그림

```
     바깥
      │
┌─────┼───────────────────────┐
│ 서브넷 경계 = 네트워크 ACL   │   ← 실선, IP만 · 허용과 차단 · 상태 비저장
│  ┌──┼────────────────────┐  │
│  │ 리소스 경계 = 보안 그룹 │  │   ← 실선, 리소스·IP · 허용만 · 상태 저장
│  │   [EC2]      [RDS]    │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- 두 경계가 **감싸는 대상이 다르다**는 것이 요점이다. 보안 그룹은 서브넷에 매이지 않으므로
  (`security-group`) 서브넷 안의 리소스 여럿을 함께 감싸는 모양으로 그려라.
- 각 경계 옆에 세 축의 값을 작은 글자(9px, `muted`)로 단다.
  NACL: `IP만` · `허용과 차단` · `상태 비저장`. 보안 그룹: `리소스·IP` · `허용만` · `상태 저장`.
- 색: NACL 경계는 `disabled`(서브넷은 자원이 아니라 경계다), 보안 그룹 경계와 리소스는
  `diagram-resource`.

### 아래쪽 — 왕복 그림

요청이 들어오고 응답이 나가는 두 방향을, 네 관문을 지나는 칸으로 그린다.

```
들어옴  →  [NACL 인바운드]  →  [SG 인바운드]  →  리소스
나감    ←  [NACL 아웃바운드] ←  [SG 아웃바운드] ←
```

`SG 아웃바운드` 칸이 **응답에서는 규칙 없이 통과**한다는 것이 이 그림의 한 수다
(`security-group-stateful-vs-nacl-stateless`: "인바운드를 허용한 연결의 응답 트래픽은
아웃바운드 규칙이 없어도 나가고, 그 반대도 마찬가지다").
`NACL 아웃바운드`는 그렇지 않다 — 상태를 기억하지 않으므로 규칙이 따로 있어야 한다.

### 시나리오 둘

이 도식은 시나리오를 **둘만** 둔다. 상태 저장/비저장의 차이는 왕복을 실제로 켜 봐야 보인다.

| id | label | 경로 | 근거 개념 id |
|---|---|---|---|
| `req` | 들어오는 요청 | 바깥 → NACL 인바운드 → SG 인바운드 → 리소스 | `nacl`, `security-group` |
| `res` | 그 응답 | 리소스 → **SG 아웃바운드(규칙 없이 통과)** → NACL 아웃바운드 → 바깥 | `security-group-stateful-vs-nacl-stateless` |

접두사는 모두 `security-groups-nacl.`다.

**캡션에는 바닥이 있다.** 경로 그림이 이미 말하는 것(A에서 B로 간다)을 글로 되풀이하지 마라.
각 캡션은 **그림이 말하지 못하는 것 하나**를 반드시 담는다 — 그 경로가 성립하는 조건,
그 경로의 제약, 또는 왜 다른 경로가 아닌가. 한 줄 요약으로 끝내면 캡션을 둔 이유가 없다.
`figcaption`은 두 줄 자리를 비워 두고 있다.

`res`의 캡션에 **보안 그룹은 규칙 없이 통과하지만 NACL은 아웃바운드 규칙이 있어야 한다**는
차이를 담아라. 이것이 이 도식의 존재 이유다.

`res`를 고르면 `SG 아웃바운드` 칸을 나머지와 **다르게** 표시해라 — 점선 테두리가 적절하다.
색을 새로 만들어 쓰지 마라. 점선이라는 형태가 "규칙이 없다"를 말한다.

## 캡션

`idleCaption`에는 두 경계가 감싸는 대상이 다르다는 것을 담아라. 본문을 옮기지 말고 직접 써라.

## 테스트

`src/components/diagrams/SgNaclBoundaryDiagram.test.tsx`를 먼저 쓴다.

1. 버튼이 `전체`를 포함해 셋이다.
2. `들어오는 요청`을 고르면 인바운드 칸 둘이 선명하고 아웃바운드 칸 둘은 흐리다.
3. `그 응답`을 고르면 아웃바운드 칸 둘이 선명하고 인바운드 칸 둘은 흐리다.
4. `그 응답`을 고른 상태에서 `SG 아웃바운드` 칸만 점선(`stroke-dasharray`)이고,
   `NACL 아웃바운드` 칸은 실선이다.
5. 보안 그룹 경계 `rect`가 NACL 경계 `rect`의 **안쪽**에 완전히 들어간다(좌표로 확인).
6. 경계: 모든 `rect`가 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`에서 빈 배열.
7. 글자 넘침: 모든 라벨 노드에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`.
8. `viewBox` 폭이 `280`이다.

4번과 5번이 이 step의 핵심 회귀 테스트다. 4번은 상태 저장의 차이를, 5번은 적용 범위의
차이를 각각 기계로 붙든다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 금지사항

- **`DiagramFrame.tsx`·`svg-bounds.ts`를 고치지 마라.**
- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **아래를 이 도식에 넣지 마라**: 보안 그룹 참조, ALB·NLB 보안 그룹 구성,
  NACL 규칙 수 제한, 보내는 쪽 서브넷 거부 규칙, Web ACL. 전부 이 주제의 개념이지만
  **두 기능의 경계가 아니라 그 위에서 하는 구성**이다.
- **차단 규칙을 보안 그룹 쪽에 그리지 마라.** 보안 그룹에는 차단 규칙이 없다(`security-group`).
- **점선 말고 새 색으로 "규칙 없음"을 표시하지 마라.**
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 캡션·곁말에 그대로 옮기지 마라.**
- 기존 테스트를 깨뜨리지 마라.
