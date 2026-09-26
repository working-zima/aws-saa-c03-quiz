# Step 7: glossary-tooltip

## 배경

사용자가 가져온 HTML은 본문의 약어에 점선 밑줄을 긋고, 마우스를 올리거나 누르면 뜻을 띄운다.
사용자는 **약어 사전 패널 없이 툴팁만** 두기로 했다(2026-09-26, ADR-037).

그런데 이 앱의 VPC 개념 본문은 약어를 거의 쓰지 않는다. "인터넷 게이트웨이"처럼 한국어 이름을 쓰고,
HTML이 쓰던 IGW·EIP·AZ·ENI·TGW는 본문에 한 번도 나오지 않는다. 그리고 뜻풀이도 사실이므로 **데이터 안에
근거 개념이 있어야 한다**(CLAUDE.md 「원본 데이터」). 두 조건을 모두 채우는 약어는 넷이다.

| term | 풀네임 | 뜻에 담을 사실 | `sourceConceptId` | VPC 본문에 나오는 곳 |
|---|---|---|---|---|
| `IAM` | Identity And Access Management | AWS 리소스를 누가 쓸 수 있는지 접근 권한을 관리한다 | `iam-permissions.iam` | `vpc-networking.vpc-endpoint-policy` |
| `EC2` | Elastic Compute Cloud | AWS에서 빌려 쓰는 컴퓨터 한 대 | `aws-core-services.ec2` | `vpc-networking.nat-instance`, `vpc-networking.comparison` |
| `ACL` | Access Control List | 접근을 허용하거나 막는 규칙 목록 | `security-groups-nacl.nacl` | `vpc-networking.s3-is-regional` |
| `VPN` | (두지 않음) | 인터넷 위에 암호화된 통신 경로를 만든다 | `hybrid-connectivity.site-to-site-vpn` | `vpc-networking.vpc-peering-scaling-limit` |

`VPN`의 풀네임은 데이터에 없으므로 `expansion`을 두지 않는다. **목록을 늘리지 마라.** CIDR·API·IPv4·IPv6·NAT는
본문에 나오지만 그것을 정의하는 개념이 데이터에 없다. VPC·S3는 이 주제가 직접 설명하는 이름이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-037**
- `docs/UI_GUIDE.md`의 **「약어 툴팁」**, 「애니메이션」, 「색상」
- `phases/40-vpc-visuals/index.json`의 step 0~6 `summary`
- `src/types/visuals.ts` — `GlossaryTerm`
- `src/data/index.ts`, `src/data/visuals/vpc-networking.json`, `src/data/visuals.test.ts`
- `src/components/ConceptList.tsx`, `ConceptList.test.tsx`
- `src/components/EmphasizedText.tsx` — 본문의 `**강조**`를 굵게 바꾸는 곳. 약어 처리가 여기와 만난다.
- `src/pages/ConceptReadPage.tsx`, `src/components/QuizRunner.tsx` — `ConceptList`를 부르는 두 곳
- `src/data/topics.json`의 위 표에 적힌 개념들

## 작업

### 1. 데이터 — JSON `glossary`

위 표의 넷을 `GlossaryTerm`으로 넣는다. `meaning`은 근거 개념의 사실에서 **직접 써라.** 한 문장, 40자 안쪽.

`src/data/visuals.test.ts`에 검사를 더한다: 약어마다 **그 주제의 개념 본문(요약·문단)에 단어 경계로 한 번
이상 나온다.** 본문에 없는 약어를 사전에 넣는 것을 막는다.

### 2. 순수 로직 — `src/lib/glossary.ts` (새 파일, React 의존 없음)

```ts
export interface TextSegment { text: string; term?: string }

// 한 개념의 텍스트 조각들(요약, 문단들 순서대로)에서 약어마다 **처음 나오는 한 곳만** term으로 표시한다.
// 단어 경계로만 맞춘다: "ACL"은 "NACL" 안에서 맞추지 않는다. 대소문자를 구분한다.
export function markFirstOccurrences(texts: string[], terms: string[]): TextSegment[][]

// 툴팁의 왼쪽 좌표. 앵커 가운데에 맞추되 화면 가장자리에서 margin 안쪽으로 붙잡는다.
export function clampTooltipLeft(anchorCenterX: number, tooltipWidth: number, viewportWidth: number, margin: number): number
```

`src/lib/glossary.test.ts`를 **먼저 쓰고 실패를 확인한 뒤** 구현한다. 확인할 것: 같은 약어가 두 문단에
나오면 첫 문단의 첫 자리만 표시된다 · `NACL` 안의 `ACL`은 표시되지 않는다 · 약어가 없는 텍스트는 조각
하나 · 조각들을 이으면 원문과 같다 · `clampTooltipLeft`가 320 폭에서 왼쪽 끝·오른쪽 끝 앵커를 8px 안쪽으로
붙잡는다.

### 3. 컴포넌트

- `src/components/GlossaryTerm.tsx` — 약어 버튼과 툴팁. UI_GUIDE 「약어 툴팁」 그대로다.
  - `<button type="button">` + 점선 밑줄, 색 변화 없음. `aria-describedby`로 툴팁을 가리킨다.
  - 마우스 올리기·초점·누르기로 열고, `Escape`·바깥 누르기·초점 이탈·스크롤로 닫는다.
  - 툴팁은 `role="tooltip"`, `position: fixed`, 왼쪽 좌표는 `clampTooltipLeft(…, margin 8)`로 정한다.
  - 내용 두 줄: `약어 = 풀네임`(풀네임이 없으면 약어만) / 뜻. **나타나는 애니메이션 없음.**
- `EmphasizedText`에 선택 prop을 더해, `**강조**` 바깥의 일반 조각에서 약어 조각을 `GlossaryTerm`으로
  렌더하게 한다. **prop을 주지 않으면 지금과 똑같이 렌더해야 한다.** `**강조**` 안의 약어는 표시하지 않는다.
- `ConceptList`에 선택 prop `glossary?: GlossaryTerm[]`를 더한다. 개념마다 `markFirstOccurrences`를
  **요약과 문단을 합쳐 한 번** 불러, 개념 안에서 약어가 처음 나오는 곳에만 툴팁을 단다.
- 호출하는 두 곳(`ConceptReadPage`, `QuizRunner`)에서 `visualsByTopicId[topic.id]?.glossary`를 넘긴다.
  VPC 주제가 아니면 `undefined`라 아무것도 바뀌지 않는다.

### 4. 테스트

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

- `GlossaryTerm.test.tsx`: 초점을 주면 툴팁이 보이고 `aria-describedby`가 그 id를 가리킨다 · `Escape`로 닫힌다 ·
  누르면 열리고 바깥을 누르면 닫힌다 · 풀네임이 없는 약어는 `약어 =`가 나오지 않는다.
- `ConceptList.test.tsx`에 더한다: `glossary`를 주면 한 개념 안에서 같은 약어의 버튼이 **하나만** 생긴다 ·
  `glossary`를 주지 않으면 버튼이 하나도 없다(기존 렌더 불변).
- `ConceptReadPage` 또는 통합 테스트: VPC 주제 화면에 `IAM` 버튼이 있고, 다른 주제(예: `lambda`) 화면에는
  약어 버튼이 없다.

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
2. 확인한다: 약어가 넷뿐인가, 약어 사전 패널을 만들지 않았는가, 애니메이션·색 변화가 없는가, VPC 밖 주제의
   렌더가 그대로인가, `src/lib/glossary.ts`에 React import가 없는가.
3. `phases/40-vpc-visuals/index.json`의 step 7을 갱신한다.
   - 성공 → `"summary"`: 약어 넷과 각 첫 등장 개념, `EmphasizedText`·`ConceptList`에 더한 prop, 테스트 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **약어 사전 패널(`details`·목록)을 만들지 마라.** 이유: 사용자 결정(ADR-037).
- **위 넷 밖의 약어를 넣지 마라.** 이유: 뜻풀이 근거가 데이터에 없거나 본문에 나오지 않는다. 근거 규칙을
  느슨하게 해 목록을 늘리지 않는다(ADR-037 「트레이드오프」).
- **VPC 밖 주제에 툴팁을 적용하지 마라.** 이유: 사용자 결정(툴팁은 VPC 주제만).
- **도식 캡션·비교표 칸에 툴팁을 달지 마라.** 이유: 범위는 개념 본문(요약·문단)이다. 도식 안의 버튼과
  툴팁 버튼이 섞이면 시나리오 버튼과 헷갈린다.
- **툴팁에 fade·slide 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`topics.json`을 고치지 마라.** 본문의 한국어 이름을 약어로 바꾸는 일도 하지 마라.
- 기존 테스트를 깨뜨리지 마라.
