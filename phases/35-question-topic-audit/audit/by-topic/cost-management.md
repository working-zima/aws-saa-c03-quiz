# 절약 플랜·Budgets·Cost Explorer·Trusted Advisor

`cost-management` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 19개 · keep 18 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 17 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q164 | savings-plan | keep | — | yes | (현재) | (현재) | false | 절약 플랜은 일정 기간과 사용량을 약정하는 대가로 할인된 요금을 적용받는 모델이다. |
| q165 | savings-plan | keep | — | partial | (현재) | savings-plan-details | false | 컴퓨팅 절약 플랜은 EC2뿐 아니라 Fargate와 Lambda에도 할인을 적용하므로 EC2 인스턴스 절약 플랜보다 적용 범위가 넓다. |
| q166 | aws-budgets | keep | — | yes | (현재) | (현재) | false | AWS Budgets는 예상 사용량과 비용을 바탕으로 예산을 설정하고 실제 지출이 그 기준을 넘으면 알린다. |
| q167 | cost-explorer | keep | — | yes | (현재) | (현재) | false | Cost Explorer는 이미 발생한 AWS 비용을 분석하며 태그 기준으로 지출을 나누고 합산할 수 있다. |
| q168 | billing-and-cost-management | keep | — | yes | (현재) | (현재) | false | Billing and Cost Management는 청구된 AWS 요금의 조회와 결제 및 비용 관리를 제공하는 콘솔이다. |
| q169 | trusted-advisor | keep | — | yes | (현재) | (현재) | false | Trusted Advisor는 AWS 환경을 자동으로 점검해 비용 절감과 성능 개선을 위한 권장 사항을 제시한다. |
| q243 | cost-allocation-tag-activation | keep | — | yes | (현재) | (현재) | false | 리소스에 사용자 정의 태그를 붙인 뒤 결제 콘솔에서 비용 할당 태그로 활성화해야 Cost Explorer의 비용 집계에 사용할 수 있다. |
| q244 | savings-plan-details | keep | — | yes | (현재) | (현재) | false | EC2·Fargate·Lambda 전체의 할인을 받되 다년 약정과 선결제를 피하려면 1년 약정에 선결제 없음 옵션을 둔 컴퓨팅 절약 플랜을 고른다. |
| q245 | cost-anomaly-detection | keep | — | yes | (현재) | (현재) | false | Cost Anomaly Detection은 정해 둔 예산 임계값 도달이 아니라 평소와 다른 지출 패턴을 감지한다. |
| q246 | compute-optimizer | keep | — | yes | (현재) | (현재) | false | Compute Optimizer는 리소스 사양 최적화를 권장하는 도구이며 팀별 비용을 집계하거나 보고하는 도구가 아니다. |
| q724 | cost-and-usage-report | keep | — | yes | (현재) | (현재) | false | AWS 비용 및 사용량 보고서는 상세 청구 데이터를 S3로 내보내므로 정해진 콘솔 화면을 벗어난 비용 집계와 시각화의 원본으로 쓸 수 있다. |
| q725 | savings-plan-baseline-vs-spike | keep | — | yes | (현재) | (현재) | false | 오래 지속되는 기본 부하만 절약 플랜으로 약정하고 잠깐 늘어나는 중단 불가 용량은 온디맨드로 받아 쓰지 않는 약정 비용을 피한다. |
| q726 | rds-reserved-instance | keep | — | yes | (현재) | (현재) | false | 장기간 꾸준히 운영할 관리형 MySQL은 RDS 예약 인스턴스를 선택해 관리형 운영을 유지하면서 온디맨드보다 요금을 낮춘다. |
| q727 | on-demand-capacity-reservation | keep | — | yes | (현재) | (현재) | false | 온디맨드 용량 예약은 인스턴스 용량을 미리 확보하는 기능으로 약정 할인이나 스팟 할인처럼 요금을 낮추는 수단이 아니다. |
| q728 | on-demand-capacity-reservation | ambiguous | — | partial | ec2-autoscaling | ec2-autoscaling.spot-workload-fit | false | 중단 후 재시작할 수 있는 배치 작업은 스팟을 선택해 비용을 낮출 수 있으며, 이 조건에서는 절약 플랜보다 저렴하고 용량 예약은 할인 수단이 아니다. |
| q729 | cost-allocation-tag-activation-in-management-account | keep | — | yes | (현재) | (현재) | false | Organizations 통합 청구의 비용 할당 태그는 관리 계정에서 사용자 정의 태그를 한 번 활성화하며 멤버 계정마다 반복하지 않는다. |
| q730 | budget-actions | keep | — | yes | (현재) | (현재) | false | AWS Budgets의 예산 조치는 비용 임계값 도달을 정책 적용이나 인스턴스 중지로 연결해 알림을 넘어 추가 사용을 제한한다. |
| q731 | budget-forecasted-alert | keep | — | yes | (현재) | (현재) | false | Budgets의 예상 지출 알림은 실제 비용이 예산에 도달하기 전에 초과 예측을 기준으로 알릴 수 있어 별도 비용 계산 코드가 필요 없다. |
| q732 | compute-optimizer-ebs-recommendations | keep | — | yes | (현재) | (현재) | false | Compute Optimizer의 EBS 권장 사항은 사용 패턴으로 비효율적인 볼륨 구성을 찾아 예상 절감액과 함께 개선안을 제시한다. |
