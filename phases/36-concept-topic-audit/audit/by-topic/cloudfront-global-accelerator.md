# CloudFront·Global Accelerator·엣지 함수

`cloudfront-global-accelerator` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 24개 · keep 24 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 21 · false 3 · duplicateOf 0
- 이 주제로 들어올 이동 후보 2개 — `api-gateway-step-functions.api-gateway-behind-cloudfront` · `waf-shield.cloudfront`
- 교차 유형 ① 23 · 2A 1 · 2B 0 · 3 0 · 4 0 · hold 0

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | cloudfront | 콘텐츠를 캐시해 전 세계 사용자에게 빠르게 제공하는 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | cloudfront-alb-origin | CloudFront 배포의 오리진으로 ALB를 지정하면 EC2가 만드는 동적 콘텐츠도 엣지를 거쳐 전달되므로 동적 콘텐츠라는 조건만으로 CloudFront를 제외하면 안 됨을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | cloudfront-multiple-origins | CloudFront 배포 하나에 S3 버킷과 로드 밸런서를 함께 오리진으로 두고 경로로 나눌 수 있어 정적·동적 콘텐츠가 하나의 도메인과 진입점을 쓸 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | cloudfront-onprem-origin | CloudFront 오리진은 AWS 밖의 서버도 될 수 있어 정적 콘텐츠는 S3에서, API는 온프레미스로 보내는 구성을 배포 하나로 만들고 보호 규칙도 한곳에 붙일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | cloudfront-signed-url | CloudFront 서명된 URL은 유효 기간이 있는 임시 접근을 나눠 주는 방식이라 일회성 다운로드에는 맞지만 계속 접근해야 하는 사용자에게는 맞지 않음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 6 | cloudfront-signed-cookie | 모든 사용자에게 같은 URL을 주거나 여러 파일을 한 번에 허용해야 할 때는 파일마다 URL이 달라지는 서명된 URL 대신 서명된 쿠키를 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | cloudfront-geo-restriction | 특정 국가의 시청자를 막는 요구는 사용자별 권한인 서명된 URL·쿠키나 오리진 접근 통제가 아니라 CloudFront의 지리적 제한 설정으로 해결함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | cloudfront-field-level-encryption | HTTPS는 오리진에 닿으면 평문이 되므로 특정 입력 필드를 전 구간에서 가려야 할 때는 엣지에서 그 필드만 암호화하는 필드 수준 암호화를 써야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | cloudfront-price-class | CloudFront 가격 등급으로 사용할 엣지 범위를 사용자가 있는 지역으로 좁히면 캐싱 효과를 유지하면서 배포 비용을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | cloudfront-ttl | 엣지에 캐시된 사본은 TTL이 남아 있는 동안 계속 제공되므로 원본을 바꾼 직후 새 내용을 보이려면 무효화로 캐시를 지워야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | cloudfront-s3-upload-with-oac | CloudFront를 업로드 경로로도 쓸 수 있으며 이때도 버킷을 공개하지 않고 OAC로 CloudFront만 접근하게 하고, 사용자 지정 도메인에는 us-east-1의 인증서가 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | cloudfront-alb-origin-access-restriction | 오리진이 ALB일 때 배포를 우회한 직접 접근을 막으려면 ALB 보안 그룹이 CloudFront 엣지의 IP 범위만 허용하게 하는 것이 표준이며 상태를 기억하지 않는 NACL은 이 용도에 불리함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | edge-keyword | 서비스 이름에 붙는 Edge는 사용자와 가장 가까운 AWS 위치에서 요청을 처리한다는 뜻이므로 전 세계 사용자의 지연을 줄이는 방향임을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 14 | lambda-at-edge | Lambda@Edge로 인증 같은 로직을 CloudFront 엣지 로케이션에서 실행하면 리전의 함수보다 사용자 가까이에서 처리해 지연을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | lambda-at-edge-origin-selection-by-viewer-location | 여러 오리진을 가진 배포에서 뷰어 위치로 오리진을 고르려면 일반 캐시 동작만으로는 안 되고 Lambda@Edge가 요청을 바꿔 줘야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | lambda-at-edge-response-compression | 요청마다 새로 만들어지는 응답은 캐시로 전송 비용을 줄일 수 없으므로 Lambda@Edge로 전달 직전에 응답을 압축해 애플리케이션 수정 없이 전송량을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | cloudfront-functions | 엣지에서 코드를 실행하는 방법은 CloudFront Functions와 Lambda@Edge 둘이며 둘 다 CDN을 지나는 요청·응답을 손보는 장치라 리전 함수를 엔드포인트로 노출하는 용도가 아님을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | cloudfront-functions-no-external-calls | CloudFront Functions는 헤더·URL 수정처럼 그 자리에서 끝나는 경량 처리용이라 외부 AWS 서비스를 호출할 수 없으므로 그런 호출이 필요한 구성에는 쓸 수 없음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | global-accelerator | 지역이 서로 다른 사용자에게 네트워크 연결 자체를 빠르게 제공하는 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 20 | global-accelerator-static-ip | Global Accelerator가 주는 고정 진입 IP는 뒤쪽 리소스가 바뀌어도 그대로라 DNS 관리를 줄이며, 가속 대상이 캐시할 콘텐츠가 아니라 연결 자체라는 것을 이해한다. | keep | — | true | (현재) | — | 2 | 2A |
| 21 | global-accelerator-endpoints | Global Accelerator는 기존 로드 밸런서를 대체하지 않고 NLB 같은 리소스를 엔드포인트로 등록해 그 앞에 세우며, 가까운 엣지에서 받아 AWS 네트워크로 최적 리전에 보내는 경로가 가속의 실체임을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 22 | global-accelerator-protocols | 미리 복사해 둘 콘텐츠가 있으면 CloudFront, 사본 없이 TCP·UDP 연결 경로를 빠르게 하고 리전 장애 때 우회해야 하면 Global Accelerator를 고른다는 갈림길을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 23 | global-accelerator-vs-dns-failover | DNS 기반 장애 조치는 캐시된 응답이 만료될 때까지 옛 리전으로 가지만 Global Accelerator는 고정 애니캐스트 IP 뒤의 경로만 바꾸므로 DNS 캐시에 영향받지 않고 리전을 전환함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 24 | cloudfront-reduces-data-transfer-cost | CloudFront는 엣지의 캐시 사본으로 오리진까지 가는 트래픽을 줄여 지연과 데이터 전송 비용을 함께 낮추지만 Global Accelerator와 다중 리전 구성은 이 절감을 만들지 않음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
