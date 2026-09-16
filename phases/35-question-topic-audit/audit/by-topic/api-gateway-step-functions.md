# API Gateway·Step Functions

`api-gateway-step-functions` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 25개 · keep 24 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 25 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q088 | step-functions | keep | — | yes | (현재) | (현재) | false | 낱개의 처리를 실행하는 서비스와, 그 처리들을 정해진 순서로 이으면서 각 단계의 재시도와 오류 처리를 맡는 오케스트레이션은 역할이 다르다. |
| q089 | api-gateway | keep | — | yes | (현재) | (현재) | false | API Gateway의 두 API 유형 가운데 HTTP API가 기능이 제한적인 대신 비용과 지연이 낮고 JWT 인증을 기본으로 제공한다. |
| q090 | api-gateway | keep | — | yes | (현재) | (현재) | false | 외부에서 들어온 요청을 받아 여러 종류의 백엔드로 안전하게 넘기는 입구 역할이 어느 서비스의 일인지가 갈림길이다. |
| q200 | api-gateway-jwt-authorizer | keep | — | yes | (현재) | (현재) | false | JWT 권한 부여와 ALB 프라이빗 통합을 기본으로 지원하면서 비용과 지연까지 낮은 쪽은 HTTP API다. |
| q206 | step-functions-features | keep | — | yes | (현재) | (현재) | false | Step Functions는 장시간 워크플로의 실행 순서를 조율하면서 사람의 승인과 실패 시 재시도를 관리한다. |
| q529 | amplify | keep | — | yes | (현재) | (현재) | false | Amplify가 맡는 범위는 애플리케이션을 만들고 배포해 서비스하는 데까지이고, 처리 완료를 사용자에게 알리는 기능은 거기에 들어 있지 않다. |
| q530 | api-gateway-rest-vs-http-timeout | keep | — | yes | (현재) | (현재) | false | 백엔드 통합이 응답할 때까지 기다려 주는 시간이 REST API 쪽이 길어서, 처리에 몇 분이 걸리는 동기 호출은 HTTP API로 받지 못한다. |
| q531 | api-gateway-rest-vs-http-timeout | keep | — | yes | (현재) | (현재) | false | HTTP API의 통합 타임아웃이 REST API보다 짧다는 것이 몇 분짜리 동기 요청에서 백엔드는 도는데 연결만 끊기는 증상의 원인이다. |
| q532 | api-gateway-rest-only-features | keep | — | yes | (현재) | (현재) | false | 호출자를 구분하는 API 키, 요청 유효성 검사, 스로틀링은 REST API만 온전히 지원하므로 이 중 하나라도 요구되면 비용이나 지연을 따질 자리가 없다. |
| q533 | api-gateway-websocket-api | keep | — | yes | (현재) | (현재) | false | 서버가 먼저 말을 걸거나 연결된 클라이언트 전체에 뿌려야 하면 요청-응답 모델로는 되지 않고 연결을 유지하는 양방향 유형이 필요하다. |
| q534 | api-gateway-api-key-not-auth | keep | — | yes | (현재) | (현재) | false | API 키는 어떤 클라이언트가 호출했는지 구분하는 식별 장치일 뿐 사용자의 신원을 검증하지 않는다. |
| q535 | api-gateway-resource-policy | keep | — | yes | (현재) | (현재) | false | 어느 계정의 호출을 허용할지는 API에 직접 붙는 리소스 정책이 정하고, 엔드포인트 정책은 그 경로를 지나는 트래픽에 통제를 더할 뿐이다. |
| q536 | api-gateway-endpoint-types | keep | — | yes | (현재) | (현재) | false | 요청이 CloudFront 엣지를 거쳐 들어오게 해 멀리 있는 사용자의 지연을 줄이는 것은 엔드포인트 방식이고, 캐싱·압축·동시성은 요청이 들어오는 경로를 바꾸지 않는다. |
| q537 | api-gateway-endpoint-types | keep | — | yes | (현재) | (현재) | false | 같은 응답을 백엔드까지 가지 않고 돌려주어 반복 요청의 왕복 자체를 없애는 것은 API Gateway 캐싱이다. |
| q538 | api-gateway-behind-cloudfront | ambiguous | — | yes | (현재) | (현재) | false | 정적 버킷과 동적 API를 같은 CloudFront 배포의 오리진으로 함께 등록하면 지연 감소와 오리진 호출 감소가 한 구성에서 나온다. |
| q539 | api-gateway-lambda-proxy-integration | keep | — | yes | (현재) | (현재) | false | 요청을 손대지 않고 그대로 넘기고 함수가 만든 결과를 그 요청의 응답으로 받으려면 통합이 함수를 동기식으로 호출해야 한다. |
| q540 | api-gateway-lambda-proxy-integration | keep | — | yes | (현재) | (현재) | false | 표준으로 정해지지 않은 인증 로직은 앞단을 따로 세우지 않고 사용자 지정 권한 부여자로 API Gateway 안에서 처리한다. |
| q541 | api-gateway-aws-service-integration | keep | — | yes | (현재) | (현재) | false | 메서드를 AWS 서비스 작업에 바로 이어 붙이면 중간에 함수를 두지 않고도 창구가 만들어져 관리할 코드가 늘지 않는다. |
| q542 | step-functions-long-running-workflow | keep | — | yes | (현재) | (현재) | false | 실행이 하루를 넘겨 이어지고 실패한 태스크를 다시 처리해야 하는 흐름은 15분 제한이 있는 함수 하나로 감쌀 수 없고 실행이 길게 유지되는 상태 머신이 들고 간다. |
| q543 | step-functions-express-workflow | keep | — | yes | (현재) | (현재) | false | 처리량이 많고 실행 하나가 짧은 워크플로에는 비용 효율이 높은 Express 유형이 맞는다. |
| q544 | step-functions-map-state | keep | — | yes | (현재) | (현재) | false | 목록을 도는 반복을 상태 머신의 Map 상태로 꺼내면 함수 코드를 고치지 않은 채 실행 시간 제한을 벗어난다. |
| q545 | api-gateway-custom-domain-name | keep | — | yes | (현재) | (현재) | false | API Gateway 사용자 지정 도메인에 붙일 인증서는 그 API와 같은 리전의 ACM에서 발급받고, us-east-1 발급은 CloudFront에 붙일 때의 예외다. |
| q546 | api-gateway-mapping-template-limits | keep | — | yes | (현재) | (현재) | false | 형식 자체가 달라지는 변환은 매핑 템플릿이 감당하는 범위를 넘어 통합 대상으로 둔 함수의 코드가 맡는다. |
| q547 | api-gateway-mapping-template-limits | keep | — | yes | (현재) | (현재) | false | 이미 그 형식을 받는 백엔드가 있는 경로는 변환 없이 그대로 흘려보내고 형식이 다른 경로에만 변환 코드를 두는 것이 부품이 가장 적은 구성이다. |
| q548 | api-gateway-ip-restriction-by-resource-policy | keep | — | yes | (현재) | (현재) | false | API Gateway에는 보안 그룹을 붙일 수 없고, 호출을 신뢰하는 IP 주소 범위로 좁히는 일은 API에 붙는 리소스 정책이 맡는다. |
