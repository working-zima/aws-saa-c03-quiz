# AWS 핵심 서비스·리전·가용 영역·온프레미스

`aws-core-services` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 18개 · keep 18 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 18 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q001 | ec2 | keep | — | yes | (현재) | (현재) | false | EC2는 원격으로 접속할 컴퓨터를 빌려 쓰는 서비스이며, 데이터베이스·파일 저장·코드 실행을 제공하는 서비스와 구분된다. |
| q002 | rds | keep | — | yes | (현재) | (현재) | false | RDS는 MySQL·MariaDB 같은 관계형 데이터베이스를 직접 마련하지 않고 AWS에서 빌려 쓰는 서비스이며, 빌리는 대상이 컴퓨터인 EC2와 갈린다. |
| q003 | s3 | keep | — | yes | (현재) | (현재) | false | S3는 파일을 보관하는 스토리지이면서 정적 웹 사이트 호스팅까지 한 서비스가 함께 제공한다. |
| q004 | route-53 | keep | — | yes | (현재) | (현재) | false | Route 53은 문자로 된 인터넷 주소인 도메인을 발급하고 관리하는 DNS 서비스다. |
| q005 | dns | keep | — | yes | (현재) | (현재) | false | DNS는 사람이 읽는 문자 주소를 컴퓨터가 쓰는 IP 주소로 바꿔 주는 시스템이다. |
| q006 | elb | keep | — | yes | (현재) | (현재) | false | ELB는 들어오는 트래픽을 여러 서버에 나누어 주는 로드 밸런서다. |
| q007 | cloudfront | keep | — | yes | (현재) | (현재) | false | CloudFront는 콘텐츠 복사본을 세계 여러 곳의 임시 저장소에 두어 사용자가 가장 가까운 곳에서 받게 하는 CDN 서비스다. |
| q008 | lambda | keep | — | yes | (현재) | (현재) | false | Lambda는 서버를 만들고 관리하는 일을 AWS가 맡고 쓰는 쪽은 실행할 코드만 올리는 컴퓨팅 서비스다. |
| q009 | region | keep | — | yes | (현재) | (현재) | false | 리전은 AWS 인프라를 지리적 위치에 따라 나눠 둔 가장 바깥쪽 단위다. |
| q010 | availability | keep | — | yes | (현재) | (현재) | false | 가용성은 시스템이 서비스를 정상 상태로 제공할 수 있는 가능성이고 보통 가동률 백분율로 나타낸다. |
| q011 | availability-zone | keep | — | yes | (현재) | (현재) | false | 가용 영역은 한 리전 안에서 물리적으로 떨어뜨려 둔 데이터 센터다. |
| q012 | multi-az | keep | — | yes | (현재) | (현재) | false | 다중 AZ는 같은 리전의 서로 다른 가용 영역에 구성 요소를 나누어 두어 한 곳이 멈춰도 서비스를 이어 가는 구성이다. |
| q013 | single-az | keep | — | yes | (현재) | (현재) | false | 단일 AZ는 시스템 전체를 가용 영역 하나에 두는 구성이라 비용은 덜 들지만 그 영역에 장애가 나면 서비스가 멈춘다. |
| q014 | on-premise | keep | — | yes | (현재) | (현재) | false | 온프레미스는 회사가 인프라 장비를 직접 사서 사내 전산실에서 운영하는 방식이다. |
| q015 | migration | keep | — | yes | (현재) | (현재) | false | 마이그레이션은 시스템이나 서비스를 한 환경에서 다른 환경으로 옮기는 일을 가리키는 말이다. |
| q170 | exam-heuristics | keep | — | yes | (현재) | (현재) | false | 사용자 급증과 이미지 처리에서 운영 부담을 줄이는 선택 기준은 코드·파일·데이터 저장을 Lambda·S3·DynamoDB의 서버리스 구성에 맡기는 것이다. |
| q317 | exponential-backoff-retry | keep | — | yes | (현재) | (현재) | false | 같은 자원을 쓰는 다른 애플리케이션은 멀쩡한데 한쪽에서만 간헐적으로 실패하면 용량 문제가 아니라 일시적 실패이므로, 지수 백오프를 붙인 재시도로 호출 쪽을 고친다. |
| q318 | blob-offload-to-s3 | keep | — | yes | (현재) | (현재) | false | 파일 본체는 S3에 두고 관계형 데이터베이스에는 객체 키와 메타데이터만 남겨야 데이터베이스 크기와 비용이 계속 커지는 원인이 사라진다. |
