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

## 권한 세트 할당과 IAM 역할 (IAM Identity Center)

확인한 날: 2026-10-09. 사용자가 Organizations를 이해하려고 "IAM Identity Center에서 계정 A에 권한을 할당하면 계정 A에 IAM 역할이
자동으로 생기고 그 역할로 접근한다"는 그림을 가져왔다. 데이터에는 권한 세트를 사용자·그룹에 계정별로 할당한다는 것까지만 있다.

- 출처: https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html
- 가져온 사실: 권한 세트는 IAM 정책 여러 개를 묶어 정의해 두는 템플릿이다. 권한 세트를 사용자나 그룹에 할당하면 IAM Identity Center가
  할당한 각 계정에 자기가 관리하는 IAM 역할을 만들고, 권한 세트에 담긴 정책을 그 역할에 붙인다. 권한을 받은 사용자는 접근 포털이나
  AWS CLI에서 그 역할을 맡는다. 권한 세트를 고치면 Identity Center가 대응하는 역할과 정책도 함께 고친다.
- 이 파일을 근거로 쓰지 않는 것: 역할 이름 규칙, 세션 지속 시간(기본 1시간·최대 12시간), 사전 정의 권한 세트 목록, account access manager.

## SCP와 관리 계정 (AWS Organizations)

확인한 날: 2026-10-09. 같은 요청에서 조직 구조와 SCP 범위 도식을 그리려면 관리 계정에 SCP가 걸리는지 정해야 했다. 데이터에는 SCP를 붙일
수 있는 자리(루트·OU·멤버 계정)만 있다.

- 출처: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
- 가져온 사실: SCP는 조직의 멤버 계정에만 걸리고, 관리 계정의 사용자와 역할에는 걸리지 않는다.
- 이 파일을 근거로 쓰지 않는 것: 서비스 연결 역할 예외, 위임 관리자, RCP, SCP 최대 크기, FullAWSAccess 기본 정책.

## 템플릿·스택·드리프트 (AWS CloudFormation)

확인한 날: 2026-10-10. 사용자가 드리프트 감지 요약 "스택으로 만든 리소스가 템플릿과 달라졌는지 보는 기능이라, 스택 밖 리소스는 보지 못한다"에서
"스택으로 만들었다"가 무슨 뜻인지 모르겠다고 했다. 데이터는 `스택`과 `드리프트`를 쓰기만 하고 정의하지 않는다.

- 출처: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html
- 가져온 사실: 템플릿은 만들 AWS 리소스와 그 속성을 적어 둔 YAML·JSON 텍스트 파일이고, CloudFormation은 이것을 설계도로 삼아 리소스를 만든다.
  스택은 관련된 리소스를 한 단위로 관리하는 묶음이다. 스택을 만들고 고치고 지우는 것으로 그 안의 리소스를 함께 만들고 고치고 지운다. 스택의
  리소스는 모두 그 스택의 템플릿이 정의한다. 예: Auto Scaling 그룹·로드 밸런서·RDS 데이터베이스를 적은 템플릿을 제출해 스택을 만들면
  CloudFormation이 그 리소스들을 모두 만든다.
- 출처: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html
- 가져온 사실: CloudFormation으로 관리하는 리소스도 사용자가 CloudFormation 밖에서(예: EC2 콘솔에서) 직접 바꿀 수 있다. 드리프트 감지는 스택의
  실제 구성이 기대한 구성(템플릿과 템플릿 파라미터로 정한 값)과 달라졌는지, 즉 드리프트했는지를 찾는다. 속성 값이 바뀌었거나 지워진 리소스를
  드리프트한 것으로 본다.
- 이 파일을 근거로 쓰지 않는 것: 변경 세트, 중첩 스택, 드리프트 상태 코드, 드리프트 감지를 지원하지 않는 리소스·속성 목록, 스택 상태 조건.

## 블록의 기본 개념 일곱 (phase 55)

확인한 날: 2026-10-10. phase 54가 들여쓰기 머리를 세우고 남긴 블록 일곱(ADR-042 「남겨 둔 것」)은 두 원본과 덤프 해설에 세부 사실만 있고,
그 블록을 소개할 정의가 없다. 사용자 결정으로 아래 일곱의 정의를 공식 문서에서 가져와 기본 개념 일곱과 문항 일곱(q733~q739)을 쓴다(ADR-039
「2026-10-10 확장 — 블록의 기본 개념 일곱」, ADR-043).

### IAM 정책 (IAM policy)

- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
- 가져온 사실: 정책은 자격 증명(사용자·그룹·역할)이나 리소스에 붙어 그 권한을 정의하는 객체이고, 대부분 JSON 문서로 저장된다. 주체가 요청을
  보내면 AWS가 정책을 평가해 허용할지 거부할지 정한다. 문장마다 Effect(허용·거부), Action(작업), Resource(리소스), Condition(조건)을 적는다.
  자격 증명 기반 정책은 붙은 주체가 할 수 있는 일을 정하고, 리소스 기반 정책(S3 버킷 정책, 역할의 신뢰 정책 등)은 정책에 적은 주체에게 그
  리소스에 대한 권한을 준다. 권한 경계는 권한을 주지 않고 자격 증명 기반 정책이 줄 수 있는 최대치만 정한다.
- 이 파일을 근거로 쓰지 않는 것: 정책 유형 아홉 전체 목록(VPC 엔드포인트 정책·RCP·RAM·세션 정책 등), 관리형·인라인 정책의 구분, 정책 크기
  한도, Version·Sid 요소, 평가 로직의 세부 단계.

### 루트 사용자 (AWS account root user)

- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- 가져온 사실: AWS 계정을 처음 만들면 계정의 모든 AWS 서비스와 리소스에 완전히 접근하는 로그인 주체 하나로 시작하고, 이것이 루트 사용자다.
  계정을 만들 때 쓴 이메일 주소와 비밀번호로 로그인한다. AWS는 일상 작업에 루트 사용자를 쓰지 말고, 루트 자격 증명을 안전하게 보관해 루트만
  할 수 있는 작업에만 쓰라고 권한다. 루트만 할 수 있는 작업의 예로, 하나뿐인 IAM 관리자가 실수로 자기 권한을 회수했을 때 정책을 고쳐 권한을
  되살리는 일이 있다. 루트 사용자는 MFA로 보호한다.
- 이 파일을 근거로 쓰지 않는 것: 루트만 할 수 있는 작업 전체 목록, 루트 액세스 키 관리 절차.

#### 멤버 계정의 루트 자격 증명 (phase 56 추가, 2026-10-10)

- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-enable-root-access.html (「Centralize root access for member accounts」),
  https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html (「Centrally manage root access for member accounts」)
- 가져온 사실: Organizations에 묶인 멤버 계정도 저마다 루트 사용자를 가진다. 루트 접근을 중앙에서 관리하도록 켜면(IAM 콘솔의 루트 액세스
  관리), 관리 계정과 IAM 위임 관리자가 멤버 계정의 루트 비밀번호·액세스 키·서명 인증서를 지우고 MFA를 비활성화할 수 있다. 그러면 그 멤버
  계정은 루트 사용자로 로그인하지도, 루트 비밀번호를 복구하지도 못한다. Organizations에서 새로 만든 계정에는 처음부터 루트 자격 증명이 없다.
  루트만 할 수 있는 작업이 필요하면 관리 계정이나 위임 관리자가 비밀번호 복구를 허용하고, 멤버 계정의 루트 이메일 받은편지함에 접근하는
  사람이 비밀번호를 재설정해 루트로 들어간다. AWS는 그 작업을 마친 뒤 루트 자격 증명을 다시 지우라고 권한다.
- 이 파일을 근거로 쓰지 않는 것: 관리 계정이 멤버 계정에서 대신하는 특권 작업의 목록(S3 버킷 정책·SQS 큐 정책 삭제 등)과 그 절차, 기능을
  켜는 데 필요한 권한·API(`sts:AssumeRoot` 등), 단독 계정의 계정 설정 변경에 루트가 필요한지 여부.
- 쓰인 곳: `iam-permissions.root-user-cannot-be-disabled`의 셋째·넷째 문단과 요약, q701 해설(ADR-045).

### AWS Systems Manager와 관리형 노드

- 출처: https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html
- 가져온 사실: Systems Manager는 AWS·온프레미스·멀티클라우드 환경의 노드를 한곳에서 보고 관리하고 운영하게 해 주는 서비스다. 노드는 관리형이어야
  하는데, 그 뜻은 SSM 에이전트가 설치돼 있고 에이전트가 Systems Manager 서비스와 통신할 수 있다는 것이다. 서버에 로그인하지 않고 원격으로
  관리하므로 배스천 호스트나 SSH가 필요 없다. 기능(도구)에는 Run Command, Session Manager, Patch Manager, Parameter Store 등이 있다.
- 출처: https://docs.aws.amazon.com/systems-manager/latest/userguide/operating-systems-and-machine-types.html
- 가져온 사실: 관리형 노드는 Systems Manager와 함께 동작하도록 구성된 머신이다. EC2 인스턴스, 온프레미스 서버, 다른 클라우드의 가상 머신, 엣지
  장치가 관리형 노드가 될 수 있다.
- 이 파일을 근거로 쓰지 않는 것: 통합 콘솔, 지원 운영 체제 목록, 진단·복구 런북, 서비스 이름 변천.

### EC2 인스턴스 유형과 제품군 (instance type, instance family)

- 출처: https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html
- 가져온 사실: 인스턴스를 시작할 때 지정하는 인스턴스 유형이 그 인스턴스가 쓰는 호스트 컴퓨터의 하드웨어를 정한다. 유형마다 컴퓨팅·메모리·
  스토리지 능력이 다르고, 이 능력에 따라 인스턴스 제품군으로 묶인다. 유형은 실행할 애플리케이션의 요구에 맞춰 고른다. 현재 세대의 분류는
  범용, 컴퓨팅 최적화, 메모리 최적화, 스토리지 최적화, 가속 컴퓨팅, 고성능 컴퓨팅이다.
- 출처: https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html
- 가져온 사실: 가속 컴퓨팅 인스턴스는 하드웨어 가속기(보조 프로세서)로 부동소수점 계산·그래픽 처리 같은 일을 CPU에서 도는 소프트웨어보다
  효율적으로 한다. GPU 인스턴스 제품군(G·P 계열 등)이 이 분류에 든다.
- 이 파일을 근거로 쓰지 않는 것: 제품군별 유형 이름 목록, 버스트 가능 성능·Flex 인스턴스, 공유 자원의 배분 방식, 이전 세대 유형.

### RDS 자동 백업과 DB 스냅샷

- 출처: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html
- 가져온 사실: RDS는 DB 인스턴스의 백업 기간에 자동 백업을 만들고 저장한다. 개별 데이터베이스가 아니라 DB 인스턴스 전체를 스토리지 볼륨
  스냅샷으로 백업하고, 지정한 보존 기간에 따라 보관하며, 그 기간 안의 어느 시점으로든 인스턴스를 복구할 수 있다. DB 스냅샷을 만들어 수동으로도
  백업할 수 있다. 자동 스냅샷과 수동 스냅샷은 모두 복사할 수 있다. DB 스냅샷(수동·최종)은 자동 백업과 따로 관리되므로 인스턴스를 지워도
  수동 스냅샷은 지워지지 않는다.
- 이 파일을 근거로 쓰지 않는 것: 백업 기간 설정 방법, 백업 스토리지 요금, 증분 스냅샷 방식, 리전당 수동 스냅샷 수 한도, 인스턴스 상태에 따른
  백업 조건, 인스턴스 삭제 시 자동 백업 보존 선택지.

### 재해 복구 전략 (disaster recovery options)

- 출처: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
- 가져온 사실: AWS의 재해 복구 전략은 크게 넷이고, 비용과 복잡도가 낮은 백업부터 여러 리전을 동시에 쓰는 복잡한 전략까지 이어진다. 백업 및
  복원은 데이터를 백업해 두고 재해가 나면 복구 리전에 인프라·구성·코드를 다시 배포한다. 파일럿 라이트는 데이터를 다른 리전에 복제하고
  데이터베이스·객체 스토리지 같은 핵심 인프라는 항상 켜 두며, 애플리케이션 서버는 꺼 두었다가 필요할 때 켠다. 웜 스탠바이는 규모만 줄인, 완전히
  동작하는 운영 환경 복사본을 다른 리전에서 계속 실행하므로 곧바로 트래픽을 받고 규모만 늘리면 된다(파일럿 라이트는 추가 조치 없이는 요청을
  처리하지 못한다는 점이 다르다). 다중 사이트 액티브-액티브는 여러 리전에서 동시에 워크로드를 실행하며 가장 복잡하고 비싸지만 복구 시간을 0에
  가깝게 줄인다. 어느 방식을 고를지는 RTO와 RPO 요구가 정한다.
- 이 파일을 근거로 쓰지 않는 것: 데이터 플레인·컨트롤 플레인 구분, 핫 스탠바이, 읽기·쓰기 전략(write global 등), 서비스별 구현 방법,
  Application Recovery Controller.

### EC2 배치 그룹 (placement group)

- 출처: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
- 가져온 사실: 서로 의존하는 EC2 인스턴스 묶음을 배치 그룹에 넣어 그 배치에 영향을 줄 수 있다. 전략은 클러스터(한 가용 영역 안에 인스턴스를
  가깝게 모아 HPC의 노드 간 통신 지연을 낮춘다), 파티션(인스턴스를 논리적 파티션으로 나눠 파티션끼리 기본 하드웨어를 공유하지 않게 한다.
  Hadoop·Cassandra·Kafka 같은 대규모 분산·복제 워크로드에 쓴다), 분산(소수의 인스턴스를 서로 다른 기본 하드웨어에 엄격하게 흩어 동시 장애를
  줄인다) 등이다. 배치 그룹은 선택 사항이고, 쓰지 않으면 EC2가 동시 장애를 줄이도록 인스턴스를 하드웨어에 흩어 놓으려 한다. 배치 그룹을 만드는
  데는 요금이 없고, 인스턴스는 한 번에 한 배치 그룹에만 들어간다.
- 이 파일을 근거로 쓰지 않는 것: Precision time 전략, 배치 그룹 병합 불가, 용량 예약·전용 호스트·스팟 관련 규칙, 공유 배치 그룹, Outposts.

## Web ACL·규칙·기본 동작 (AWS WAF)

확인한 날: 2026-10-14. 사용자가 "web acl에 대한 설명이 있나?"라고 물었다. 데이터는 `Web ACL`을 개념 넷과 해설 열 곳에서 쓰지만, 그것이
무엇인지 말하는 문장은 `security-groups-nacl.web-acl-vs-nacl`의 한 문장(WAF의 규칙 묶음)뿐이고 WAF의 기본 개념에는 없다. 두 원본과 덤프
해설도 "WAF에서만 쓰는, 웹 요청의 허용·차단을 판단하는 접근 제어"까지만 말한다. 「본문 크기 한도」의 "우선순위가 앞선 규칙으로 허용한다"와
「규칙 종류」의 "매장 IP만 허용"은 규칙 평가 순서와 기본 동작을 알아야 읽히는데, 그 설명도 없다(ADR-039 「2026-10-14 확장」).

- 출처: https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html
- 가져온 사실: WAF로 리소스를 보호하려면 Web ACL을 만들어 보호할 리소스에 연결한다. 연결된 리소스는 들어오는 요청을 WAF에 넘겨 그 Web ACL로
  검사받는다. Web ACL이 무엇을 막을지는 규칙으로 정한다. 규칙 하나는 요청을 검사할 기준과, 기준에 맞는 요청에 할 동작(허용·차단 등)을 함께
  담는다. 규칙은 Web ACL 안에 직접 정의하거나, 다시 쓸 수 있는 규칙 그룹(AWS 관리형 규칙 그룹 포함)으로 넣는다.
- 출처: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-processing-order.html
- 가져온 사실: Web ACL 안의 규칙에는 서로 다른 숫자 우선순위를 준다. WAF는 우선순위 숫자가 낮은 규칙부터 평가하고, 평가를 끝내는 동작이 걸리거나
  규칙을 다 볼 때까지 이어 간다.
- 출처: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-default-action.html
- 가져온 사실: Web ACL에는 기본 동작을 반드시 정한다. 기본 동작은 어느 규칙에서도 평가를 끝내는 동작이 걸리지 않은 요청에 적용되고, 값은
  허용(Allow)과 차단(Block) 가운데 하나다. 대부분의 요청을 들이고 특정 요청만 막으려면 기본 동작을 허용으로 두고 막을 요청을 규칙으로 적는다.
  대부분을 막고 특정 IP 등에서 온 요청만 들이려면 기본 동작을 차단으로 두고 들일 요청을 규칙으로 적는다.
- 이 파일을 근거로 쓰지 않는 것: 콘솔의 새 이름 「protection pack(web ACL)」(기능은 같고 API와 시험은 web ACL이라 부른다), Count·CAPTCHA·
  Challenge 동작, 규칙 그룹 동작의 재정의, WCU와 요금, 리소스 하나에 Web ACL 하나만 연결된다는 제약, 리전 Web ACL과 CloudFront용 글로벌
  Web ACL(us-east-1)의 구분, 연결할 수 있는 리소스 전체 목록, 변경 전파 지연.
- 쓰인 곳: `waf-shield.waf`의 넷째·다섯째 문단. 다른 주제에서 처음 나오는 두 자리(`elastic-load-balancing.alb-routing-conditions`,
  `identity-federation.cognito-social-idp-federation`)의 "규칙을 담은 Web ACL"은 이 절의 사실을 한 구절로 줄인 것이다(ADR-029).

## 목록 항목의 영문 이름 (ADR-046, phase 57)

개념 본문의 목록 항목 가운데 이름이 한국어인 것에 붙인 영문 이름의 근거다(ADR-039 「2026-10-13 확장」). **이름 표기만** 가져온다. 이 절을
근거로 항목의 동작·사양·제약을 쓰지 않는다. 확인한 날: 2026-10-13.

표기 규칙: 문서는 복수형(On-Demand Instances)이나 문장 속 소문자(compliance mode)로 쓰지만, 이 앱의 기존 괄호 영문(Standard Queue,
Simple Routing)에 맞춰 단수·Title Case로 쓴다. 파일 게이트웨이는 별도 개념인 FSx File Gateway와 갈리도록 S3를 붙인다(문서 이름은 Amazon
S3 File Gateway, 덤프 원문 Q252는 S3 File Gateway). Lambda 호출 유형은 Invoke API `InvocationType`의 값 그대로 코드 표기로 쓴다.

| 개념 | 한국어 이름 → 영문 이름 | 출처 |
|---|---|---|
| storage-gateway-migration.storage-gateway | 파일 게이트웨이 → S3 File Gateway, 볼륨 게이트웨이 → Volume Gateway, 테이프 게이트웨이 → Tape Gateway | https://docs.aws.amazon.com/storagegateway/ |
| ec2-autoscaling.ec2, ec2-autoscaling.ec2-purchase-options | 온디맨드 인스턴스 → On-Demand Instance, 스팟 인스턴스 → Spot Instance, 예약 인스턴스 → Reserved Instance | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html |
| ebs-instance-store.placement-groups | 클러스터 → Cluster, 파티션 → Partition, 분산 → Spread | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html |
| ebs-instance-store.ebs-volume-type-names | 범용 SSD → General Purpose SSD, 프로비저닝된 IOPS SSD → Provisioned IOPS SSD, 처리량 최적화 HDD → Throughput Optimized HDD, 콜드 HDD → Cold HDD | https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html |
| backup-disaster-recovery.dr-strategies | 백업 및 복원 → Backup and Restore, 파일럿 라이트 → Pilot Light, 웜 스탠바이 → Warm Standby, 다중 사이트 액티브-액티브 → Multi-site Active/Active | https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html |
| s3-versioning-lifecycle.object-lock | 거버넌스 모드 → Governance Mode, 규정 준수 모드 → Compliance Mode | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html |
| lambda.lambda-invocation-types | 이벤트 호출 → `Event`, 요청-응답 → `RequestResponse` | https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html |
| governance-iac.control-tower-controls | 사전 예방적 제어 → Proactive Control, 탐지 제어 → Detective Control | https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html |
| iam-permissions.iam-policy | 자격 증명 기반 정책 → Identity-based Policy, 리소스 기반 정책 → Resource-based Policy | https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html |
| rds-storage-features.rds-backups | 자동 백업 → Automated Backup, DB 스냅샷 → DB Snapshot | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.BackupRestore.html |
| ecs-eks-fargate.ecs-task-role-vs-task-execution-role | 태스크 실행 역할 → Task Execution Role, 태스크 역할 → Task Role | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html, https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html |
| waf-shield.cloudfront | 캐시 무효화 → Invalidation | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html |

영문을 붙이지 않은 것: 멀티 오리진(공식 문서에 딱 맞는 단일 기능명이 없다), 이름이 이미 영문이거나 영문이 이미 붙어 있던 항목.

## 태스크 정의·태스크·서비스, 파드·노드 (Amazon ECS·Amazon EKS)

확인한 날: 2026-10-15. 사용자가 "EKS에서 파드가 뭔지 ECS에서 태스크가 뭔지 잘 모르겠다"고 했다. 데이터는 `ecs-eks-fargate` 주제의 개념 아홉에서
`태스크`를, 개념 넷에서 `파드`와 `노드`를 쓴다. 그런데 무엇인지 말하는 문장은 없다. `태스크 정의`와 `서비스`, `서비스 스케줄러`도 마찬가지다. 두 원본과
덤프 해설도 이 말을 쓰기만 한다(ADR-039 「2026-10-15 확장」).

- 출처: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html
- 가져온 사실: 태스크 정의는 애플리케이션의 설계도다. 애플리케이션을 이루는 컨테이너 하나 이상과 그 파라미터를 적은 JSON 텍스트 파일이다.
  컨테이너마다 쓸 이미지, 태스크나 컨테이너에 줄 CPU·메모리, 네트워크 모드, 로그 설정, 볼륨, 태스크가 쓸 IAM 역할 등을 지정한다. 태스크는
  태스크 정의를 클러스터 안에서 실제로 실행한 인스턴스이고, 실행할 태스크의 수를 정할 수 있다. 서비스는 원하는 수의 태스크를 동시에 실행하고
  유지한다. 태스크가 실패하거나 멈추면 서비스 스케줄러가 같은 태스크 정의로 새 태스크를 시작해 그 수를 맞춘다.
- 출처: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/application_architecture.html
- 가져온 사실: 여러 종류의 애플리케이션 컨테이너를 한 태스크 정의에 묶으면 그 컨테이너들을 따로 확장할 수 없다. 그러면 모든 태스크가 웹
  컨테이너와 API 컨테이너를 같은 수로 실행한다. 그래서 확장 양상이 다른 웹 사이트와 API는 태스크 정의를 나눈다. 태스크 정의에 적는 용량이 태스크가
  올라갈 인프라를 정한다.
- 출처: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html
- 가져온 사실: 서비스는 로드 밸런서 뒤에 둘 수 있고, 그러면 로드 밸런서가 그 서비스의 태스크들로 트래픽을 나눈다.
- 출처: https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-concepts.html
- 가져온 사실: 파드는 쿠버네티스에서 배포하는 가장 작은 단위이고 보통 컨테이너 하나를 담는다. 단단히 결합된 컨테이너는 한 파드에 여럿 넣을 수 있다.
  웹 서버 컨테이너와, 로그를 모으는 사이드카 컨테이너가 그 예다. 그러면 두 컨테이너는 늘 같은 노드에서 실행된다. 한 파드의 컨테이너들은 같은
  환경을 공유하므로 IP 주소 하나를 함께 쓰고, 서로를 자기 localhost처럼 부른다. 클러스터는 클러스터를 관리하는 컨트롤 플레인과, 실제 워크로드가
  도는 워커 노드(노드)로 나뉜다. EKS는 컨트롤 플레인을 관리하고, 클러스터를 만들 때 EC2 인스턴스를 노드로 할당한다. 파드를 어느 노드에서
  실행할지는 컨트롤 플레인의 스케줄러가 고른다.
- 직접 견준 문장: 본문의 "파드는 ECS의 태스크에 해당한다"는 위 두 정의를 나란히 놓은 것이다. 태스크는 태스크 정의대로 시작한 실행 단위이고, 파드는
  컨테이너를 담아 배포하는 가장 작은 단위다. 두 서비스를 직접 견주는 공식 문장을 근거로 한 것이 아니다.
- 이 파일을 근거로 쓰지 않는 것: 태스크 정의 패밀리와 리비전, 시작 유형·용량 공급자의 세부, 서비스의 원하는 수·최대 비율 파라미터와 상태 검사 교체
  규칙, 서비스 재시작 스로틀, Service Connect·서비스 검색, 쿠버네티스의 디플로이먼트·스테이트풀셋·데몬셋·잡, 쿠버네티스 Service·Ingress 객체,
  kubelet·kube-proxy·etcd 같은 구성 요소.
- 쓰인 곳: `ecs-eks-fargate.ecs`의 셋째·넷째 문단과 `ecs-eks-fargate.eks`의 셋째·넷째 문단. `lambda.lambda-container-image` 둘째 문단의 "컨테이너를
  어떤 설정으로 실행할지 적는 태스크 정의, 태스크를 정한 수만큼 유지하는 서비스"는 이 절의 사실을 한 구절로 줄인 것이다. Lambda 주제에서 이 두 말이 처음
  나오는 자리라서다(ADR-029).

## 액세스 키의 비활성화와 삭제 (IAM)

확인한 날: 2026-10-19. 데이터는 "액세스 키에는 만료 시점이 없다"와 함께 "유출되면 회수할 방법이 없다"고 썼다. 앞의 것은 문서와 맞고 뒤의 것은
어긋난다(ADR-039 「2026-10-19 확장」).

- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- 가져온 사실: 액세스 키는 IAM 사용자(또는 루트 사용자)의 장기 자격 증명이다. 모범 사례는 액세스 키 같은 장기 자격 증명을 만드는 대신 IAM 역할
  같은 임시 자격 증명을 쓰는 것이다.
- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/access-keys-admin-managed.html
- 가져온 사실: IAM 관리자는 사용자의 액세스 키를 비활성화하고 삭제할 수 있다. 비활성화한 키는 더는 API 호출에 쓸 수 없고, 필요하면 다시
  활성화할 수 있다. 삭제한 키는 되살릴 수 없다.
- 이 파일을 근거로 쓰지 않는 것: 사용자당 액세스 키 최대 개수, 키 교체 절차, 마지막 사용 시각 조회와 자격 증명 보고서, CloudTrail·CloudWatch
  모니터링 권고, 비밀 액세스 키는 만들 때만 볼 수 있다는 사실.
- 쓰인 곳: `iam-permissions.iam`의 둘째 문단, `iam-permissions.iam-user`의 첫 문단, q156·q157·q160의 해설.

## 컨테이너·컨테이너 이미지·레지스트리, 컨테이너 오케스트레이션·쿠버네티스

확인한 날: 2026-10-21. 사용자가 "나는 컨테이너나 쿠버네티스가 뭔지도 몰라"라고 했다. 데이터는 `ecs-eks-fargate` 주제의 개념 열 곳에서 `컨테이너`를, 일곱
곳에서 `쿠버네티스`를 쓰지만 무엇인지 말하는 문장이 없다(ADR-039 「2026-10-21 확장」, ADR-049). **이 절만 `docs.aws.amazon.com` 밖의 AWS 소개 페이지를
함께 근거로 쓴다.** 「무엇을 묶는가」와 「가상 머신과의 차이」가 소개 페이지에만 있어서 사용자가 인정했다.

- 출처: https://aws.amazon.com/what-is/containerization/ (AWS 소개 페이지)
- 가져온 사실: 컨테이너화는 애플리케이션 코드를 실행에 필요한 모든 파일·라이브러리와 함께 묶어 어떤 인프라에서도 실행되게 하는 것이다. 그래서 프로그램
  코드를 다시 쓰지 않고 여러 환경에 배포할 수 있다. 가상 머신이 하드웨어 층을 복제하는 것과 달리 컨테이너화는 자체 환경에서 운영 체제 층을 뺀다.
  컨테이너들은 같은 운영 체제를 함께 쓰고 가볍다. 컨테이너 이미지는 읽기 전용이다. 컨테이너 오케스트레이션은 컨테이너를 자동으로 시작·중지·관리하는
  기술이고, 쿠버네티스는 널리 쓰이는 오픈 소스 오케스트레이터다. Docker(Docker Engine)는 널리 쓰이는 오픈 소스 컨테이너 런타임이다.
- 출처: https://aws.amazon.com/docker/ (AWS 소개 페이지)
- 가져온 사실: Docker는 애플리케이션을 빌드·테스트·배포하는 소프트웨어 플랫폼이고, 소프트웨어를 표준화된 단위인 컨테이너로 묶는다. 그렇게 만든 것은 어디서나
  같은 방식으로 실행된다. 가상 머신은 서버 하드웨어를 가상화하고, 컨테이너는 서버의 운영 체제를 가상화한다. 이미지는 컨테이너를 정의하는 읽기 전용
  템플릿이고, 컨테이너는 실행 중인 이미지다.
- 출처: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html
- 가져온 사실: EC2 인스턴스는 AWS 클라우드의 가상 서버다.
- 출처: https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-concepts.html
- 가져온 사실: 컨테이너 이미지는 소프트웨어 꾸러미이고, 컨테이너는 그 이미지를 실행한 인스턴스다. 컨테이너를 만들 때는 보통 Dockerfile에서 시작하며, 바탕
  이미지, 설치할 것, 시작할 때 실행할 명령을 적는다. 로컬 컴퓨터에서 Docker로 컨테이너를 만들고 시험한다. 컨테이너 레지스트리는 이미지를 보관하고 나눠 주는
  중심 장소이고, 실행할 노드는 레지스트리에서 이미지를 내려받아(pull) 실행한다. 쿠버네티스는 컨테이너 오케스트레이션 도구다. 여러 머신에 애플리케이션을
  배포하고, 컨테이너 상태를 살펴 실패한 컨테이너를 다시 시작하고, 부하에 따라 늘리고 줄이고, 머신 사이에 트래픽을 나눈다. 선언해 둔 클러스터 상태와 실제
  상태가 맞는지 계속 확인해 맞춘다. EKS는 오픈 소스 쿠버네티스 프로젝트를 기반으로 한 AWS 관리형 서비스다. 쿠버네티스 소스 코드는 공개되어 있어 자기 장비에
  직접 설치해 관리할 수 있고, 애플리케이션은 온프레미스와 여러 클라우드의 클러스터에 배포될 수 있다.
- 출처: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html
- 가져온 사실: ECS는 컨테이너화된 애플리케이션을 배포·관리·확장하는 완전 관리형 컨테이너 오케스트레이션 서비스다.
- 출처: https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html
- 가져온 사실: ECR은 AWS의 관리형 컨테이너 이미지 레지스트리 서비스이고, 원하는 명령줄 도구로 이미지를 올리고(push) 내려받는다(pull).
- 이 파일을 근거로 쓰지 않는 것: 커널을 공유한다는 표현(읽은 페이지 어디에도 없다), 이미지 레이어, 컨테이너 런타임의 종류(containerd·podman·nerdctl 등),
  쿠버네티스 객체(Deployment·Service·Ingress 등)와 kubectl·kind·minikube·kubeadm, Docker Hub·Red Hat Quay의 세부, 레지스트리 안의 리포지토리 정의(위 페이지들에는
  없다 — 아래 「ECR의 레지스트리와 리포지토리」 절에서 다른 페이지로 찾았다), 「이미지 하나로 컨테이너를 여럿 띄운다」(태스크 정의·파드 템플릿의 구조로만
  짐작되고 문장으로 확인하지 못했다), Docker를 「컨테이너를 위한 운영 체제」라고 부르는 비유, EKS Hybrid Nodes.
- 쓰인 곳: 새 개념 `ecs-eks-fargate.container`의 네 문단과 `ecs-eks-fargate.container-orchestration`의 세 문단, 새 문항 q740·q741과 그 해설.
- 쓰인 곳(2026-10-21 후속, ADR-049): 다른 주제 여덟에서 `컨테이너`·`컨테이너 이미지`·`쿠버네티스`·`도커`가 처음 나오는 개념에 붙인 한 문장 풀이는 이 절의
  사실을 줄인 것이다(ADR-029). `data-transfer-services.snowball-edge-compute`, `storage-gateway-migration.application-migration-service`,
  `ec2-autoscaling.gpu-instance-family`(컨테이너화·오케스트레이션 포함), `cloudfront-global-accelerator.cloudfront-reduces-data-transfer-cost`,
  `lambda.lambda-container-image`, `kinesis-streaming.kinesis-client-library`, `cloudwatch-xray.cloudwatch-container-insights`(클러스터 포함),
  `guardduty-macie-inspector.inspector-scans-ecr-images`.

## ECR의 레지스트리와 리포지토리 (Amazon ECR)

확인한 날: 2026-10-21. `ecs-eks-fargate.ecr-image-scan-on-push`가 "리포지토리에 올라오는 새 이미지"라고 쓰지만 리포지토리가 무엇인지 말하는 문장이 없다.
위 절을 쓸 때는 `what-is-ecr.html`만 읽어 정의를 찾지 못했다(ADR-049 「남겨 둔 것」). 리포지토리·레지스트리 페이지에 있었다.

- 출처: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html
- 가져온 사실: AWS 계정마다 기본 프라이빗 ECR 레지스트리가 하나 주어진다. 프라이빗 레지스트리로 Docker·OCI 이미지의 프라이빗 이미지 리포지토리를 관리한다.
- 출처: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html
- 가져온 사실: ECR 프라이빗 리포지토리는 Docker 이미지, OCI 이미지와 OCI 호환 아티팩트를 담는다. 계정은 기본 레지스트리의 리포지토리들에 읽기·쓰기 권한을 갖는다.
- 출처: https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html
- 가져온 사실: 리포지토리마다 푸시 시 스캔을 설정할 수 있다.
- 이 파일을 근거로 쓰지 않는 것: OCI 아티팩트의 종류, 리포지토리 정책·수명 주기 정책, 레지스트리 복제(리전 간·계정 간), 퍼블릭 레지스트리, 기본 스캔의
  리포지토리 필터.
- 쓰인 곳: `ecs-eks-fargate.ecr-image-scan-on-push`의 첫 문단 마지막 문장.

## IAM Roles Anywhere와 AWS CLI의 외부 자격 증명 프로세스

확인한 날: 2026-10-21. 사용자가 `identity-federation.sts-assume-role`의 「STS로 역할을 맡아 임시 자격 증명을 받는다」를 이해하려고 19단계 절차를 정리해 와서
공식 문서와 대조해 달라고 했다(ADR-039 「2026-10-21 확장 — IAM Roles Anywhere」, ADR-050). 아래는 대조에 쓴 문서와 가져온 사실이다.

- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html
- 가져온 사실: AWS 밖에서 도는 서버·컨테이너·애플리케이션이 IAM 임시 자격 증명을 받게 해 주고, 그 워크로드에 장기 자격 증명을 둘 필요가 없게 한다. 회사
  인증 기관이 발급한 X.509 인증서를 쓰고, 그 인증 기관을 신뢰 앵커로 등록한다. 신뢰 앵커는 AWS Private CA나 외부 인증 기관의 인증서를 가리킨다. 역할이
  IAM Roles Anywhere 서비스 주체를 신뢰해야 IAM Roles Anywhere가 그 역할을 맡아 임시 자격 증명을 내준다. 프로필은 IAM Roles Anywhere가 맡을 역할을
  지정한다. 모든 리소스는 리전 단위이고 같은 계정·같은 리전에 있어야 함께 쓴다.
- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/getting-started.html
- 가져온 사실: 외부 인증 기관을 쓰려면 신뢰 앵커를 만들 때 외부 인증서 번들(External certificate bundle)을 고르고 인증 기관 인증서 본문을 PEM 형식으로
  붙여 넣는다. 공인 인증 기관의 인증서는 신뢰 앵커로 쓸 수 없다. 역할의 신뢰 정책에 `rolesanywhere.amazonaws.com`을 넣고 `sts:AssumeRole`·
  `sts:TagSession`·`sts:SetSourceIdentity`를 허용한다. 조건이 없으면 그 인증 기관(과 그 아래 인증 기관)이 발급한 유효한 인증서는 무엇이든 역할을 맡을 수
  있어서 주체·발급자 조건이 권장된다. 프로필을 만들 때 그 역할을 고른다.
- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/trust-model.html
- 가져온 사실: 요청의 서명을 인증서의 키 종류에 맞는 알고리즘으로 먼저 검증하고, 그다음 인증서가 신뢰 앵커로 등록한 인증 기관이 발급한 것인지 확인한다.
  인증에 쓰는 인증서는 X.509 v3이고, 기본 제약의 `CA` 값이 있으면 false, 키 용도에 Digital Signature, 서명 알고리즘은 SHA256 이상이다(MD5·SHA1 거부).
  신뢰 앵커로 쓰는 인증서는 키 용도에 Certificate Sign, 기본 제약에 `CA: true`다. 신뢰 정책에 `aws:SourceArn`(신뢰 앵커 ARN)과 인증서 주체 조건
  (`aws:PrincipalTag/x509Subject/CN` 등)을 거는 것이 권장된다.
- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-sign-process.html
- 가져온 사실: 서명 과정은 SigV4와 같고, 서명은 인증서의 개인키로 만든다. 인증서는 `X-Amz-X509` 헤더로 보낸다. 개인키 자체는 요청에 들어가지 않는다.
- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html
- 가져온 사실: CreateSession 요청에는 프로필 ARN·역할 ARN·신뢰 앵커 ARN이 들어간다. CreateSession은 AssumeRole을 X.509로 감싼 것이고, AssumeRole이 내준
  임시 자격 증명을 IAM Roles Anywhere가 바꾸지 않고 그대로 넘긴다. 자격 증명은 액세스 키 ID·비밀 액세스 키·세션 토큰·만료 시각이다.
- 출처: https://docs.aws.amazon.com/rolesanywhere/latest/userguide/credential-helper.html
- 가져온 사실: IAM Roles Anywhere가 제공하는 credential helper(`aws_signing_helper`)가 인증서로 서명을 만들어 임시 자격 증명을 받아 오고, 표준 JSON
  (Version·AccessKeyId·SecretAccessKey·SessionToken·Expiration)으로 돌려준다. `credential-process` 명령에는 `--certificate`·`--private-key`·
  `--trust-anchor-arn`·`--profile-arn`·`--role-arn`이 필요하다. 운영 체제별 파일을 이 페이지에서 내려받는다. AWS CLI에서는 `config` 파일의 프로필에
  `credential_process`로 이 명령을 적고 `region`을 함께 적는다. ARN 꼴: `arn:aws:rolesanywhere:리전:계정:trust-anchor/…`,
  `arn:aws:rolesanywhere:리전:계정:profile/…`, `arn:aws:iam::계정:role/…`. `credential-process`는 AWS CLI가 명령마다 부른다.
- 출처: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sourcing-external.html
- 가져온 사실: `credential_process`는 `config` 파일의 프로필에 적는다. 경로에 `~`나 환경 변수를 쓰지 말고 전체 경로를 쓴다. AWS CLI는 외부 프로세스의 출력
  JSON을 읽고, Expiration이 있으면 임시 자격 증명으로 보고 만료 전에 명령을 다시 실행해 갱신한다. AWS CLI는 외부 프로세스 자격 증명을 assume-role처럼
  캐시하지 않는다. `config` 파일과 관련 파일을 보호하라고 경고한다.
- 출처: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
- 가져온 사실: AssumeRole은 IAM 사용자나 역할이 부르는 API다 — 같은 계정의 사용자가 역할을 맡으려면 그 사용자에게 AssumeRole을 부를 권한을 주거나 역할의
  신뢰 정책에 그 사용자를 주체로 넣는다. 요청은 호출자의 자격 증명으로 서명한다. 신뢰 정책은 누가 역할을 맡을 수 있는지, 권한 정책은 역할로 무엇을 할 수
  있는지 정한다. 개념 본문의 「AssumeRole은 원래 이미 AWS 자격 증명을 가진 쪽이 호출하는 기능이다」는 이 사실을 줄인 것이다.
- 출처: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html
- 가져온 사실: 버킷 안 객체에 대한 동작(PutObject 등)은 리소스를 `arn:aws:s3:::버킷이름/*`로 적는다.
- 일반 IT 용어(ADR-010 예외, 이 파일의 근거가 아니다): OpenSSL, 인증 기관(CA), 개인키·공개키, 인증서, 인증서 서명 요청(CSR), 자체 서명 인증서, 디지털 서명.
- 이 파일을 근거로 쓰지 않는 것: 세션 정책, 인증서 해지 목록(CRL), 소스 아이덴티티 규칙, `update`·`serve` 명령과 OS 인증서 저장소·PKCS#11·TPM,
  세션 기간의 범위(900~43200초)와 역할의 최대 세션 기간, AWS Private CA로 인증 기관을 만드는 법, OpenSSL 명령줄.
- 쓰인 곳: 새 개념 `identity-federation.iam-roles-anywhere`의 본문과 단계 그림 19장, 새 문항 q742와 그 해설.
