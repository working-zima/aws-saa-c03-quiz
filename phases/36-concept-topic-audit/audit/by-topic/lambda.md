# Lambda

`lambda` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 17 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 15 · 2A 1 · 2B 1 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | lambda | Lambda는 요청이 있을 때만 코드를 실행하는 서버리스 서비스이며 콜드 스타트와 한 번 실행 15분 상한 같은 실행 모델의 특성을 함께 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 3 | 2A |
| 2 | lambda-function-url | 단순한 호출만 필요할 때는 API Gateway를 앞에 두지 않고 Lambda 함수 URL로 HTTP(S) 주소를 붙이는 편이 구성과 비용이 작다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | lambda-function-url-iam-auth | Lambda 함수 URL의 AWS_IAM 인증 유형에서 서명된 요청과 IAM 정책이 호출을 통제하는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | lambda-invocation-types | Lambda의 이벤트 호출은 결과를 기다리지 않는 비동기이고 요청-응답 호출은 끝날 때까지 기다리는 동기이므로 오래 걸리는 작업에는 이벤트 호출을 써야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 5 | lambda-kinesis-event-source | Lambda가 Kinesis Data Streams 레코드를 이벤트로 받아 처리할 수 있어 스트림 소비자를 위한 인스턴스 없이 수집·처리·적재 파이프라인을 구성할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | lambda-vpc-access | 프라이빗 서브넷의 리소스와 사설 IP로 통신하려면 Lambda를 그 VPC에 연결해야 하며 VPC 밖이나 퍼블릭 서브넷에 두는 것으로는 닿지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | lambda-container-image | Lambda는 컨테이너 이미지를 패키징 형식으로 받으므로 실행 시간이 Lambda 한계 안에 드는 기존 컨테이너 작업은 ECS·EKS보다 운영 부담이 적은 Lambda로 옮길 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | lambda-layer-size-limit | Lambda 레이어는 크기 상한이 있고 올린 뒤 바뀌지 않는 부속 아티팩트라 계속 늘어나는 공유 데이터를 담는 저장소로는 쓸 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | lambda-efs-mount | 레이어 상한을 넘는 종속성이나 여러 팀이 갱신하는 공유 데이터는 EFS를 Lambda 함수에 마운트해 재배포 없이 읽을 수 있고 그 전송은 TLS로 암호화됨을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 10 | lambda-memory-cpu-proportional | Lambda는 메모리만 설정하고 CPU는 메모리에 비례해 배정되므로 CPU를 짧게 몰아 쓰는 작업도 메모리를 늘려 대응하며 간헐적 작업에서는 유휴 비용이 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | lambda-memory-ceiling | Lambda 한 번 실행의 메모리 상한 10GB와 실행 시간 상한 15분이 올릴 수 있는 작업의 크기를 정하므로 그 안에 드는 작업에는 분산 처리 클러스터가 필요 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | lambda-reserved-concurrency | 프로비저닝된 동시성은 실행 환경을 미리 초기화해 콜드 스타트를 없애고 예약된 동시성은 동시 실행 수를 떼어 둘 뿐이라 일관된 저지연에는 전자가 필요함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 13 | lambda-provisioned-concurrency-autoscaling | 프로비저닝된 동시성을 고정값으로 두면 한산한 시간에도 비용이 들므로 Application Auto Scaling으로 수요에 맞춰 조정해야 지연과 비용을 함께 맞출 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | lambda-concurrency-limit-throttling | TooManyRequestsException은 Lambda 동시 실행 한도에 닿았다는 신호이므로 앞에 큐를 두어 급증분을 받아 두어야 하며 예약된 동시성은 오히려 확장을 묶는다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | hold |
| 15 | lambda-snapstart | SnapStart는 초기화를 끝낸 실행 환경의 스냅샷을 되살려 상시 비용 없이 Java 함수의 시작 시간을 줄이며 게시된 버전에서만 동작하고 호출마다 달라야 할 값은 핸들러 안에 두어야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 16 | lambda-version-alias-config-freeze | Lambda 버전은 코드와 함께 환경 변수 값도 고정하므로 주기적으로 바뀌는 자격 증명은 환경 변수가 아니라 실행 시점에 비밀 저장소에서 읽어야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | lambda-execution-role-logs | Lambda는 실행 역할의 권한으로 동작하므로 로그가 남지 않으면 실행 역할 정책에 로그 그룹·스트림 생성과 이벤트 기록 권한이 있는지 확인해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | serverless-runtime-no-os-access | 실행 환경을 AWS가 관리하는 서비스는 운영 체제 접근을 주지 않으므로 OS 수준 설정이 요구되면 서버리스 대신 EC2(데이터베이스는 RDS Custom)를 골라야 함을 이해한다. | keep | — | false | (현재) | — | 2 | 2B |
