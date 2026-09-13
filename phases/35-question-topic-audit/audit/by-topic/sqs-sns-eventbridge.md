# SQS·SNS·EventBridge·Amazon MQ·SES

`sqs-sns-eventbridge` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 40개 · keep 40 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 40 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q091 | sqs | keep | — | yes | (현재) | (현재) | false | 메시지를 대기열에 쌓아 차례로 처리하게 하면 보내는 쪽과 받는 쪽이 서로를 직접 호출하지 않게 되어 결합도가 낮아진다. |
| q092 | sqs | keep | — | yes | (현재) | (현재) | false | 표준 대기열은 순서와 중복 없음 대신 처리량을 택한 유형이라, 처리량이 더 중요한 상황에 맞는다. |
| q093 | sqs | keep | — | yes | (현재) | (현재) | false | FIFO 대기열은 메시지를 보낸 순서 그대로 정확히 한 번 처리하는 것을 보장하는 유형이다. |
| q094 | sqs | keep | — | yes | (현재) | (현재) | false | 유입 속도가 처리 속도보다 빨라도 요청을 잃지 않게 하는 것은 메시지를 보관해 두는 내구성 버퍼다. |
| q095 | sns | keep | — | yes | (현재) | (현재) | false | 같은 메시지 하나를 여러 수신 대상에 한꺼번에 전달하는 것은 발행-구독 방식의 성질이고, 큐는 쌓인 메시지를 소비자들에게 나눠 준다. |
| q096 | eventbridge | keep | — | yes | (현재) | (현재) | false | AWS 서비스가 낸 이벤트를 규칙으로 다른 서비스에 흘려보내 동작을 잇는 것이 이벤트 라우터의 일이다. |
| q097 | eventbridge | keep | — | yes | (현재) | (현재) | false | 업로드 같은 서비스 이벤트가 일어난 시점에 다른 서비스를 호출하도록 잇는 일은 이벤트 라우터가 맡는다. |
| q099 | sqs | keep | — | yes | (현재) | (현재) | false | 큐를 사이에 두면 보내는 쪽과 받는 쪽이 서로를 직접 호출하지 않게 되어 각 구성 요소가 독립적으로 분리된다. |
| q203 | sqs-details | keep | — | yes | (현재) | (현재) | false | SQS가 큐에 들어온 메시지를 들고 있을 수 있는 보존 기간의 상한은 14일이다. |
| q204 | sqs-queue-depth-scaling | keep | — | yes | (현재) | (현재) | false | 아직 처리하지 못한 작업의 양을 직접 재는 지표는 큐에 쌓인 메시지 수이고, CPU 사용률은 이미 밀린 결과를 뒤늦게 보여 주는 간접 지표다. |
| q205 | eventbridge-scheduler | keep | — | yes | (현재) | (현재) | false | 정해진 시각이나 주기에 작업을 실행시켜야 하는 자동화는 시간 기반 스케줄러가 맡고, 이벤트가 난 즉시 반응하는 장치와 반대쪽이다. |
| q207 | ses | keep | — | yes | (현재) | (현재) | false | 이메일 자체가 목적이면 여러 대상에 뿌리는 알림이 아니라 이메일 발송에 최적화된 서비스를 쓴다. |
| q549 | amazon-mq | keep | — | yes | (현재) | (현재) | false | 표준 프로토콜로 브로커와 통신하던 애플리케이션은 메시징 방식을 바꾸지 않고 같은 프로토콜을 지원하는 관리형 브로커로 옮긴다. |
| q550 | dead-letter-queue | keep | — | yes | (현재) | (현재) | false | 여러 번 시도해도 처리되지 않는 메시지를 따로 모아 두면 그 하나가 뒤의 작업을 막지 않고 실패 원인을 확인할 곳도 남는다. |
| q551 | sns-is-not-a-queue | keep | — | yes | (현재) | (현재) | false | 유입이 처리 속도보다 빠를 수 있는 구간에 필요한 것은 쌓아 두었다가 꺼내 가게 하는 내구성 버퍼이고, 발행-구독은 즉시 밀어낼 뿐 그 일을 하지 못한다. |
| q552 | sns-is-not-a-queue | keep | — | yes | (현재) | (현재) | false | 알림 한 통이면 되는 자리에 큐를 끼우면 버퍼가 필요 없는 곳에 부품만 늘어나며, 어긋나는 이유는 큐의 제약이 아니라 목적이 다르다는 데 있다. |
| q553 | sns-sqs-fanout-per-consumer | keep | — | yes | (현재) | (현재) | false | 모든 소비자가 모든 이벤트를 각자의 속도로 받으려면 주제에 소비자마다 큐를 하나씩 구독시켜 각 큐가 그 소비자의 버퍼가 되게 한다. |
| q554 | eventbridge-vs-step-functions | keep | — | yes | (현재) | (현재) | false | 단계별 진행을 중앙에서 추적하는 것은 상태 머신의 일이고, 처리가 끝날 때까지 요청을 안정적으로 들고 있는 것은 큐의 일이다. |
| q555 | eventbridge-ordering-and-retention | keep | — | yes | (현재) | (현재) | false | EventBridge는 이벤트가 보낸 순서대로 도착한다고 보장하지 않고 24시간을 넘겨 보관하지도 않는다. |
| q556 | eventbridge-event-pattern-vs-polling | keep | — | yes | (현재) | (현재) | false | 규칙에 이벤트 패턴을 걸면 이벤트가 실제로 왔을 때만 대상이 실행되어, 주기적으로 확인하는 구성보다 지연도 비용도 작다. |
| q557 | eventbridge-event-bus-types | keep | — | yes | (현재) | (현재) | false | 내가 만든 애플리케이션이 스스로 올리는 이벤트는 사용자 지정 이벤트 버스로 보내고, 파트너 버스는 AWS 밖 SaaS가 보내는 이벤트를 받는 통로다. |
| q558 | eventbridge-pipes | keep | — | yes | (현재) | (현재) | false | 소스와 대상을 점 대 점으로 이으면서 걸러내기와 형식 변환까지 대신해 중간 함수를 없애는 장치가 파이프다. |
| q559 | eventbridge-api-destination | keep | — | yes | (현재) | (현재) | false | AWS 밖의 HTTP API를 규칙의 대상으로 부르면서 OAuth 인증까지 서비스가 들고 있어 중계 계층을 만들지 않아도 되는 장치가 API 대상이다. |
| q560 | eventbridge-private-api-target | keep | — | yes | (현재) | (현재) | false | 공용 주소 없이 VPC 안의 API로 이벤트를 넣으려면 같은 VPC에 연결한 함수를 규칙의 대상으로 두고 그 함수가 사설 주소로 API를 부르게 한다. |
| q561 | eventbridge-resource-change-rule | keep | — | yes | (현재) | (현재) | false | 리소스의 생성·수정 같은 구성 변경도 이벤트가 되므로, 설정이 그대로인지 주기적으로 확인하지 않고 변경이 일어난 시점에 바로 대응할 수 있다. |
| q562 | sns-fifo-topic | keep | — | yes | (현재) | (현재) | false | 여러 구독자에게 동시에 뿌리면서 순서까지 지켜야 한다는 두 요구를 함께 만족하는 것은 FIFO 주제뿐이다. |
| q563 | ses-inbound-email-receiving | keep | — | yes | (현재) | (현재) | false | SES는 발송뿐 아니라 수신도 맡아, 수신 규칙의 대상으로 함수를 지정하면 도착한 메일의 본문과 첨부를 그 자리에서 처리한다. |
| q564 | sqs-batch-and-polling | keep | — | yes | (현재) | (현재) | false | 처리량을 직접 끌어올리는 것은 한 요청으로 여러 메시지를 다루는 배치이고, 가시성 타임아웃과 롱 폴링은 다른 문제를 푼다. |
| q565 | sqs-visibility-timeout-vs-processing-time | keep | — | yes | (현재) | (현재) | false | 처리를 마치고 삭제하기 전에 가시성 타임아웃이 지나면 메시지가 다시 보여 중복 처리되므로, 그 값을 소비자의 최대 처리 시간 이상으로 올려야 한다. |
| q566 | sqs-visibility-timeout-vs-processing-time | keep | — | yes | (현재) | (현재) | false | 전달 지연은 큐에 넣은 메시지가 처음 보이기까지를 미루는 값이라, 이미 가져간 메시지가 되살아나는 재처리에는 손대지 못한다. |
| q567 | sqs-message-size-limit | keep | — | yes | (현재) | (현재) | false | 메시지 본문 상한을 넘는 페이로드는 본문을 S3에 두고 위치만 보내는 확장으로 처리하며, 크기 때문에 큐를 버리면 버퍼 자체가 사라진다. |
| q568 | sqs-fifo-message-group-id | keep | — | yes | (현재) | (현재) | false | FIFO의 순서 보장은 큐 전체가 아니라 메시지 그룹 단위로 적용되므로, 순서를 지켜야 하는 단위를 그룹 ID로 잡으면 다른 단위는 병렬로 처리된다. |
| q569 | sqs-fifo-deduplication-id | keep | — | yes | (현재) | (현재) | false | FIFO 대기열에 중복 제거 ID를 실으면 5분 창 안의 같은 메시지를 큐가 걸러내고, 표준 큐에는 그 보장이 없다. |
| q570 | sqs-content-based-deduplication | keep | — | yes | (현재) | (현재) | false | 콘텐츠 기반 중복 제거는 FIFO 대기열에서만 켤 수 있어, 보내는 쪽을 고치지 않더라도 큐를 FIFO로 다시 만드는 단계는 피할 수 없다. |
| q571 | sns-no-message-body-rewrite | keep | — | yes | (현재) | (현재) | false | SNS에는 전달 직전에 본문을 다시 쓰는 단계가 없으므로 수신자별로 다른 내용은 주제에 게시하기 전에 만들어야 한다. |
| q572 | sqs-queue-policy | keep | — | yes | (현재) | (현재) | false | 특정 주체만 큐를 쓰게 하려면 큐에 붙는 리소스 정책이 대상을 지목하고 주체 쪽 IAM 정책도 함께 있어야 하며, 명시적 거부는 허용을 이긴다. |
| q573 | cross-account-sns-to-sqs-queue-policy | keep | — | yes | (현재) | (현재) | false | 다른 계정 주제의 발행을 받으려면 큐 정책이 그 주제 ARN을 지목하고 주제 쪽도 그 큐 ARN으로 좁혀야 범위가 한 쌍으로 닫힌다. |
| q574 | sqs-encryption-and-consumer-kms-permission | keep | — | yes | (현재) | (현재) | false | KMS 키로 암호화한 큐를 소비하려면 큐를 대신 폴링하는 Lambda의 실행 역할에 복호화 권한이 있어야 하고, 없으면 폴링이 조용히 실패한다. |
| q575 | sns-encrypted-topic-publish-permissions | keep | — | yes | (현재) | (현재) | false | 고객 관리 키로 암호화한 주제에 게시하려면 주제의 리소스 정책, 그 키의 정책, 게시자의 실행 역할 권한 셋이 모두 맞아야 한다. |
| q576 | sqs-vpc-endpoint-and-queue-policy | keep | — | yes | (현재) | (현재) | false | 인터페이스 엔드포인트로 길을 내고 큐 정책으로 그 경로만 허용해야 공용 IP를 쓰지 않는다는 조건이 설정으로 보장된다. |
