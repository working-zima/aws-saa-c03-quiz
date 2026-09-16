# 절약 플랜·Budgets·Cost Explorer·Trusted Advisor

`cost-management` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 17개 · keep 17 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 14 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 15 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | savings-plan | 절약 플랜은 기간과 사용량을 약정하는 대신 요금을 할인받는 모델이며, 컴퓨팅 절약 플랜은 EC2·Fargate·Lambda에 걸쳐 적용되고 EC2 인스턴스 절약 플랜은 특정 인스턴스 계열과 리전에 묶인다는 유형 차이를 이해한다. | keep | — | true | (현재) | — | 2 | 2A |
| 2 | savings-plan-details | EC2를 Lambda나 Fargate와 함께 쓰는 환경에서는 EC2 인스턴스 절약 플랜으로 할인되지 않는 부분이 생겨 컴퓨팅 절약 플랜을 고르고, 다년 계약을 피하려면 1년 약정과 선결제 없음 옵션을 고른다는 선택 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | savings-plan-baseline-vs-spike | 1년 이상 이어지는 예측 가능한 기본 부하만 약정으로 덮고 몇 주짜리 일시적 증가분은 온디맨드로 받아야 쓰지 않는 약정분의 비용을 피할 수 있으며, 상태 유지형 워크로드의 증가분은 스팟으로 받을 수 없음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | rds-reserved-instance | 관리형 관계형 데이터베이스를 꾸준히 사용할 때 컴퓨팅 절약 플랜의 적용 범위와 RDS 예약 인스턴스의 할인 선택을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | on-demand-capacity-reservation | 온디맨드 용량 예약은 필요한 인스턴스 용량을 미리 확보하는 기능일 뿐 할인 수단이 아니므로 비용 최적화 요구에는 답이 되지 않고, 중단을 견디는 배치 작업에는 약정 할인보다 스팟이 더 싸다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | hold |
| 6 | cost-explorer | Cost Explorer는 이미 발생한 과거·현재 지출을 분석하는 도구이며, 리소스 태그로 비용을 나누고 합산해 팀·프로젝트·환경별 지출을 확인할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | billing-and-cost-management | 청구된 요금의 확인·결제·비용 관리를 한곳에서 처리하는 결제 콘솔의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 8 | cost-allocation-tag-activation | 부서별 비용을 나누려면 리소스에 사용자 정의 태그를 붙인 뒤 결제 콘솔에서 그 태그를 활성화하는 두 단계를 거쳐야 비용 분석 도구에 나타나며, AWS가 붙이는 시스템 태그는 이 용도가 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | cost-allocation-tag-activation-in-management-account | 통합 청구를 쓰는 조직에서는 비용 할당 태그 활성화를 구성원 계정마다 하지 않고 지불자인 관리 계정에서 한 번 해야 통합 비용 보기에 일관되게 쓰이며, 리소스 그룹 콘솔은 청구 할당을 켜는 곳이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | aws-budgets | AWS Budgets는 예상 사용량과 지출로 예산을 세우고 실제 값이 넘으면 알리며, 비용 태그로 특정 리소스만 예산 감시 대상에 넣을 수 있다는 역할을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | budget-actions | 예산을 넘지 않게 막아야 하면 알림만으로는 부족하고 임계값에서 SCP를 붙이거나 인스턴스를 멈추는 예산 조치를 써야 하며, Cost Explorer·Cost Anomaly Detection·CloudWatch 경보는 알릴 뿐 막지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | budget-forecasted-alert | AWS Budgets 알림은 실제 지출뿐 아니라 예상 지출이 임계값을 넘을 것으로 계산될 때도 보낼 수 있어 초과를 가장 빨리 감지하며, SNS로 전달되므로 비용 계산 함수를 따로 만들 필요가 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | cost-anomaly-detection | Cost Anomaly Detection은 평소와 다른 이상 지출 패턴을 감지하는 도구라서 예산의 몇 퍼센트 도달 같은 임계값 기반 알림 요구에는 AWS Budgets가 맞음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | cost-and-usage-report | Cost Explorer나 Budgets의 정해진 화면으로 만들기 어려운 사용자 지정 비용 집계에는 항목별 청구 원본을 S3로 내보내는 CUR을 쓰고 Athena로 질의·QuickSight로 시각화한다는 선택 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | trusted-advisor | 환경 점검 결과로 비용 절감과 성능 개선을 권고하는 진단 도구의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 16 | compute-optimizer | Compute Optimizer는 리소스 사양 최적화를 권장할 뿐 팀별 비용 집계·보고나 예산 임계값 알림을 하지 않으므로, 그 요구는 비용 할당 태그와 Cost Explorer·Budgets가 맡는다는 역할 경계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | compute-optimizer-ebs-recommendations | Compute Optimizer의 권장 대상에는 EBS 볼륨도 포함되어 활용도가 낮거나 비효율적인 구성을 예상 절감액과 함께 제시하므로, 절감액이 담긴 제안이 필요하면 지표만 보여 주는 모니터링 도구가 아니라 이 서비스를 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
