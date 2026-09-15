# Systems Manager·AppConfig·EC2 Instance Connect

`systems-manager` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 7개 · keep 7 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 7 · false 0 · duplicateOf 1
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 7 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ssm-run-command | Systems Manager Run Command는 에이전트를 통해 관리형 인스턴스에 SSH나 열린 접속 경로 없이 명령을 보내며, 반복 조치를 자동화할 때 함수를 만들어 명령을 부르는 것보다 유지할 코드가 없어 운영 부담이 작음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | ssm-session-manager | Session Manager는 인바운드 포트를 열지 않고 443으로 SSH 없이 인스턴스에 셸을 여는 방식이라 접속 수단을 특정하지 않은 요구에 맞고, SSH가 필수이면 EC2 Instance Connect 엔드포인트가 맞으며 인스턴스에는 Systems Manager용 IAM 역할이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | ssm-patch-manager | Patch Manager는 실행 중인 인스턴스에 패치를 배포할 뿐 이미지를 고치지 않으므로, 오토 스케일링 그룹이 사용자 지정 AMI에서 인스턴스를 계속 새로 시작하는 환경에서 배포 시점의 취약점 유입을 막으려면 이미지 단계에서 풀어야 함을 이해한다. | keep | — | true | (현재) | ec2-autoscaling.ec2-image-builder | 1 | ① |
| 4 | ssm-managed-instance-core-policy | Systems Manager가 인스턴스를 관리하려면 관리형 정책을 사용자 대신 인스턴스 역할에 연결해야 하며 기존 역할도 활용할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | ssm-inventory | Systems Manager Inventory는 인스턴스에 무엇이 설치되어 있고 설정이 어떤지를 수집하는 기능이며, 리소스 사이의 관계나 아키텍처 다이어그램이 필요하면 다른 도구를 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | ec2-instance-connect-endpoint | 프라이빗 서브넷 인스턴스에 퍼블릭 IP나 배스천 호스트 없이 SSH로 접속하려면 같은 서브넷에 EC2 Instance Connect 엔드포인트를 만들고 IAM 정책을 주며, SSH가 HTTPS로 터널링되므로 보안 그룹에서 22가 아니라 443을 연다는 것을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 7 | appconfig | AWS AppConfig는 애플리케이션 구성을 검증한 뒤 멈춤 없이 배포하는 서비스이고 순환이 필요한 자격 증명 보관은 Secrets Manager가 맡으므로, 두 요구가 함께 있으면 두 서비스를 나눠 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
