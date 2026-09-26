# Step 2: dr-choice

## 배경

`backup-disaster-recovery` 주제의 마지막 세 개념은 재해 복구 방식 셋이다 — **백업 및 복원**, **대기 리전**
(짧은 RTO가 요구하는 구성), **AWS Elastic Disaster Recovery**. 셋을 가르는 것은 두 질문이다. 원본이 어디 있는가
(온프레미스인가 AWS인가), 복구 시간 목표(RTO)가 얼마나 짧은가.

사용자가 가져온 HTML의 "재해 복구 고르기"는 이 두 질문을 흐름으로, 방식마다 복구 시간을 **막대 길이**로 그린다.
이 앱에서는 **막대를 그리지 않는다.** 데이터의 "몇 시간·60초·15분"은 실측한 복구 시간이 아니라 각 방식이 감당하는
RTO 요구의 예이고, 막대로 그리면 근거 없는 길이 관계를 만든다(ADR-037 확장 문단). 값은 **글자 라벨**로만 둔다.

**앵커는 `backup-disaster-recovery.elastic-disaster-recovery`**(셋 중 마지막)다. 세 방식을 다 읽은 뒤 가르는 도식이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-036, ADR-037**(확장 문단까지)
- `docs/UI_GUIDE.md`의 **「도식」 절 전체**, 특히 「두 줄 노드」
- `phases/41-backup-visuals/index.json`의 step 0·1 `summary`
- `src/types/visuals.ts`(`nodeNotes`), `src/data/visuals/backup-disaster-recovery.json`
- `src/components/diagrams/VpcDestinationDiagram.tsx` — 두 줄 노드의 선례
- `src/components/diagrams/BackupFlowDiagram.tsx` — 같은 주제의 도식(step 0)
- `src/components/diagrams/DiagramFrame.tsx` — **고치지 마라.**
- `src/lib/svg-bounds.ts`
- `src/data/topics.json`의 `backup-and-restore-dr`, `warm-standby-for-low-rto`, `elastic-disaster-recovery`

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/DrChoiceDiagram.tsx`
- 문구: JSON `diagrams["dr-choice"]`
- 매핑: `registry.ts`에 `'backup-disaster-recovery.elastic-disaster-recovery': DrChoiceDiagram` 한 줄

### 모양 — 세 단

| 그룹 id | 그룹 라벨 | 노드 id | 노드 라벨 | 색 |
|---|---|---|---|---|
| `source` | 원본 위치 | `onprem` | 온프레미스 | 무채색 |
| | | `aws` | AWS | 무채색 |
| `rto` | 복구 시간 목표 | `rto-hours` | 몇 시간 | 무채색 |
| | | `rto-seconds` | 60초처럼 짧음 | 무채색 |
| `strategy` | 재해 복구 방식 | `backup-restore` | 백업 및 복원 | `diagram-managed` |
| | | `warm-standby` | 대기 리전 | `diagram-managed` |
| | | `drs` | Elastic Disaster Recovery | `diagram-managed` |

- `strategy`의 세 노드는 **두 줄 노드**(높이 44, 전체 폭 240)다. 윗줄(`nodeNotes`, 곁말 9)은 **평소에 준비해 둔 것**,
  아랫줄은 방식 이름이다.

| 노드 | 윗줄에 담을 사실 | 근거 |
|---|---|---|
| `backup-restore` | 이미지와 백업만 옮겨 두고 컴퓨팅은 꺼 둔다 | `backup-disaster-recovery.backup-and-restore-dr` |
| `warm-standby` | 로드 밸런서와 최소 인스턴스가 실행 중, 데이터는 리전 간 복제 | `backup-disaster-recovery.warm-standby-for-low-rto` |
| `drs` | 원본 디스크 변경을 블록 단위로 계속 복제 | `backup-disaster-recovery.elastic-disaster-recovery` |

- 윗줄이 `estimateTextWidth(윗줄, 9) + 12 <= 240`을 넘으면 문장을 줄여라. 글자 크기를 내리지 마라.
- `Elastic Disaster Recovery`(137.5)는 전체 폭 노드라 들어간다. `AWS DRS`로 줄이지 마라 — 본문 제목이 풀네임이다.

### 시나리오 셋

| id | label | 선명한 노드 | 경로 | 캡션에 담을 사실 | `sources` |
|---|---|---|---|---|---|
| `r1` | 백업 및 복원 | `aws`, `rto-hours`, `backup-restore` | `aws` → `rto-hours` → `backup-restore` | 재해 뒤 CloudFormation 템플릿으로 인프라를 다시 세운다 · 정상 운영 비용이 가장 낮다 | `backup-disaster-recovery.backup-and-restore-dr` |
| `r2` | 대기 리전 | `aws`, `rto-seconds`, `warm-standby` | `aws` → `rto-seconds` → `warm-standby` | 상태 점검을 건 DNS 장애 조치가 자동으로 넘긴다 · 장애 뒤에 켜는 절차가 들어갈 자리가 없다 | `backup-disaster-recovery.warm-standby-for-low-rto` |
| `r3` | Elastic Disaster Recovery | `onprem`, `drs` | `onprem` → `drs` | 복제해 둔 상태로 인스턴스를 띄운다 · RTO가 15분처럼 짧아도 감당하고 장애 조치를 실제로 일으키지 않고 시험한다 | `backup-disaster-recovery.elastic-disaster-recovery` |

- `r3`의 경로는 `rto` 단을 **건너뛴다.** 온프레미스 원본은 RTO로 가르기 전에 이 서비스로 정해진다는 뜻이다.
  경로가 `rto` 그룹의 노드 상자를 뚫지 않게 통로를 잡아라(교차 검사가 확인한다).
- 캡션은 사실에서 **직접 써라.** 본문 문장을 옮기지 마라(ADR-009). **320px에서 두 줄 이하가 되도록 50자 안팎으로**
  쓴다. 두 사실이 다 안 들어가면 앞의 사실을 남긴다.
- `idleCaption`: 원본 위치와 복구 시간 목표로 방식을 고른다는 안내 한 문장. 도식의 `sources`: 세 개념 id 모두.
- `legend`: 파랑과 무채색이 각각 무엇인지 한 줄.

### 테스트 — `DrChoiceDiagram.test.tsx`

**먼저 쓰고 실패를 확인한 뒤** 구현한다.

1. 처음에는 노드 일곱이 모두 선명하고 경로가 없다.
2. 시나리오마다 선명한 노드와 보이는 경로가 위 표와 같다. `r3`에서 `rto-hours`·`rto-seconds`는 흐리다.
3. 관문 5·6(두 줄 노드는 두 줄 각각)·7. 노드마다 자기 그룹 안에 있다.
4. 도식 안에 막대·눈금이 없다 — `rect` 가운데 노드·그룹이 아닌 것이 없다.
5. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.

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
2. 확인한다: 시간 막대·축·비용 아이콘·이모지·애니메이션이 없는가, 캡션에 근거 표 밖 사실이 없는가.
3. `phases/41-backup-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`: 최종 `viewBox`, `r3` 경로를 통과시킨 통로, 가장 빠듯한 윗줄과 그 여유, 교차 검사 결과.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **복구 시간을 막대·축·눈금으로 그리지 마라.** 이유: ADR-037 확장. RTO 값은 라벨 글자로만 쓴다.
- **대기 리전과 Elastic Disaster Recovery의 비용을 비교하지 마라**(💰 개수 포함). 이유: 데이터에 근거가 없다.
  비용은 "백업 및 복원이 가장 낮다"만 말한다.
- **파일럿 라이트·다중 사이트 같은 방식을 더하지 마라.** 이유: 데이터에 없다.
- **"장애 재생" 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **DataSync·Storage Gateway 노드를 더하지 마라.** 이유: 이 도식의 일은 세 방식을 가르는 것이다. 그 대안이 왜 안 되는지는
  본문이 말한다.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
