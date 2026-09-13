# EC2 인스턴스 유형·구매 옵션·Auto Scaling

`ec2-autoscaling` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 24개 · keep 24 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 24 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q074 | ec2 | keep | — | yes | (현재) | (현재) | false | EC2는 서버 한 대를 임대해 원격으로 접속해 쓰는 컴퓨팅 서비스이고, 나머지는 이미 있는 서버의 앞이나 사이에 놓이는 서비스다. |
| q075 | ec2 | keep | — | yes | (현재) | (현재) | false | 대상 추적 정책은 평균 CPU 사용률 70% 같은 목표값을 유지하도록 Auto Scaling이 서버 수를 계속 조정하는 방식이다. |
| q076 | ec2 | keep | — | yes | (현재) | (현재) | false | 스팟 인스턴스는 AWS가 여유 용량을 회수하면 실행이 멈추는 대신 값이 가장 싼 구매 방식이라 중단을 감수하는 작업에 맞는다. |
| q077 | ec2 | keep | — | yes | (현재) | (현재) | false | 예약 인스턴스는 1년이나 3년 사용을 약정하고 그 대가로 할인을 받는 구매 방식이라 장기 가동이 확실할 때 고른다. |
| q188 | warm-pool | keep | — | yes | (현재) | (현재) | false | Auto Scaling 웜 풀은 초기화를 마친 인스턴스를 중지 상태로 대기시켜 실행 비용을 늘리지 않고 확장 시 초기화 지연을 줄인다. |
| q189 | scheduled-scaling | keep | — | yes | (현재) | (현재) | false | 트래픽 급증 시점이 예측 불가능하면 시각을 지정하는 예약된 조정이 아니라 지표 목표값을 벗어나는 즉시 반응하는 대상 추적이 답이다. |
| q435 | ami-and-launch-template | keep | — | yes | (현재) | (현재) | false | 새 인스턴스를 띄우려면 복제할 이미지인 AMI와 시작 설정인 시작 템플릿이 먼저 있어야 하고, 그 둘을 받은 오토 스케일링 그룹이 수요에 따라 대수를 조정한다. |
| q436 | ec2-image-builder | keep | — | yes | (현재) | (현재) | false | EC2 Image Builder는 AMI를 만들고 패치·보안 강화·시험까지 파이프라인으로 자동화하는 관리형 서비스라 애플리케이션이 늘어도 같은 방식이 통한다. |
| q437 | memory-optimized-instance-family | keep | — | yes | (현재) | (현재) | false | 메모리 최적화 제품군은 메모리 안에서 큰 데이터를 처리하는 워크로드용이라, 두 계층 모두 메모리 사용률이 높으면 양쪽을 같은 제품군에 올린다. |
| q438 | gpu-instance-family | keep | — | yes | (현재) | (현재) | false | GPU를 제공하는 것은 GPU 인스턴스 제품군의 EC2뿐이라, 컨테이너가 GPU를 쓰면 Lambda와 Fargate가 후보에서 빠지고 그 인스턴스 위에 ECS를 올린다. |
| q439 | reserved-instance-types | keep | — | yes | (현재) | (현재) | false | 표준 예약 인스턴스는 정해 둔 유형을 그대로 쓰는 조건이라 할인이 가장 크고, 유형을 바꿀 계획이 없는 일정한 워크로드에 맞는다. |
| q440 | reserved-instance-types | keep | — | yes | (현재) | (현재) | false | 전환 가능 예약 인스턴스는 약정 기간 안에 인스턴스 유형을 바꿀 수 있는 대신 표준만큼 싸지 않다. |
| q441 | spot-workload-fit | keep | — | yes | (현재) | (현재) | false | 스팟은 중단을 견디도록 설계된 무상태 작업에만 맞고, 상태를 들고 있거나 한 대에서만 도는 워크로드에는 맞지 않는다. |
| q442 | target-tracking-vs-simple-scaling | keep | — | yes | (현재) | (현재) | false | 단순 조정은 고정 조정 폭과 쿨다운 탓에 짧은 급증에서 늦거나 과하게 늘고, 대상 추적은 지표를 목표값에 붙여 두려고 수요에 비례해 조절한다. |
| q443 | target-tracking-vs-simple-scaling | keep | — | yes | (현재) | (현재) | false | 경보 임계값을 넘으면 정해진 폭만큼 한 번 조정하고 쿨다운을 기다리는 방식이 단순 조정이다. |
| q444 | predictive-scaling | keep | — | yes | (현재) | (현재) | false | 예측 스케일링은 과거 패턴을 스스로 분석해 수요가 오르기 전에 인스턴스를 미리 시작하므로, 시각은 되풀이되지만 필요한 용량이 달라지는 워크로드를 사람 손 없이 받는다. |
| q445 | spot-allocation-strategy | keep | — | yes | (현재) | (현재) | false | 중단을 최소화하는 것이 우선 조건이면 여유 용량이 가장 많은 풀을 고르는 용량 최적화 전략이다. |
| q446 | spot-allocation-strategy | keep | — | yes | (현재) | (현재) | false | 가격-용량 최적화 전략은 가격과 용량을 함께 보아 비용과 용량 확보를 절충한다. |
| q447 | asg-instance-type-override | keep | — | yes | (현재) | (현재) | false | 허용할 인스턴스 유형을 여러 개로 재정의하면 뽑을 수 있는 용량 풀이 넓어져 원하는 시각에 용량이 확보될 확률이 올라간다. |
| q448 | asg-on-demand-base-capacity | keep | — | yes | (현재) | (현재) | false | Auto Scaling 그룹에 온디맨드를 기본 용량으로 일정 수 깔아 두면 그만큼은 회수되지 않아 스팟 중단의 충격을 흡수한다. |
| q449 | asg-single-instance-self-healing | keep | — | yes | (현재) | (현재) | false | 오토 스케일링 그룹은 지정된 용량을 유지하려 하므로, 최소·최대·희망 용량을 모두 1로 두면 확장 없이 비정상 인스턴스 교체만 남는다. |
| q450 | elb-health-check-drives-asg-replacement | keep | — | yes | (현재) | (현재) | false | 오토 스케일링 그룹은 로드 밸런서의 상태 검사 결과를 인스턴스 상태로 받아 교체하므로, 그 검사가 애플리케이션 응답까지 보는 깊이여야 고장이 잡힌다. |
| q451 | enhanced-networking | keep | — | yes | (현재) | (현재) | false | 향상된 네트워킹은 인스턴스 유형이 지원해야 켜지고, 클러스터 배치 그룹만으로는 대역폭과 초당 패킷 처리량이 끝까지 나오지 않는다. |
| q452 | parallelcluster | keep | — | yes | (현재) | (현재) | false | ParallelCluster는 고성능 컴퓨팅으로 계산 작업을 실행하는 환경을 꾸리는 도구이고, 실시간 응답형 워크로드의 확장은 맡지 않는다. |
