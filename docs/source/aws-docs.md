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
