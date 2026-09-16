# S3 스토리지 클래스 유형

`s3-storage-classes` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 17개 · keep 17 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 17 · false 0 · duplicateOf 2
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 17 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | standard | S3 객체의 보관 비용과 조회 시간은 스토리지 클래스로 달라지며, 따로 지정하지 않으면 접근이 잦은 데이터용 S3 Standard가 쓰인다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | intelligent-tiering | 접근 빈도를 예측하기 어려운 데이터는 실제 접근에 따라 계층을 자동으로 옮기는 S3 Intelligent-Tiering에 맡긴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | standard-ia | 읽는 일은 드물지만 필요할 때 기다리지 않고 꺼내야 하는 데이터에는 S3 Standard-IA를 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | one-zone-ia | S3 One Zone-IA는 Standard-IA와 같은 저빈도 즉시 조회 용도지만 데이터를 가용 영역 하나에만 두어 고가용성이 없다는 차이를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | glacier-instant-retrieval | Glacier 계열은 법률·감사·규정 준수용 장기 보관 클래스이며 그중 Instant Retrieval은 대기 없이 꺼낼 수 있는 클래스라는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | glacier-flexible-retrieval | 거의 읽지 않고 꺼낼 때 몇 시간을 기다릴 수 있는 데이터에는 S3 Glacier Flexible Retrieval을 쓰며 표준 검색이 3~5시간 걸린다는 것을 이해한다. | keep | — | true | (현재) | glacier-flexible-retrieval-standard-time | 1 | ① |
| 7 | glacier-deep-archive | 꺼내는 데 최대 12시간을 기다릴 수 있는 데이터에는 Glacier 계열에서 가장 느린 S3 Glacier Deep Archive를 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | s3-express-one-zone | 밀리초 미만의 지연과 높은 처리량이 필요한 작업에는 조회 대기 구분과 별개인 고성능 클래스 S3 Express One Zone을 쓴다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | retrieval-time | S3 스토리지 클래스를 가르는 첫 기준이 조회 요청에 곧바로 응답하는지이며 대기가 필요한 클래스는 Flexible Retrieval과 Deep Archive라는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | glacier-or-standard-ia | S3의 저빈도 접근 데이터를 보관할 때 장기 보관 목적의 유무로 Glacier 계열과 Standard-IA를 구분하는 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | glacier-flexible-retrieval-standard-time | S3 Glacier Flexible Retrieval의 표준 검색이 보통 3~5시간이므로 몇 시간 이내에 꺼내면 되는 보관 조건을 채운다는 것을 이해한다. | keep | — | true | (현재) | glacier-flexible-retrieval | 1 | ① |
| 12 | glacier-flexible-retrieval-expedited | S3 Glacier Flexible Retrieval에는 1~5분 안에 끝나는 신속 검색이 있어 값싼 장기 보관과 분 단위 조회를 함께 요구할 때 아카이브 계열을 제외하지 말아야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | s3-storage-class-cost-order | 장기 보관에서 Standard-IA보다 Glacier 계열, Flexible Retrieval보다 Deep Archive가 싸므로 요구 검색 시간을 채우는 클래스 중 가장 싼 쪽까지 내려가 고른다는 판단 순서를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | lifecycle-vs-intelligent-tiering | 접근이 식는 시점을 알면 시간 기준 수명 주기 규칙, 객체마다 접근이 예측되지 않으면 Intelligent-Tiering을 고른다는 갈림 기준을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | s3-storage-class-analysis | S3 스토리지 클래스 분석은 접근 패턴을 보고 전환 대상을 권고할 뿐 실제 전환은 하지 않으므로 자동 계층화 요구에는 답이 되지 못한다는 한계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | s3-retrieval-fee-by-class | S3 클래스의 비용은 보관 단가와 읽을 때의 검색 요금으로 나뉘며, IA 계열은 검색 요금이 붙고 Intelligent-Tiering은 붙지 않는다는 차이를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | intelligent-tiering-monitoring-fee | S3 Intelligent-Tiering은 객체마다 모니터링·자동화 요금이 붙어 수명이 아주 짧은 데이터에는 오히려 비싸므로 데이터가 머무는 기간으로 클래스를 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
