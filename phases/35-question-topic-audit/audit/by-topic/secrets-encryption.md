# Secrets Manager·Parameter Store·KMS·ACM·CloudHSM

`secrets-encryption` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 23개 · keep 22 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 23 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 1개 — q465(`elastic-load-balancing`)

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q138 | secrets-manager | keep | — | yes | (현재) | (현재) | false | 보안에 치명적인 자격 증명 같은 비밀값을 맡는 것은 Secrets Manager이고, Parameter Store는 덜 민감한 설정값, KMS는 암호화 키, ACM은 인증서를 다룬다. |
| q139 | parameter-store | keep | — | yes | (현재) | (현재) | false | 보안에 치명적이지 않은 설정값을 두는 주 용도는 Systems Manager Parameter Store이고, 자동 순환이 붙은 Secrets Manager는 치명적인 비밀값 쪽이다. |
| q140 | secrets-manager-vs-parameter-store | keep | — | yes | (현재) | (현재) | false | 설정값·비밀값을 보관하는 두 서비스 중 저장한 암호 값을 주기적으로 자동 교체하는 순환 기능은 Secrets Manager에만 있다. |
| q141 | kms | keep | — | yes | (현재) | (현재) | false | 암호화에 쓸 키를 만들고 보관하는 서비스는 KMS이고, Secrets Manager·Parameter Store는 값을, ACM은 인증서를 다룬다. |
| q142 | kms | keep | — | yes | (현재) | (현재) | false | KMS가 저장하고 관리하는 대상은 암호화 키이며, 애플리케이션 비밀값이나 SSL/TLS 인증서가 아니다. |
| q143 | acm | keep | — | yes | (현재) | (현재) | false | SSL/TLS 인증서의 발급과 갱신을 맡는 서비스는 ACM이고, KMS는 키·Secrets Manager는 비밀값·IAM은 접근 권한을 다룬다. |
| q144 | secrets-manager-vs-parameter-store | keep | — | yes | (현재) | (현재) | false | Secrets Manager와 Parameter Store는 둘 다 설정값과 비밀값을 안전하게 저장한다는 점이 같고, 인증서 발급·키 관리·API 호출 기록은 다른 서비스의 일이다. |
| q145 | kms | keep | — | yes | (현재) | (현재) | false | 암호화 키 자체를 주기적으로 자동 교체하는 것은 KMS의 순환 기능이며, 값을 교체하는 Secrets Manager나 인증서를 갱신하는 ACM과 대상이 다르다. |
| q227 | acm-cloudfront-region | keep | — | yes | (현재) | (현재) | false | CloudFront에 붙일 ACM 인증서는 콘텐츠 버킷의 리전과 상관없이 us-east-1에서 발급해야 한다. |
| q228 | lambda-env-var-kms | keep | — | yes | (현재) | (현재) | false | Lambda 환경 변수를 KMS 키로 암호화하면 콘솔에서도 값이 가려지고 복호화 권한을 가진 사용자만 내용을 볼 수 있다. |
| q229 | cloudhsm | keep | — | yes | (현재) | (현재) | false | 전용 하드웨어 보안 모듈로 매우 높은 수준의 키 보안을 제공하는 것은 CloudHSM이고, 일반적인 암호화는 KMS로 충분하다. |
| q230 | rotation-heuristic | keep | — | yes | (현재) | (현재) | false | 며칠마다 비밀번호를 바꾸라는 요구는 자동 순환 신호이며, RDS와 통합돼 자격 증명 순환을 기본 제공하는 서비스는 Secrets Manager다. |
| q657 | kms-key-types-by-management | keep | — | yes | (현재) | (현재) | false | 키 정책과 교체 주기를 조직이 직접 정할 수 있는 KMS 키는 고객 관리 키뿐이며, AWS 관리 키·AWS 소유 키에는 그 통제권이 없다. |
| q658 | kms-multi-region-key | keep | — | yes | (현재) | (현재) | false | KMS 다중 리전 키는 여러 리전에 복제되면서 하나의 논리적 키로 취급되어 어느 리전에서든 같은 키로 암호화하고 복호화할 수 있다. |
| q659 | kms-imported-key-material | keep | — | yes | (현재) | (현재) | false | KMS에 외부 키 자료를 가져오면 그 원본을 안전하게 보관하고 필요할 때 다시 넣는 책임이 사용자에게 남는다. |
| q660 | kms-cloudhsm-key-store | keep | — | yes | (현재) | (현재) | false | 전용 하드웨어 보안 모듈에 키를 두면서 RDS 저장 중 암호화에 쓰려면 CloudHSM이 뒷받침하는 KMS 키를 만들어 암호화 키로 지정한다. |
| q661 | kms-key-per-tenant | keep | — | yes | (현재) | (현재) | false | 고객마다 데이터를 별도로 암호화하라는 규정은 고객별 KMS 키와 키 정책으로 충족하고, 키 사용 기록은 CloudTrail에 자동으로 남는다. |
| q662 | acm-dns-validation | keep | — | yes | (현재) | (현재) | false | ACM 인증서의 도메인 검증을 DNS로 하면 레코드가 남아 있는 한 갱신이 사람 개입 없이 이뤄지고, 이메일 검증은 갱신마다 승인이 필요하다. |
| q663 | secrets-manager-batch-get-secret-value | keep | — | yes | (현재) | (현재) | false | Secrets Manager의 BatchGetSecretValue는 시크릿 여러 개를 한 번의 호출로 돌려주므로 값마다 조회를 반복하거나 AWS Batch를 둘 필요가 없다. |
| q664 | kms-automatic-key-rotation | keep | — | yes | (현재) | (현재) | false | KMS가 만든 키 자료를 가진 고객 관리 키에 자동 교체를 켜면 해마다 새 키 자료가 생기고 키 ID·ARN이 유지돼 운영 부담이 가장 작다. |
| q665 | kms-symmetric-vs-asymmetric-rotation | keep | — | yes | (현재) | (현재) | false | KMS 자동 키 교체는 암호화와 복호화에 쓰는 대칭 고객 관리 키에서 지원되고, 서명용 비대칭 키는 교체 동작이 다르다. |
| q666 | imported-key-material-rotation | keep | — | yes | (현재) | (현재) | false | 가져온 키 자료를 쓰는 KMS 키는 자동 교체를 쓸 수 없고, 기존 키에 새 키 자료를 다시 가져오면 키 ID와 ARN이 유지돼 애플리케이션이 멈추지 않는다. |
| q667 | acm-expiration-event | ambiguous | — | yes | (현재) | (현재) | false | ACM이 인증서 만료 임박 이벤트를 발행하므로 EventBridge 규칙으로 잡아 이메일 구독이 붙은 SNS 주제로 보내면 폴링 함수나 큐 소비자 코드 없이 담당자에게 통보된다. |
