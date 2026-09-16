# EBS·인스턴스 스토어·스냅샷·배치 그룹

`ebs-instance-store` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 16개 · keep 16 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 16 · partial 0 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q040 | ebs | keep | — | yes | (현재) | (현재) | false | EBS는 외장 디스크를 꽂듯 EC2와 RDS에 블록 단위 저장 공간을 붙이는 서비스이고 그 둘 외에는 연결되지 않는다. |
| q041 | ebs | keep | — | yes | (현재) | (현재) | false | EBS는 가용 영역 하나 안에서 동작하며 연결 대상이 EC2와 RDS로 정해져 있다. |
| q044 | instance-store | keep | — | yes | (현재) | (현재) | false | 인스턴스 스토어는 EC2에 내장된 임시 디스크여서 인스턴스를 중지하거나 종료하면 저장된 데이터를 잃는다. |
| q175 | cluster-placement-group | keep | — | yes | (현재) | (현재) | false | 노드 사이의 네트워크 지연을 최대한 줄이려면 인스턴스를 같은 가용 영역의 가까운 하드웨어에 밀집 배치하는 클러스터 배치 그룹을 쓴다. |
| q176 | ebs-elastic-volumes | keep | — | yes | (현재) | (현재) | false | EBS Elastic Volumes는 볼륨이 연결된 상태 그대로 크기를 늘려 떼었다 붙이는 중단을 없앤다. |
| q284 | elastic-fabric-adapter | keep | — | yes | (현재) | (현재) | false | Elastic Fabric Adapter는 EC2의 운영체제 네트워크 스택을 우회해 HPC 노드 사이의 통신 지연을 줄이는 장치다. |
| q285 | ebs-volume-type-names | keep | — | yes | (현재) | (현재) | false | 프로비저닝된 IOPS SSD의 약칭은 io2이고 처리량 최적화 HDD의 약칭은 st1이다. |
| q286 | gp3-iops-independent-of-size | keep | — | yes | (현재) | (현재) | false | gp3는 볼륨 크기와 무관하게 16,000 IOPS까지 지정할 수 있고 gp2는 IOPS가 크기에 묶여 쓰지 않는 용량까지 잡아야 한다. |
| q287 | spread-placement-group | keep | — | yes | (현재) | (현재) | false | 두 인스턴스가 같은 물리 하드웨어에 놓이지 않게 하려면 분산 배치 그룹을 쓰고, 가용 영역 장애까지 견디려면 그 그룹을 여러 가용 영역에 걸쳐 쓴다. |
| q288 | io2-block-express-iops-ceiling | keep | — | yes | (현재) | (현재) | false | 볼륨 하나로 20만 IOPS 대와 1밀리초 미만 지연을 내는 구성은 io2 Block Express다. |
| q289 | ebs-encryption-by-default | keep | — | yes | (현재) | (현재) | false | 앞으로 만드는 볼륨이 빠짐없이 암호화되게 하는 것은 볼륨마다 거는 설정이 아니라 EC2 계정 속성의 EBS 기본 암호화다. |
| q290 | ebs-encryption-performance | keep | — | yes | (현재) | (현재) | false | 암호화한 EBS 볼륨도 암호화하지 않은 볼륨과 같은 IOPS를 내고 지연 차이도 미미하므로 성능 제약이 있어도 그대로 암호화한다. |
| q291 | ebs-recycle-bin | keep | — | yes | (현재) | (현재) | false | 삭제 권한을 그대로 두면서 지워진 스냅샷을 되살리려면 태그로 대상을 고르는 휴지통 보존 규칙을 만든다. |
| q292 | ebs-snapshot-block-public-access | keep | — | yes | (현재) | (현재) | false | 스냅샷을 공개로 공유하지 못하게 원천에서 막는 설정은 조직 수준에서 켜는 스냅샷 공개 액세스 차단이고, 찾아 알리거나 기록하는 감시 수단과 구분된다. |
| q293 | data-lifecycle-manager | keep | — | yes | (현재) | (현재) | false | 쌓이는 스냅샷을 사람 손 없이 계속 정리하려면 생성 일정과 보존 기간을 정의한 Amazon Data Lifecycle Manager 정책을 둔다. |
| q294 | ebs-fast-snapshot-restore | keep | — | yes | (현재) | (현재) | false | 스냅샷에서 만든 볼륨은 첫 접근마다 지연 초기화가 일어나므로 AMI가 쓰는 스냅샷에 빠른 스냅샷 복원을 켜면 인스턴스 시작이 빨라진다. |
