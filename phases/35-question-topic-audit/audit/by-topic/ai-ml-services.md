# SageMaker·Comprehend·Rekognition·Lex·Transcribe·Translate·Textract

`ai-ml-services` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 7개 · keep 7 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 7 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q310 | sagemaker | keep | — | yes | (현재) | (현재) | false | SageMaker AI는 S3 버킷을 학습 데이터 출처로 직접 사용할 수 있어 학습용 데이터를 별도 파일 시스템이나 노트북 저장소에 복사할 필요가 없다. |
| q311 | media-ai-service-lineup | keep | — | yes | (현재) | (현재) | false | Transcribe는 음성을 텍스트로 변환하면서 화자 분할을 제공하므로 누가 말했는지 구분한 녹취록을 만든다. |
| q312 | media-ai-service-lineup | keep | — | yes | (현재) | (현재) | false | Textract는 문서 이미지에서 글자와 표를 추출하며 음성 전사·언어 번역·텍스트 의미 분석과 역할이 다르다. |
| q313 | comprehend | keep | — | yes | (현재) | (현재) | false | Comprehend는 글에서 개체명·감정·핵심 문구를 추출하는 자연어 처리 기능을 제공한다. |
| q314 | amazon-lex | keep | — | yes | (현재) | (현재) | false | Lex는 사용자와 말을 주고받는 대화형 인터페이스를 구축하는 서비스다. |
| q315 | sagemaker-autopilot | keep | — | yes | (현재) | (현재) | false | SageMaker Autopilot은 보유 데이터로 모델을 만들고 훈련하는 과정을 자동화해 직접 훈련 절차를 작성하는 부담을 줄인다. |
| q316 | rekognition-content-moderation | keep | — | yes | (현재) | (현재) | false | Rekognition의 콘텐츠 검토는 미리 학습된 모델로 이미지의 부적절한 내용을 탐지해 직접 모델을 훈련하지 않고 검토 기능을 붙이게 한다. |
