# CloudFront·Global Accelerator·엣지 함수

`cloudfront-global-accelerator` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 27개 · keep 27 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 26 · partial 1 · no 0
- 이 주제로 들어올 이동 후보 3개 — q152(`waf-shield`) · q153(`waf-shield`) · q154(`waf-shield`)

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q082 | cloudfront | keep | — | yes | (현재) | (현재) | false | CloudFront는 이미지와 파일의 사본을 엣지에 캐싱해 전 세계 사용자 가까이에서 빠르게 제공한다. |
| q192 | global-accelerator-protocols | keep | — | yes | (현재) | (현재) | false | Global Accelerator는 TCP·UDP 연결을 가까운 엣지로 받아 가속하고 비정상 리전 대신 정상 리전으로 라우팅한다. |
| q193 | cloudfront-ttl | keep | — | yes | (현재) | (현재) | false | CloudFront의 TTL이 남아 있으면 원본을 바꿔도 옛 캐시를 제공하므로 즉시 새 파일을 내보내려면 캐시를 무효화해야 한다. |
| q194 | edge-keyword | keep | — | yes | (현재) | (현재) | false | AWS 서비스에 붙는 Edge는 원본 리전이나 고정된 한 AZ가 아니라 전 세계 사용자와 가까운 AWS 서버에서 요청을 처리한다는 뜻이다. |
| q198 | lambda-at-edge | keep | — | yes | (현재) | (현재) | false | Lambda@Edge는 CloudFront 엣지 로케이션에서 코드를 실행해 인증·권한 부여 로직을 사용자 가까이에서 처리한다. |
| q467 | cloudfront-alb-origin | keep | — | yes | (현재) | (현재) | false | CloudFront는 ALB를 오리진으로 삼아 EC2가 생성하는 동적 콘텐츠도 엣지를 거쳐 낮은 지연으로 전달할 수 있다. |
| q468 | cloudfront-multiple-origins | keep | — | yes | (현재) | (현재) | false | CloudFront 배포 하나에 여러 오리진을 등록하고 요청 경로별로 선택하면 정적·동적 콘텐츠를 한 도메인으로 제공할 수 있다. |
| q469 | cloudfront-onprem-origin | keep | — | yes | (현재) | (현재) | false | CloudFront는 온프레미스 API도 오리진으로 등록해 S3 정적 콘텐츠와 한 배포에서 경로별로 처리하고 배포 단위로 WAF를 적용할 수 있다. |
| q470 | global-accelerator | keep | — | yes | (현재) | (현재) | false | Global Accelerator는 지역이 다른 사용자에게 제공하는 네트워크 연결 자체를 빠르게 하는 서비스다. |
| q471 | global-accelerator-static-ip | keep | — | yes | (현재) | (현재) | false | Global Accelerator의 전 세계 공통 고정 IP를 진입점으로 쓰면 뒤쪽 리소스가 바뀌어도 클라이언트 주소와 DNS를 바꿀 필요가 없다. |
| q472 | global-accelerator-static-ip | keep | — | partial | (현재) | global-accelerator-protocols | false | 캐시할 사본이 없는 실시간 TCP 스트림은 콘텐츠 캐시가 아니라 Global Accelerator로 연결 경로를 최적화해 지연을 줄인다. |
| q473 | global-accelerator-endpoints | keep | — | yes | (현재) | (현재) | false | Global Accelerator는 기존 NLB를 엔드포인트로 등록해 앞단에 추가할 수 있으며 AWS 네트워크 경로로 지연과 지터를 줄인다. |
| q474 | cloudfront-functions | keep | — | yes | (현재) | (현재) | false | CloudFront Functions와 Lambda@Edge는 CDN의 요청·응답을 수정하는 함수이며 리전 Lambda에 IAM 인증 HTTPS 엔드포인트를 제공하는 수단이 아니다. |
| q475 | cloudfront-reduces-data-transfer-cost | keep | — | yes | (현재) | (현재) | false | CloudFront의 엣지 캐시는 원본 요청과 전송량을 줄이므로 단일 리전에서도 지연과 전송 비용을 함께 줄이지만 연결 가속이나 리전 복제는 같은 절감을 주지 않는다. |
| q476 | cloudfront-reduces-data-transfer-cost | keep | — | yes | (현재) | (현재) | false | 애플리케이션을 여러 리전에 복제하면 리전마다 인프라와 리전 간 전송 비용이 추가되어 단일 리전과 엣지 캐시 조합보다 비용 조건에서 불리하다. |
| q477 | global-accelerator-vs-dns-failover | keep | — | yes | (현재) | (현재) | false | Global Accelerator는 같은 애니캐스트 IP 뒤의 경로를 바꾸므로 리전 장애 조치 때 클라이언트의 DNS 캐시 만료를 기다리지 않는다. |
| q478 | cloudfront-signed-url | keep | — | yes | (현재) | (현재) | false | CloudFront 서명된 URL은 URL 소지자에게 정해진 유효 기간 동안만 파일 접근을 허용한다. |
| q479 | cloudfront-signed-url | keep | — | yes | (현재) | (현재) | false | CloudFront 서명된 URL은 만료되는 임시 접근이라 매일 계속 접속하는 사용자에게는 만료 때마다 새 링크를 배포해야 한다. |
| q480 | cloudfront-signed-cookie | keep | — | yes | (현재) | (현재) | false | CloudFront 서명된 쿠키는 URL을 바꾸지 않고 여러 파일에 대한 접근 권한을 쿠키에 담아 제공한다. |
| q481 | cloudfront-geo-restriction | keep | — | yes | (현재) | (현재) | false | CloudFront의 지리적 제한은 배포 설정의 국가 목록으로 시청자를 허용하거나 차단하므로 별도 코드나 서명 발급이 필요 없다. |
| q482 | cloudfront-field-level-encryption | keep | — | yes | (현재) | (현재) | false | CloudFront 필드 수준 암호화는 선택한 값을 엣지에서 암호화해 개인 키를 가진 애플리케이션만 읽게 하므로 HTTPS 종료 뒤에도 중간 구성 요소에 노출되지 않는다. |
| q483 | lambda-at-edge-origin-selection-by-viewer-location | keep | — | yes | (현재) | (현재) | false | Lambda@Edge로 뷰어 위치를 나타내는 헤더를 적용하고 그 헤더에 따라 오리진을 선택해야 CloudFront가 가까운 리전의 원본으로 보낼 수 있다. |
| q484 | lambda-at-edge-response-compression | keep | — | yes | (현재) | (현재) | false | 재사용할 수 없는 응답의 전송 비용은 Lambda@Edge가 전달 직전에 압축해 바이트 수를 줄이면 애플리케이션 변경 없이 낮출 수 있다. |
| q485 | cloudfront-price-class | keep | — | yes | (현재) | (현재) | false | CloudFront 가격 등급에서 사용할 엣지 범위를 사용자 지역에 맞게 좁히면 캐싱 효과를 유지하면서 배포 비용을 줄일 수 있다. |
| q486 | cloudfront-s3-upload-with-oac | keep | — | yes | (현재) | (현재) | false | 비공개 S3 업로드를 CloudFront로 받으려면 업로드를 허용하고 OAC로 원본 접근을 제한하며 사용자 지정 도메인 인증서는 us-east-1에서 발급한다. |
| q487 | cloudfront-alb-origin-access-restriction | keep | — | yes | (현재) | (현재) | false | ALB 오리진 우회 접근을 막는 표준 구성은 ALB 보안 그룹의 인바운드를 CloudFront 엣지 공용 IP 범위로 제한하는 것이다. |
| q488 | cloudfront-functions-no-external-calls | keep | — | yes | (현재) | (현재) | false | CloudFront Functions는 외부 AWS 서비스로 네트워크 호출을 할 수 없으므로 이미지 검사 서비스를 호출하는 처리에 사용할 수 없다. |
