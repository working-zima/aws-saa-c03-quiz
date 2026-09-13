# Kinesis Data Streams·Data Firehose·Flink·Video Streams·MSK

`kinesis-streaming` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 17개 · keep 17 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 17 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q128 | streaming-services-comparison | keep | — | yes | (현재) | (현재) | false | 스트리밍 서비스의 역할 중 수집이나 전달이 아니라 실시간 처리와 분석을 맡는 것은 Managed Service for Apache Flink다. |
| q202 | msk | keep | — | yes | (현재) | (현재) | false | Amazon MSK는 Apache Kafka를 관리형으로 제공하므로 기존 Kafka 아키텍처의 코드 변경을 최소화해 이전할 수 있다. |
| q633 | kinesis-data-streams | keep | — | yes | (현재) | (현재) | false | Kinesis 계열에서 계속 발생하는 스트림을 끊김 없이 받아들여 담아 두는 수집 단계는 Kinesis Data Streams가 맡는다. |
| q634 | data-firehose | keep | — | yes | (현재) | (현재) | false | 실시간 스트림을 지정한 목적지 서비스까지 전송하고 배달하는 단계는 Data Firehose가 맡는다. |
| q635 | managed-service-apache-flink | keep | — | yes | (현재) | (현재) | false | 흐르는 스트림을 실시간으로 처리하고 분석하는 단계는 Managed Service for Apache Flink가 맡는다. |
| q636 | kinesis-video-streams | keep | — | yes | (현재) | (현재) | false | Kinesis Video Streams는 실시간으로 흘러드는 영상을 수집해 분석으로 넘기는 서비스이고, 이미 녹화된 영상 파일의 보관과 배포는 S3가 맡는다. |
| q637 | flink-kinesis-source-sink | keep | — | yes | (현재) | (현재) | false | Managed Service for Apache Flink는 Kinesis 스트림을 소스와 싱크로 모두 받으므로, 원본 스트림을 물려 결과를 두 번째 스트림으로 내면 애플리케이션 코드 변경 없이 서버리스로 처리 단계를 끼울 수 있다. |
| q638 | firehose-lambda-transformation | keep | — | yes | (현재) | (현재) | false | Firehose는 목적지에 적재하기 전에 Lambda 함수를 호출해 레코드를 변환하므로, 개인 식별 정보를 원본이 저장되기 전에 가릴 수 있다. |
| q639 | firehose-format-conversion | keep | — | yes | (현재) | (현재) | false | Data Firehose는 S3에 적재하면서 레코드를 Parquet 같은 열 기반 형식으로 변환하므로 수집과 형식 변환이 파이프라인 하나로 끝난다. |
| q640 | kinesis-retention-and-fanout | keep | — | yes | (현재) | (현재) | false | Kinesis Data Streams는 데이터를 최대 365일 보존하고, 향상된 팬아웃은 소비자마다 전용 처리량을 줘 여러 수신자가 서로 밀어내지 않고 낮은 지연으로 읽게 한다. |
| q641 | kinesis-client-library | keep | — | yes | (현재) | (현재) | false | Kinesis Client Library로 만든 소비자는 샤드 할당과 체크포인트를 애플리케이션이 직접 통제하고, Lambda 이벤트 소스 매핑은 그 동작을 자동으로 처리해 직접 제어를 주지 않는다. |
| q642 | msk-kafka-connect | keep | — | yes | (현재) | (현재) | false | MSK는 Kafka Connect로 이기종 소스에서 데이터를 끌어오고 스트림 처리기가 소비자 전달 전에 변환해, 정해진 형태를 요구하는 대시보드에 1초 미만 갱신을 유지한다. |
| q643 | kinesis-record-size-limit | keep | — | yes | (현재) | (현재) | false | Kinesis Data Streams의 레코드 하나는 최대 1MB라 500KB 메시지를 그대로 실을 수 있다. |
| q644 | kinesis-partition-key-hot-shard | keep | — | yes | (현재) | (현재) | false | 전체 용량이 남는데도 쓰기가 거절되면 파티션 키 쏠림으로 특정 샤드만 과부하된 것이라, 값이 고르게 흩어지는 키로 바꿔 분배를 고쳐야 한다. |
| q645 | kinesis-capacity-mode | keep | — | yes | (현재) | (현재) | false | 프로비저닝 모드는 샤드 수를 직접 정해 처리량을 확보하고, 온디맨드 모드는 처리량 관리를 없애는 대신 비용이 더 든다. |
| q646 | kinesis-capacity-mode | keep | — | yes | (현재) | (현재) | false | 파티션 키 쏠림으로 스로틀링이 나는 스트림을 온디맨드로 옮기면 증상은 가려지지만 쏠림이라는 근본 원인은 남고 비용만 오른다. |
| q647 | firehose-buffering | keep | — | yes | (현재) | (현재) | false | Firehose는 데이터를 버퍼에 모아 일괄 적재하므로 초 단위 갱신이 필요한 화면 뒤에 두면 버퍼만큼의 지연이 남는다. |
