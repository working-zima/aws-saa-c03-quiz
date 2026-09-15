# EC2 인스턴스 유형·구매 옵션·Auto Scaling

`ec2-autoscaling` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 18 · false 0 · duplicateOf 1
- 이 주제로 들어올 이동 후보 4개 — `ebs-instance-store.cluster-placement-group` · `ebs-instance-store.spread-placement-group` · `ebs-instance-store.elastic-fabric-adapter` · `sqs-sns-eventbridge.sqs-queue-depth-scaling`
- 교차 유형 ① 18 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ec2 | EC2 인스턴스를 수요에 맞춰 조정하면서 사용 기간과 중단 허용 여부에 따라 구매 방식을 선택하는 기본 구조를 이해한다. | keep | — | true | (현재) | — | 4 | ① |
| 2 | ami-and-launch-template | EC2 인스턴스를 자동으로 늘리려면 복제할 AMI와 시작 설정을 갖추어 Auto Scaling 그룹이 같은 구성의 인스턴스를 생성할 수 있어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | ec2-image-builder | 새 EC2 인스턴스가 취약한 옛 이미지에서 반복 생성되지 않도록 Image Builder로 AMI 제작·패치·검사를 자동화해야 하는 이유를 이해한다. | keep | — | true | (현재) | systems-manager.ssm-patch-manager | 1 | ① |
| 4 | memory-optimized-instance-family | EC2 제품군은 계층의 이름이 아니라 실제 자원 수요로 골라야 하며 메모리 사용이 큰 계층에는 메모리 최적화 제품군이 필요한 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | gpu-instance-family | GPU 요구는 EC2 제품군뿐 아니라 사용할 실행 방식까지 제한하므로 GPU 인스턴스 기반 컨테이너 실행과 서버리스 대안을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | enhanced-networking | EC2 노드 간 통신 성능은 가까운 배치만으로 확보되지 않으며 향상된 네트워킹을 지원하는 인스턴스 유형을 함께 골라야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | reserved-instance-types | EC2 예약 인스턴스의 표준·전환 가능 유형을 선택할 때 할인 폭뿐 아니라 향후 인스턴스 유형 변경과 약정 기간의 제약을 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 8 | spot-workload-fit | EC2 스팟의 낮은 가격을 이용하려면 중단 때 잃을 상태가 있는지와 작업이 중단을 견디는지를 먼저 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | scheduled-scaling | EC2 용량 조정에서 수요가 몰릴 시점을 미리 알 수 있는지에 따라 예약된 조정과 지표 기반 대상 추적을 구분한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | target-tracking-vs-simple-scaling | EC2의 짧은 수요 급증에 대응할 때 고정 폭 조정과 목표 유지 조정을 구분하고 상태가 아닌 수요를 나타내는 지표를 선택할 수 있어야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 11 | predictive-scaling | 반복되는 EC2 수요에 앞서 용량을 준비하면서 필요한 대수도 자동으로 예측하려면 예약·반응형 조정과 예측 스케일링을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | spot-allocation-strategy | EC2 스팟 용량 풀을 고를 때 최저 비용·중단 최소화·두 조건의 절충 중 무엇을 우선하는지에 따라 할당 전략이 달라짐을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 13 | asg-instance-type-override | Auto Scaling 그룹이 사용할 EC2 인스턴스 유형을 여러 개 허용하면 하나의 용량 풀 부족에 묶이지 않아 필요한 용량을 확보하기 쉬워짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | asg-on-demand-base-capacity | Auto Scaling 그룹에 온디맨드 기반 용량을 두면 스팟 회수 때도 일정 처리 용량을 남겨 비용 절감과 가용성을 함께 조절할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | warm-pool | Auto Scaling 웜 풀에서 초기화를 끝낸 인스턴스를 중지 상태로 대기시키면 계속 실행하는 여유 서버보다 실행 비용을 줄이면서 확장 준비 시간을 단축할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | asg-single-instance-self-healing | Auto Scaling 그룹의 용량을 한 대로 고정해도 지정 용량을 유지하는 동작으로 비정상 인스턴스를 자동 교체할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | elb-health-check-drives-asg-replacement | Auto Scaling의 비정상 인스턴스 교체가 작동하려면 애플리케이션 오류를 실제로 감지하는 상태 검사 결과가 전달되어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | parallelcluster | ParallelCluster는 배치 성격의 HPC 계산 환경을 마련하는 도구이므로 실시간 상호작용 서비스의 탄력적 확장과는 용도가 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
