# Step 4: vs-concepts

## 배경

ADR-051대로 노션의 vs 짝 가운데 앱에 짝을 세운 자리가 없던 넷에 딸린 개념과 문항을 넣는다. 개념 636 → 640개, 문항 742 → 746개(q743~q746).

| 새 개념 | 바로 앞 개념(`after`) | `parentId` | 문항 |
|---|---|---|---|
| `rds-storage-features.multi-az-vs-read-replica` 다중 AZ 배포 vs 읽기 전용 복제본 | `rds-storage-features.features` | 같다 | q743 |
| `efs-fsx.efs-vs-ebs` EFS vs EBS | `efs-fsx.efs` | 같다 | q745 |
| `sqs-sns-eventbridge.eventbridge-vs-sns` EventBridge vs SNS | `sqs-sns-eventbridge.eventbridge-vs-step-functions` | `sqs-sns-eventbridge.eventbridge` | q744 |
| `cost-management.compute-vs-ec2-instance-savings-plans` 컴퓨팅 절약 플랜 vs EC2 인스턴스 절약 플랜 | `cost-management.savings-plan` | 같다 | q746 |

본문은 두 항목의 목록(ADR-046)과 판단 문장 하나이고, 사실은 기존 개념과 ADR-039 「2026-10-23 확장 — 절약 플랜의 두 유형」에서 왔다. 무엇을 넣는지는
**`phases/66-exam-emphasis/changes.json`의 `newConcepts`·`newQuestions`에 글자 그대로 정해져 있다.** 그대로 적용한다. 이 step은 **부분 D**만 한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-051**(「새 개념과 문항」)과 ADR-039 끝의 **「2026-10-23 확장 — 절약 플랜의 두 유형」**, **ADR-046**(목록), **ADR-026**(개념마다 문항),
  **ADR-030**(문항 기준)
- `docs/source/aws-docs.md` 「절약 플랜의 두 유형」과 「목록 항목의 영문 이름」 표
- `phases/66-exam-emphasis/changes.json`의 `newConcepts`·`newQuestions`
- `phases/66-exam-emphasis/tools/content.mjs` — `applyNew`(스냅샷 항목·`conceptLineCount`·`questionsSha256`도 함께 고친다)
- `phases/66-exam-emphasis/tests-concepts.patch`

## 작업

### 1. 테스트를 먼저

```bash
git apply phases/66-exam-emphasis/tests-concepts.patch
npx vitest run src/data
```

`data.test.ts`의 개념 수 둘(24~38번 cost-management 17 → 18, 9~23번 rds-storage-features 22 → 23·sqs-sns-eventbridge 33 → 34), 개념 순서 넷(EFS·FSx, RDS,
메시징, 비용 관리), 목록 개념 목록(21 → 25개)이 바뀐다. **정확히 일곱이 실패해야 한다** — 「보안·운영 데이터 주제는 원본 항목 수만큼 개념을 가진다」, 「네트워크
데이터 주제는 원본 항목 수만큼 개념을 가진다」, 「EFS·FSx 주제가 … 블록 순서로 개념을 둔다」, 「RDS 주제가 … 블록 순서로 개념을 둔다」, 「메시징 주제가 …
블록 순서로 개념을 둔다」, 「비용 관리 주제가 … 블록 순서로 개념을 둔다」, 「목록이 있는 개념은 이 25개뿐이다」. 다르면 멈추고 `error`로 끝낸다.

### 2. 데이터

```bash
node phases/66-exam-emphasis/tools/apply.mjs --part D
```

`src/data/topics.json`에 개념 줄 넷, `src/data/questions.json` 끝에 문항 넷, `scripts/topics-baseline.json`에 항목 넷이 들어가고 `conceptLineCount` 636 → 640,
`questionsSha256`이 바뀐다. 도구가 던지면 손으로 고치지 말고 멈춰서 `error`로 끝낸다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/66-exam-emphasis/verify-content.mjs --through D
node scripts/coverage.mjs
node scripts/content-audit.mjs
node scripts/explanation-audit.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` 통과(2698개). 해설 약어 풀네임·정답 위치·문항 형식 테스트도 그대로 통과한다.
   - `check-structure.mjs` — 「구조 이상 없음」. `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-content.mjs --through D` — 「✓ … 부분 A~D를 적용한 결과와 같다」.
   - `coverage.mjs` — 「개념 640개 중 640개 덮임 (100%) … 문항 746개」.
   - `content-audit.mjs` — 전체 ⑤ 장문 4건(설계 전과 같다), 네 주제의 ③ 노출 수가 설계 전과 같다(efs-fsx 4, rds-storage-features 3, sqs-sns-eventbridge 4,
     cost-management 0).
2. `git status`로 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts`와 phase 메타데이터뿐인지 확인한다.
3. `phases/66-exam-emphasis/index.json`의 step 4를 갱신한다. 성공이면 `summary`에 새 개념 id 넷, 새 문항 넷, 실패를 확인한 테스트 일곱, 전체 테스트 수를 적는다.

## 금지사항

- **`changes.json`의 문장·위치·문항·정답 위치를 바꾸지 마라.** 이유: 사용자가 미리보기로 보고 승인한 글자이고, 정답 위치(2·1·3·3)는 0~3번의 문항 수를 맞춘 값이다.
  이상해 보이면 고치지 말고 `summary`에 적어라.
- **기존 개념과 기존 문항을 고치지 마라.** 이유: ADR-051은 새 개념·새 문항만 더한다. `features`·`savings-plan-details` 같은 이웃 개념도 그대로다.
- **새 개념에 분류 문장(「AWS 분류로는 … 쪽 서비스다」)을 넣지 마라.** 이유: 서비스 소개 개념이 아니라 딸린 갈림길 개념이다.
- **`topics.json`·`questions.json`·`topics-baseline.json`을 재직렬화하지 마라.** 이유: 한 줄 포맷과 스냅샷 해시가 깨진다.
- **패치 밖의 테스트를 고치지 마라.** 이유: 설계가 예상하지 못한 의존이라 사람이 판단해야 한다.
- 기존 테스트를 깨뜨리지 마라.
