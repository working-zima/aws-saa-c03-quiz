# Step 0: backup-flow

## 배경

`backup-disaster-recovery` 주제의 앞 여덟 개념은 AWS Backup 하나를 여러 자리에서 말한다 — 서비스 자체 백업의
보존 한계를 넘을 때, EC2를 무엇으로 지정할 때, 여러 계정일 때, S3를 촘촘히 되돌릴 때, 사본을 어디에 둘 때,
복원을 검증할 때, 감사할 때. 따로 읽으면 기능 목록이지만 한 그림에 놓으면 **원본 → 백업 계획 → 사본·검증·감사**라는
한 줄기가 된다.

사용자가 가져온 HTML의 "백업 흐름" 도식이 그 줄기를 그린다. 이 step은 그것을 이 앱의 도식 규약으로 다시 그린다.
결정과 옮기지 않은 것은 `docs/ADR.md` **ADR-037**(끝의 「2026-09-26 확장 — 백업 주제」 포함)에 있다.

**앵커는 백업 블록의 끝, `backup-disaster-recovery.backup-audit-manager`다.** 시나리오 일곱이 앞 개념 일곱의 판단을
하나씩 담으므로, 본문을 읽은 뒤에야 캡션의 뜻이 선다. "읽은 것의 정리"다(사용자 결정, 2026-09-26).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**(확장 문단까지)
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**
- `src/types/visuals.ts`, `src/data/index.ts`, `src/data/visuals/vpc-networking.json`, `src/data/visuals.test.ts`
- `src/components/diagrams/VpcPathsDiagram.tsx` — JSON에서 문구를 읽는 도식의 선례
- `src/components/diagrams/MessagingShapesDiagram.tsx` — VPC 계층이 없는 도식에서 색을 쓰는 선례
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `backup-disaster-recovery` 주제 개념 0~7

## 작업

### 1. 데이터 파일과 로더

- `src/data/visuals/backup-disaster-recovery.json`을 `{ "diagrams": {}, "tables": {}, "glossary": [] }` 모양으로 만들고
  이 step의 도식 문구를 `diagrams["backup-flow"]`에 넣는다.
- `src/data/index.ts`의 `visualsByTopicId`에 `'backup-disaster-recovery'` 키를 더한다.
- `glossary`는 **빈 배열로 둔다.** 약어 툴팁은 VPC 주제에만 있다(ADR-037).

### 2. 도식 — `src/components/diagrams/BackupFlowDiagram.tsx`

매핑: `registry.ts`에 `'backup-disaster-recovery.backup-audit-manager': BackupFlowDiagram` 한 줄.

**그룹과 노드**(위에서 아래로):

| 자리 | id | 라벨 | 색 |
|---|---|---|---|
| 그룹 밖 맨 위 | `org-policy` | Organizations 백업 정책 | `diagram-managed` |
| 그룹 `source` (라벨 `원본 계정`) | `ec2` | EC2 인스턴스 | 무채색 |
| | `ebs` | EBS 볼륨 | 무채색 |
| | `rds` | RDS | 무채색 |
| | `dynamodb` | DynamoDB | 무채색 |
| | `s3` | S3 | 무채색 |
| 그룹 `backup` (라벨 `AWS Backup`) | `plan` | 백업 계획 | `diagram-managed` |
| | `restore-test` | 복원 테스트 계획 | `diagram-managed` |
| | `audit` | Backup Audit Manager | `diagram-managed` |
| 그룹 `copies` (라벨 `사본`) | `other-region` | 다른 리전 | 무채색 |
| | `other-account` | 다른 계정 | 무채색 |

- `Organizations 백업 정책`(`estimateTextWidth` 122.5)과 `Backup Audit Manager`(110)는 여백 12를 더하면 2열(112)을
  넘으므로 **한 줄 전체 폭으로 편다.** 라벨을 줄이지 마라.
- **`diagram-resource`(청록)를 쓰지 마라.** 이 도식에는 VPC·서브넷 계층이 없다(ADR-036).
- **"백업 볼트" 노드를 만들지 마라.** 데이터에 근거가 없다(ADR-037 확장). 사본 경로는 `plan`에서 바로 나간다.

**시나리오 일곱**:

| id | label | 경로 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|
| `b1` | 보존 기간 | `rds` → `plan`, `dynamodb` → `plan` | 서비스 자체 백업은 35일까지다 · 그보다 오래 두거나 리전 간 복제가 필요하면 백업 계획으로 일정·보존·복사·만료 삭제를 설정한다 | `backup-disaster-recovery.backup-long-term-retention` |
| `b2` | 대상 지정 | `ec2` → `plan` | 볼륨만 지정하면 인스턴스를 다시 세울 구성이 빠진다 · 인스턴스를 지정해야 구성과 붙은 볼륨이 함께 담긴다 | `backup-disaster-recovery.backup-ec2-resource-assignment` |
| `b3` | 조직 전체 | `org-policy` → `plan` | 조직에서 한 번 정한 백업 계획이 회원 계정에 내려가고 새 계정에도 따라붙는다 | `backup-disaster-recovery.organizations-backup-policy` |
| `b4` | 연속 백업 | `s3` → `plan` | S3에 연속 백업을 걸면 특정 시점으로 되돌릴 수 있어 하루 한 번보다 잃는 구간이 짧다 | `backup-disaster-recovery.backup-s3-continuous-backup` |
| `b5` | 사본 위치 | `plan` → `other-region`, `plan` → `other-account` | 다른 리전은 리전 장애를, 다른 계정은 계정 침해와 실수 삭제를 막는다 | `backup-disaster-recovery.backup-cross-account-copy` |
| `b6` | 복원 검증 | `plan` → `restore-test` | 백업이 실제로 복원되는지 통제된 방식으로 자동 검증한다 · 검증 함수를 직접 만들 필요가 없다 | `backup-disaster-recovery.backup-restore-testing-plan` |
| `b7` | 감사 | `plan` → `audit` | 프레임워크를 기준으로 규정 준수와 암호화 여부를 감사해 보고서를 낸다 · 이름이 닮은 AWS Audit Manager와는 다른 서비스다 | `backup-disaster-recovery.backup-audit-manager` |

- `b2`의 선명한 노드에 `ebs`를 넣지 마라. 경로가 `ec2`에서 나가야 "인스턴스를 지정한다"가 그림으로 선다. `ebs`는 흐리게
  둬서 "볼륨이 아니라 인스턴스"를 보인다.
- 캡션은 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **320px에서 두 줄 이하가 되도록 50자 안팎으로**
  쓴다(phase 40 실측: 50자 넘는 캡션이 3줄이 됐다).
- 오답 대비("직접 만든 함수 대신" 등)는 글자로만 쓴다. 빨강·X·취소선을 쓰지 마라(ADR-036).
- `idleCaption`: 시나리오를 골라 백업의 판단 자리를 보라는 안내 한 문장. 도식의 `sources`:
  `backup-disaster-recovery.backup`, `backup-disaster-recovery.backup-long-term-retention`.
- `legend`: 파랑과 무채색이 각각 무엇인지 한 줄.

### 3. 테스트 — `BackupFlowDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 처음에는 노드 11개가 모두 선명하고 경로가 없다.
2. 시나리오마다 선명한 노드 집합과 보이는 경로가 위 표와 같다. `b2`에서 `ebs`는 흐리다.
3. 관문 5(viewBox 경계)·6(라벨 넘침)·7(폭 280). 노드마다 자기 그룹 박스 안에 있다.
4. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
5. 도식 안에 "볼트"라는 글자가 없다.
6. `ConceptList`에 `backup-audit-manager` 개념을 주면 본문 뒤에 이 도식이 온다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다. 세로는 얼마든 늘려도 된다.

## 검증 절차

1. AC를 실행한다.
2. 확인한다: 볼트·이모지·비유·빨강이 없는가, 캡션에 근거 표 밖 사실이 없는가, `DiagramFrame.tsx`·`topics.json`이 그대로인가.
3. `phases/41-backup-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, 전체 폭으로 편 노드, 가장 긴 캡션의 글자 수, 교차 검사 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **백업 볼트를 그리거나 캡션에 쓰지 마라.** 이유: 데이터에 근거가 없다(ADR-037 확장).
- **비유(Vercel·GitHub·npm·Lighthouse 등)와 이모지를 쓰지 마라.** 이유: 사용자 결정, UI_GUIDE 「AI 슬롭 안티패턴」.
- **자동 재생·흐르는 점 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **비교표를 만들지 마라.** 이유: step 1의 범위다.
- **`DiagramFrame.tsx`·`topics.json`·VPC 주제의 파일을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
