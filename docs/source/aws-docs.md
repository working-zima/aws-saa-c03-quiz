# AWS 공식 문서에서 가져온 기초 용어 (ADR-039)

두 원본(`concepts-raw.md`, `exam-gaps.md`)과 덤프 원문이 **쓰기만 하고 정의하지 않는** 기초 용어의 근거다. 여기 적힌 용어만
이 파일을 근거로 개념 본문에 풀이할 수 있다. 목록을 늘리려면 ADR-039를 고친다.

원문은 옮기지 않는다(ADR-009). 아래 "가져온 사실"은 문서를 읽고 직접 쓴 요약이다. 확인한 날: 2026-09-27.

## 호스팅 영역 (hosted zone)

- 출처: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html
- 가져온 사실: 레코드를 담는 그릇이다. 도메인(예: example.com)과 그 하위 도메인으로 가는 트래픽을 어떻게 보낼지에 대한 레코드를
  담고, 이름은 그 도메인과 같다. 퍼블릭 호스팅 영역은 인터넷에서의 트래픽을, 프라이빗 호스팅 영역은 VPC 안의 트래픽을 다루는
  레코드를 담는다.

## 레코드 (record)

- 출처: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html
- 가져온 사실: 호스팅 영역을 만든 뒤, 그 도메인의 트래픽을 어떻게 보낼지 DNS에 알려 주려고 만든다. 레코드 하나에는 도메인이나
  하위 도메인 이름, 레코드 유형, 그 유형에 맞는 값이 들어간다.
- 출처: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html
- 가져온 사실: 레코드를 만들 때 라우팅 정책을 고르고, 그 정책이 Route 53이 질의에 어떻게 답할지를 정한다.

## 대상 그룹 (target group)

- 출처: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html
- 가져온 사실: EC2 인스턴스 같은 등록된 대상으로 요청을 보내는 단위다. 상태 검사는 대상 그룹마다 설정하고, 로드 밸런서는 등록된
  대상 가운데 정상인 것으로 요청을 보낸다. 수요가 늘면 대상을 더 등록하고, 줄거나 점검이 필요하면 등록을 해제한다. 로드 밸런서는
  클라이언트가 접속하는 단일 지점이다.

## 동시 실행 수와 예약된 동시성 (Lambda concurrency, reserved concurrency)

확인한 날: 2026-10-09. 사용자가 "예약된 동시성은 그 함수가 쓸 동시 실행 수를 떼어 둘 뿐"에서 무엇에서 떼어 내는지 모르겠다고 했다.
두 원본과 덤프 해설은 "용량을 예약할 뿐"과 "함수가 쓸 수 있는 동시 실행 수의 상한이기도 하다"만 말하고, 함수들이 계정의 한도를
나눠 쓴다는 전제가 없다(ADR-039 「2026-10-09 확장」).

- 출처: https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html
- 가져온 사실: 동시 실행 수는 한 함수가 같은 순간에 처리하고 있는 요청의 수이고, 요청 하나마다 실행 환경이 하나씩 붙는다.
  계정에는 리전마다 동시 실행 한도가 있고(기본 1,000), 그 리전의 모든 함수가 이 한도를 나눠 쓴다. 예약된 동시성은 이 한도의
  일부를 한 함수에 배정하는 값이며, 그 함수가 동시에 처리하는 요청 수의 하한이자 상한이 된다. 예약된 몫은 다른 함수가 쓸 수 없다.
  예약된 동시성으로는 실행 환경이 요청이 올 때 만들어지므로 콜드 스타트가 생길 수 있고, 프로비저닝된 동시성은 실행 환경을 미리
  초기화해 둔다.
- 출처: https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html
- 가져온 사실: 한도가 1,000인 계정에서 한 함수에 100을 예약하면, 그 함수가 100을 다 쓰지 않을 때도 다른 함수들은 남은 900을
  나눠 쓴다. 예약된 동시성을 설정하는 데는 추가 요금이 없다.
- 이 파일을 근거로 쓰지 않는 것: 예약할 수 있는 최대치(한도에서 100을 뺀 값), 초당 요청 수 한도, 확장 속도. 본문의 1,000은
  "예를 들어"로 든 값이다.
