# Lambda

`lambda` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 25개 · keep 23 · ambiguous 1 · move-recommended 1
- 이동 후보 비율 4.0% — q508
- conceptFit yes 23 · partial 2 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q085 | lambda | keep | — | yes | (현재) | (현재) | false | Lambda가 한동안 호출되지 않다가 실행 환경을 준비하느라 첫 요청이 지연되는 현상을 콜드 스타트라고 한다. |
| q086 | lambda | keep | — | partial | (현재) | lambda-reserved-concurrency | false | 프로비저닝된 동시성은 Lambda 실행 환경을 미리 초기화해 첫 요청의 콜드 스타트를 줄이는 설정이다. |
| q087 | lambda | keep | — | yes | (현재) | (현재) | false | Lambda의 한 번 실행에는 15분 제한이 있으므로 이를 초과하는 작업은 해당 실행으로 처리할 수 없다. |
| q197 | lambda-function-url | keep | — | yes | (현재) | (현재) | false | Lambda 함수 URL은 API Gateway 없이 함수에 HTTP·HTTPS 주소를 직접 붙여 필요할 때 호출하게 한다. |
| q199 | lambda-vpc-access | keep | — | yes | (현재) | (현재) | false | 프라이빗 서브넷의 EC2와 사설 IP로 통신하려면 Lambda를 그 리소스가 있는 VPC에 연결해야 한다. |
| q489 | lambda-function-url-iam-auth | keep | — | yes | (현재) | (현재) | false | 함수 URL의 인증 유형을 AWS_IAM으로 설정하면 AWS 서명 요청만 받고 IAM 정책으로 호출 허용 여부를 판단한다. |
| q490 | lambda-container-image | keep | — | yes | (현재) | (현재) | false | Lambda는 컨테이너 이미지를 패키징 형식으로 받으므로 실행 제한 안에 드는 기존 컨테이너 작업을 이미지 손질 후 함수로 옮길 수 있다. |
| q491 | lambda-invocation-types | keep | — | yes | (현재) | (현재) | false | Lambda 이벤트 호출은 비동기 처리라 호출자가 함수 완료를 기다리지 않으므로 결과를 나중에 알리는 긴 작업에 맞는다. |
| q492 | lambda-invocation-types | keep | — | yes | (현재) | (현재) | false | Lambda 요청-응답 호출은 동기 방식이므로 함수 처리 시간이 그대로 호출자의 응답 대기 시간이 된다. |
| q493 | lambda-memory-cpu-proportional | keep | — | yes | (현재) | (현재) | false | Lambda의 CPU는 메모리 할당량에 비례해 배정되므로 한 번 실행의 계산 능력을 늘리려면 메모리를 올린다. |
| q494 | lambda-reserved-concurrency | keep | — | yes | (현재) | (현재) | false | 프로비저닝된 동시성은 실행 환경을 미리 초기화하지만 예약된 동시성은 실행 수만 확보하므로 콜드 스타트 방지에는 전자가 필요하다. |
| q495 | lambda-reserved-concurrency | keep | — | yes | (현재) | (현재) | false | 예약된 동시성은 Lambda의 동시 실행 몫을 확보할 뿐 실행 환경을 미리 만들지 않으므로 콜드 스타트는 남는다. |
| q496 | lambda-provisioned-concurrency-autoscaling | keep | — | yes | (현재) | (현재) | false | Lambda 프로비저닝된 동시성을 Application Auto Scaling으로 수요에 맞게 조정해야 사전 초기화의 저지연 효과와 비혼잡 시간의 비용 절감을 함께 얻는다. |
| q497 | lambda-concurrency-limit-throttling | ambiguous | — | yes | (현재) | (현재) | false | Lambda 동시 실행 한도로 거절되는 급증 요청은 큐에 보관한 뒤 처리 가능한 속도로 전달하면 유실을 막을 수 있다. |
| q498 | lambda-kinesis-event-source | keep | — | yes | (현재) | (현재) | false | Lambda는 Kinesis Data Streams 레코드를 이벤트로 받아 처리하므로 별도 소비자 인스턴스 없이 실시간 변환과 DynamoDB 적재를 구성할 수 있다. |
| q499 | lambda-snapstart | keep | — | yes | (현재) | (현재) | false | Lambda SnapStart는 게시된 함수 버전에만 활성화할 수 있고 $LATEST에는 적용되지 않는다. |
| q500 | lambda-snapstart | keep | — | yes | (현재) | (현재) | false | SnapStart는 초기화 결과를 재사용하므로 호출마다 새로 만들어야 하는 고유 값의 생성 코드는 초기화 부분이 아니라 핸들러 안에 둬야 한다. |
| q501 | lambda-memory-ceiling | keep | — | yes | (현재) | (현재) | false | Lambda 호출 하나에는 메모리를 최대 10GB까지 할당할 수 있으므로 1GB가 필요한 짧은 작업은 메모리 상한 안에 든다. |
| q502 | lambda-layer-size-limit | keep | — | yes | (현재) | (현재) | false | Lambda 레이어의 크기 제한은 압축 상태 50MB와 압축 해제 상태 250MB이며 함수 실행 시간 제한과 별개다. |
| q503 | lambda-efs-mount | keep | — | yes | (현재) | (현재) | false | Lambda에 EFS를 마운트하면 레이어 상한을 넘는 공유 데이터를 함수 재배포 없이 갱신하며 읽을 수 있다. |
| q504 | lambda-efs-mount | keep | — | yes | (현재) | (현재) | false | Lambda에 EFS를 마운트해 읽는 구성의 전송은 TLS로 자동 암호화되므로 별도 서버나 저장 경로를 추가할 필요가 없다. |
| q505 | lambda-version-alias-config-freeze | keep | — | yes | (현재) | (현재) | false | Lambda의 게시된 버전에는 환경 변수도 고정되므로 교체되는 자격 증명은 버전 밖에 보관하고 호출 시점에 읽어야 재배포 없이 최신 값을 쓸 수 있다. |
| q506 | lambda-execution-role-logs | keep | — | yes | (현재) | (현재) | false | Lambda가 로그를 남기려면 함수 실행 역할의 정책에 CloudWatch Logs의 로그 그룹·스트림 생성과 이벤트 쓰기 권한이 있어야 한다. |
| q507 | serverless-runtime-no-os-access | keep | — | yes | (현재) | (현재) | false | Lambda와 Fargate는 런타임 OS 접근을 주지 않으므로 에이전트 설치와 운영 체제 설정이 필요한 컨테이너는 EC2 위에서 실행해야 한다. |
| q508 | serverless-runtime-no-os-access | move-recommended | high | partial | rds-storage-features | rds-storage-features.rds-custom | false | 일반 RDS는 OS 접근을 허용하지 않으므로 관리형 관계형 데이터베이스에서 OS 설정을 직접 바꿔야 하면 RDS Custom을 선택한다. |
