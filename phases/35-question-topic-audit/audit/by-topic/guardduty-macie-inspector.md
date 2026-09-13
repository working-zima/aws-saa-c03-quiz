# GuardDuty·Macie·Inspector·Security Hub

`guardduty-macie-inspector` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 12개 · keep 11 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 12 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q150 | guardduty | keep | — | yes | (현재) | (현재) | false | 계정을 겨냥한 공격 징후를 탐지하되 직접 대응하지 않는 서비스는 GuardDuty이고, Shield·WAF는 방어까지 한다. |
| q151 | macie | keep | — | yes | (현재) | (현재) | false | S3에 보관된 데이터에서 개인정보 같은 민감한 내용을 머신러닝으로 자동 식별하는 것은 Macie다. |
| q235 | guardduty-db-login | keep | — | yes | (현재) | (현재) | false | GuardDuty는 계정 수준 위협뿐 아니라 비정상 데이터베이스 로그인 실패와 수상한 접속까지 탐지하며, CloudTrail은 데이터베이스 내부 로그인 시도를 기록하지 않는다. |
| q236 | security-service-lineup | keep | — | yes | (현재) | (현재) | false | EC2 인스턴스의 패치 누락과 CVE 같은 공개 취약점을 스캔하는 것은 Inspector이고, Detective는 조사, Firewall Manager·Network Firewall은 트래픽 규칙을 다룬다. |
| q677 | amazon-inspector | keep | — | yes | (현재) | (현재) | false | 운영체제와 애플리케이션의 알려진 취약점을 찾아내는 것은 Inspector이고, GuardDuty는 계정 위협, Macie는 저장 데이터, Security Hub는 발견 사항 집계를 맡는다. |
| q678 | amazon-inspector | keep | — | yes | (현재) | (현재) | false | 취약점이 새 인스턴스에 유입되지 않게 하려면 발견이 아니라 조치가 필요하므로, 찾아 줄 뿐 패치하지 않는 Inspector 대신 이미지를 만드는 단계에서 패치를 넣는 EC2 Image Builder를 쓴다. |
| q679 | security-hub | keep | — | yes | (현재) | (현재) | false | 여러 계정·서비스에 흩어진 보안 경고와 규정 준수 상태를 한자리에 모아 우선순위를 매기는 것은 Security Hub이며, 탐지 자체는 하지 않는다. |
| q680 | macie-automated-discovery | keep | — | yes | (현재) | (현재) | false | Macie 자동 민감 데이터 탐지를 켜면 검색 작업을 사람이 시작하지 않아도 S3를 계속 검사하고, 그 결과가 EventBridge로 나가 규칙으로 후속 처리를 부를 수 있다. |
| q681 | inspector-scans-ecr-images | keep | — | yes | (현재) | (현재) | false | ECR의 컨테이너 이미지에서 소프트웨어 취약점과 의도하지 않은 네트워크 노출을 스캔하는 주체는 Inspector다. |
| q682 | macie-delegated-administrator | keep | — | yes | (현재) | (현재) | false | 조직의 여러 계정과 리전의 버킷을 한자리에서 검사하려면 Macie 위임 관리자 계정을 지정해 계정을 붙이고, 리전 단위로 동작하므로 리전마다 자동 탐지를 켠다. |
| q683 | guardduty-finding-to-eventbridge | keep | — | yes | (현재) | (현재) | false | 암호화폐 채굴 같은 활동을 탐지하는 것은 GuardDuty이고, 그 탐지 결과를 조건으로 한 EventBridge 규칙이 함수를 불러 사람 손 없이 인스턴스를 격리한다. |
| q684 | macie-finding-to-eventbridge | ambiguous | — | yes | (현재) | (현재) | false | 민감 데이터 탐지 결과는 EventBridge로 나가므로 규칙에서 해당 유형만 걸러 알림 서비스로 보내면 보안 팀이 바로 통보받고, 큐나 버킷은 쌓아 둘 뿐 사람에게 알리지 않는다. |
