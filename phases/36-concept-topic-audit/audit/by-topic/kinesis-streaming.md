# Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK

`kinesis-streaming` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 12 · false 4 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 16 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | kinesis-data-streams | 계속 발생하는 스트림 데이터를 끊김 없이 받아들이는 수집 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | kinesis-retention-and-fanout | Kinesis Data Streams는 데이터를 최대 365일 보존하고 향상된 팬아웃으로 소비자마다 전용 처리량을 주므로, 긴 보관과 여러 소비자의 동시 읽기가 필요한 요구에서 큐와 갈린다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | kinesis-client-library | 샤드 수준 제어와 사용자 지정 체크포인트가 필요하면 KCL로 소비자를 직접 만들어야 하며, 함수의 이벤트 소스 매핑은 그 제어를 대신 처리하므로 이 요구를 채우지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | kinesis-record-size-limit | Kinesis Data Streams의 레코드 하나는 최대 1MB라 수백 KB의 메시지를 그대로 실을 수 있고, 크기 조건이 주어지면 이 한계로 스트림을 쓸 수 있는지 판단한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | kinesis-partition-key-hot-shard | 파티션 키 값이 몰리면 전체 용량이 남아도 특정 샤드만 과부하가 되어 스로틀링이 나므로, 샤드를 늘리기보다 값이 고르게 흩어지는 키로 분배를 고쳐야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | kinesis-capacity-mode | Kinesis Data Streams의 프로비저닝 모드와 온디맨드 모드는 처리량 관리 부담과 비용을 맞바꾸는 선택이며, 파티션 키 쏠림 같은 원인은 모드를 바꿔도 해결되지 않음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 7 | data-firehose | 연속해서 들어오는 데이터를 목적지 서비스까지 전송하는 스트림 전달 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 8 | firehose-lambda-transformation | Firehose가 적재 전에 Lambda를 불러 레코드를 변환하면 민감 정보를 저장 전에 가릴 수 있으며, 저장 후 분류나 서버 측 암호화로는 수집 시점에 값을 바꾸지 못함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | firehose-format-conversion | Firehose는 S3에 쓰기 전에 레코드를 Parquet 같은 형식으로 변환할 수 있어 준실시간 수집과 분석용 형식 변환을 파이프라인 하나로 끝낸다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | firehose-buffering | Firehose는 데이터를 버퍼에 모아 일괄로 적재하므로 초 단위 갱신이 필요한 실시간 대시보드의 앞단에는 버퍼만큼의 지연이 남는다는 한계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | managed-service-apache-flink | 흐르는 데이터를 실시간으로 처리하고 분석하는 스트림 처리 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 12 | flink-kinesis-source-sink | Flink가 Kinesis 스트림을 소스와 싱크로 모두 쓸 수 있어, 기존 애플리케이션 코드를 고치지 않고 원본 스트림과 결과 스트림 사이에 실시간 처리 단계를 끼워 넣을 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | streaming-services-comparison | 실시간 스트림을 다루는 수집·보관, 목적지 전달, 처리·분석은 서로 다른 역할이므로 요구하는 단계에 맞춰 도구를 골라야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 14 | kinesis-video-streams | Kinesis Video Streams는 장치에서 실시간으로 들어오는 영상을 수집해 분석·처리로 넘기는 서비스이며, 녹화된 영상 파일을 보관하고 내려주는 일은 스토리지와 콘텐츠 전송의 몫임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | msk | 이미 Kafka로 운영하는 이벤트 기반 아키텍처는 코드를 크게 바꾸지 않고 관리형 Kafka인 MSK로 옮기며, 동작 방식이 다른 큐나 이벤트 버스는 단순 이전 대상이 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | msk-kafka-connect | MSK는 Kafka Connect로 형식이 다른 소스에서 데이터를 끌어오고 스트림 처리기로 전달 전에 변환해, 1초 미만 갱신이 필요한 저지연 파이프라인에서 별도 변환 단계를 두지 않아도 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
