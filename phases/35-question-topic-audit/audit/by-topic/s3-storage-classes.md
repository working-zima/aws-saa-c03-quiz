# S3 스토리지 클래스 유형

`s3-storage-classes` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 17개 · keep 17 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 17 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q016 | intelligent-tiering | keep | — | yes | (현재) | (현재) | false | 접근 패턴을 예측할 수 없는 데이터는 사용 패턴을 분석해 계층을 자동으로 옮겨 주는 Intelligent-Tiering에 둔다. |
| q017 | standard | keep | — | yes | (현재) | (현재) | false | S3 Standard는 따로 지정하지 않으면 쓰이는 기본 클래스이고 접근이 잦은 데이터에 맞는다. |
| q018 | standard-ia | keep | — | yes | (현재) | (현재) | false | 법·감사 목적의 장기 보관이 아니고 접근만 드물며 즉시 읽어야 하는 데이터는 Standard-IA에 둔다. |
| q019 | one-zone-ia | keep | — | yes | (현재) | (현재) | false | One Zone-IA는 Standard-IA와 용도가 같으면서 데이터를 가용 영역 하나에만 저장해 고가용성을 제공하지 않는다. |
| q020 | glacier-instant-retrieval | keep | — | yes | (현재) | (현재) | false | 법·감사 목적의 장기 보관이면서 기다림 없이 꺼내야 하면 Glacier 계열 중 Instant Retrieval이다. |
| q021 | glacier-flexible-retrieval | keep | — | yes | (현재) | (현재) | false | Glacier Flexible Retrieval의 표준 검색은 보통 3~5시간이 걸린다. |
| q022 | glacier-deep-archive | keep | — | yes | (현재) | (현재) | false | Glacier Deep Archive는 조회에 최대 12시간까지 걸려도 되는 데이터를 담는 가장 저렴한 클래스다. |
| q023 | glacier-or-standard-ia | keep | — | yes | (현재) | (현재) | false | 법·감사·규정 준수를 위한 장기 보관 목적이 있으면 Glacier 계열이고, 그 목적 없이 접근 빈도만 낮으면 Standard-IA다. |
| q024 | retrieval-time | keep | — | yes | (현재) | (현재) | false | 클래스를 즉시 조회와 대기 조회로 가르면 대기가 필요한 것은 Glacier Flexible Retrieval과 Deep Archive 둘뿐이다. |
| q319 | s3-express-one-zone | keep | — | yes | (현재) | (현재) | false | 여러 노드가 같은 데이터에 1밀리초 미만으로 접근해야 하면 그 지연을 목표로 만들어진 S3 Express One Zone을 쓴다. |
| q320 | glacier-flexible-retrieval-standard-time | keep | — | yes | (현재) | (현재) | false | Glacier Flexible Retrieval의 표준 검색은 일반적으로 3~5시간 안에 끝난다. |
| q321 | glacier-flexible-retrieval-expedited | keep | — | yes | (현재) | (현재) | false | Glacier Flexible Retrieval에는 1~5분이면 끝나는 신속 검색이 따로 있어 분 단위 조회 요구에도 아카이브 계열이 남는다. |
| q322 | s3-storage-class-cost-order | keep | — | yes | (현재) | (현재) | false | 장기 보관에서 Standard-IA는 Glacier 계열보다 비싸고 Glacier 계열 안에서는 Deep Archive가 가장 싸다. |
| q323 | lifecycle-vs-intelligent-tiering | keep | — | yes | (현재) | (현재) | false | S3 객체의 접근 패턴을 예측할 수 없고 다시 자주 읽힐 수 있다면 기간 기반 수명 주기 규칙보다 실제 접근을 추적하는 Intelligent-Tiering이 맞다. |
| q324 | s3-storage-class-analysis | keep | — | yes | (현재) | (현재) | false | S3 스토리지 클래스 분석은 어느 데이터를 어느 클래스로 옮기면 좋을지 알려 주기만 하고 옮기는 일은 하지 않는다. |
| q325 | s3-retrieval-fee-by-class | keep | — | yes | (현재) | (현재) | false | Standard-IA와 One Zone-IA는 읽을 때마다 검색 요금이 붙지만 Intelligent-Tiering은 어느 계층에서 읽어도 검색 요금이 없다. |
| q326 | intelligent-tiering-monitoring-fee | keep | — | yes | (현재) | (현재) | false | Intelligent-Tiering은 객체마다 모니터링·자동화 요금을 받으므로 하루 만에 지워지는 데이터에는 계층화로 아낄 것보다 감시 비용이 커진다. |
