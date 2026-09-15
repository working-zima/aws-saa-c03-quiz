# phase 36 수정 후보 인계 목록 — 다음 phase의 입력

**확신이 높은 항목도 이 phase에서 자동으로 고치지 않는다. 다음 phase 설계 단계에서 사람이 목록을 다시 확인한다.**

이 파일은 `tools/aggregate.mjs`가 `audit/verdicts.jsonl`(개념 판정)·`audit/cross-phase35.jsonl`(교차 분류)·phase 35
`audit/verdicts.jsonl`(문항 판정)·`src/data/`에서 만든다. 숫자와 줄 번호는 스크립트가 센 값이고, 판정·데이터·테스트는 한 줄도
바꾸지 않았다. 기준은 ADR-035(개념 소속)·ADR-034(문항 소속)·ADR-033(서비스 블록 순서)·ADR-026(개념당 최소 1문항)이다.
전체 집계는 [report.md](report.md)에 있다.

## 목차와 건수

| 절 | 무엇 | 후보 | 영향 문항 |
| --- | --- | --- | --- |
| 1 | 확신이 높은 구조 오류 — move-recommended + confidence=high | 4 | 6 |
| 2 | 2A — 같은 주제 안에서 문항의 conceptId만 바꿀 후보 | 14 | 14 |
| 3 | 2B — 문항의 topicId·conceptId를 함께 바꿀 후보 | 4 | 4 |
| 4 | 3 — 개념을 옮기고 연결 문항이 따라가는 후보 | 2 | 2 |
| 5 | 4 — 개념과 문항이 둘 다 재배정 후보 | 0 | 0 |
| 6 | 보류 목록 — ambiguous · confidence medium·low · hold | 21 | 24 |

한 개념이 여러 절에 걸칠 수 있다 — 유형 3은 언제나 1절의 개념이고, 1절에도 교차 분류가 hold인 개념이 있다. 상세는 처음 나오는
절에 한 번 적고 뒤 절은 그 절을 가리킨다.

## 모든 후보에 공통으로 함께 고칠 것

- `src/data/questions.json`을 한 글자라도 고치면 `scripts/topics-baseline.json`의 `questionsSha256`을 같은 커밋에서 갱신한다
  — `scripts/check-structure.mjs`가 대조한다. 지금 값은 `aadc1894b3eb2d9211159ef346057bf24510ba534b78ccade4d40bf018343f54`이고, 되돌릴 때는 이 값으로 되돌린다.
- 개념을 옮기거나 순서를 바꾸면 `scripts/topics-baseline.json`의 개념 항목 순서·id를 `topics.json`과 같게 옮긴다(ADR-033).
  `scripts/sync-baseline.mjs`는 순서 변경을 거부하므로 손으로 고친다.
- 개념 배열이 바뀐 주제는 `src/data/data.test.ts`의 주제별 순서 단언과 그 블록 주석(규칙 5 기록)을 함께 고친다.
- 문항의 `topicId`는 `conceptId`가 속한 주제와 같아야 한다(ADR-034). 둘 중 하나만 바꾸지 않는다.
- 개념마다 문항이 하나 이상 남아야 한다(ADR-026). 예외 목록을 만들어 통과시키지 않는다.

## 1. 확신이 높은 구조 오류 — move-recommended + confidence=high 4건

### `ebs-instance-store.spread-placement-group` → `ec2-autoscaling`

- 판정: move-recommended · confidence **high** · serviceSpecificGoal true · 교차 유형 **3** · 판정 step 3
- 현재 개념·주제: `ebs-instance-store.spread-placement-group` · `ebs-instance-store`(위치 14/15)
- 권장 개념·주제: `ec2-autoscaling.spread-placement-group` · `ec2-autoscaling`
- 학습 목표: 분산 배치 그룹이 EC2 인스턴스를 서로 다른 하드웨어에 흩어 동시 장애를 줄이며, 여러 가용 영역과 함께 쓰면 하드웨어·가용 영역 장애를 함께 막는다는 것을 이해한다.
- 영향 받는 문항 전체: q287
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`ebs-instance-store.spread-placement-group` → `ec2-autoscaling.spread-placement-group`)
- 문항 topicId 변경: 예 — q287 `ebs-instance-store` → `ec2-autoscaling`
- 문항 conceptId 변경: 예 — q287 `ebs-instance-store.spread-placement-group` → `ec2-autoscaling.spread-placement-group`
- 문항별 근거(phase 35 판정):
  - q287 — 문항 판정 keep이라 개념을 따라간다. 결정 지식: 두 인스턴스가 같은 물리 하드웨어에 놓이지 않게 하려면 분산 배치 그룹을 쓰고, 가용 영역 장애까지 견디려면 그 그룹을 여러 가용 영역에 걸쳐 쓴다.
- 원 주제(source) `ebs-instance-store` · 대상 주제(target) `ec2-autoscaling`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: ec2-autoscaling에서 cluster-placement-group 바로 뒤에 둔다. 클러스터 배치 그룹과 목적이 정반대라는 대비를 전제로 쓰고(규칙 5) 같은 배치 그룹 하위 기능이라 연속으로 둔다(규칙 3). conceptId가 ec2-autoscaling.*로 바뀌고 연결 문항 q287도 함께 옮겨야 한다.
  - 지정한 앞뒤 개념 `ebs-instance-store.cluster-placement-group`이 지금 `ec2-autoscaling`에 없어 이 후보만으로는 자리가 정해지지 않는다 — 그 개념의 이동과 함께 정해야 한다
  - 대상 주제의 순서 단언: `data.test.ts` 3426줄 it 「EC2·Auto Scaling 주제가 인스턴스 재료·제품군·구매 옵션·조정 정책·혼합 구성·운영 블록 순서로 개념을 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `cluster-placement-group`[이동 후보] · 뒤 `elastic-fabric-adapter`[이동 후보] → 빼면 둘이 맞붙는다. 개념 15 → 14
  - 원 주제의 순서 단언: `data.test.ts` 3126줄 it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 18 → 19. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`분산 배치 그룹`): `ebs-instance-store.elastic-fabric-adapter`[이동 후보]
  - 원 주제 쪽 영향: 원 주제에서 이 개념을 언급하는 것은 `ebs-instance-store.elastic-fabric-adapter`(흩어 놓는 구성은 저지연 요구를 절반만 채운다는 대비)이고 그것도 이동 후보다. 원 주제에 남는 EBS·인스턴스 스토어 개념은 이 개념을 쓰지 않아 빼도 전제를 잃는 개념이 생기지 않는다. 대신 이 개념 본문이 `ebs-instance-store.cluster-placement-group`을 대비로 전제하므로, confidence가 medium이라 보류된 그 개념과 따로 옮기면 두 주제 중 한쪽에만 전제가 남는다.
- 커버리지 영향(ADR-026):
  - 원 id `ebs-instance-store.spread-placement-group`는 사라지고, 연결 문항 1개 중 1개가 새 id를 따라간다
  - 새 개념 `ec2-autoscaling.spread-placement-group`의 문항 1개
- 함께 고칠 곳:
  - `src/data/topics.json` — `ebs-instance-store`에서 빼고 `ec2-autoscaling`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q287의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 407줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 863줄(const step3Concepts) · 3146줄(it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q287 → 873줄 it 「S3 수명 주기·암호화·블록 스토리지 문제 24개가 담당 개념과 일대일로 이어진다」(topicId·conceptId) · 891줄 it 「S3 수명 주기·암호화·블록 스토리지 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 901줄 it 「S3 수명 주기·암호화·블록 스토리지 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `ec2-autoscaling.spread-placement-group`를 빼고 id를 `ebs-instance-store.spread-placement-group`로 되돌려 `ebs-instance-store`의 위치 14(앞 `cluster-placement-group` · 뒤 `elastic-fabric-adapter`)에 다시 넣는다. `questions.json`의 q287 topicId를 `ebs-instance-store`·conceptId를 `ebs-instance-store.spread-placement-group`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 학습 목표는 EC2 인스턴스의 물리 배치 전략으로 가용성을 얻는 방법이며 본문에 블록 스토리지·스냅샷·인스턴스 스토어와 이어지는 내용이 없다. 목표가 EC2 고유 기능이고 EC2 서비스를 다루는 주제가 ec2-autoscaling으로 따로 있으므로, 서비스 고유 목표이면서도 다른 주제를 명확히 더 적절한 자리로 권한다.
- 교차 근거(cross-phase35.jsonl): 개념은 ec2-autoscaling으로 high 이동 권고이고 q287은 현재 개념을 그대로 권해 3이다. q287의 결정적 지식이 분산 배치 그룹 자체라 개념을 옮기면 문항이 따라가며, 다음 phase는 conceptId를 ec2-autoscaling.spread-placement-group으로 바꾸면서 q287의 topicId·conceptId도 함께 바꾼다. blockImpact의 자리가 cluster-placement-group 바로 뒤인데 그 개념이 medium이라 hold이므로 두 개념의 이동을 함께 정해야 한다.

### `ebs-instance-store.elastic-fabric-adapter` → `ec2-autoscaling`

- 판정: move-recommended · confidence **high** · serviceSpecificGoal true · 교차 유형 **3** · 판정 step 3
- 현재 개념·주제: `ebs-instance-store.elastic-fabric-adapter` · `ebs-instance-store`(위치 15/15)
- 권장 개념·주제: `ec2-autoscaling.elastic-fabric-adapter` · `ec2-autoscaling`
- 학습 목표: EFA는 운영체제 네트워크 스택을 건너뛰어 노드 간 통신 지연을 줄이는 EC2 네트워크 장치로, 향상된 네트워킹보다 한 단계 위이며 클러스터 배치 그룹과 짝을 이룬다는 것을 이해한다.
- 영향 받는 문항 전체: q284
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`ebs-instance-store.elastic-fabric-adapter` → `ec2-autoscaling.elastic-fabric-adapter`)
- 문항 topicId 변경: 예 — q284 `ebs-instance-store` → `ec2-autoscaling`
- 문항 conceptId 변경: 예 — q284 `ebs-instance-store.elastic-fabric-adapter` → `ec2-autoscaling.elastic-fabric-adapter`
- 문항별 근거(phase 35 판정):
  - q284 — 문항 판정 keep이라 개념을 따라간다. 결정 지식: Elastic Fabric Adapter는 EC2의 운영체제 네트워크 스택을 우회해 HPC 노드 사이의 통신 지연을 줄이는 장치다.
- 원 주제(source) `ebs-instance-store` · 대상 주제(target) `ec2-autoscaling`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: ec2-autoscaling의 enhanced-networking 바로 뒤, reserved-instance-types로 시작하는 구매 옵션 블록 앞에 둔다. 문단 1이 향상된 네트워킹을, 문단 2가 두 배치 그룹을 전제로 쓰므로 규칙 5에 따라 셋보다 뒤다. conceptId가 ec2-autoscaling.*로 바뀌고 연결 문항 q284도 함께 옮겨야 한다.
  - 지금 배열에 이 후보만 넣으면 위치 7/19 — 앞 `enhanced-networking` · 뒤 `reserved-instance-types`
  - 대상 주제의 순서 단언: `data.test.ts` 3426줄 it 「EC2·Auto Scaling 주제가 인스턴스 재료·제품군·구매 옵션·조정 정책·혼합 구성·운영 블록 순서로 개념을 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `spread-placement-group`[이동 후보] · 뒤 없음(맨 끝) → 빼면 둘이 맞붙는다. 개념 15 → 14
  - 원 주제의 순서 단언: `data.test.ts` 3126줄 it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 18 → 19. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`EFA|Elastic Fabric Adapter`): 없음
  - 원 주제 쪽 영향: 원 주제에 남는 개념 중 EFA를 언급하는 것은 없어 빼도 원 주제에서 전제를 잃는 개념이 생기지 않는다. 이 개념 본문이 비교 기준으로 쓰는 향상된 네트워킹(`ec2-autoscaling.enhanced-networking`)은 지금도 대상 주제에만 있고, 본문이 전제로 쓰는 두 배치 그룹은 이동 후보라 함께 옮겨야 대상 주제에서 전제가 모두 선다.
- 커버리지 영향(ADR-026):
  - 원 id `ebs-instance-store.elastic-fabric-adapter`는 사라지고, 연결 문항 1개 중 1개가 새 id를 따라간다
  - 새 개념 `ec2-autoscaling.elastic-fabric-adapter`의 문항 1개
- 함께 고칠 곳:
  - `src/data/topics.json` — `ebs-instance-store`에서 빼고 `ec2-autoscaling`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q284의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 411줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 860줄(const step3Concepts) · 3147줄(it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q284 → 873줄 it 「S3 수명 주기·암호화·블록 스토리지 문제 24개가 담당 개념과 일대일로 이어진다」(topicId·conceptId) · 891줄 it 「S3 수명 주기·암호화·블록 스토리지 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 901줄 it 「S3 수명 주기·암호화·블록 스토리지 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `ec2-autoscaling.elastic-fabric-adapter`를 빼고 id를 `ebs-instance-store.elastic-fabric-adapter`로 되돌려 `ebs-instance-store`의 위치 15(앞 `spread-placement-group` · 뒤 없음(맨 끝))에 다시 넣는다. `questions.json`의 q284 topicId를 `ebs-instance-store`·conceptId를 `ebs-instance-store.elastic-fabric-adapter`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 학습 목표는 EC2 인스턴스 사이 통신 경로를 줄이는 네트워크 장치이며 스토리지와 이어지는 내용이 없다. 본문이 비교 기준으로 쓰는 향상된 네트워킹이 EC2 서비스 주제인 ec2-autoscaling에 있어 그쪽이 명확히 더 적절하므로, 서비스 고유 목표이면서도 다른 주제를 권한다.
- 교차 근거(cross-phase35.jsonl): 개념은 ec2-autoscaling으로 high 이동 권고이고 q284는 현재 개념을 그대로 권해 3이다. q284의 결정적 지식이 EFA의 운영체제 네트워크 스택 우회라 개념을 옮기면 문항이 따라가며, 다음 phase는 conceptId를 ec2-autoscaling.elastic-fabric-adapter로 바꾸면서 q284의 topicId·conceptId도 함께 바꾼다. 본문이 두 배치 그룹을 전제로 쓰는데 cluster-placement-group이 hold이므로 blockImpact의 자리는 그 처리와 함께 정해야 한다.

### `api-gateway-step-functions.api-gateway-behind-cloudfront` → `cloudfront-global-accelerator`

- 판정: move-recommended · confidence **high** · serviceSpecificGoal true · 교차 유형 **hold**(문항 ambiguous) · 판정 step 7
- 현재 개념·주제: `api-gateway-step-functions.api-gateway-behind-cloudfront` · `api-gateway-step-functions`(위치 9/20)
- 권장 개념·주제: `cloudfront-global-accelerator.api-gateway-behind-cloudfront` · `cloudfront-global-accelerator`
- 학습 목표: CloudFront의 오리진에 동적 HTTP API도 연결하면 정적 파일과 API 응답 모두 엣지를 이용하고 캐시 가능한 응답의 원본 호출을 줄일 수 있음을 이해한다.
- 영향 받는 문항 전체: q538
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`api-gateway-step-functions.api-gateway-behind-cloudfront` → `cloudfront-global-accelerator.api-gateway-behind-cloudfront`)
- 문항 topicId 변경: 예 — q538 `api-gateway-step-functions` → `cloudfront-global-accelerator`(확정되지 않음)
- 문항 conceptId 변경: 예 — q538 `api-gateway-step-functions.api-gateway-behind-cloudfront` → `cloudfront-global-accelerator.api-gateway-behind-cloudfront`(확정되지 않음)
- 문항별 근거(phase 35 판정):
  - q538 — 문항 판정 ambiguous이라 개념을 따라갈지 확정되지 않았다. 따라가면 새 id로 간다. 결정 지식: 정적 버킷과 동적 API를 같은 CloudFront 배포의 오리진으로 함께 등록하면 지연 감소와 오리진 호출 감소가 한 구성에서 나온다.
- 원 주제(source) `api-gateway-step-functions` · 대상 주제(target) `cloudfront-global-accelerator`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: cloudfront-global-accelerator의 CloudFront 오리진 블록에서 cloudfront-multiple-origins 뒤·cloudfront-onprem-origin 앞에 두어 여러 오리진의 기본 구성을 익힌 뒤 HTTP API 연결을 읽도록 한다.
  - 지금 배열에 이 후보만 넣으면 위치 4/25 — 앞 `cloudfront-multiple-origins` · 뒤 `cloudfront-onprem-origin`
  - 대상 주제의 순서 단언: `data.test.ts` 3485줄 it 「CloudFront·Global Accelerator 주제가 CloudFront·엣지 함수·Global Accelerator 블록 다음에 둘의 비용 비교를 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `api-gateway-endpoint-types` · 뒤 `api-gateway-lambda-proxy-integration` → 빼면 둘이 맞붙는다. 개념 20 → 19
  - 원 주제의 순서 단언: `data.test.ts` 3668줄 it 「API Gateway·Step Functions 주제가 API Gateway·Step Functions·Amplify 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 24 → 25. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`CloudFront`): `api-gateway-step-functions.api-gateway-websocket-api` · `api-gateway-step-functions.api-gateway-endpoint-types` · `api-gateway-step-functions.api-gateway-custom-domain-name`
  - 원 주제 쪽 영향: 원 주제에 CloudFront를 언급하는 개념은 있지만 HTTP API를 CloudFront 오리진으로 등록하는 구성을 전제로 쓰는 것은 없다. `api-gateway-step-functions.api-gateway-websocket-api`는 CloudFront가 상태를 들고 있는 연결을 대신하지 못한다는 대비로, `api-gateway-step-functions.api-gateway-endpoint-types`는 엣지 최적화 엔드포인트가 CloudFront를 거친다는 경로로, `api-gateway-step-functions.api-gateway-custom-domain-name`은 인증서 리전 예외로 각자 그 자리에서 쓴다. 빼면 API Gateway 블록에서 API 앞에 CloudFront를 두는 구성이 사라지므로, 원 주제에 그 구성을 가리키는 문장을 남길지는 설계에서 정한다.
- 커버리지 영향(ADR-026):
  - 원 id `api-gateway-step-functions.api-gateway-behind-cloudfront`는 사라지고, 연결 문항 1개 중 0개가 새 id를 따라간다 · 확정되지 않은 문항 1개(q538)
  - 새 개념 `cloudfront-global-accelerator.api-gateway-behind-cloudfront`의 문항 0개(확정되지 않은 문항까지 따라가면 1개) — **확정되지 않은 문항이 따라가지 않으면 문항이 없어 불변식이 깨진다**
- 함께 고칠 곳:
  - `src/data/topics.json` — `api-gateway-step-functions`에서 빼고 `cloudfront-global-accelerator`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q538의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 1474줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 1802줄(const step12Concepts) · 3684줄(it 「API Gateway·Step Functions 주제가 API Gateway·Step Functions·Amplify 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q538 → 1813줄 it 「API Gateway·Step Functions 문제 20개가 담당 개념 16개를 빠짐없이 덮는다」(topicId·conceptId) · 1828줄 it 「API Gateway·Step Functions 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 1838줄 it 「API Gateway·Step Functions 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `cloudfront-global-accelerator.api-gateway-behind-cloudfront`를 빼고 id를 `api-gateway-step-functions.api-gateway-behind-cloudfront`로 되돌려 `api-gateway-step-functions`의 위치 9(앞 `api-gateway-endpoint-types` · 뒤 `api-gateway-lambda-proxy-integration`)에 다시 넣는다. `questions.json`의 q538 topicId를 `api-gateway-step-functions`·conceptId를 `api-gateway-step-functions.api-gateway-behind-cloudfront`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 중심은 CloudFront가 동적 응답도 오리진에서 받아 엣지로 전달·캐시한다는 기능이며 HTTP API는 그 기능을 적용할 백엔드다. API Gateway의 고유 설정이나 유형 선택보다 CloudFront의 오리진 범위를 가르치므로, 서비스 고유 목표를 실제 소유한 엣지 주제로 옮기는 것이 맞다.
- 교차 근거(cross-phase35.jsonl): 개념은 cloudfront-global-accelerator로 high 이동 권고지만 유일한 문항 q538이 ambiguous라 hold다. q538의 두 해석 중 한 CloudFront 배포의 여러 오리진이라는 전송 지식은 개념의 권장 방향과 같지만, HTTP API를 오리진으로 등록한다는 API Gateway 연동 해석이 남아 문항이 개념을 따라갈지 확정되지 않는다.

### `waf-shield.cloudfront` → `cloudfront-global-accelerator`

- 판정: move-recommended · confidence **high** · serviceSpecificGoal true · 교차 유형 **hold**(이동 권고의 confidence가 high가 아님) · 판정 step 10
- 현재 개념·주제: `waf-shield.cloudfront` · `waf-shield`(위치 2/15)
- 권장 개념·주제: `cloudfront-global-accelerator.cloudfront` · `cloudfront-global-accelerator` — **이 id는 이미 있는 개념 id와 같아 새 slug를 정해야 한다**
- 학습 목표: CloudFront 배포는 콘텐츠 캐시·무효화, 원본 접근 제어와 요청 경로별 오리진 선택을 함께 제공한다는 기능 범위를 이해한다.
- 영향 받는 문항 전체: q152 · q153 · q154
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`waf-shield.cloudfront` → `cloudfront-global-accelerator.cloudfront`)
- 문항 topicId 변경: 예 — q152 `waf-shield` → `cloudfront-global-accelerator` · q153 `waf-shield` → `cloudfront-global-accelerator` · q154 `waf-shield` → `cloudfront-global-accelerator`
- 문항 conceptId 변경: 예 — q152 `waf-shield.cloudfront` → `cloudfront-global-accelerator.cloudfront` · q153 `waf-shield.cloudfront` → `cloudfront-global-accelerator.cloudfront-ttl` · q154 `waf-shield.cloudfront` → `cloudfront-global-accelerator.cloudfront-multiple-origins`
- 문항별 근거(phase 35 판정):
  - q152 — 문항 판정 move-recommended·medium · 권장 개념 없음이라 개념을 따라간다. 결정 지식: OAC는 원본에 접근할 수 있는 주체를 CloudFront로 한정해 배포를 거치지 않고 원본에 직접 닿는 경로를 막는 CloudFront의 기능이다.
  - q153 — 문항 판정 move-recommended·high이 `cloudfront-global-accelerator.cloudfront-ttl`을 권해 개념을 따라가지 않고 그 개념으로 간다. 결정 지식: 캐시 무효화는 엣지에 남은 캐시 사본을 강제로 지워 TTL이 남아 있어도 다음 요청부터 원본의 새 결과를 가져오게 한다.
  - q154 — 문항 판정 move-recommended·high이 `cloudfront-global-accelerator.cloudfront-multiple-origins`을 권해 개념을 따라가지 않고 그 개념으로 간다. 결정 지식: CloudFront의 멀티 오리진은 배포 하나에 여러 원본을 등록하고 요청 경로별로 응답할 원본을 나누는 기능이다.
- 원 주제(source) `waf-shield` · 대상 주제(target) `cloudfront-global-accelerator`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: cloudfront-global-accelerator의 CloudFront 블록에서 기본 소개 cloudfront 뒤·cloudfront-alb-origin 앞에 두어 캐시·OAC·멀티 오리진의 기능 개요를 각 오리진과 캐시 세부보다 먼저 읽게 하며, 기존 multiple-origins·ttl과 부분적으로 겹치는 내용의 정리는 후속 설계에 남긴다.
  - 지금 배열에 이 후보만 넣으면 위치 2/25 — 앞 `cloudfront` · 뒤 `cloudfront-alb-origin`
  - 대상 주제의 순서 단언: `data.test.ts` 3485줄 it 「CloudFront·Global Accelerator 주제가 CloudFront·엣지 함수·Global Accelerator 블록 다음에 둘의 비용 비교를 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `waf` · 뒤 `waf-attach-targets` → 빼면 둘이 맞붙는다. 개념 15 → 14
  - 원 주제의 순서 단언: `data.test.ts` 4717줄 it 「WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 24 → 25. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`CloudFront`): `waf-shield.waf-attach-targets` · `waf-shield.waf-rate-based-rule` · `waf-shield.firewall-manager`
  - 원 주제 쪽 영향: 원 주제에서 `waf-shield.waf-attach-targets`가 CloudFront와 멀티 오리진 구성을 전제로 쓴다 — `data.test.ts`의 순서 단언 주석이 바로 이 전제 때문에 규칙 5로 이 개념을 그 앞에 두었다고 적었다. `waf-shield.waf-rate-based-rule`(CloudFront가 앞에 있으면 엣지에서 끊는다)과 `waf-shield.firewall-manager`(계정마다 흩어진 CloudFront 배포)도 CloudFront를 언급하지만 이 개념이 소개한 기능을 전제로 쓰지는 않는다. 빼면 원 주제에서 CloudFront가 무엇인지 소개하는 개념이 사라지므로, 남는 개념에 CloudFront의 성격 한 줄을 붙일지(ADR-027·ADR-029의 주제 밖 서비스 성격 한 줄) 이동과 함께 설계해야 한다. 이 개념 본문의 캐시 무효화·멀티 오리진은 대상 주제의 `cloudfront-global-accelerator.cloudfront-ttl`·`cloudfront-global-accelerator.cloudfront-multiple-origins`와 부분적으로 겹친다.
- 커버리지 영향(ADR-026):
  - 원 id `waf-shield.cloudfront`는 사라지고, 연결 문항 3개 중 1개가 새 id를 따라간다 · 다른 개념으로 가는 문항 2개(q153 · q154)
  - 새 개념 `cloudfront-global-accelerator.cloudfront`의 문항 1개
  - q153의 대상 개념 `cloudfront-global-accelerator.cloudfront-ttl`: 문항 1 → 2
  - q154의 대상 개념 `cloudfront-global-accelerator.cloudfront-multiple-origins`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/topics.json` — `waf-shield`에서 빼고 `cloudfront-global-accelerator`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q152 · q153 · q154의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 2390줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 4726줄(it 「WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다」) · 6429줄(블록 밖)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q152 → 373줄 it 「보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다」(topicId·conceptId) · 406줄 it 「보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) / q153 → 373줄 it 「보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다」(topicId·conceptId) · 406줄 it 「보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) / q154 → 373줄 it 「보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다」(topicId·conceptId) · 406줄 it 「보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `cloudfront-global-accelerator.cloudfront`를 빼고 id를 `waf-shield.cloudfront`로 되돌려 `waf-shield`의 위치 2(앞 `waf` · 뒤 `waf-attach-targets`)에 다시 넣는다. `questions.json`의 q152 topicId를 `waf-shield`·conceptId를 `waf-shield.cloudfront`, q153 topicId를 `waf-shield`·conceptId를 `waf-shield.cloudfront`, q154 topicId를 `waf-shield`·conceptId를 `waf-shield.cloudfront`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 중심은 WAF의 공격 검사나 적용 조건이 아니라 CloudFront 배포 자체의 캐시·OAC·멀티 오리진 기능이다. 뒤의 WAF 연결을 위한 소개 역할은 있지만 본문 전체가 가르치는 고유 기능의 주제는 cloudfront-global-accelerator이며, aws-core-services.cloudfront는 CDN의 거리 문제만 설명해 깊이가 달라 중복으로 보지 않는다.
- 교차 근거(cross-phase35.jsonl): 개념과 세 문항이 모두 cloudfront-global-accelerator를 가리켜 방향은 같지만 q152의 이동 권고가 medium이라 hold다. q152는 권장 개념이 null이라 대상 개념이 없어 추가 설계가 필요하다(그 주제에서 OAC를 담은 cloudfront-s3-upload-with-oac는 업로드 경로가 중심). q153은 cloudfront-ttl, q154는 cloudfront-multiple-origins로 기존 개념에 재연결되므로 개념을 옮겨도 따라갈 수 있는 문항은 q152뿐이고, 옮긴 id cloudfront-global-accelerator.cloudfront는 이미 있는 개념과 겹쳐 새 slug가 필요하다.

### 대상 주제별로 넣어 본 배열

`blockImpact`가 지정한 앞 개념 바로 뒤에 넣고, 앞 개념이 아직 없으면 뒤 개념 바로 앞에 넣는다. 앞 개념이 다른 이동 후보면 그 후보가
들어간 뒤에 넣는다. 굵은 칸이 들어온 후보(옮기기 전 id · confidence)다.

#### `ec2-autoscaling` — 지금 개념 18개

- confidence high만 넣을 때 — 넣은 후보 2건 · 자리가 정해지지 않은 후보 `ebs-instance-store.spread-placement-group`
  - 1 ec2 · 2 ami-and-launch-template · 3 ec2-image-builder · 4 memory-optimized-instance-family · 5 gpu-instance-family · 6 enhanced-networking · **7 `ebs-instance-store.elastic-fabric-adapter`(high)** · 8 reserved-instance-types · 9 spot-workload-fit · 10 scheduled-scaling · 11 target-tracking-vs-simple-scaling · 12 predictive-scaling · 13 spot-allocation-strategy · 14 asg-instance-type-override · 15 asg-on-demand-base-capacity · 16 warm-pool · 17 asg-single-instance-self-healing · 18 elb-health-check-drives-asg-replacement · 19 parallelcluster
- 이동 권고를 모두 넣을 때 — 넣은 후보 4건 · 지정한 앞뒤와 맞붙지 않는 자리 1건
  - 1 ec2 · 2 ami-and-launch-template · 3 ec2-image-builder · 4 memory-optimized-instance-family · 5 gpu-instance-family · **6 `ebs-instance-store.cluster-placement-group`(medium)** · **7 `ebs-instance-store.spread-placement-group`(high)** · 8 enhanced-networking · **9 `ebs-instance-store.elastic-fabric-adapter`(high)** · 10 reserved-instance-types · 11 spot-workload-fit · 12 scheduled-scaling · 13 target-tracking-vs-simple-scaling · 14 predictive-scaling · **15 `sqs-sns-eventbridge.sqs-queue-depth-scaling`(medium)** · 16 spot-allocation-strategy · 17 asg-instance-type-override · 18 asg-on-demand-base-capacity · 19 warm-pool · 20 asg-single-instance-self-healing · 21 elb-health-check-drives-asg-replacement · 22 parallelcluster
  - `ebs-instance-store.cluster-placement-group`: 지정한 뒤 개념 `ec2-autoscaling.enhanced-networking` 대신 `ebs-instance-store.spread-placement-group`이 붙는다

#### `cloudfront-global-accelerator` — 지금 개념 24개

- confidence high만 넣을 때 — 넣은 후보 2건
  - 1 cloudfront · **2 `waf-shield.cloudfront`(high)** · 3 cloudfront-alb-origin · 4 cloudfront-multiple-origins · **5 `api-gateway-step-functions.api-gateway-behind-cloudfront`(high)** · 6 cloudfront-onprem-origin · 7 cloudfront-signed-url · 8 cloudfront-signed-cookie · 9 cloudfront-geo-restriction · 10 cloudfront-field-level-encryption · 11 cloudfront-price-class · 12 cloudfront-ttl · 13 cloudfront-s3-upload-with-oac · 14 cloudfront-alb-origin-access-restriction · 15 edge-keyword · 16 lambda-at-edge · 17 lambda-at-edge-origin-selection-by-viewer-location · 18 lambda-at-edge-response-compression · 19 cloudfront-functions · 20 cloudfront-functions-no-external-calls · 21 global-accelerator · 22 global-accelerator-static-ip · 23 global-accelerator-endpoints · 24 global-accelerator-protocols · 25 global-accelerator-vs-dns-failover · 26 cloudfront-reduces-data-transfer-cost
- 이동 권고를 모두 넣을 때 — 넣은 후보 2건
  - 1 cloudfront · **2 `waf-shield.cloudfront`(high)** · 3 cloudfront-alb-origin · 4 cloudfront-multiple-origins · **5 `api-gateway-step-functions.api-gateway-behind-cloudfront`(high)** · 6 cloudfront-onprem-origin · 7 cloudfront-signed-url · 8 cloudfront-signed-cookie · 9 cloudfront-geo-restriction · 10 cloudfront-field-level-encryption · 11 cloudfront-price-class · 12 cloudfront-ttl · 13 cloudfront-s3-upload-with-oac · 14 cloudfront-alb-origin-access-restriction · 15 edge-keyword · 16 lambda-at-edge · 17 lambda-at-edge-origin-selection-by-viewer-location · 18 lambda-at-edge-response-compression · 19 cloudfront-functions · 20 cloudfront-functions-no-external-calls · 21 global-accelerator · 22 global-accelerator-static-ip · 23 global-accelerator-endpoints · 24 global-accelerator-protocols · 25 global-accelerator-vs-dns-failover · 26 cloudfront-reduces-data-transfer-cost

#### `identity-federation` — 지금 개념 11개

- confidence high만 넣을 때 — 넣은 후보 0건
  - 1 identity-center · 2 identity-center-external-idp · 3 identity-center-permission-set · 4 sts · 5 sts-assume-role · 6 aws-directory-service · 7 custom-identity-broker-for-non-saml · 8 saml-federation-role-to-ad-group-mapping · 9 cognito · 10 cognito-pools · 11 cognito-social-idp-federation
- 이동 권고를 모두 넣을 때 — 넣은 후보 1건
  - 1 identity-center · 2 identity-center-external-idp · 3 identity-center-permission-set · 4 sts · 5 sts-assume-role · **6 `iam-permissions.iam-roles-anywhere`(medium)** · 7 aws-directory-service · 8 custom-identity-broker-for-non-saml · 9 saml-federation-role-to-ad-group-mapping · 10 cognito · 11 cognito-pools · 12 cognito-social-idp-federation

### 원 주제별로 빼 본 배열

#### `ebs-instance-store` — 지금 개념 15개

- confidence high만 뺄 때(2건): 개념 13개 · 맞붙는 자리 `cluster-placement-group` ↔ 맨 끝
- 이동 권고를 모두 뺄 때(3건): 개념 12개 · 맞붙는 자리 `instance-store` ↔ 맨 끝

#### `api-gateway-step-functions` — 지금 개념 20개

- confidence high만 뺄 때(1건): 개념 19개 · 맞붙는 자리 `api-gateway-endpoint-types` ↔ `api-gateway-lambda-proxy-integration`
- 이동 권고를 모두 뺄 때(1건): 개념 19개 · 맞붙는 자리 `api-gateway-endpoint-types` ↔ `api-gateway-lambda-proxy-integration`

#### `sqs-sns-eventbridge` — 지금 개념 33개

- confidence high만 뺄 때(0건): 개념 33개 · 맞붙는 자리 없음
- 이동 권고를 모두 뺄 때(1건): 개념 32개 · 맞붙는 자리 `sqs-details` ↔ `sqs-batch-and-polling`

#### `waf-shield` — 지금 개념 15개

- confidence high만 뺄 때(1건): 개념 14개 · 맞붙는 자리 `waf` ↔ `waf-attach-targets`
- 이동 권고를 모두 뺄 때(1건): 개념 14개 · 맞붙는 자리 `waf` ↔ `waf-attach-targets`

#### `iam-permissions` — 지금 개념 18개

- confidence high만 뺄 때(0건): 개념 18개 · 맞붙는 자리 없음
- 이동 권고를 모두 뺄 때(1건): 개념 17개 · 맞붙는 자리 `instance-profile` ↔ `cross-account-iam-role`

## 2. 2A — 같은 주제 안에서 문항의 conceptId만 바꿀 후보 14건

### q037 · `s3-encryption-batch.sse-types` → `s3-encryption-batch.sse-kms-cost`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `s3-encryption-batch.sse-types` · `s3-encryption-batch`
- 권장 개념·주제: `s3-encryption-batch.sse-kms-cost` · `s3-encryption-batch`
- 영향 받는 문항 전체: q037
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q037 `s3-encryption-batch.sse-types` → `s3-encryption-batch.sse-kms-cost`
- 문항 판정(phase 35):
  - q037 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: SSE-KMS는 객체마다 키를 만들어 KMS를 호출하므로 객체 수가 많으면 비용이 커지고, S3 Bucket Key로 버킷 키를 재사용하면 그 호출이 줄어든다.
- 원 주제(source) `s3-encryption-batch` · 대상 주제(target) `s3-encryption-batch`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `sse-kms-cost`가 이미 `s3-encryption-batch`의 위치 6/13에 있다(앞 `sse-kms-audit-trail` · 뒤 `sse-c-no-rotation-or-audit`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `s3-encryption-batch.sse-types`: 문항 4 → 3(남는 문항 q035 · q036 · q038)
  - 대상 개념 `s3-encryption-batch.sse-kms-cost`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q037의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 2755줄(it 「S3 암호화 주제가 암호화·Batch Operations와 인벤토리·Object Lambda 블록 순서로 개념을 둔다」) / 대상 개념 id가 나오는 줄: 246줄(it 「보충 개념 9개가 지정된 주제에 그대로 남아 있다」 · 짧은 이름) · 429줄(it 「기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다」) · 2759줄(it 「S3 암호화 주제가 암호화·Batch Operations와 인벤토리·Object Lambda 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q037 conceptId를 `s3-encryption-batch.sse-types`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q037이 같은 주제의 sse-kms-cost를 권해 2A다. 문항이 가르는 것은 키 관리 주체가 아니라 객체마다 KMS를 호출해 커지는 비용이라 q037의 conceptId만 바꾸면 되고, 원 개념에는 q035·q036·q038이 남는다.

### q043 · `efs-fsx.efs` → `efs-fsx.efs-lifecycle-management`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `efs-fsx.efs` · `efs-fsx`
- 권장 개념·주제: `efs-fsx.efs-lifecycle-management` · `efs-fsx`
- 영향 받는 문항 전체: q043
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q043 `efs-fsx.efs` → `efs-fsx.efs-lifecycle-management`
- 문항 판정(phase 35):
  - q043 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: EFS IA에 옮긴 파일도 밀리초 단위 지연으로 즉시 읽을 수 있어 아카이브처럼 복원을 기다리지 않는다.
- 원 주제(source) `efs-fsx` · 대상 주제(target) `efs-fsx`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `efs-lifecycle-management`가 이미 `efs-fsx`의 위치 7/25에 있다(앞 `efs-posix-permissions` · 뒤 `efs-ia-file-size-threshold`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `efs-fsx.efs`: 문항 2 → 1(남는 문항 q042)
  - 대상 개념 `efs-fsx.efs-lifecycle-management`: 문항 1 → 2 · 2A·2B 후보를 모두 적용하면 3
- 함께 고칠 곳:
  - `src/data/questions.json` — q043의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3163줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」) · 5361줄(블록 밖) · 6311줄(블록 밖) / 대상 개념 id가 나오는 줄: 250줄(it 「보충 개념 9개가 지정된 주제에 그대로 남아 있다」 · 짧은 이름) · 432줄(it 「기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다」) · 3169줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q043 conceptId를 `efs-fsx.efs`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q043이 같은 주제의 efs-lifecycle-management를 권해 2A다. IA로 옮긴 파일을 곧바로 읽는다는 특성이 답을 가르므로 q043의 conceptId만 바꾸면 되고 원 개념에는 q042가 남는다. q344도 같은 대상을 권하므로 함께 옮기면 efs-lifecycle-management의 문항이 1개에서 3개가 된다.

### q344 · `efs-fsx.efs-ia-file-size-threshold` → `efs-fsx.efs-lifecycle-management`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `efs-fsx.efs-ia-file-size-threshold` · `efs-fsx`
- 권장 개념·주제: `efs-fsx.efs-lifecycle-management` · `efs-fsx`
- 영향 받는 문항 전체: q344
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q344 `efs-fsx.efs-ia-file-size-threshold` → `efs-fsx.efs-lifecycle-management`
- 문항 판정(phase 35):
  - q344 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: EFS에서 오래 접근하지 않는 파일은 수명 주기 관리로 IA 계층에 자동 전환해 저장 비용을 줄인다.
- 원 주제(source) `efs-fsx` · 대상 주제(target) `efs-fsx`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `efs-lifecycle-management`가 이미 `efs-fsx`의 위치 7/25에 있다(앞 `efs-posix-permissions` · 뒤 `efs-ia-file-size-threshold`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `efs-fsx.efs-ia-file-size-threshold`: 문항 2 → 1(남는 문항 q343)
  - 대상 개념 `efs-fsx.efs-lifecycle-management`: 문항 1 → 2 · 2A·2B 후보를 모두 적용하면 3
- 함께 고칠 곳:
  - `src/data/questions.json` — q344의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q344 → 1079줄 it 「공유 파일 스토리지 문제 24개가 담당 개념 21개를 빠짐없이 덮는다」(topicId·conceptId) · 1092줄 it 「공유 파일 스토리지 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 1102줄 it 「공유 파일 스토리지 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 1070줄(const step4Concepts) · 3170줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」) / 대상 개념 id가 나오는 줄: 250줄(it 「보충 개념 9개가 지정된 주제에 그대로 남아 있다」 · 짧은 이름) · 432줄(it 「기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다」) · 3169줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q344 conceptId를 `efs-fsx.efs-ia-file-size-threshold`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q344가 같은 주제의 efs-lifecycle-management를 권해 2A다. 오답을 가르는 것이 크기 임계값이 아니라 접근 빈도에 따른 수명 주기 전환이라 q344의 conceptId만 바꾸면 되고, 원 개념에는 q343이 남는다. 같은 대상을 권하는 efs-fsx.efs의 q043과 함께 다룬다.

### q045 · `efs-fsx.fsx` → `efs-fsx.fsx-lustre-s3-data-repository-association`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `efs-fsx.fsx` · `efs-fsx`
- 권장 개념·주제: `efs-fsx.fsx-lustre-s3-data-repository-association` · `efs-fsx`
- 영향 받는 문항 전체: q045
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q045 `efs-fsx.fsx` → `efs-fsx.fsx-lustre-s3-data-repository-association`
- 문항 판정(phase 35):
  - q045 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: FSx for Lustre는 계산 집약적인 분석에 쓰는 고성능 파일 시스템이며 S3 버킷의 데이터를 연동해 사용할 수 있다.
- 원 주제(source) `efs-fsx` · 대상 주제(target) `efs-fsx`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `fsx-lustre-s3-data-repository-association`가 이미 `efs-fsx`의 위치 20/25에 있다(앞 `fsx-lustre-persistent-deployment` · 뒤 `fsx-ontap-multi-az`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `efs-fsx.fsx`: 문항 4 → 3(남는 문항 q046 · q047 · q048) · 2A·2B 후보를 모두 적용하면 2
  - 대상 개념 `efs-fsx.fsx-lustre-s3-data-repository-association`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q045의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3175줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」) · 6312줄(블록 밖) / 대상 개념 id가 나오는 줄: 1076줄(const step4Concepts) · 3182줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q045 conceptId를 `efs-fsx.fsx`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q045는 fsx-lustre-s3-data-repository-association을, q046은 fsx-ontap-multi-protocol-tiering을 같은 주제 안에서 권해 2A다. 소개에 한 항목으로 나열된 유형별 특징보다 전용 개념이 결정적 지식을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q047·q048이 남는다.

### q046 · `efs-fsx.fsx` → `efs-fsx.fsx-ontap-multi-protocol-tiering`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `efs-fsx.fsx` · `efs-fsx`
- 권장 개념·주제: `efs-fsx.fsx-ontap-multi-protocol-tiering` · `efs-fsx`
- 영향 받는 문항 전체: q046
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q046 `efs-fsx.fsx` → `efs-fsx.fsx-ontap-multi-protocol-tiering`
- 문항 판정(phase 35):
  - q046 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: FSx for NetApp ONTAP은 NFS와 SMB를 함께 지원해 서로 다른 운영체제의 클라이언트가 같은 데이터를 사용할 수 있다.
- 원 주제(source) `efs-fsx` · 대상 주제(target) `efs-fsx`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `fsx-ontap-multi-protocol-tiering`가 이미 `efs-fsx`의 위치 22/25에 있다(앞 `fsx-ontap-multi-az` · 뒤 `fsx-ontap-iscsi-block`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `efs-fsx.fsx`: 문항 4 → 3(남는 문항 q045 · q047 · q048) · 2A·2B 후보를 모두 적용하면 2
  - 대상 개념 `efs-fsx.fsx-ontap-multi-protocol-tiering`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q046의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3175줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」) · 6312줄(블록 밖) / 대상 개념 id가 나오는 줄: 1066줄(const step4Concepts) · 3184줄(it 「EFS·FSx 주제가 EFS·FSx 개요·Windows·Lustre·ONTAP·File Gateway 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q046 conceptId를 `efs-fsx.fsx`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q045는 fsx-lustre-s3-data-repository-association을, q046은 fsx-ontap-multi-protocol-tiering을 같은 주제 안에서 권해 2A다. 소개에 한 항목으로 나열된 유형별 특징보다 전용 개념이 결정적 지식을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q047·q048이 남는다.

### q061 · `rds-storage-features.features` → `rds-storage-features.rds-multi-az-db-cluster`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `rds-storage-features.features` · `rds-storage-features`
- 권장 개념·주제: `rds-storage-features.rds-multi-az-db-cluster` · `rds-storage-features`
- 영향 받는 문항 전체: q061
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q061 `rds-storage-features.features` → `rds-storage-features.rds-multi-az-db-cluster`
- 문항 판정(phase 35):
  - q061 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: RDS Multi AZ DB 클러스터는 읽기를 받는 대기 DB들을 두어 고가용성과 읽기 처리 능력을 함께 확보한다.
- 원 주제(source) `rds-storage-features` · 대상 주제(target) `rds-storage-features`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `rds-multi-az-db-cluster`가 이미 `rds-storage-features`의 위치 6/21에 있다(앞 `multi-az-standby-limits` · 뒤 `rds-multi-az-failover-rto`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `rds-storage-features.features`: 문항 6 → 5(남는 문항 q060 · q062 · q063 · q064 · q065) · 2A·2B 후보를 모두 적용하면 4
  - 대상 개념 `rds-storage-features.rds-multi-az-db-cluster`: 문항 2 → 3
- 함께 고칠 곳:
  - `src/data/questions.json` — q061의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3274줄(it 「RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다」) · 5650줄(it 「RDS 세 기능의 목적 차이가 Read Replica 문단에 드러난다」) / 대상 개념 id가 나오는 줄: 1240줄(const step6Concepts) · 3276줄(it 「RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다」) · 3321줄(it 「다중 AZ 배포의 두 형태가 대기 인스턴스의 역할로 갈린다」) · 3324줄(it 「다중 AZ 배포의 두 형태가 대기 인스턴스의 역할로 갈린다」)
- 되돌리는 방법: `questions.json`의 q061 conceptId를 `rds-storage-features.features`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q061은 rds-multi-az-db-cluster를, q065는 rds-blue-green-deployment를 같은 주제 안에서 권해 2A다. 기능 목록의 한 항목보다 전용 개념이 배포 형태와 전환 절차를 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q060·q062·q063·q064가 남는다.

### q065 · `rds-storage-features.features` → `rds-storage-features.rds-blue-green-deployment`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `rds-storage-features.features` · `rds-storage-features`
- 권장 개념·주제: `rds-storage-features.rds-blue-green-deployment` · `rds-storage-features`
- 영향 받는 문항 전체: q065
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q065 `rds-storage-features.features` → `rds-storage-features.rds-blue-green-deployment`
- 문항 판정(phase 35):
  - q065 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: RDS 블루/그린 배포는 운영과 동기화된 스테이징 환경에서 변경을 검증하고 그 환경으로 운영을 전환한다.
- 원 주제(source) `rds-storage-features` · 대상 주제(target) `rds-storage-features`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `rds-blue-green-deployment`가 이미 `rds-storage-features`의 위치 11/21에 있다(앞 `rds-proxy-failover` · 뒤 `rds-snapshot-cross-region-copy`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `rds-storage-features.features`: 문항 6 → 5(남는 문항 q060 · q061 · q062 · q063 · q064) · 2A·2B 후보를 모두 적용하면 4
  - 대상 개념 `rds-storage-features.rds-blue-green-deployment`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q065의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3274줄(it 「RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다」) · 5650줄(it 「RDS 세 기능의 목적 차이가 Read Replica 문단에 드러난다」) / 대상 개념 id가 나오는 줄: 1236줄(const step6Concepts) · 3281줄(it 「RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q065 conceptId를 `rds-storage-features.features`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q061은 rds-multi-az-db-cluster를, q065는 rds-blue-green-deployment를 같은 주제 안에서 권해 2A다. 기능 목록의 한 항목보다 전용 개념이 배포 형태와 전환 절차를 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q060·q062·q063·q064가 남는다.

### q068 · `aurora.aurora` → `aurora.aurora-replica-auto-scaling`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `aurora.aurora` · `aurora`
- 권장 개념·주제: `aurora.aurora-replica-auto-scaling` · `aurora`
- 영향 받는 문항 전체: q068
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q068 `aurora.aurora` → `aurora.aurora-replica-auto-scaling`
- 문항 판정(phase 35):
  - q068 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: Aurora Auto Scaling은 부하 지표가 임계치를 넘을 때 읽기 전용 복제본 수를 자동으로 늘리는 기능이다.
- 원 주제(source) `aurora` · 대상 주제(target) `aurora`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `aurora-replica-auto-scaling`가 이미 `aurora`의 위치 6/18에 있다(앞 `aurora-endpoint-types` · 뒤 `read-replica-no-schema-change`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `aurora.aurora`: 문항 3 → 2(남는 문항 q066 · q067)
  - 대상 개념 `aurora.aurora-replica-auto-scaling`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q068의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 224줄(it 「데이터베이스 보충 개념 9개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 304줄(it 「보충 개념 추가 후에도 39개 주제의 메타데이터가 그대로다」 · 짧은 이름) · 495줄(it 「데이터베이스 보충 문제 9개가 새 개념과 일대일로 이어진다」 · 짧은 이름) · 496줄(it 「데이터베이스 보충 문제 9개가 새 개념과 일대일로 이어진다」 · 짧은 이름) · 1276줄(it 「RDS·Aurora 문제 32개가 담당 개념 29개를 빠짐없이 덮는다」 · 짧은 이름) · 1321줄(it 「RDS 스토리지 기능과 Aurora 주제의 모든 개념이 문항을 갖는다」 · 짧은 이름) · 2607줄(it 「네트워크 데이터 주제가 지정된 순서와 메타데이터로 추가된다」 · 짧은 이름) · 3331줄(it 「Aurora 주제가 Serverless부터 스토리지 구성까지 하위 기능 블록 순서로 개념을 둔다」 · 짧은 이름) · 3337줄(it 「Aurora 주제가 Serverless부터 스토리지 구성까지 하위 기능 블록 순서로 개념을 둔다」) · 6321줄(블록 밖) / 대상 개념 id가 나오는 줄: 1251줄(const step6Concepts) · 3342줄(it 「Aurora 주제가 Serverless부터 스토리지 구성까지 하위 기능 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q068 conceptId를 `aurora.aurora`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q068이 같은 주제의 aurora-replica-auto-scaling을 권해 2A다. 읽기 전용 복제본 수를 자동으로 조정하는 기능이 답을 가르므로 q068의 conceptId만 바꾸면 되고, 원 개념에는 q066·q067이 남는다.

### q080 · `elastic-load-balancing.elb` → `elastic-load-balancing.nlb-udp-listener`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `elastic-load-balancing.elb` · `elastic-load-balancing`
- 권장 개념·주제: `elastic-load-balancing.nlb-udp-listener` · `elastic-load-balancing`
- 영향 받는 문항 전체: q080
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q080 `elastic-load-balancing.elb` → `elastic-load-balancing.nlb-udp-listener`
- 문항 판정(phase 35):
  - q080 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: NLB는 TCP와 UDP 트래픽을 모두 받아 낮은 지연으로 대상에 전달하는 로드 밸런서다.
- 원 주제(source) `elastic-load-balancing` · 대상 주제(target) `elastic-load-balancing`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `nlb-udp-listener`가 이미 `elastic-load-balancing`의 위치 10/16에 있다(앞 `nlb-tls-listener` · 뒤 `nlb-ip-targets`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `elastic-load-balancing.elb`: 문항 4 → 3(남는 문항 q078 · q079 · q081) · 2A·2B 후보를 모두 적용하면 2
  - 대상 개념 `elastic-load-balancing.nlb-udp-listener`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q080의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3466줄(it 「로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다」) · 3565줄(it 「로드 밸런서 셋의 선택 기준이 한 주제 안에 함께 있다」) · 5366줄(블록 밖) · 6105줄(it 「TCP와 UDP 풀이가 이름과 계층뿐 아니라 둘의 차이까지 알려준다」) · 6127줄(it 「용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다」) · 6334줄(블록 밖) / 대상 개념 id가 나오는 줄: 1455줄(const step8Concepts) · 3475줄(it 「로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다」) · 3567줄(it 「로드 밸런서 셋의 선택 기준이 한 주제 안에 함께 있다」)
- 되돌리는 방법: `questions.json`의 q080 conceptId를 `elastic-load-balancing.elb`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q080은 nlb-udp-listener를, q081은 gateway-load-balancer를 같은 주제 안에서 권해 2A다. 유형 나열보다 각 유형의 전용 개념이 지원 프로토콜과 분산 대상을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q078·q079가 남는다.

### q081 · `elastic-load-balancing.elb` → `elastic-load-balancing.gateway-load-balancer`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `elastic-load-balancing.elb` · `elastic-load-balancing`
- 권장 개념·주제: `elastic-load-balancing.gateway-load-balancer` · `elastic-load-balancing`
- 영향 받는 문항 전체: q081
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q081 `elastic-load-balancing.elb` → `elastic-load-balancing.gateway-load-balancer`
- 문항 판정(phase 35):
  - q081 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: 게이트웨이 로드 밸런서는 애플리케이션 서버가 아니라 방화벽 같은 보안 어플라이언스에 트래픽을 분산한다.
- 원 주제(source) `elastic-load-balancing` · 대상 주제(target) `elastic-load-balancing`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `gateway-load-balancer`가 이미 `elastic-load-balancing`의 위치 12/16에 있다(앞 `nlb-ip-targets` · 뒤 `gwlb-endpoint-cross-account-inspection`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `elastic-load-balancing.elb`: 문항 4 → 3(남는 문항 q078 · q079 · q080) · 2A·2B 후보를 모두 적용하면 2
  - 대상 개념 `elastic-load-balancing.gateway-load-balancer`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q081의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 3466줄(it 「로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다」) · 3565줄(it 「로드 밸런서 셋의 선택 기준이 한 주제 안에 함께 있다」) · 5366줄(블록 밖) · 6105줄(it 「TCP와 UDP 풀이가 이름과 계층뿐 아니라 둘의 차이까지 알려준다」) · 6127줄(it 「용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다」) · 6334줄(블록 밖) / 대상 개념 id가 나오는 줄: 1452줄(const step8Concepts) · 3477줄(it 「로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다」) · 3566줄(it 「로드 밸런서 셋의 선택 기준이 한 주제 안에 함께 있다」)
- 되돌리는 방법: `questions.json`의 q081 conceptId를 `elastic-load-balancing.elb`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q080은 nlb-udp-listener를, q081은 gateway-load-balancer를 같은 주제 안에서 권해 2A다. 유형 나열보다 각 유형의 전용 개념이 지원 프로토콜과 분산 대상을 설명하므로 두 문항의 conceptId만 각각 바꾸면 되고, 원 개념에는 q078·q079가 남는다.

### q472 · `cloudfront-global-accelerator.global-accelerator-static-ip` → `cloudfront-global-accelerator.global-accelerator-protocols`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `cloudfront-global-accelerator.global-accelerator-static-ip` · `cloudfront-global-accelerator`
- 권장 개념·주제: `cloudfront-global-accelerator.global-accelerator-protocols` · `cloudfront-global-accelerator`
- 영향 받는 문항 전체: q472
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q472 `cloudfront-global-accelerator.global-accelerator-static-ip` → `cloudfront-global-accelerator.global-accelerator-protocols`
- 문항 판정(phase 35):
  - q472 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: 캐시할 사본이 없는 실시간 TCP 스트림은 콘텐츠 캐시가 아니라 Global Accelerator로 연결 경로를 최적화해 지연을 줄인다.
- 원 주제(source) `cloudfront-global-accelerator` · 대상 주제(target) `cloudfront-global-accelerator`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `global-accelerator-protocols`가 이미 `cloudfront-global-accelerator`의 위치 22/24에 있다(앞 `global-accelerator-endpoints` · 뒤 `global-accelerator-vs-dns-failover`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `cloudfront-global-accelerator.global-accelerator-static-ip`: 문항 2 → 1(남는 문항 q471)
  - 대상 개념 `cloudfront-global-accelerator.global-accelerator-protocols`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q472의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q472 → 1559줄 it 「CloudFront·엣지 문제 22개가 담당 개념 19개를 빠짐없이 덮는다」(topicId·conceptId) · 1574줄 it 「CloudFront·엣지 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 1584줄 it 「CloudFront·엣지 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 1542줄(const step9Concepts) · 3516줄(it 「CloudFront·Global Accelerator 주제가 CloudFront·엣지 함수·Global Accelerator 블록 다음에 둘의 비용 비교를 둔다」) / 대상 개념 id가 나오는 줄: 147줄(it 「컴퓨팅·메시징 보충 개념 21개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 535줄(it 「컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다」) · 3518줄(it 「CloudFront·Global Accelerator 주제가 CloudFront·엣지 함수·Global Accelerator 블록 다음에 둘의 비용 비교를 둔다」) · 3531줄(it 「CloudFront와 Global Accelerator가 한 주제 안에 함께 있다」) · 6114줄(it 「CloudFront와 Global Accelerator의 갈림길이 추상적인 대비 대신 구체적인 기준으로 쓰인다」) · 6129줄(it 「용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다」)
- 되돌리는 방법: `questions.json`의 q472 conceptId를 `cloudfront-global-accelerator.global-accelerator-static-ip`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q472가 같은 주제의 global-accelerator-protocols를 권해 2A다. 주소 고정은 문항의 조건이 아니고 사본 캐싱과 연결 가속의 갈림길이 답을 가르므로 q472의 conceptId만 바꾸면 되고, 원 개념에는 q471이 남는다.

### q086 · `lambda.lambda` → `lambda.lambda-reserved-concurrency`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `lambda.lambda` · `lambda`
- 권장 개념·주제: `lambda.lambda-reserved-concurrency` · `lambda`
- 영향 받는 문항 전체: q086
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q086 `lambda.lambda` → `lambda.lambda-reserved-concurrency`
- 문항 판정(phase 35):
  - q086 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: 프로비저닝된 동시성은 Lambda 실행 환경을 미리 초기화해 첫 요청의 콜드 스타트를 줄이는 설정이다.
- 원 주제(source) `lambda` · 대상 주제(target) `lambda`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `lambda-reserved-concurrency`가 이미 `lambda`의 위치 12/18에 있다(앞 `lambda-memory-ceiling` · 뒤 `lambda-provisioned-concurrency-autoscaling`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `lambda.lambda`: 문항 3 → 2(남는 문항 q085 · q087)
  - 대상 개념 `lambda.lambda-reserved-concurrency`: 문항 2 → 3
- 함께 고칠 곳:
  - `src/data/questions.json` — q086의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: 없음
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 183줄(it 「컴퓨팅·메시징 보충 개념 21개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 316줄(it 「보충 개념 추가 후에도 39개 주제의 메타데이터가 그대로다」 · 짧은 이름) · 574줄(it 「컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다」 · 짧은 이름) · 576줄(it 「컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다」 · 짧은 이름) · 1653줄(it 「Lambda 문제 20개가 담당 개념 15개를 빠짐없이 덮는다」 · 짧은 이름) · 1696줄(it 「Lambda 주제의 모든 개념이 문항을 갖는다」 · 짧은 이름) · 2615줄(it 「네트워크 데이터 주제가 지정된 순서와 메타데이터로 추가된다」 · 짧은 이름) · 3604줄(it 「Lambda 주제가 호출부터 실행 역할까지 하위 기능 블록 다음에 운영 체제 접근 비교를 둔다」 · 짧은 이름) · 3611줄(it 「Lambda 주제가 호출부터 실행 역할까지 하위 기능 블록 다음에 운영 체제 접근 비교를 둔다」) · 4145줄(it 「동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다」 · 짧은 이름) · 4150줄(it 「동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다」) · 6018줄(it 「개념 본문이 Lambda가 하는 일과 비용 할당 태그가 무엇인지 알려준다」) · 6029줄(it 「개념 본문 보강이 요약과 문단 개수를 바꾸지 않는다」) · 6340줄(블록 밖) / 대상 개념 id가 나오는 줄: 1633줄(const step10Concepts) · 3622줄(it 「Lambda 주제가 호출부터 실행 역할까지 하위 기능 블록 다음에 운영 체제 접근 비교를 둔다」) · 4144줄(it 「동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다」) · 4151줄(it 「동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다」)
- 되돌리는 방법: `questions.json`의 q086 conceptId를 `lambda.lambda`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q086이 같은 주제의 lambda-reserved-concurrency를 권해 2A다. 실행 환경을 미리 초기화해 콜드 스타트를 줄이는 설정이 답을 가르므로 q086의 conceptId만 바꾸면 되고, 원 개념에는 q085·q087이 남는다.

### q159 · `identity-federation.identity-center` → `identity-federation.identity-center-permission-set`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `identity-federation.identity-center` · `identity-federation`
- 권장 개념·주제: `identity-federation.identity-center-permission-set` · `identity-federation`
- 영향 받는 문항 전체: q159
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q159 `identity-federation.identity-center` → `identity-federation.identity-center-permission-set`
- 문항 판정(phase 35):
  - q159 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: IAM Identity Center의 권한 세트는 대상 계정에서 허용할 작업을 묶어 사용자나 그룹에 부여하는 권한 템플릿이다.
- 원 주제(source) `identity-federation` · 대상 주제(target) `identity-federation`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `identity-center-permission-set`가 이미 `identity-federation`의 위치 3/11에 있다(앞 `identity-center-external-idp` · 뒤 `sts`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `identity-federation.identity-center`: 문항 2 → 1(남는 문항 q158)
  - 대상 개념 `identity-federation.identity-center-permission-set`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q159의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q159 → 373줄 it 「보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다」(topicId·conceptId) · 406줄 it 「보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 4499줄(it 「자격 증명 페더레이션 주제가 Identity Center·STS·Directory Service·페더레이션·Cognito 블록 순서로 개념을 둔다」) · 4597줄(it 「Identity Center와 SAML 페더레이션과 Cognito가 한 주제 안에서 갈린다」) · 6436줄(블록 밖) / 대상 개념 id가 나오는 줄: 2382줄(const step18Concepts) · 4501줄(it 「자격 증명 페더레이션 주제가 Identity Center·STS·Directory Service·페더레이션·Cognito 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q159 conceptId를 `identity-federation.identity-center`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q159가 같은 주제의 identity-center-permission-set을 권해 2A다. 자격 증명과 허용 작업을 묶은 권한 템플릿의 차이가 답을 가르므로 q159의 conceptId만 바꾸면 되고, 원 개념에는 q158이 남는다.

### q165 · `cost-management.savings-plan` → `cost-management.savings-plan-details`

- 교차 유형 **2A** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `cost-management.savings-plan` · `cost-management`
- 권장 개념·주제: `cost-management.savings-plan-details` · `cost-management`
- 영향 받는 문항 전체: q165
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 아니요 — 같은 주제 안이다
- 문항 conceptId 변경: 예 — q165 `cost-management.savings-plan` → `cost-management.savings-plan-details`
- 문항 판정(phase 35):
  - q165 — verdict keep · conceptFit partial · coverageConflict false · retarget —. 결정 지식: 컴퓨팅 절약 플랜은 EC2뿐 아니라 Fargate와 Lambda에도 할인을 적용하므로 EC2 인스턴스 절약 플랜보다 적용 범위가 넓다.
- 원 주제(source) `cost-management` · 대상 주제(target) `cost-management`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `savings-plan-details`가 이미 `cost-management`의 위치 2/17에 있다(앞 `savings-plan` · 뒤 `savings-plan-baseline-vs-spike`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `cost-management.savings-plan`: 문항 2 → 1(남는 문항 q164)
  - 대상 개념 `cost-management.savings-plan-details`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q165의 conceptId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q165 → 373줄 it 「보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다」(topicId·conceptId) · 406줄 it 「보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 4904줄(it 「비용 관리 주제가 약정·비용 조회·예산·이상 탐지·보고서·권장 도구 블록 순서로 개념을 둔다」) · 6299줄(블록 밖) · 6447줄(블록 밖) / 대상 개념 id가 나오는 줄: 48줄(it 「보안·비용 보충 개념 23개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 691줄(it 「보안·자격 증명·비용 관리 보충 문제 23개가 새 개념과 일대일로 이어진다」) · 4905줄(it 「비용 관리 주제가 약정·비용 조회·예산·이상 탐지·보고서·권장 도구 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q165 conceptId를 `cost-management.savings-plan`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q165가 같은 주제의 savings-plan-details를 권해 2A다. 컴퓨팅 절약 플랜이 Fargate·Lambda까지 덮는 적용 범위가 답을 가르므로 q165의 conceptId만 바꾸면 되고, 원 개념에는 q164가 남는다.

## 3. 2B — 문항의 topicId·conceptId를 함께 바꿀 후보 4건

### q465 · `elastic-load-balancing.end-to-end-encryption-behind-alb` → `secrets-encryption.acm`

- 교차 유형 **2B** · 개념 판정 keep · 개념 serviceSpecificGoal false
- 현재 개념·주제: `elastic-load-balancing.end-to-end-encryption-behind-alb` · `elastic-load-balancing`
- 권장 개념·주제: `secrets-encryption.acm` · `secrets-encryption`
- 영향 받는 문항 전체: q465
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 예 — q465 `elastic-load-balancing` → `secrets-encryption`
- 문항 conceptId 변경: 예 — q465 `elastic-load-balancing.end-to-end-encryption-behind-alb` → `secrets-encryption.acm`
- 문항 판정(phase 35):
  - q465 — verdict move-recommended·high · conceptFit yes · coverageConflict false · retarget ready. 결정 지식: 인증서 발급과 갱신을 관리형 서비스에 맡기면 직접 발급·반입·교체하는 방식보다 인증서 수명 주기의 운영 부담이 줄어든다.
- 원 주제(source) `elastic-load-balancing` · 대상 주제(target) `secrets-encryption`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `acm`가 이미 `secrets-encryption`의 위치 17/20에 있다(앞 `kms-cloudhsm-key-store` · 뒤 `acm-dns-validation`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `elastic-load-balancing.end-to-end-encryption-behind-alb`: 문항 2 → 1(남는 문항 q464)
  - 대상 개념 `secrets-encryption.acm`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q465의 conceptId·topicId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q465 → 1467줄 it 「EC2·로드 밸런서 문제 32개가 담당 개념 28개를 빠짐없이 덮는다」(topicId·conceptId) · 1483줄 it 「EC2·로드 밸런서 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 1493줄 it 「EC2·로드 밸런서 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 1463줄(const step8Concepts) · 3481줄(it 「로드 밸런서 주제가 ELB 개요·ALB·NLB·Gateway Load Balancer·공통 설정 블록 순서로 개념을 둔다」) / 대상 개념 id가 나오는 줄: 4710줄(it 「비밀·키 주제가 Secrets Manager·Parameter Store·KMS·CloudHSM·ACM 블록 순서로 개념을 둔다」) · 5374줄(블록 밖) · 6421줄(블록 밖)
- 되돌리는 방법: `questions.json`의 q465 conceptId를 `elastic-load-balancing.end-to-end-encryption-behind-alb`·topicId를 `elastic-load-balancing`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q465가 다른 주제의 secrets-encryption.acm을 high로 권해 2B다. 이 문항은 TLS 구간 구성 없이 인증서 발급·갱신 책임만으로 풀리므로 q465의 topicId·conceptId를 함께 옮기면 되고(retarget ready), 원 개념에는 q464가 남는다. 다만 개념 판정은 인증서 관리 방식 비교를 이 구성의 운영 판단으로 보고 옮기지 않았으므로, 옮긴 뒤 원 개념 본문과 q465가 가르치는 범위가 갈리는지 함께 확인해야 한다.

### q508 · `lambda.serverless-runtime-no-os-access` → `rds-storage-features.rds-custom`

- 교차 유형 **2B** · 개념 판정 keep · 개념 serviceSpecificGoal false
- 현재 개념·주제: `lambda.serverless-runtime-no-os-access` · `lambda`
- 권장 개념·주제: `rds-storage-features.rds-custom` · `rds-storage-features`
- 영향 받는 문항 전체: q508
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 예 — q508 `lambda` → `rds-storage-features`
- 문항 conceptId 변경: 예 — q508 `lambda.serverless-runtime-no-os-access` → `rds-storage-features.rds-custom`
- 문항 판정(phase 35):
  - q508 — verdict move-recommended·high · conceptFit partial · coverageConflict false · retarget ready. 결정 지식: 일반 RDS는 OS 접근을 허용하지 않으므로 관리형 관계형 데이터베이스에서 OS 설정을 직접 바꿔야 하면 RDS Custom을 선택한다.
- 원 주제(source) `lambda` · 대상 주제(target) `rds-storage-features`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `rds-custom`가 이미 `rds-storage-features`의 위치 20/21에 있다(앞 `rds-stop-instance-restart` · 뒤 `rds-custom-byol`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `lambda.serverless-runtime-no-os-access`: 문항 2 → 1(남는 문항 q507)
  - 대상 개념 `rds-storage-features.rds-custom`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q508의 conceptId·topicId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q508 → 1646줄 it 「Lambda 문제 20개가 담당 개념 15개를 빠짐없이 덮는다」(topicId·conceptId) · 1659줄 it 「Lambda 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 1669줄 it 「Lambda 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 1643줄(const step10Concepts) · 3628줄(it 「Lambda 주제가 호출부터 실행 역할까지 하위 기능 블록 다음에 운영 체제 접근 비교를 둔다」) / 대상 개념 id가 나오는 줄: 1237줄(const step6Concepts) · 3290줄(it 「RDS 주제가 스토리지부터 RDS Custom까지 하위 기능 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q508 conceptId를 `lambda.serverless-runtime-no-os-access`·topicId를 `lambda`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이고 q508이 다른 주제의 rds-storage-features.rds-custom을 high로 권해 2B다. 관리형 데이터베이스에서 OS 설정이 필요하면 RDS Custom을 고른다는 지식이 답을 가르므로 q508의 topicId·conceptId를 함께 옮기면 되고(retarget ready), 원 개념에는 서버리스 런타임을 묻는 q507이 남는다.

### q225 · `security-groups-nacl.nacl-rule-limit` → `waf-shield.waf-rule-types`

- 교차 유형 **2B** · 개념 판정 keep · 개념 serviceSpecificGoal true
- 현재 개념·주제: `security-groups-nacl.nacl-rule-limit` · `security-groups-nacl`
- 권장 개념·주제: `waf-shield.waf-rule-types` · `waf-shield`
- 영향 받는 문항 전체: q225
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 예 — q225 `security-groups-nacl` → `waf-shield`
- 문항 conceptId 변경: 예 — q225 `security-groups-nacl.nacl-rule-limit` → `waf-shield.waf-rule-types`
- 문항 판정(phase 35):
  - q225 — verdict move-recommended·high · conceptFit partial · coverageConflict true · retarget needs-design. 결정 지식: 다수의 특정 IP 주소에서 오는 웹 요청만 허용하려면 국가별로 가르는 지리적 일치 규칙이 아니라 WAF IP 세트 일치 규칙을 사용한다.
- 원 주제(source) `security-groups-nacl` · 대상 주제(target) `waf-shield`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `waf-rule-types`가 이미 `waf-shield`의 위치 4/15에 있다(앞 `waf-attach-targets` · 뒤 `waf-managed-rule-groups`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `security-groups-nacl.nacl-rule-limit`: 문항 1 → 0(남는 문항 없음) — **원 개념에 문항이 남지 않아 개념당 최소 1문항 불변식이 깨진다. 대체 문항이나 개념 병합을 이 이동과 함께 설계해야 한다**(주제별 커버리지 단언: 2060줄 it 「백업·재해 복구와 네트워킹 세 주제의 모든 개념이 문항을 갖는다」)
  - 대상 개념 `waf-shield.waf-rule-types`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q225의 conceptId·topicId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q225 → 668줄 it 「보안·자격 증명·비용 관리 보충 문제 23개가 새 개념과 일대일로 이어진다」(topicId·conceptId) · 716줄 it 「보안·자격 증명·비용 관리 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) · 735줄 it 「전체 보충 문제 q170~q246의 정답 위치가 고르게 퍼져 있다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 10줄(it 「보안·비용 보충 개념 23개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 672줄(it 「보안·자격 증명·비용 관리 보충 문제 23개가 새 개념과 일대일로 이어진다」) · 4000줄(it 「보안 그룹·NACL 주제가 보안 그룹·NACL 블록 다음에 둘의 비교를 둔다」) / 대상 개념 id가 나오는 줄: 25줄(it 「보안·비용 보충 개념 23개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 680줄(it 「보안·자격 증명·비용 관리 보충 문제 23개가 새 개념과 일대일로 이어진다」) · 4728줄(it 「WAF·Shield 주제가 WAF·Shield·Firewall Manager 블록 순서로 개념을 둔다」) · 4821줄(it 「WAF와 Shield와 Shield Advanced가 한 주제 안에서 계층과 대상으로 갈린다」)
- 되돌리는 방법: `questions.json`의 q225 conceptId를 `security-groups-nacl.nacl-rule-limit`·topicId를 `security-groups-nacl`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep인데 유일한 문항 q225가 다른 주제의 waf-shield.waf-rule-types를 high로 권해 2B다. NACL 규칙 수 한계는 문제문에 주어진 배경이고 IP 세트와 지리적 일치를 가르는 WAF 지식이 답을 정하므로 q225의 topicId·conceptId를 함께 옮기되, 원 개념에 문항이 남지 않는다(phase 35 coverageConflict·retarget needs-design). 다음 phase는 NACL의 한계를 묻는 대체 문항을 이 이동과 함께 설계해야 한다.

### q223 · `cloudwatch-xray.log-analysis-options` → `emr-glue-athena.log-storage-s3-athena`

- 교차 유형 **2B** · 개념 판정 keep · 개념 serviceSpecificGoal false
- 현재 개념·주제: `cloudwatch-xray.log-analysis-options` · `cloudwatch-xray`
- 권장 개념·주제: `emr-glue-athena.log-storage-s3-athena` · `emr-glue-athena`
- 영향 받는 문항 전체: q223
- conceptId 변경: 아니요 — 개념은 옮기지 않는다
- 문항 topicId 변경: 예 — q223 `cloudwatch-xray` → `emr-glue-athena`
- 문항 conceptId 변경: 예 — q223 `cloudwatch-xray.log-analysis-options` → `emr-glue-athena.log-storage-s3-athena`
- 문항 판정(phase 35):
  - q223 — verdict move-recommended·high · conceptFit partial · coverageConflict true · retarget needs-design. 결정 지식: 대용량 로그를 가끔 분석할 때는 S3에 보관하고 조회한 만큼 과금하는 Athena를 사용해 상시 클러스터 운영 비용을 피한다.
- 원 주제(source) `cloudwatch-xray` · 대상 주제(target) `emr-glue-athena`
- 대상 주제의 서비스 블록과 자리(ADR-033): 새로 넣을 개념이 없다. 대상 개념 `log-storage-s3-athena`가 이미 `emr-glue-athena`의 위치 16/20에 있다(앞 `athena-federated-query` · 뒤 `lake-formation`).
- phase 34 순서 영향: 없음 — 개념 배열이 바뀌지 않는다
- 커버리지 영향(ADR-026):
  - 원 개념 `cloudwatch-xray.log-analysis-options`: 문항 1 → 0(남는 문항 없음) — **원 개념에 문항이 남지 않아 개념당 최소 1문항 불변식이 깨진다. 대체 문항이나 개념 병합을 이 이동과 함께 설계해야 한다**(주제별 커버리지 단언: 2249줄 it 「스트리밍과 관측 두 주제의 모든 개념이 문항을 갖는다」)
  - 대상 개념 `emr-glue-athena.log-storage-s3-athena`: 문항 1 → 2
- 함께 고칠 곳:
  - `src/data/questions.json` — q223의 conceptId·topicId
  - `scripts/topics-baseline.json` — `questionsSha256`
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q223 → 610줄 it 「네트워크·라우팅·분석 보충 문제 15개가 새 개념과 일대일로 이어진다」(topicId·conceptId) · 649줄 it 「네트워크·라우팅·분석 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) · 735줄 it 「전체 보충 문제 q170~q246의 정답 위치가 고르게 퍼져 있다」(대조 필드 없음)
  - `src/data/data.test.ts` — 원 개념 id가 나오는 줄: 106줄(it 「네트워크·라우팅·분석 보충 개념 15개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 629줄(it 「네트워크·라우팅·분석 보충 문제 15개가 새 개념과 일대일로 이어진다」) · 4379줄(it 「CloudWatch·X-Ray 주제가 CloudWatch·X-Ray·Performance Insights·Managed Grafana 블록 순서로 개념을 둔다」) · 4446줄(it 「CloudWatch의 지표와 로그와 경보가 한 주제 안에서 한 벌로 읽힌다」) · 4457줄(it 「CloudWatch의 지표와 로그와 경보가 한 주제 안에서 한 벌로 읽힌다」) / 대상 개념 id가 나오는 줄: 2099줄(const step15Concepts) · 4202줄(it 「EMR·Glue·Athena 주제가 EMR·Spark·Glue·Athena·Lake Formation·Parquet 블록 순서로 개념을 둔다」)
- 되돌리는 방법: `questions.json`의 q223 conceptId를 `cloudwatch-xray.log-analysis-options`·topicId를 `cloudwatch-xray`로 되돌리고, `topics-baseline.json`의 `questionsSha256`을 `aadc1894b3eb2d92…`로 되돌린다. `data.test.ts`를 고쳤다면 위 줄들을 원래대로 되돌린다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep인데 유일한 문항 q223이 다른 주제의 emr-glue-athena.log-storage-s3-athena를 high로 권해 2B다. 대상 개념은 권장 주제 안에 있어 q223의 topicId·conceptId를 함께 옮기면 되지만 원 개념에 문항이 남지 않는다(phase 35 coverageConflict·retarget needs-design). 두 개념은 phase 36이 서로 duplicateOf로 기록한 쌍이므로, 다음 phase는 대체 문항을 만들지 두 개념을 합칠지를 이 이동과 함께 정해야 한다.

## 4. 3 — 개념을 옮기고 연결 문항이 따라가는 후보 2건

개념이 high 이동 권고이고 연결 문항이 모두 현재 개념을 그대로 권해, 개념을 옮기면 문항이 따라가는 자리다. 모든 필드는 1절의 같은
개념 항목에 있다.

| 개념 | 권장 주제 | 따라가는 문항 | 상세 |
| --- | --- | --- | --- |
| `ebs-instance-store.spread-placement-group` | `ec2-autoscaling` | q287 | 1절 |
| `ebs-instance-store.elastic-fabric-adapter` | `ec2-autoscaling` | q284 | 1절 |

## 5. 4 — 개념과 문항이 둘 다 재배정 후보 0건

없음.

## 6. 보류 목록 — ambiguous · confidence medium·low · hold 21건

보류는 변경을 제안하지 않는 자리라 되돌릴 것이 없다. 설계에서 이동을 정하면 1~3절의 형식으로 옮겨 적는다.

| 개념 | 주제 | 보류 기준 | 연결 문항(phase 35 판정 → 권장 개념) | 상세 |
| --- | --- | --- | --- | --- |
| `s3-encryption-batch.s3-object-lambda` | `s3-encryption-batch` | ambiguous · hold(개념 ambiguous) | q278 keep | 6-2절 |
| `s3-access-control.s3-storage-lens` | `s3-access-control` | ambiguous · hold(개념 ambiguous) | q252 keep | 6-2절 |
| `s3-access-control.s3-storage-lens-advanced-activity-metrics` | `s3-access-control` | ambiguous · hold(개념 ambiguous) | q255 keep | 6-2절 |
| `ebs-instance-store.cluster-placement-group` | `ebs-instance-store` | confidence medium · hold(이동 권고의 confidence가 high가 아님) | q175 keep | 6-1절 |
| `efs-fsx.efs-replication-one-way` | `efs-fsx` | hold(문항 ambiguous) | q348 ambiguous | 6-2절 |
| `data-transfer-services.datasync-task-status-event` | `data-transfer-services` | ambiguous · hold(개념 ambiguous) | q364 ambiguous | 6-2절 |
| `aurora.aurora-clone` | `aurora` | hold(문항 ambiguous) | q400 ambiguous → `backup-disaster-recovery.backup-long-term-retention` | 6-2절 |
| `elastic-load-balancing.internal-load-balancer` | `elastic-load-balancing` | hold(문항 ambiguous) | q459 ambiguous | 6-2절 |
| `lambda.lambda-concurrency-limit-throttling` | `lambda` | hold(문항 ambiguous) | q497 ambiguous | 6-2절 |
| `ecs-eks-fargate.elastic-beanstalk` | `ecs-eks-fargate` | ambiguous · hold(개념 ambiguous) | q510 keep | 6-2절 |
| `api-gateway-step-functions.api-gateway-behind-cloudfront` | `api-gateway-step-functions` | hold(문항 ambiguous) | q538 ambiguous | 1절 |
| `api-gateway-step-functions.amplify` | `api-gateway-step-functions` | ambiguous · hold(개념 ambiguous) | q529 keep | 6-2절 |
| `sqs-sns-eventbridge.sqs-queue-depth-scaling` | `sqs-sns-eventbridge` | confidence medium · hold(이동 권고의 confidence가 high가 아님) | q204 keep | 6-1절 |
| `hybrid-connectivity.access-terms` | `hybrid-connectivity` | ambiguous · hold(개념 ambiguous) | q217 keep | 6-2절 |
| `cloudwatch-xray.cloudwatch-alarm-state-change-event` | `cloudwatch-xray` | ambiguous · hold(개념 ambiguous) | q656 ambiguous | 6-2절 |
| `secrets-encryption.acm-expiration-event` | `secrets-encryption` | ambiguous · hold(개념 ambiguous) | q667 ambiguous | 6-2절 |
| `waf-shield.cloudfront` | `waf-shield` | hold(이동 권고의 confidence가 high가 아님) | q152 move-recommended·medium → 없음 · q153 move-recommended·high → `cloudfront-global-accelerator.cloudfront-ttl` · q154 move-recommended·high → `cloudfront-global-accelerator.cloudfront-multiple-origins` | 1절 |
| `guardduty-macie-inspector.guardduty-finding-to-eventbridge` | `guardduty-macie-inspector` | ambiguous · hold(개념 ambiguous) | q683 keep | 6-2절 |
| `guardduty-macie-inspector.macie-finding-to-eventbridge` | `guardduty-macie-inspector` | ambiguous · hold(개념 ambiguous) | q684 ambiguous | 6-2절 |
| `iam-permissions.iam-roles-anywhere` | `iam-permissions` | confidence medium · hold(이동 권고의 confidence가 high가 아님) | q686 keep | 6-1절 |
| `cost-management.on-demand-capacity-reservation` | `cost-management` | hold(문항 ambiguous) | q727 keep · q728 ambiguous → `ec2-autoscaling.spot-workload-fit` | 6-2절 |

### 6-1. confidence가 high가 아닌 이동 권고 3건

### `ebs-instance-store.cluster-placement-group` → `ec2-autoscaling`

- 판정: move-recommended · confidence **medium** · serviceSpecificGoal true · 교차 유형 **hold**(이동 권고의 confidence가 high가 아님) · 판정 step 3
- 현재 개념·주제: `ebs-instance-store.cluster-placement-group` · `ebs-instance-store`(위치 13/15)
- 권장 개념·주제: `ec2-autoscaling.cluster-placement-group` · `ec2-autoscaling`
- 학습 목표: EC2 인스턴스를 가까운 하드웨어에 밀집 배치하는 클러스터 배치 그룹으로 노드 사이 지연을 낮추고 처리량을 높이며, HPC에서 고성능 스토리지와 함께 쓰인다는 것을 이해한다.
- 영향 받는 문항 전체: q175
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`ebs-instance-store.cluster-placement-group` → `ec2-autoscaling.cluster-placement-group`)
- 문항 topicId 변경: 예 — q175 `ebs-instance-store` → `ec2-autoscaling`
- 문항 conceptId 변경: 예 — q175 `ebs-instance-store.cluster-placement-group` → `ec2-autoscaling.cluster-placement-group`
- 문항별 근거(phase 35 판정):
  - q175 — 문항 판정 keep이라 개념을 따라간다. 결정 지식: 노드 사이의 네트워크 지연을 최대한 줄이려면 인스턴스를 같은 가용 영역의 가까운 하드웨어에 밀집 배치하는 클러스터 배치 그룹을 쓴다.
- 원 주제(source) `ebs-instance-store` · 대상 주제(target) `ec2-autoscaling`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: ec2-autoscaling의 인스턴스 제품군 블록에서 gpu-instance-family 뒤, enhanced-networking 바로 앞에 배치 그룹 하위 기능으로 넣는다. enhanced-networking 문단 0이 클러스터 배치 그룹을 전제로 쓰므로 규칙 5에 따라 앞선다. conceptId가 ec2-autoscaling.*로 바뀌고 연결 문항 q175도 함께 옮겨야 한다.
  - 지금 배열에 이 후보만 넣으면 위치 6/19 — 앞 `gpu-instance-family` · 뒤 `enhanced-networking`
  - 대상 주제의 순서 단언: `data.test.ts` 3426줄 it 「EC2·Auto Scaling 주제가 인스턴스 재료·제품군·구매 옵션·조정 정책·혼합 구성·운영 블록 순서로 개념을 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `instance-store` · 뒤 `spread-placement-group`[이동 후보] → 빼면 둘이 맞붙는다. 개념 15 → 14
  - 원 주제의 순서 단언: `data.test.ts` 3126줄 it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 18 → 19. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`클러스터 배치 그룹`): `ebs-instance-store.spread-placement-group`[이동 후보] · `ebs-instance-store.elastic-fabric-adapter`[이동 후보]
  - 원 주제 쪽 영향: 원 주제에서는 `ebs-instance-store.spread-placement-group`(목적이 정반대라는 대비)과 `ebs-instance-store.elastic-fabric-adapter`(저지연 HPC에서 짝을 이루는 구성)가 이 개념을 전제로 쓰고, 둘 다 이동 후보다. 이 개념만 옮기면 그 두 개념이 원 주제에서 전제를 잃는다. 배치 그룹 두 개념과 EFA를 함께 옮기면 원 주제에 남는 EBS 볼륨·스냅샷·인스턴스 스토어 개념 가운데 전제를 잃는 것은 없지만, 배치 그룹 블록이 통째로 빠져 주제 제목의 「배치 그룹」이 맞지 않게 되므로 제목(`topics.json`·`data.test.ts`의 주제 메타데이터 단언·`topics-baseline.json`)도 함께 정해야 한다. 본문이 짝으로 드는 FSx for Lustre는 `efs-fsx.fsx-for-lustre`에 있어 어느 주제에 두든 주제 밖 언급으로 남는다.
- 커버리지 영향(ADR-026):
  - 원 id `ebs-instance-store.cluster-placement-group`는 사라지고, 연결 문항 1개 중 1개가 새 id를 따라간다
  - 새 개념 `ec2-autoscaling.cluster-placement-group`의 문항 1개
- 함께 고칠 곳:
  - `src/data/topics.json` — `ebs-instance-store`에서 빼고 `ec2-autoscaling`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q175의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 403줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 249줄(it 「보충 개념 9개가 지정된 주제에 그대로 남아 있다」 · 짧은 이름) · 430줄(it 「기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다」) · 3145줄(it 「EBS 주제가 EBS 볼륨·스냅샷·인스턴스 스토어·배치 그룹·EFA 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q175 → 422줄 it 「기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다」(topicId·conceptId) · 455줄 it 「기초·스토리지 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) · 735줄 it 「전체 보충 문제 q170~q246의 정답 위치가 고르게 퍼져 있다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `ec2-autoscaling.cluster-placement-group`를 빼고 id를 `ebs-instance-store.cluster-placement-group`로 되돌려 `ebs-instance-store`의 위치 13(앞 `instance-store` · 뒤 `spread-placement-group`)에 다시 넣는다. `questions.json`의 q175 topicId를 `ebs-instance-store`·conceptId를 `ebs-instance-store.cluster-placement-group`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 학습 목표는 EC2 인스턴스를 물리적으로 어디에 놓는가라는 EC2 고유 설정이고, 블록 스토리지나 인스턴스 스토어의 지속성과는 관계가 없다. EC2 서비스를 다루는 ec2-autoscaling에 이 개념을 전제로 쓰는 향상된 네트워킹이 이미 있어 그쪽이 더 자연스럽지만, 본문 유일한 문단이 FSx for Lustre와 짝을 이루는 HPC 스토리지 구성을 말해 스토리지 쪽 맥락으로 읽을 여지가 남으므로 medium으로 둔다.
- 교차 근거(cross-phase35.jsonl): 개념의 ec2-autoscaling 이동 권고가 medium이라 hold다. q175는 인스턴스 배치가 답을 가르는 문항으로 현재 개념을 유지해 개념이 옮기면 따라갈 구조(3)지만, 본문의 FSx for Lustre와 짝을 이루는 HPC 스토리지 맥락 때문에 개념 판정 스스로 확신을 낮췄다. 같은 블록으로 옮길 spread-placement-group·elastic-fabric-adapter(3)가 이 개념을 전제로 쓰므로 함께 다뤄야 한다.

### `sqs-sns-eventbridge.sqs-queue-depth-scaling` → `ec2-autoscaling`

- 판정: move-recommended · confidence **medium** · serviceSpecificGoal false · 교차 유형 **hold**(이동 권고의 confidence가 high가 아님) · 판정 step 7
- 현재 개념·주제: `sqs-sns-eventbridge.sqs-queue-depth-scaling` · `sqs-sns-eventbridge`(위치 4/33)
- 권장 개념·주제: `ec2-autoscaling.sqs-queue-depth-scaling` · `ec2-autoscaling`
- 학습 목표: 비동기 처리의 적체를 해소하려면 CPU 사용률보다 대기 작업량을 기준으로 백엔드 인스턴스의 처리 용량을 조절해야 하는 이유를 이해한다.
- 영향 받는 문항 전체: q204
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`sqs-sns-eventbridge.sqs-queue-depth-scaling` → `ec2-autoscaling.sqs-queue-depth-scaling`)
- 문항 topicId 변경: 예 — q204 `sqs-sns-eventbridge` → `ec2-autoscaling`
- 문항 conceptId 변경: 예 — q204 `sqs-sns-eventbridge.sqs-queue-depth-scaling` → `ec2-autoscaling.sqs-queue-depth-scaling`
- 문항별 근거(phase 35 판정):
  - q204 — 문항 판정 keep이라 개념을 따라간다. 결정 지식: 아직 처리하지 못한 작업의 양을 직접 재는 지표는 큐에 쌓인 메시지 수이고, CPU 사용률은 이미 밀린 결과를 뒤늦게 보여 주는 간접 지표다.
- 원 주제(source) `sqs-sns-eventbridge` · 대상 주제(target) `ec2-autoscaling`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: ec2-autoscaling의 Auto Scaling 정책 블록에서 predictive-scaling 뒤·spot-allocation-strategy 앞에 두어 조정 방식의 비교 다음에 대기 작업량이라는 지표 선택을 익히도록 한다.
  - 지금 배열에 이 후보만 넣으면 위치 12/19 — 앞 `predictive-scaling` · 뒤 `spot-allocation-strategy`
  - 대상 주제의 순서 단언: `data.test.ts` 3426줄 it 「EC2·Auto Scaling 주제가 인스턴스 재료·제품군·구매 옵션·조정 정책·혼합 구성·운영 블록 순서로 개념을 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `sqs-details` · 뒤 `sqs-batch-and-polling` → 빼면 둘이 맞붙는다. 개념 33 → 32
  - 원 주제의 순서 단언: `data.test.ts` 3770줄 it 「메시징 주제가 SQS·SNS·SQS와 SNS의 조합·EventBridge·Amazon MQ·SES 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 18 → 19. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`대기열 깊이|쌓인 메시지 수|오토 스케일링|Auto Scaling`): 없음
  - 원 주제 쪽 영향: 원 주제에 남는 개념 중 대기열에 쌓인 메시지 수로 처리 계층을 확장하는 구성을 전제로 쓰는 것은 없어 빼도 전제를 잃는 개념이 생기지 않는다. 빼면 SQS 블록의 갈림길에서 큐를 병목 진단의 지표로 쓰는 개념이 사라지고, 큐가 급증분을 버퍼로 흡수한다는 설명은 `sqs-sns-eventbridge.sqs-message-size-limit` 등에 남는다.
- 커버리지 영향(ADR-026):
  - 원 id `sqs-sns-eventbridge.sqs-queue-depth-scaling`는 사라지고, 연결 문항 1개 중 1개가 새 id를 따라간다
  - 새 개념 `ec2-autoscaling.sqs-queue-depth-scaling`의 문항 1개
- 함께 고칠 곳:
  - `src/data/topics.json` — `sqs-sns-eventbridge`에서 빼고 `ec2-autoscaling`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q204의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 1545줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 165줄(it 「컴퓨팅·메시징 보충 개념 21개가 지정된 주제의 개념 배열 끝에 추가된다」 · 짧은 이름) · 552줄(it 「컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다」) · 3786줄(it 「메시징 주제가 SQS·SNS·SQS와 SNS의 조합·EventBridge·Amazon MQ·SES 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q204 → 526줄 it 「컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다」(topicId·conceptId) · 591줄 it 「컴퓨팅·메시징 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음) · 735줄 it 「전체 보충 문제 q170~q246의 정답 위치가 고르게 퍼져 있다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `ec2-autoscaling.sqs-queue-depth-scaling`를 빼고 id를 `sqs-sns-eventbridge.sqs-queue-depth-scaling`로 되돌려 `sqs-sns-eventbridge`의 위치 4(앞 `sqs-details` · 뒤 `sqs-batch-and-polling`)에 다시 넣는다. `questions.json`의 q204 topicId를 `sqs-sns-eventbridge`·conceptId를 `sqs-sns-eventbridge.sqs-queue-depth-scaling`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 큐는 처리하지 못한 작업량을 보여 주는 상황이고 중심은 수요를 직접 나타내는 지표로 처리 인스턴스를 확장하는 판단이다. SQS의 전달·보존 설정을 바꾸는 내용이 아니며 대상 추적의 지표 선택과 이어지므로 ec2-autoscaling을 권하되, 큐 소비 운영으로도 읽히는 경계여서 확신은 medium으로 둔다.
- 교차 근거(cross-phase35.jsonl): 개념의 ec2-autoscaling 이동 권고가 medium이라 hold다. q204는 남은 작업량을 직접 재는 지표라는 이유로 현재 개념을 유지하면서 ec2-autoscaling을 부차 주제로 적어, 조정 지표 선택으로 읽는 개념 쪽과 큐 소비 운영으로 읽는 해석이 함께 남아 있다.

### `iam-permissions.iam-roles-anywhere` → `identity-federation`

- 판정: move-recommended · confidence **medium** · serviceSpecificGoal true · 교차 유형 **hold**(이동 권고의 confidence가 high가 아님) · 판정 step 10
- 현재 개념·주제: `iam-permissions.iam-roles-anywhere` · `iam-permissions`(위치 6/18)
- 권장 개념·주제: `identity-federation.iam-roles-anywhere` · `identity-federation`
- 학습 목표: 기존 X.509 인증서를 AWS 임시 자격 증명으로 교환하는 IAM Roles Anywhere를 통신 상대 검증이나 이미 가진 자격 증명으로 요청에 서명하는 절차와 구분해야 함을 이해한다.
- 영향 받는 문항 전체: q686
- conceptId 변경: 예 — 개념을 옮기면 `<topicId>.<slug>`의 주제 부분이 바뀐다(`iam-permissions.iam-roles-anywhere` → `identity-federation.iam-roles-anywhere`)
- 문항 topicId 변경: 예 — q686 `iam-permissions` → `identity-federation`
- 문항 conceptId 변경: 예 — q686 `iam-permissions.iam-roles-anywhere` → `identity-federation.iam-roles-anywhere`
- 문항별 근거(phase 35 판정):
  - q686 — 문항 판정 keep이라 개념을 따라간다. 결정 지식: SAML·OIDC 없이 사내 인증서 체계로 장기 키 없이 AWS API를 부르려면 IAM Roles Anywhere가 X.509 인증서를 IAM 역할의 임시 자격 증명과 바꿔 준다.
- 원 주제(source) `iam-permissions` · 대상 주제(target) `identity-federation`
- 대상 주제의 서비스 블록과 자리(ADR-033):
  - blockImpact 원문: identity-federation의 STS·임시 자격 증명 블록에서 sts-assume-role 뒤·aws-directory-service 앞에 두어 역할로 단기 자격 증명을 받는 기본을 익힌 뒤 X.509 인증서를 이용하는 외부 워크로드의 획득 방식을 읽게 한다.
  - 지금 배열에 이 후보만 넣으면 위치 6/12 — 앞 `sts-assume-role` · 뒤 `aws-directory-service`
  - 대상 주제의 순서 단언: `data.test.ts` 4490줄 it 「자격 증명 페더레이션 주제가 Identity Center·STS·Directory Service·페더레이션·Cognito 블록 순서로 개념을 둔다」
- phase 34 순서 영향:
  - 원 주제: 앞 `instance-profile` · 뒤 `cross-account-iam-role` → 빼면 둘이 맞붙는다. 개념 18 → 17
  - 원 주제의 순서 단언: `data.test.ts` 4463줄 it 「IAM 권한 주제가 사용자와 그룹·역할·정책·분석 도구·루트 사용자 블록 순서로 개념을 둔다」
  - 대상 주제: 개념 11 → 12. 같은 주제로 들어오는 이동 권고를 함께 넣은 배열은 「대상 주제별로 넣어 본 배열」에 있다
  - 원 주제에서 이 개념을 언급하는 개념(`Roles Anywhere|X\.509`): 없음
  - 원 주제 쪽 영향: 원 주제에 남는 개념 중 이 개념을 언급하거나 전제로 쓰는 것은 없어 빼도 전제를 잃는 개념이 생기지 않는다. 역할 블록에는 `iam-permissions.instance-profile`과 `iam-permissions.cross-account-iam-role`이 남는다. 연결 문항 q686의 판정은 자격 증명 페더레이션 주제의 경로가 문제의 조건에서 제외됐다며 현재 주제 유지를 권해 이 개념 판정과 반대쪽을 가리킨다.
- 커버리지 영향(ADR-026):
  - 원 id `iam-permissions.iam-roles-anywhere`는 사라지고, 연결 문항 1개 중 1개가 새 id를 따라간다
  - 새 개념 `identity-federation.iam-roles-anywhere`의 문항 1개
- 함께 고칠 곳:
  - `src/data/topics.json` — `iam-permissions`에서 빼고 `identity-federation`에 넣는다. 개념 id가 바뀐다
  - `src/data/questions.json` — q686의 topicId·conceptId
  - `scripts/topics-baseline.json` — 개념 항목 2532줄의 id·순서, `questionsSha256`
  - `src/data/data.test.ts` — 이 개념 id가 나오는 줄: 2365줄(const step18Concepts) · 4474줄(it 「IAM 권한 주제가 사용자와 그룹·역할·정책·분석 도구·루트 사용자 블록 순서로 개념을 둔다」)
  - `src/data/data.test.ts` — 문항을 구간으로 대조하는 단언: q686 → 2386줄 it 「자격 증명 문제 24개가 담당 개념 20개를 빠짐없이 덮는다」(topicId·conceptId) · 2401줄 it 「자격 증명 문제의 topicId가 conceptId의 주제와 같다」(topicId·conceptId) · 2411줄 it 「자격 증명 문제의 정답 위치와 문구가 출제 규칙을 따른다」(대조 필드 없음)
- 되돌리는 방법: `topics.json`에서 `identity-federation.iam-roles-anywhere`를 빼고 id를 `iam-permissions.iam-roles-anywhere`로 되돌려 `iam-permissions`의 위치 6(앞 `instance-profile` · 뒤 `cross-account-iam-role`)에 다시 넣는다. `questions.json`의 q686 topicId를 `iam-permissions`·conceptId를 `iam-permissions.iam-roles-anywhere`로 되돌린다. `topics-baseline.json`의 개념 항목과 `questionsSha256`(`aadc1894b3eb2d92…`)을 이 값으로, `data.test.ts`의 위 줄들을 원래대로 되돌린다.
- 판정 근거(verdicts.jsonl): 온프레미스에도 IAM 역할을 쓰게 하는 확장이라는 해석은 있지만, 본문이 가르는 것은 역할의 권한 범위가 아니라 기존 인증서를 AWS 자격 증명으로 교환하는 인증 연동 방식이다. 서비스 고유 목표의 중심이 SAML·OIDC·상호 TLS·서명과의 자격 증명 획득 비교에 있어 identity-federation을 권하며, 역할 활용이라는 현재 블록의 해석 여지는 medium으로 남긴다.
- 교차 근거(cross-phase35.jsonl): 개념의 identity-federation 이동 권고가 medium이라 hold다. q686은 identity-federation의 SAML·ID 브로커 경로가 조건에서 제외됐다는 이유로 현재 개념을 유지했는데, 이는 자격 증명 획득 방식 비교를 근거로 옮기자는 개념 판정과 반대쪽을 가리키는 근거라 설계 단계에서 두 판정을 다시 맞춰 봐야 한다.

### 6-2. 이동 권고가 아닌 보류 16건

#### `s3-encryption-batch.s3-object-lambda`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: 같은 원본을 요청하는 애플리케이션마다 다르게 보여줘야 할 때 사본을 만들지 않고 S3 Object Lambda가 반환 직전에 객체를 변환한다는 것을 이해한다.
- 쟁점: Lambda로 객체를 처리하는 데이터 보호 ↔ 요청자마다 다른 형태로 내주는 접근 방식
- `s3-encryption-batch` 주제로 읽으면: PII 제거처럼 Lambda로 객체를 처리하는 기능으로 읽으면 암호화와 Batch Operations의 Lambda 호출을 묶은 현재 주제에 둔다.
- `s3-access-control` 주제로 읽으면: 중심이 같은 데이터를 요청하는 쪽마다 다른 형태로 내주는 접근 방식이라, 버킷에 닿는 방식을 나누는 접근 제어 주제가 자연스럽다.
- 영향 받는 문항 전체: q278
  - q278 — verdict keep · 권장 `s3-encryption-batch.s3-object-lambda` · conceptFit yes. 결정 지식: 같은 데이터 세트를 호출자마다 다르게 내보내려면 객체를 돌려주기 직전에 함수가 변환하는 S3 Object Lambda를 쓴다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q278은 반환 직전에 변환하는 구조로 현재 개념을 유지했지만, 개념 쪽 쟁점은 그 구조를 데이터 처리(s3-encryption-batch)로 가르칠지 요청자별 접근 방식(s3-access-control)으로 가르칠지여서 문항의 keep만으로 소속이 정해지지 않는다.

#### `s3-access-control.s3-storage-lens`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: S3 Storage Lens는 계정 전반의 스토리지 사용 현황을 분석·보고하는 기능이라 객체 생성에 반응해 처리하는 이벤트 알림과 다르다는 것을 이해한다.
- 쟁점: S3 운영 기능으로서의 사용 현황 대시보드 ↔ 접근 제어와 무관한 사용 현황 분석
- `s3-access-control` 주제로 읽으면: S3 사용 현황 분석을 맡는 다른 주제가 없고 계정 전체 버킷을 한자리에서 보는 관리 기능이라, 접근 경로 뒤에 운영 기능을 붙인 현재 주제에 둔다.
- `s3-storage-classes` · `s3-versioning-lifecycle` 주제로 읽으면: 학습 목표가 접근 제어와 무관한 사용 현황 분석이라 `s3-storage-class-analysis` 곁이나 이벤트 알림이 있는 버전 관리·수명 주기 주제에서 가르치는 편이 자연스럽다.
- 영향 받는 문항 전체: q252
  - q252 — verdict keep · 권장 `s3-access-control.s3-storage-lens` · conceptFit yes. 결정 지식: 계정에 흩어진 버킷의 사용 현황을 한자리에 모아 분석하고 보고하는 기능은 S3 Storage Lens다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q252는 사용 현황을 모아 보고하는 기능으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 접근 제어와 무관한 사용 현황 분석을 s3-storage-classes나 s3-versioning-lifecycle에서 가르칠지여서 문항의 keep만으로 확정되지 않는다.

#### `s3-access-control.s3-storage-lens-advanced-activity-metrics`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: S3 Storage Lens의 고급 활동 메트릭을 켜면 접근 로그를 직접 모아 분석하지 않고도 계정 전체에서 더 이상 읽히지 않는 버킷을 찾아 스토리지 비용 절감 대상을 고를 수 있음을 이해한다.
- 쟁점: Storage Lens 기본 개념의 세부 설정 ↔ 접근이 식은 데이터를 찾아 비용을 줄이는 일
- `s3-access-control` 주제로 읽으면: Storage Lens 기본 개념의 세부 설정이라 기본 개념과 같은 블록에 붙어 있어야 한다.
- `s3-storage-classes` 주제로 읽으면: 학습 목표가 접근이 식은 데이터를 찾아 스토리지 비용을 줄이는 일이라 접근 패턴 분석과 클래스 비용을 다루는 주제가 자연스럽다.
- 영향 받는 문항 전체: q255
  - q255 — verdict keep · 권장 `s3-access-control.s3-storage-lens-advanced-activity-metrics` · conceptFit yes. 결정 지식: 더 이상 읽히지 않는 버킷을 계정 전체에서 찾는 일은 Storage Lens의 고급 활동 메트릭을 켜면 대시보드 안에서 끝난다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q255는 준비가 가장 적은 수단으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 Storage Lens 기본 개념과 같은 블록에 둘지 비용 절감 대상을 고르는 s3-storage-classes에 둘지여서 기본 개념 s3-storage-lens의 처리와 함께 정해야 한다.

#### `efs-fsx.efs-replication-one-way`

- 보류 기준: hold(문항 ambiguous) · 개념 판정 keep · serviceSpecificGoal true
- 학습 목표: EFS 자체 복제의 읽기 전용 대상과 단방향 제약 때문에 양쪽 리전에서 쓰는 동기화는 별도의 반대 방향 전송 작업이 필요함을 이해한다.
- 영향 받는 문항 전체: q348
  - q348 — verdict ambiguous · 권장 `efs-fsx.efs-replication-one-way` · conceptFit yes. 결정 지식: EFS 자체 복제는 읽기 전용 대상을 두는 단방향 기능이고, 양쪽 쓰기를 반영하는 대안은 반대 방향의 DataSync 작업 두 개다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이지만 유일한 문항 q348이 ambiguous라 hold다. EFS 복제의 단방향 제약으로 읽으면 현재 개념이지만 반대 방향 DataSync 작업 두 개의 구성 문제로도 읽히고, data-transfer-services에는 양방향 작업을 설명하는 개념이 없어 이동 쪽 대상도 비어 있다.

#### `data-transfer-services.datasync-task-status-event`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: DataSync가 제공하는 작업 상태 이벤트를 이용하면 별도의 상태 조회 코드를 만들지 않고 전송 결과를 알림으로 연결할 수 있음을 이해한다.
- 쟁점: DataSync 작업 상태 알림 기능 ↔ 폴링 대신 이벤트 규칙을 쓰는 공통 패턴
- `data-transfer-services` 주제로 읽으면: DataSync 작업의 완료·실패를 통지하는 고유 연동 기능으로 읽으면 전송 운영을 다루는 현재 주제의 내용이다.
- `sqs-sns-eventbridge` 주제로 읽으면: 두 번째 문단이 CloudWatch에도 같은 원리를 적용하며 이벤트가 있으면 폴링을 만들지 말라는 공통 패턴을 가르치므로 이벤트 규칙 주제의 내용이다.
- 영향 받는 문항 전체: q364
  - q364 — verdict ambiguous · 권장 `data-transfer-services.datasync-task-status-event` · conceptFit yes. 결정 지식: DataSync가 작업 실행의 성공·오류 상태 변화를 이벤트로 내보내므로 EventBridge 규칙에서 SNS로 연결하면 상태를 폴링하는 코드 없이 이메일로 알릴 수 있다.
- 교차 근거(cross-phase35.jsonl): 개념과 q364가 모두 ambiguous라 hold다. 두 판정이 DataSync 상태 이벤트라는 서비스 기능인가, 폴링 대신 EventBridge 규칙에서 SNS로 잇는 sqs-sns-eventbridge.eventbridge-event-pattern-vs-polling의 공통 패턴인가라는 같은 쟁점에서 멈춰 서로 어긋나지 않지만 확정할 근거도 없다.

#### `aurora.aurora-clone`

- 보류 기준: hold(문항 ambiguous) · 개념 판정 keep · serviceSpecificGoal true
- 학습 목표: Aurora 클론은 Aurora 클러스터를 복제하는 기능이므로 일반 RDS 엔진의 장기 백업·복원 요구에 대신 적용할 수 없음을 이해한다.
- 영향 받는 문항 전체: q400
  - q400 — verdict ambiguous · 권장 `backup-disaster-recovery.backup-long-term-retention`(다른 주제) · conceptFit partial. 결정 지식: 서비스 자체 백업의 보존 한계, 곧 RDS 자동 백업의 35일을 넘겨 보존하면서 특정 시점 복원까지 해야 하면 AWS Backup으로 백업 계획을 세운다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이지만 유일한 문항 q400이 ambiguous라 hold다. q400은 이동할 경우의 대상으로 backup-disaster-recovery.backup-long-term-retention을 적었지만 클론의 적용 범위를 확인하는 해석도 남겼고, 개념 판정은 후반의 AWS Backup 설명을 반례로 봤다. 문항을 옮기면 aurora-clone에 문항이 남지 않는다.

#### `elastic-load-balancing.internal-load-balancer`

- 보류 기준: hold(문항 ambiguous) · 개념 판정 keep · serviceSpecificGoal true
- 학습 목표: 로드 밸런서를 내부용으로 만들면 사설 네트워크에서만 닿지만 이름 공개 여부는 호스팅 영역이 따로 정하므로 둘 다 사설로 두어야 완전히 숨겨짐을 이해한다.
- 영향 받는 문항 전체: q459
  - q459 — verdict ambiguous · 권장 `elastic-load-balancing.internal-load-balancer` · conceptFit yes. 결정 지식: 접속 경로와 이름 해석을 모두 사설로 제한하려면 내부 로드 밸런서와 프라이빗 호스팅 영역을 함께 사용해야 한다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이지만 유일한 문항 q459가 ambiguous라 hold다. 내부 로드 밸런서의 노출 체계만으로는 퍼블릭·프라이빗 호스팅 영역을 가른 두 보기 중 답을 고를 수 없어 route53 문제라는 해석이 남았고, 개념 판정은 프라이빗 호스팅 영역을 짝으로만 봤다.

#### `lambda.lambda-concurrency-limit-throttling`

- 보류 기준: hold(문항 ambiguous) · 개념 판정 keep · serviceSpecificGoal true
- 학습 목표: TooManyRequestsException은 Lambda 동시 실행 한도에 닿았다는 신호이므로 앞에 큐를 두어 급증분을 받아 두어야 하며 예약된 동시성은 오히려 확장을 묶는다는 것을 이해한다.
- 영향 받는 문항 전체: q497
  - q497 — verdict ambiguous · 권장 `lambda.lambda-concurrency-limit-throttling` · conceptFit yes. 결정 지식: Lambda 동시 실행 한도로 거절되는 급증 요청은 큐에 보관한 뒤 처리 가능한 속도로 전달하면 유실을 막을 수 있다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이지만 유일한 문항 q497이 ambiguous라 hold다. 동시성 한도 초과를 진단하는 Lambda 문제로 읽으면 현재 개념이지만 급증분을 큐가 보관한다는 sqs-sns-eventbridge.sns-is-not-a-queue의 통합 패턴으로도 읽히며, 개념 판정은 큐를 버퍼로만 봤다.

#### `ecs-eks-fargate.elastic-beanstalk`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: Elastic Beanstalk의 코드 배포 자동화가 인스턴스 운영 책임까지 없애지는 않으며 애플리케이션을 함수로 나누기 어려울 때 선택지가 되는 이유를 이해한다.
- 쟁점: 기존 애플리케이션의 배포 방식 선택 ↔ EC2 기반 환경에 남는 운영 책임
- `ecs-eks-fargate` 주제로 읽으면: 뒤의 App2Container가 코드 배포와 컨테이너 변환을 대비하므로, 배포 방식을 고르는 지식으로 읽으면 현재 주제에 둔다.
- `ec2-autoscaling` 주제로 읽으면: 개념 자체의 중심이 EC2 기반 환경에 남는 운영 책임과 Lambda와의 차이라서 관리형 배포를 EC2 주제에서 설명하는 편이 자연스럽다.
- 영향 받는 문항 전체: q510
  - q510 — verdict keep · 권장 `ecs-eks-fargate.elastic-beanstalk` · conceptFit yes. 결정 지식: Elastic Beanstalk는 기존 애플리케이션 코드를 통째로 받아 환경 생성과 배포·확장·상태 모니터링을 지원한다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q510은 코드를 통째로 배포한다는 조건으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 이 문항이 다루지 않는 EC2 기반 환경의 운영 책임을 ecs-eks-fargate와 ec2-autoscaling 중 어디서 가르칠지여서 문항의 keep만으로 확정되지 않는다.

#### `api-gateway-step-functions.amplify`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: Amplify의 웹·모바일 개발·배포 지원과 백엔드 처리 완료 알림은 구분해야 하며 알림은 별도 서비스가 맡는다는 경계를 이해한다.
- 쟁점: 앱 개발·배포와 백엔드 처리의 책임 구분 ↔ 푸시 알림 서비스 선택 기준
- `api-gateway-step-functions` 주제로 읽으면: 웹·모바일 앱 개발·배포와 백엔드 처리 흐름의 책임을 구분하는 소개로 읽으면 API와 워크플로를 다루는 현재 주제에 둔다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문이 처리 완료 푸시 알림을 Amplify가 아니라 SNS가 맡는다는 대비에 집중하므로 알림 서비스 선택 기준으로 읽힌다.
- 영향 받는 문항 전체: q529
  - q529 — verdict keep · 권장 `api-gateway-step-functions.amplify` · conceptFit yes. 결정 지식: Amplify가 맡는 범위는 애플리케이션을 만들고 배포해 서비스하는 데까지이고, 처리 완료를 사용자에게 알리는 기능은 거기에 들어 있지 않다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q529는 Amplify의 범위가 어디서 끝나는지로 현재 개념을 유지하고 SNS를 대비 오답으로만 봤지만, 개념 쪽은 알림 서비스 선택 기준(sqs-sns-eventbridge)으로 읽는 해석을 남겼으므로 문항의 keep만으로 확정되지 않는다.

#### `hybrid-connectivity.access-terms`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal false
- 학습 목표: Customer Gateway는 Site-to-Site VPN의 고객 측 종단이고 Bastion Host는 프라이빗 서브넷의 서버로 들어가는 중간 서버라서, 둘 다 요구된 연결 경로 자체를 만드는 수단이 아님을 이해한다.
- 쟁점: VPN 구성 요소 Customer Gateway ↔ 프라이빗 인스턴스 접속 수단 Bastion Host
- `hybrid-connectivity` 주제로 읽으면: Customer Gateway를 VPN 구성 요소로 읽으면 뒤의 `virtual-private-gateway`가 온프레미스 쪽 종단으로 전제하므로 현재 주제에 둔다.
- `systems-manager` · `vpc-networking` 주제로 읽으면: Bastion Host의 실제 역할은 프라이빗 서브넷 인스턴스 접속이라 배스천 없는 접속을 다루는 Systems Manager 주제나 VPC 주제가 자연스럽다. 성격이 다른 두 용어가 한 개념에 묶여 있다.
- 영향 받는 문항 전체: q217
  - q217 — verdict keep · 권장 `hybrid-connectivity.access-terms` · conceptFit yes. 결정 지식: Site-to-Site VPN의 고객 측 연결 종단을 나타내는 구성 요소는 Customer Gateway다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q217은 Customer Gateway가 VPN의 고객 측 종단이라는 지식으로 현재 개념을 유지했지만, 개념 쪽 쟁점은 한 개념에 함께 묶인 Bastion Host를 systems-manager나 vpc-networking에서 가르칠지여서 이 문항이 답하지 않는다.

#### `cloudwatch-xray.cloudwatch-alarm-state-change-event`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: CloudWatch 알람의 상태 변경이 이벤트로 나가므로 EventBridge 규칙이 이를 받아 조치 서비스를 직접 대상으로 호출하면 중계 함수 없이 자동 대응을 붙일 수 있음을 이해한다.
- 쟁점: CloudWatch 알람 상태 변경을 자동 대응의 출발점으로 쓰기 ↔ 규칙이 대상을 직접 호출하는 EventBridge 설계
- `cloudwatch-xray` 주제로 읽으면: 알람을 알림 장치로만 쓰지 않고 상태 변경을 자동 대응의 출발점으로 삼는 CloudWatch 알람의 활용으로 읽으면 CloudWatch 블록에 둔다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문 후반이 함수를 끼우지 않고 규칙이 대상을 직접 호출하는 EventBridge 규칙 설계를 가르치며 `eventbridge-resource-change-rule`과 같은 패턴이다.
- 영향 받는 문항 전체: q656
  - q656 — verdict ambiguous · 권장 `cloudwatch-xray.cloudwatch-alarm-state-change-event` · conceptFit yes. 결정 지식: CloudWatch 알람의 상태 변경은 EventBridge 이벤트로 전달되므로, 규칙이 그 이벤트를 잡아 조치 서비스를 대상으로 직접 호출하면 사이에 함수를 두지 않아도 된다.
- 교차 근거(cross-phase35.jsonl): 개념과 q656이 모두 ambiguous라 hold다. 둘 다 알람 상태 변경이 이벤트로 나간다는 CloudWatch 기능과, 규칙이 조치 서비스를 직접 호출해 함수를 끼우지 않는 EventBridge 규칙 설계 사이에서 같은 두 해석을 남겼다.

#### `secrets-encryption.acm-expiration-event`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: ACM이 제공하는 인증서 만료 임박 이벤트를 사람에게 전달할 알림으로 연결하면 만료 날짜를 반복 조회하는 코드를 줄일 수 있음을 이해한다.
- 쟁점: ACM 인증서 만료 이벤트 기능 ↔ 이벤트 우선·SNS 알림 전달 패턴
- `secrets-encryption` 주제로 읽으면: 가져온 ACM 인증서의 만료를 관리하는 고유 이벤트 기능으로 읽으면 ACM 블록의 운영 내용이다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문 후반이 SNS와 SQS의 알림 전달 차이와 폴링보다 이벤트를 우선하는 공통 패턴을 가르쳐 메시징 주제에 둘 근거가 강하다.
- 영향 받는 문항 전체: q667
  - q667 — verdict ambiguous · 권장 `secrets-encryption.acm-expiration-event` · conceptFit yes. 결정 지식: ACM이 인증서 만료 임박 이벤트를 발행하므로 EventBridge 규칙으로 잡아 이메일 구독이 붙은 SNS 주제로 보내면 폴링 함수나 큐 소비자 코드 없이 담당자에게 통보된다.
- 교차 근거(cross-phase35.jsonl): 개념과 q667이 모두 ambiguous라 hold다. 둘 다 ACM 만료 임박 이벤트라는 서비스 기능과, 폴링 대신 이벤트 패턴을 쓰고 알림에는 큐가 아니라 SNS를 쓴다는 sqs-sns-eventbridge의 통합 지식 사이에서 같은 두 해석을 남겼다.

#### `guardduty-macie-inspector.guardduty-finding-to-eventbridge`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: GuardDuty의 탐지 결과를 EventBridge 규칙으로 받아 격리 작업을 수행할 함수와 연결하면 탐지와 실제 대응을 분리해 자동화할 수 있음을 이해한다.
- 쟁점: GuardDuty가 직접 대응하지 않는 한계의 보완 ↔ 탐지와 조치를 잇는 EventBridge 규칙 패턴
- `guardduty-macie-inspector` 주제로 읽으면: GuardDuty가 직접 대응하지 않는 한계를 보완하는 운영 통합으로 읽으면 탐지 블록에서 배울 내용이고, 본문도 탐지 출발점의 차이를 강조한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 본문이 탐지와 조치를 잇는 EventBridge 규칙을 구성의 요점으로 명시하므로 이벤트 기반 대응 패턴으로 읽힌다.
- 영향 받는 문항 전체: q683
  - q683 — verdict keep · 권장 `guardduty-macie-inspector.guardduty-finding-to-eventbridge` · conceptFit yes. 결정 지식: 암호화폐 채굴 같은 활동을 탐지하는 것은 GuardDuty이고, 그 탐지 결과를 조건으로 한 EventBridge 규칙이 함수를 불러 사람 손 없이 인스턴스를 격리한다.
- 교차 근거(cross-phase35.jsonl): 개념이 ambiguous라 hold다. q683은 오답이 보안 서비스의 역할을 오해한 것이라 GuardDuty 탐지 쪽으로 유지하고 EventBridge를 부차로 뒀지만, 개념 쪽 쟁점은 탐지와 조치를 잇는 EventBridge 규칙 패턴의 소속이라 문항의 keep은 두 해석 중 한쪽만 뒷받침한다.

#### `guardduty-macie-inspector.macie-finding-to-eventbridge`

- 보류 기준: ambiguous · hold(개념 ambiguous) · 개념 판정 ambiguous · serviceSpecificGoal true
- 학습 목표: Macie의 민감 데이터 발견을 보안 팀에 알리려면 탐지 유형을 거른 이벤트를 사람에게 전달할 대상으로 보내야 하며 큐 저장만으로는 부족함을 이해한다.
- 쟁점: Macie 결과의 유형과 침해 탐지와의 차이 ↔ 큐에 쌓기와 사람에게 알리기의 차이
- `guardduty-macie-inspector` 주제로 읽으면: Macie가 만든 결과의 유형과 침해 징후 탐지와의 차이를 배우는 활용 개념으로 보면 민감 데이터 탐지 블록에 속한다.
- `sqs-sns-eventbridge` 주제로 읽으면: 후반의 핵심이 큐에 쌓는 것과 사람에게 알리는 것의 차이라 이벤트에서 알림으로 잇는 패턴으로 읽힌다.
- 영향 받는 문항 전체: q684
  - q684 — verdict ambiguous · 권장 `guardduty-macie-inspector.macie-finding-to-eventbridge` · conceptFit yes. 결정 지식: 민감 데이터 탐지 결과는 EventBridge로 나가므로 규칙에서 해당 유형만 걸러 알림 서비스로 보내면 보안 팀이 바로 통보받고, 큐나 버킷은 쌓아 둘 뿐 사람에게 알리지 않는다.
- 교차 근거(cross-phase35.jsonl): 개념과 q684가 모두 ambiguous라 hold다. 둘 다 Macie 탐지 결과의 유형이라는 보안 서비스 지식과, 알림이 필요한 곳에 큐를 두지 않는 sqs-sns-eventbridge.sns-is-not-a-queue의 이벤트→알림 패턴 사이에서 같은 두 해석을 남겼다.

#### `cost-management.on-demand-capacity-reservation`

- 보류 기준: hold(문항 ambiguous) · 개념 판정 keep · serviceSpecificGoal true
- 학습 목표: 온디맨드 용량 예약은 필요한 인스턴스 용량을 미리 확보하는 기능일 뿐 할인 수단이 아니므로 비용 최적화 요구에는 답이 되지 않고, 중단을 견디는 배치 작업에는 약정 할인보다 스팟이 더 싸다는 것을 이해한다.
- 영향 받는 문항 전체: q727 · q728
  - q727 — verdict keep · 권장 `cost-management.on-demand-capacity-reservation` · conceptFit yes. 결정 지식: 온디맨드 용량 예약은 인스턴스 용량을 미리 확보하는 기능으로 약정 할인이나 스팟 할인처럼 요금을 낮추는 수단이 아니다.
  - q728 — verdict ambiguous · 권장 `ec2-autoscaling.spot-workload-fit`(다른 주제) · conceptFit partial. 결정 지식: 중단 후 재시작할 수 있는 배치 작업은 스팟을 선택해 비용을 낮출 수 있으며, 이 조건에서는 절약 플랜보다 저렴하고 용량 예약은 할인 수단이 아니다.
- 교차 근거(cross-phase35.jsonl): 개념은 keep이지만 q728이 ambiguous라 hold다. q728은 중단을 견디는 작업에 스팟을 고르는 해석으로 ec2-autoscaling.spot-workload-fit을 잠정 권했는데, 이는 step 12가 개념을 ambiguous에서 keep으로 고칠 때 물리친 EC2 쪽 해석과 같은 방향이다. q727은 현재 개념을 유지하므로 q728이 옮겨도 원 개념의 커버리지는 남는다.
