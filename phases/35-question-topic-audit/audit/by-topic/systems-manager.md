# Systems Manager·AppConfig·EC2 Instance Connect

`systems-manager` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 8개 · keep 8 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 8 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q302 | ssm-run-command | keep | — | yes | (현재) | (현재) | false | Run Command는 관리형 인스턴스에 원격 명령을 보내므로 알람 이벤트에 연결하면 별도 함수 코드 없이 반복 조치를 자동 실행할 수 있다. |
| q303 | appconfig | keep | — | yes | (현재) | (현재) | false | AppConfig는 애플리케이션 구성을 검증·배포하고, 순환이 필요한 데이터베이스 자격 증명의 보관은 Secrets Manager에 맡긴다. |
| q304 | ssm-session-manager | keep | — | yes | (현재) | (현재) | false | Session Manager는 배스천이나 인바운드 포트 개방 없이 인스턴스에 대화형 셸을 여는 접속 수단이다. |
| q305 | ec2-instance-connect-endpoint | keep | — | yes | (현재) | (현재) | false | EC2 Instance Connect 엔드포인트는 배스천 호스트나 퍼블릭 IP 없이 프라이빗 인스턴스에 SSH로 접속하는 경로를 제공한다. |
| q306 | ec2-instance-connect-endpoint | keep | — | yes | (현재) | (현재) | false | 현재 본문과 해설은 EC2 Instance Connect 엔드포인트의 SSH 접속을 HTTPS 터널링으로 설명하며 사용할 포트를 22가 아닌 443으로 제시한다. |
| q307 | ssm-patch-manager | keep | — | yes | (현재) | (현재) | false | 실행 중인 인스턴스에만 패치를 적용하면 같은 옛 AMI에서 시작하는 새 인스턴스는 고쳐지지 않으므로 배포 전 이미지 단계에서 패치해야 한다. |
| q308 | ssm-managed-instance-core-policy | keep | — | yes | (현재) | (현재) | false | Systems Manager로 관리할 인스턴스에 이미 역할이 있다면 기존 역할에 AmazonSSMManagedInstanceCore 정책을 추가하는 것이 권한을 마련하는 최소 변경이다. |
| q309 | ssm-inventory | keep | — | yes | (현재) | (현재) | false | Systems Manager Inventory는 인스턴스의 설치 소프트웨어와 구성 정보를 수집하는 기능이다. |
