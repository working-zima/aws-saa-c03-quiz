# ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk

`ecs-eks-fargate` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 23개 · keep 22 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 22 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 22 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ecs | ECS는 컨테이너를 운영하는 서비스이며 EC2 기반은 세부 조정 대신 서버 운영 부담이 크고 Fargate 기반은 서버 관리와 확장을 AWS에 맡긴다는 차이를 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 2 | ecs-task-role | ECS에서 컨테이너에 권한을 줄 때 인스턴스 역할이 아니라 태스크 역할에 필요한 리소스만 허용하는 정책을 붙여야 권한이 다른 컨테이너로 새지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | ecs-task-role-vs-task-execution-role | ECS의 태스크 실행 역할은 이미지를 가져오고 로그를 내보내는 데 쓰이고 태스크 역할은 애플리케이션 코드가 쓰므로 애플리케이션 권한은 태스크 역할에 줘야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | ecs-awsvpc-mode | awsvpc 네트워크 모드는 ECS 태스크마다 네트워크 인터페이스를 붙여 프라이빗 서브넷 배치와 로드 밸런서 대상 등록을 쉽게 하고 외부 노출을 로드 밸런서로 좁힌다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | ecs-task-placement-strategy | ECS 서비스 스케줄러의 배치 전략으로 태스크를 가용 영역에 고르게 분산하고 최소 용량을 영역 수만큼 두면 한 영역 장애에도 서비스가 계속됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | fargate-no-time-limit | Lambda의 15분 실행 제한을 넘는 컨테이너 작업은 서버 관리 없이 사용량만큼 과금되는 Fargate에서 실행하고, 초단기 작업은 Lambda가 낫다는 경계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | fargate-spot | Fargate Spot은 ECS 태스크를 크게 싸게 실행하는 대신 용량 회수로 중단될 수 있으므로 시작 시각이 유연하고 중단을 견디는 단기 작업에 맞음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | fargate-per-second-billing | Fargate는 초 단위로 과금하되 최소 1분을 매기므로 수십 초짜리 간헐적 작업은 Lambda가 더 싸다는 비용 경계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | fargate-efs-mount | 서버를 관리하지 않으면서 컨테이너에 영구 파일 저장소를 주려면 Fargate에서 도는 ECS 태스크에 EFS를 마운트해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | eks | 기존 환경이 쿠버네티스라면 코드와 배포 절차를 유지하려고 EKS로, 순수 Docker 컨테이너라면 ECS로 옮긴다는 선택 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | eks-compute-options | EKS의 자체 관리형 노드·관리형 노드 그룹·Fargate 순으로 사용자의 인프라 책임이 줄며 인스턴스 관리를 아예 없애려면 Fargate를 골라야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 12 | eks-fargate-pod-isolation | EKS에서 Fargate로 실행하는 파드는 CPU·메모리·스토리지·네트워크 인터페이스를 이웃 파드와 나누지 않아 테넌트 격리 요구를 스케줄링 규칙 없이 충족함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | eks-cluster-autoscaler | Horizontal Pod Autoscaler는 파드 수만 늘리므로 노드가 가득 차면 대기 중인 파드를 감지해 노드를 늘리는 Cluster Autoscaler가 함께 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | eks-aws-load-balancer-controller | EKS에서 경로별 마이크로서비스 라우팅은 AWS Load Balancer Controller가 Ingress를 읽어 ALB를 만들게 하는 것이 표준이며 NLB·API Gateway는 추가 계층과 비용을 만든다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | eks-connector | EKS Connector는 AWS 밖의 쿠버네티스 클러스터를 옮기지 않고 등록만 해 EKS 콘솔에서 함께 보이게 하는 도구이며 모니터링 도구와 역할이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | eks-anywhere | EKS Anywhere는 자기 데이터 센터에서 쿠버네티스를 운영하기 위한 것이라 흩어진 기존 클러스터를 중앙에서 확인하는 목적에는 EKS Connector를 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | eks-irsa | 노드 역할에 권한을 붙이면 모든 파드가 공유하므로 IRSA로 쿠버네티스 서비스 계정에 IAM 역할을 연결하고 OIDC 공급자와의 신뢰 관계를 세워야 파드별 최소 권한이 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | eks-secrets-kms-encryption | 쿠버네티스 시크릿은 기본적으로 인코딩만 되어 저장되므로 EKS에서 KMS 키로 봉투 암호화를 켜야 저장 중 암호화 요구를 만족함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | ecr-image-scan-on-push | ECR은 컨테이너 이미지를 두는 프라이빗 레지스트리이며 푸시 시 스캔을 켜면 실행 중인 워크로드를 바꾸지 않고 새 이미지마다 알려진 취약점 검사를 자동화할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | aws-batch | 여러 작업을 모아 처리하는 배치 처리와 여러 단계를 순서대로 이어 실행하는 워크플로 조율은 서로 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 21 | batch-fargate-compute-environment | AWS Batch가 컴퓨팅 환경의 프로비저닝과 확장을 맡고 그 환경을 Fargate로 두면 관리할 인스턴스가 없어 정기 배치 이전의 운영 부담이 가장 작아짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 22 | elastic-beanstalk | Elastic Beanstalk의 코드 배포 자동화가 인스턴스 운영 책임까지 없애지는 않으며 애플리케이션을 함수로 나누기 어려울 때 선택지가 되는 이유를 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
| 23 | app2container | App2Container는 기존 Java·.NET 애플리케이션을 최소한의 수정으로 컨테이너 이미지와 배포 산출물로 바꾸는 도구라 코드를 올려 환경을 꾸리는 Elastic Beanstalk와 방향이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
