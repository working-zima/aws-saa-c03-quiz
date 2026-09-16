# EBS·인스턴스 스토어·스냅샷·배치 그룹

`ebs-instance-store` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 15개 · keep 12 · ambiguous 0 · move-recommended 3
- 이동 후보 비율 20.0% — `ebs-instance-store.cluster-placement-group` · `ebs-instance-store.spread-placement-group` · `ebs-instance-store.elastic-fabric-adapter`
- 이동 후보의 confidence high 2 · medium 1 · low 0
- serviceSpecificGoal true 15 · false 0 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 12 · 2A 0 · 2B 0 · 3 2 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ebs | EBS가 EC2와 RDS에 외장 디스크처럼 붙는 블록 스토리지이며 한 가용 영역 안에서 동작한다는 범위를 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 2 | ebs-elastic-volumes | EBS Elastic Volumes로 연결된 볼륨의 크기를 떼지 않고 늘릴 수 있어 스토리지 확장에 중단이 생기지 않는다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 3 | ebs-volume-type-names | EBS 볼륨 유형을 gp3·io2·st1·sc1 이름으로 구분하고, 일관된 IOPS가 필요한 데이터 볼륨만 io2로 두는 구성을 판단할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | gp3-iops-independent-of-size | gp3는 볼륨 크기와 별개로 16,000 IOPS까지 성능을 지정할 수 있어 gp2처럼 용량을 부풀리거나 io 계열로 가지 않아도 되는 경우를 판단할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 5 | io2-block-express-iops-ceiling | gp3 상한을 넘는 수십만 IOPS가 구체적 수치로 요구될 때 io2 Block Express가 필요하다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | ebs-encryption-by-default | 리전별 EC2 계정 속성에서 EBS 기본 암호화를 켜면 새 볼륨이 모두 암호화되고 암호화되지 않은 볼륨 생성이 막히므로, 사후 탐지 규칙과 달리 생성 시점에 강제된다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | ebs-encryption-performance | 성능 유지가 요구되는 EBS 볼륨에도 EBS 암호화를 적용할 수 있으며 애플리케이션 암호화를 따로 만들 필요가 없는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | ebs-recycle-bin | EBS 스냅샷 휴지통은 관리자 권한을 줄이지 않고 지워진 스냅샷을 보존 규칙 기간 동안 복구할 수 있게 하며 태그로 대상을 고른다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 9 | ebs-snapshot-block-public-access | EBS 스냅샷 공개 액세스 차단을 조직 수준에서 켜면 모든 구성원 계정의 공개 공유를 막으며 Config·CloudTrail 같은 감시 수단과 달리 차단한다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | data-lifecycle-manager | Amazon Data Lifecycle Manager가 정책으로 EBS 스냅샷을 만들고 보존 기간이 지난 것을 계속 지워 스냅샷 누적 비용을 줄인다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | ebs-fast-snapshot-restore | 스냅샷에서 만든 EBS 볼륨은 블록 첫 접근 때 지연 초기화가 일어나므로, 대용량 AMI의 시작 지연은 빠른 스냅샷 복원으로 스냅샷 쪽에서 해결해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | instance-store | 인스턴스 스토어는 EC2에 내장된 임시 디스크라 인스턴스를 중지·종료하면 데이터가 사라지므로 영구 저장소로 쓸 수 없다는 것을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 13 | cluster-placement-group | EC2 인스턴스를 가까운 하드웨어에 밀집 배치하는 클러스터 배치 그룹으로 노드 사이 지연을 낮추고 처리량을 높이며, HPC에서 고성능 스토리지와 함께 쓰인다는 것을 이해한다. | move-recommended | medium | true | ec2-autoscaling | — | 1 | hold |
| 14 | spread-placement-group | 분산 배치 그룹이 EC2 인스턴스를 서로 다른 하드웨어에 흩어 동시 장애를 줄이며, 여러 가용 영역과 함께 쓰면 하드웨어·가용 영역 장애를 함께 막는다는 것을 이해한다. | move-recommended | high | true | ec2-autoscaling | — | 1 | 3 |
| 15 | elastic-fabric-adapter | EFA는 운영체제 네트워크 스택을 건너뛰어 노드 간 통신 지연을 줄이는 EC2 네트워크 장치로, 향상된 네트워킹보다 한 단계 위이며 클러스터 배치 그룹과 짝을 이룬다는 것을 이해한다. | move-recommended | high | true | ec2-autoscaling | — | 1 | 3 |
