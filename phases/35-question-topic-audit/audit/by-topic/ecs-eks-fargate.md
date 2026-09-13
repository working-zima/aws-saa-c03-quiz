# ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk

`ecs-eks-fargate` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 25개 · keep 25 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 25 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q083 | ecs | keep | — | yes | (현재) | (현재) | false | ECS는 Docker 컨테이너의 배치와 운영을 돕는 컨테이너 관리 서비스다. |
| q084 | ecs | keep | — | yes | (현재) | (현재) | false | Fargate 기반 ECS는 서버 관리를 AWS에 맡겨 EC2 기반 ECS보다 인프라 관리 부담을 줄인다. |
| q195 | eks | keep | — | yes | (현재) | (현재) | false | 기존 Kubernetes의 코드와 배포 방식을 유지해 AWS로 옮기려면 관리형 Kubernetes 서비스인 EKS를 선택한다. |
| q196 | fargate-no-time-limit | keep | — | yes | (현재) | (현재) | false | Lambda의 15분 실행 한도를 넘는 컨테이너 작업을 서버 관리 없이 실행하려면 실행 시간 제한이 없는 Fargate를 쓴다. |
| q201 | aws-batch | keep | — | yes | (현재) | (현재) | false | AWS Batch는 여러 작업을 모아 배치로 처리하는 서비스이며 단계별 순서를 조율하는 워크플로 서비스와 다르다. |
| q509 | ecr-image-scan-on-push | keep | — | yes | (현재) | (현재) | false | ECR 리포지토리의 기본 스캔에서 푸시 시 스캔을 켜면 새 컨테이너 이미지마다 알려진 취약점을 자동 검사한다. |
| q510 | elastic-beanstalk | keep | — | yes | (현재) | (현재) | false | Elastic Beanstalk는 기존 애플리케이션 코드를 통째로 받아 환경 생성과 배포·확장·상태 모니터링을 지원한다. |
| q511 | app2container | keep | — | yes | (현재) | (현재) | false | App2Container는 기존 Java·.NET 애플리케이션을 분석해 적은 코드 변경으로 컨테이너 이미지와 배포 산출물을 만드는 도구다. |
| q512 | eks-compute-options | keep | — | yes | (현재) | (현재) | false | EKS에서 인스턴스와 클러스터 용량을 직접 프로비저닝하지 않는 실행 방식은 Fargate다. |
| q513 | eks-compute-options | keep | — | yes | (현재) | (현재) | false | EKS에서 어떤 파드를 Fargate로 실행할지 선택하는 설정은 Fargate 프로필이다. |
| q514 | fargate-spot | keep | — | yes | (현재) | (현재) | false | 시작 시각이 유연하고 중단을 견디는 ECS 작업은 Fargate Spot 용량 공급자로 실행하면 중단 가능성을 받아들이는 대신 비용을 낮출 수 있다. |
| q515 | batch-fargate-compute-environment | keep | — | yes | (현재) | (현재) | false | AWS Batch의 컴퓨팅 환경을 Fargate로 두면 배치 작업의 용량 프로비저닝과 확장을 맡기면서 관리할 인스턴스를 남기지 않는다. |
| q516 | eks-fargate-pod-isolation | keep | — | yes | (현재) | (현재) | false | Fargate로 실행하는 EKS 파드는 각자 격리된 환경을 받아 CPU·메모리·스토리지·네트워크 인터페이스를 다른 파드와 공유하지 않는다. |
| q517 | eks-cluster-autoscaler | keep | — | yes | (현재) | (현재) | false | 파드를 올릴 노드 용량이 부족하면 대기 중인 파드를 감지하는 Cluster Autoscaler로 노드를 늘려야 하며 파드 수 조정만으로는 해결되지 않는다. |
| q518 | eks-aws-load-balancer-controller | keep | — | yes | (현재) | (현재) | false | AWS Load Balancer Controller는 Kubernetes Ingress를 읽어 경로 라우팅용 ALB를 생성하므로 클러스터 안의 별도 라우팅 계층을 줄인다. |
| q519 | eks-connector | keep | — | yes | (현재) | (현재) | false | EKS Connector는 기존 외부 Kubernetes 클러스터를 옮기지 않고 AWS에 등록해 EKS 콘솔에서 함께 보게 한다. |
| q520 | eks-anywhere | keep | — | yes | (현재) | (현재) | false | EKS Anywhere는 자체 데이터 센터 안에서 Kubernetes 클러스터를 운영하는 수단이다. |
| q521 | ecs-task-role | keep | — | yes | (현재) | (현재) | false | 특정 ECS 태스크에만 버킷 접근을 주려면 인스턴스 역할 대신 그 태스크 역할에 대상 버킷 ARN으로 좁힌 정책을 붙인다. |
| q522 | ecs-task-role-vs-task-execution-role | keep | — | yes | (현재) | (현재) | false | ECS 컨테이너 안의 애플리케이션이 AWS API를 호출할 권한은 이미지 가져오기·로그 전송용 태스크 실행 역할이 아니라 태스크 역할에 부여한다. |
| q523 | eks-irsa | keep | — | yes | (현재) | (현재) | false | IRSA는 Kubernetes 서비스 계정에 IAM 역할 ARN을 지정하고 클러스터 OIDC 공급자와 역할의 신뢰 관계를 설정해 파드별 AWS 권한을 부여한다. |
| q524 | ecs-awsvpc-mode | keep | — | yes | (현재) | (현재) | false | ECS 태스크 정의의 awsvpc 네트워크 모드는 태스크마다 별도의 네트워크 인터페이스를 부여한다. |
| q525 | ecs-task-placement-strategy | keep | — | yes | (현재) | (현재) | false | ECS 분산 배치 전략에 가용 영역 속성을 지정하고 영역 수만큼 최소 태스크 용량을 확보하면 한 AZ 장애에도 다른 AZ의 태스크가 남는다. |
| q526 | fargate-per-second-billing | keep | — | yes | (현재) | (현재) | false | Fargate는 실행 시간을 초 단위로 계산하되 최소 1분을 과금하므로 10초 작업도 1분 요금을 낸다. |
| q527 | fargate-efs-mount | keep | — | yes | (현재) | (현재) | false | Fargate 기반 ECS 태스크에 EFS를 마운트하면 서버를 직접 관리하지 않고 컨테이너 종료 뒤에도 남는 파일 시스템을 사용할 수 있다. |
| q528 | eks-secrets-kms-encryption | keep | — | yes | (현재) | (현재) | false | EKS의 etcd에 base64로 인코딩된 시크릿을 저장 중 암호화하려면 KMS 키를 지정하는 시크릿 봉투 암호화를 켜야 한다. |
