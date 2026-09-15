# API Gateway·Step Functions

`api-gateway-step-functions` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 20개 · keep 18 · ambiguous 1 · move-recommended 1
- 이동 후보 비율 5.0% — `api-gateway-step-functions.api-gateway-behind-cloudfront`
- 이동 후보의 confidence high 1 · medium 0 · low 0
- serviceSpecificGoal true 20 · false 0 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 18 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 2

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | api-gateway | API Gateway가 요청을 백엔드로 전달하는 역할과 REST API·HTTP API의 기능·비용·지연·인증 지원 차이를 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 2 | api-gateway-jwt-authorizer | JWT 인증과 ALB 통합을 함께 요구할 때 HTTP API의 기본 지원을 이용해 API 구성을 단순하게 만드는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | api-gateway-rest-vs-http-timeout | API Gateway의 동기 요청은 백엔드 통합을 기다리는 시간에 제한되므로 처리 시간까지 보고 API 유형을 골라야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 4 | api-gateway-rest-only-features | API 키·요청 검증·호출량 제한 같은 관리 기능의 필요 여부로 API Gateway의 REST API와 HTTP API를 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | api-gateway-websocket-api | 서버가 먼저 메시지를 보내거나 연결을 유지하며 주고받는 요구에는 API Gateway의 WebSocket API가 필요한 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | api-gateway-api-key-not-auth | API Gateway의 API 키는 사용량 식별용이므로 사용자 신원 확인을 대신할 수 없다는 한계를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | api-gateway-resource-policy | API Gateway의 계정 간 호출 허용은 API 리소스 정책이 정하고 엔드포인트 정책은 접근 경로의 통제를 더한다는 차이를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | api-gateway-endpoint-types | API Gateway의 엔드포인트 유형에 따라 전 세계 사용자의 진입 경로가 달라지며 캐싱·압축·백엔드 용량 조절과 효과를 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 9 | api-gateway-behind-cloudfront | CloudFront의 오리진에 동적 HTTP API도 연결하면 정적 파일과 API 응답 모두 엣지를 이용하고 캐시 가능한 응답의 원본 호출을 줄일 수 있음을 이해한다. | move-recommended | high | true | cloudfront-global-accelerator | — | 1 | hold |
| 10 | api-gateway-lambda-proxy-integration | API Gateway의 AWS_PROXY 통합이 요청을 Lambda에 넘겨 동기 응답을 받는 방식과 사용자 지정 권한 부여자의 역할을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 11 | api-gateway-aws-service-integration | API Gateway에서 AWS 서비스 작업을 직접 호출할 수 있으면 전달만 하는 중간 함수의 코드와 운영 부담을 없앨 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | api-gateway-custom-domain-name | API Gateway의 사용자 지정 주소를 구성할 때 도메인·인증서·DNS 별칭을 연결하고 사용자마다 별도 인프라를 만들지 않는 방법을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | api-gateway-mapping-template-limits | API Gateway의 가벼운 매핑과 별도 코드가 필요한 형식 변환의 경계를 이해하고 변환할 요청에만 처리 함수를 배치할 수 있다. | keep | — | true | (현재) | — | 2 | ① |
| 14 | api-gateway-ip-restriction-by-resource-policy | API Gateway 호출의 출발지 IP를 제한할 때 리소스 정책을 사용해야 하며 보안 그룹을 붙이는 방식과 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | step-functions | Step Functions가 여러 작업의 실행 상태·재시도·오류 처리를 관리해 단일 함수보다 긴 처리 흐름을 조율하는 역할을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | step-functions-features | Step Functions로 자동 재시도와 사람의 승인을 포함하는 장기 워크플로를 조율해 애플리케이션의 흐름 제어 부담을 줄이는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | step-functions-long-running-workflow | Step Functions의 장기 실행 상태를 이용하면 개별 태스크보다 훨씬 오래 걸리는 전체 작업을 단일 Lambda 호출로 감싸지 않고 조율할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | step-functions-express-workflow | Step Functions에서 짧고 호출량이 많은 처리 흐름은 Express 유형의 특성에 맞으며 함수별 동시성 설정만으로 흐름을 조율할 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | step-functions-map-state | Step Functions의 Map 상태에 항목별 반복 호출을 맡기면 기존 처리 함수를 고치지 않고 호출을 조율하는 함수의 시간 한계를 피할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | amplify | Amplify의 웹·모바일 개발·배포 지원과 백엔드 처리 완료 알림은 구분해야 하며 알림은 별도 서비스가 맡는다는 경계를 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
