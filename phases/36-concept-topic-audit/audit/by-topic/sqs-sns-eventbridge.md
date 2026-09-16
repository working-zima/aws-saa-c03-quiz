# SQS·SNS·EventBridge·Amazon MQ·SES

`sqs-sns-eventbridge` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 33개 · keep 32 · ambiguous 0 · move-recommended 1
- 이동 후보 비율 3.0% — `sqs-sns-eventbridge.sqs-queue-depth-scaling`
- 이동 후보의 confidence high 0 · medium 1 · low 0
- serviceSpecificGoal true 25 · false 8 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 32 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | sqs | SQS로 생산자와 소비자를 분리하고 요청 급증을 흡수하며 순서·중복 요구에 따라 표준 대기열과 FIFO 대기열을 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 5 | ① |
| 2 | dead-letter-queue | 반복 처리에 실패한 메시지를 별도 큐에 보관하면 나머지 처리 흐름을 막지 않으면서 실패 원인을 조사하고 다시 처리할 근거를 남길 수 있음을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 3 | sqs-details | SQS의 보존 기간으로 메시지 만료를 정할 수 있고 표준 대기열의 중복·순서 변경 가능성 때문에 FIFO가 필요한 경우를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | sqs-queue-depth-scaling | 비동기 처리의 적체를 해소하려면 CPU 사용률보다 대기 작업량을 기준으로 백엔드 인스턴스의 처리 용량을 조절해야 하는 이유를 이해한다. | move-recommended | medium | false | ec2-autoscaling | — | 1 | hold |
| 5 | sqs-batch-and-polling | SQS의 배치 처리·가시성 타임아웃·롱 폴링은 각각 처리량·동시 재처리 방지·빈 조회 감소라는 다른 문제를 푼다는 차이를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | sqs-visibility-timeout-vs-processing-time | SQS 메시지를 삭제하기 전에 가시성 타임아웃이 끝나면 다시 처리될 수 있으므로 숨기는 시간을 소비자의 처리 시간에 맞춰야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 7 | sqs-message-size-limit | SQS 크기 한계를 넘는 메시지는 본문을 외부에 저장하고 참조만 큐로 보내 비동기 버퍼의 역할을 유지할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | sqs-fifo-message-group-id | SQS FIFO의 순서 보장은 메시지 그룹 단위이므로 순서가 필요한 업무 단위를 그룹 ID로 정해 서로 다른 그룹의 병렬 처리를 허용하는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | sqs-fifo-deduplication-id | SQS FIFO의 중복 제거 ID가 정해진 시간 창 안의 중복 전달을 걸러 주며 표준 큐나 구독 필터가 이를 대신하지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | sqs-content-based-deduplication | SQS FIFO의 콘텐츠 기반 중복 제거를 이용하면 발신 코드에 ID를 추가하지 않고도 본문이 같은 메시지의 중복을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | sqs-queue-policy | SQS 접근을 정한 역할로 제한할 때 큐의 리소스 정책과 호출자의 IAM 정책을 구분해 각각 알맞은 대상에 연결해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | sqs-encryption-and-consumer-kms-permission | SQS에서 KMS 기반 암호화를 선택하면 큐를 읽는 소비자의 실행 역할에 복호화 권한이 필요하며 SQS 관리 키 방식과 운영 조건이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | sqs-vpc-endpoint-and-queue-policy | SQS에 사설 접근 경로를 만드는 것과 그 경로만 사용하도록 큐 정책으로 제한하는 것은 함께 필요한 별도 설정임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | sns | 하나의 사건을 여러 수신 대상의 작업으로 이어 보내는 발행·구독 방식의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 15 | sns-fifo-topic | SNS에서 여러 구독자에게 같은 이벤트를 순서대로 전달하려면 FIFO 주제가 필요하며 순서 보장과 다중 전달을 함께 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | sns-no-message-body-rewrite | SNS의 전달·필터 기능은 수신자별 본문 재작성을 대신하지 못하므로 내용을 바꾸는 처리를 게시 전에 배치해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | sns-encrypted-topic-publish-permissions | 고객 관리 키로 암호화한 SNS 주제에 게시하려면 주제 정책·키 정책·게시자의 실행 역할 권한을 함께 맞춰야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | sns-is-not-a-queue | 소비자가 자기 속도로 꺼내 처리할 내구성 버퍼와 여러 구독자에게 즉시 보내는 알림은 서로 다른 요구임을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 19 | sns-sqs-fanout-per-consumer | 모든 소비자가 모든 이벤트를 각자의 속도로 처리하려면 공용 큐 하나를 나눠 읽는 대신 발행된 이벤트마다 소비자별 큐에 사본을 보내야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 20 | cross-account-sns-to-sqs-queue-policy | 계정을 넘는 SNS·SQS 전달에서 주제와 큐를 ARN으로 특정해 서로 필요한 발행 범위만 허용하는 구성을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 21 | eventbridge | 한 서비스에서 일어난 사건을 다른 서비스 작업의 시작 신호로 연결하는 이벤트 기반 통합의 역할을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 22 | eventbridge-scheduler | EventBridge Scheduler의 시각·주기 기반 실행은 사건 발생 즉시 처리하는 요구와 다르므로 작업의 시작 조건을 먼저 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 23 | eventbridge-vs-step-functions | 이벤트를 대상으로 전달하는 라우팅과 여러 처리 단계의 상태를 중앙에서 추적하는 워크플로 조율의 역할 차이를 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 24 | eventbridge-ordering-and-retention | EventBridge의 순서·보관 제약을 이해하고 엄격한 전달 순서나 장기 보존이 필요한 스트림과 이벤트 라우팅을 구분할 수 있다. | keep | — | true | (현재) | — | 1 | ① |
| 25 | eventbridge-event-pattern-vs-polling | EventBridge에서 즉시 반응할 규칙은 일정이 아닌 이벤트 패턴으로 정의하며 빈 폴링과 확인 주기에 따른 지연을 피할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 26 | eventbridge-event-bus-types | EventBridge에서 AWS 서비스·자체 애플리케이션·외부 SaaS가 내는 이벤트의 출처에 맞춰 이벤트 버스 유형을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 27 | eventbridge-pipes | EventBridge 파이프가 소스와 대상을 일대일로 연결하며 필터링·변환·전달을 맡아 중간 처리 코드를 줄이는 방식을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 28 | eventbridge-api-destination | EventBridge의 API 대상이 외부 HTTP API 호출과 인증을 맡아 OAuth 처리를 위한 별도 중계 코드를 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 29 | eventbridge-private-api-target | EventBridge의 이벤트를 비공개 API에 전달하려면 VPC에 연결된 Lambda를 중계 대상으로 두는 등 사설 접근 조건을 갖춘 연결이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 30 | eventbridge-resource-change-rule | 리소스 구성 변경에도 EventBridge 규칙을 적용해 변경 시점에 후속 처리와 알림을 실행할 수 있으며 위협 탐지와는 목적이 다름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 31 | amazon-mq | 기존 애플리케이션의 표준 메시징 프로토콜을 유지해야 할 때 Amazon MQ로 브로커를 이전하면 SQS 방식으로 코드를 바꾸는 부담을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 32 | ses | 이메일 발송 자체가 목적이면 여러 대상으로 보내는 범용 알림과 구분해 이메일 전용 서비스를 선택해야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 33 | ses-inbound-email-receiving | SES의 수신 규칙으로 도착한 메일을 처리 함수에 연결할 수 있으며 메일 필터링과 본문·첨부 파일 처리는 다른 단계임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
