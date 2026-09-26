# Step 1: backup-tables

## 배경

사용자가 가져온 HTML은 백업 흐름 안에 미니 도식 둘을 넣었다 — "볼륨만 지정할 때 vs 인스턴스를 지정할 때",
"계정마다 설정할 때 vs 조직 정책을 쓸 때". 둘 다 **두 선택의 대비**라서 이 앱에서는 phase 40이 만든 비교표로 옮긴다
(사용자 결정, 2026-09-26). 여기에 "다른 리전 사본 vs 다른 계정 사본" 표를 하나 더한다 — 본문이 둘을 나란히
후보로 놓고 막는 사고가 다르다고 말하는 자리다.

비교표 규칙은 `docs/UI_GUIDE.md` 「비교표」와 ADR-037에 있다. 세 열 이하, 판정에 색 없음, 가로 스크롤 없음.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**(확장 문단까지)
- `docs/UI_GUIDE.md`의 **「비교표」**
- `phases/41-backup-visuals/index.json`의 step 0 `summary`
- `src/types/visuals.ts` — `ComparisonTable`(선택 필드 `columnWidths` 포함)
- `src/components/diagrams/ComparisonTableFigure.tsx` — **이 컴포넌트를 그대로 쓴다. 고치지 마라.**
- `src/components/diagrams/vpcTables.tsx` — 표를 registry에 붙이는 래퍼의 선례
- `src/data/visuals/backup-disaster-recovery.json`(step 0이 만든 파일), `src/data/visuals.test.ts`
- `src/components/diagrams/registry.ts`
- `src/data/topics.json`의 아래 근거 개념들

## 작업

### 표 셋 — JSON `tables`

칸 문장은 아래 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). 칸은 짧게 — 320px에서 세 열이 한 화면에 든다.
세 표 모두 `columnWidths`는 `["24%", "38%", "38%"]`(행 머리 열을 좁힌다, phase 40 실측).

#### `ec2-assignment` → `backup-disaster-recovery.backup-ec2-resource-assignment` 뒤

열: (빈 머리) · `EBS 볼륨만 지정` · `EC2 인스턴스 지정`. 행 둘.

| 행 머리 | 볼륨만 | 인스턴스 | 근거 |
|---|---|---|---|
| 담기는 것 | 볼륨의 데이터 | 인스턴스 구성과 붙은 볼륨 전부 | `backup-disaster-recovery.backup-ec2-resource-assignment` |
| 복구할 때 | 인스턴스를 다시 세울 구성이 빠진다 | 한 번에 끝나고 다른 리전에서도 바로 복구한다 | `backup-disaster-recovery.backup-ec2-resource-assignment`, `backup-disaster-recovery.backup-long-term-retention` |

#### `backup-policy-scope` → `backup-disaster-recovery.organizations-backup-policy` 뒤

열: (빈 머리) · `계정마다 설정` · `Organizations 백업 정책`. 행 셋.

| 행 머리 | 계정마다 | 조직 정책 | 근거 |
|---|---|---|---|
| 계획을 정하는 곳 | 각 계정의 AWS Backup | 조직 수준 | `backup-disaster-recovery.organizations-backup-policy` |
| 관리 지점 | 계정 수만큼 는다 | 한 곳 | 같음 |
| 새 계정 | `—` | 같은 규칙이 따라붙는다 | 같음 |

`새 계정` 행의 `계정마다` 칸은 **`—`로 둔다.** 원본 HTML은 "새 계정은 빠지기 쉽다"고 했지만 데이터에 그 말이 없다.

#### `copy-destination` → `backup-disaster-recovery.backup-cross-account-copy` 뒤

열: (빈 머리) · `다른 리전` · `다른 계정`. 행 둘.

| 행 머리 | 다른 리전 | 다른 계정 | 근거 |
|---|---|---|---|
| 막는 사고 | 리전 하나가 통째로 멈추는 것 | 계정 침해와 실수 삭제 | `backup-disaster-recovery.backup-cross-account-copy` |
| 계정이 침해되면 | 같은 계정 안이라 함께 노출된다 | 관리 주체가 갈라져 지울 경로가 끊긴다 | 같음 |

### 매핑

`src/components/diagrams/backupTables.tsx` 한 파일에 표마다 `ComparisonTableFigure`에 JSON 표를 넘기는 작은 컴포넌트를 두고,
`registry.ts`에 위 앵커 셋을 한 줄씩 더한다. 셋 모두 아직 도식이 없는 개념이라 단일 값이다.

### 테스트 — `backupTables.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 표 셋이 데이터에 있고, 각 표가 앵커 개념의 `ConceptList` 렌더 결과에서 본문 뒤에 나온다.
2. 열 머리 수·행 구조가 데이터와 같다.
3. `colgroup`의 폭이 `["24%", "38%", "38%"]`다.
4. `backup-policy-scope`의 `새 계정` 행 `계정마다` 칸이 `—`다.

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
2. 확인한다: 근거 표 밖 사실이 칸에 없는가, 판정·색·이모지가 없는가, `ComparisonTableFigure.tsx`가 그대로인가.
3. `phases/41-backup-visuals/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`: 표 셋의 id와 앵커, 가장 긴 칸의 글자 수.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **`ComparisonTableFigure.tsx`를 고치지 마라.** 이유: phase 40에서 실측·검증을 마친 공용 컴포넌트다.
- **"새 계정은 빠지기 쉽다", "보존 기간 전에는 못 지운다" 같은 근거 없는 칸을 쓰지 마라.** 이유: 데이터에 없다.
- **백업 볼트를 표에 넣지 마라.** 이유: ADR-037 확장.
- **도식을 만들지 마라.** 재해 복구 도식은 step 2의 범위다.
- **`topics.json`·VPC 주제의 파일을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
