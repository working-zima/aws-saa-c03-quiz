# Secrets Manager·Parameter Store·KMS·ACM·CloudHSM

`secrets-encryption` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 20개 · keep 19 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 17 · false 3 · duplicateOf 2
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 19 · 2A 0 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | secrets-manager | 애플리케이션의 민감한 자격 증명 같은 비밀값을 안전하게 보관하는 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 2 | secrets-manager-batch-get-secret-value | Secrets Manager의 BatchGetSecretValue로 여러 비밀값을 한 번에 읽을 수 있으며 이름에 Batch가 있어도 별도 배치 컴퓨팅은 필요하지 않음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | parameter-store | 애플리케이션의 설정값과 비밀값을 안전하게 보관하며 상대적으로 덜 민감한 설정을 관리하는 저장 수단의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 4 | secrets-manager-vs-parameter-store | Secrets Manager와 Parameter Store가 모두 값을 안전하게 보관하지만 자격 증명의 자동 교체 요구가 있으면 Secrets Manager를 선택해야 함을 이해한다. | keep | — | true | (현재) | rotation-heuristic | 2 | ① |
| 5 | rotation-heuristic | 자격 증명을 주기적으로 자동 교체하려면 비밀값의 저장이나 암호화 키 교체와 구분해 Secrets Manager의 순환 기능을 선택해야 함을 이해한다. | keep | — | true | (현재) | secrets-manager-vs-parameter-store | 1 | ① |
| 6 | kms | KMS가 관리하는 대상은 비밀값이나 설정값이 아니라 암호화 키이며 키의 주기적 교체도 그 관리 범위에 속함을 이해한다. | keep | — | true | (현재) | — | 3 | ① |
| 7 | kms-key-types-by-management | KMS 키의 관리 주체에 따라 고객이 정책과 교체 주기를 통제할 수 있는 범위가 달라짐을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | kms-multi-region-key | KMS 다중 리전 키를 이용하면 리전이 달라도 같은 논리적 키로 암호화·복호화하면서 키 복제와 가용성 관리를 맡길 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | kms-key-per-tenant | 고객별로 암호화와 접근 범위를 분리하려면 KMS 키도 고객별로 나누고 각 키 정책과 사용 기록을 관리 단위로 삼아야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | kms-imported-key-material | KMS에 외부 키 자료를 가져오면 원본 보관과 재등록 책임이 사용자에게 남으므로 관리 부담을 줄이는 요구와 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | kms-automatic-key-rotation | KMS가 생성한 키 자료의 자동 교체는 키 ID와 ARN을 유지하므로 사용하는 리소스를 고치지 않고 정기 교체를 수행할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | kms-symmetric-vs-asymmetric-rotation | KMS의 자동 교체를 선택할 때 대칭 고객 관리 키의 지원 범위를 확인하고 비활성화·삭제와 봉투 암호화의 성격을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | imported-key-material-rotation | 가져온 키 자료의 교체에서는 기존 KMS 키의 식별자를 유지하는 재등록과 키를 삭제해 새로 만드는 일을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 14 | lambda-env-var-kms | KMS로 비밀값의 열람을 제한하는 것과 Secrets Manager로 자격 증명을 자동 교체하는 것은 서로 다른 요구임을 Lambda 환경 변수 사례로 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | cloudhsm | 전용 하드웨어 키 보안이 필요한 경우와 KMS로 충분한 경우를 구분해 CloudHSM의 비용과 관리 부담을 판단해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | kms-cloudhsm-key-store | 전용 하드웨어에 키를 보관하면서 KMS를 사용하는 서비스의 저장 중 암호화와 연결하려면 CloudHSM이 뒷받침하는 KMS 키가 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | acm | HTTPS 통신 상대를 증명하는 인증서의 발급과 갱신을 관리하는 서비스의 역할을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
| 18 | acm-dns-validation | ACM의 도메인 소유 검증 방식을 고르는 일이 인증서 갱신의 자동화 여부도 결정하므로 DNS 검증과 이메일 승인을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | acm-cloudfront-region | CloudFront에 사용할 ACM 인증서는 오리진의 위치와 별개로 us-east-1에서 발급해야 한다는 사용 제약을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | acm-expiration-event | ACM이 제공하는 인증서 만료 임박 이벤트를 사람에게 전달할 알림으로 연결하면 만료 날짜를 반복 조회하는 코드를 줄일 수 있음을 이해한다. | ambiguous | — | true | (현재) | — | 1 | hold |
