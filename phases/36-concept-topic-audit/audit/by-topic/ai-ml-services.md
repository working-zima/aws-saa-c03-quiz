# SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract

`ai-ml-services` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 6개 · keep 6 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 3 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 6 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | sagemaker | SageMaker AI의 모델 훈련에 S3 데이터를 직접 연결할 수 있으므로 별도 파일 시스템에 학습용 사본을 만들 필요가 없는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 2 | sagemaker-autopilot | SageMaker Autopilot은 자기 데이터로 모델을 만들고 훈련하는 과정을 자동화하므로, 모델 훈련을 포함하지 않아야 한다는 조건에서는 오히려 맞지 않고 이미 학습된 모델을 API로 부르는 서비스를 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | media-ai-service-lineup | 음성을 글로 옮기기·이미지와 영상 분석·번역·문서의 글자와 표 추출은 입력 종류가 다른 별개의 사전 학습 AI 기능이므로 요구하는 입력에 맞춰 서비스를 골라야 하고, 결과를 분석하는 단계는 따로 필요함을 이해한다. | keep | — | false | (현재) | — | 2 | ① |
| 4 | comprehend | 이미 학습된 기능으로 글의 개체명·감정·핵심 문구를 분석하는 자연어 처리는 번역·문자 추출·모델 훈련과 다른 역할임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 5 | amazon-lex | 사용자와 대화를 주고받는 인터페이스를 만드는 일은 글의 감정을 판정하거나 이미지·영상을 분석하는 일과 역할이 다름을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 6 | rekognition-content-moderation | Rekognition의 콘텐츠 검토는 AWS가 미리 학습한 모델로 이미지의 부적절한 콘텐츠를 탐지하므로 모델 훈련 없이 검토를 붙일 수 있고, 정지 이미지·영상 스트림·글이라는 입력 종류가 선택을 가른다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
