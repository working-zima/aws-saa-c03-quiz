# EFS·FSx(Windows·Lustre·ONTAP)

`efs-fsx` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`·`audit/cross-phase35.jsonl`에서 만든 파일이다. 손으로 고치지 않는다.
전체 집계는 [report.md](../report.md), 수정 후보는 [handoff-fixes.md](../handoff-fixes.md).

- 개념 25개 · keep 25 · ambiguous 0 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- 이동 후보의 confidence high 0 · medium 0 · low 0
- serviceSpecificGoal true 24 · false 1 · duplicateOf 0
- 이 주제로 들어올 이동 후보 0개
- 교차 유형 ① 21 · 2A 3 · 2B 0 · 3 0 · 4 0 · hold 1

배열 순서는 `topics.json` 그대로다(ADR-033). 권장 주제가 현재와 같으면 `(현재)`로, 같은 주제의 개념은 주제 접두사를 떼고 적는다.

| 위치 | conceptId | learningGoal | fit | confidence | serviceSpecificGoal | 권장 주제 | duplicateOf | 문항 수 | 교차 유형 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | efs | 여러 컴퓨터와 가용 영역에서 파일을 함께 쓰는 EFS의 NFS 접근 방식과 범용 공유 스토리지로서의 역할을 이해한다. | keep | — | true | (현재) | — | 2 | 2A |
| 2 | efs-throughput-modes | EFS의 필요한 처리량이 저장량에 비례하는지에 따라 버스팅 모드와 별도 처리량을 지정하는 모드를 구분할 수 있음을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 3 | efs-elastic-throughput | 예측하기 어려운 EFS 부하에는 처리량을 자동 조절하는 Elastic 모드를 쓰며 파일 계층화와는 별도로 설정해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 4 | efs-performance-modes | EFS 성능 모드는 처리량을 지정하는 방식과 다른 설정이며 지연 시간과 대규모 동시 접근의 요구를 기준으로 골라야 함을 이해한다. | keep | — | true | (현재) | — | 2 | ① |
| 5 | efs-one-zone | 원본을 다시 만들 수 있는 NFS 데이터라면 EFS One Zone의 가용 영역 장애 위험을 감수하고 저장 비용을 낮출 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 6 | efs-posix-permissions | 기존 Linux 파일 동작과 소유자·그룹 권한을 유지해야 하는 애플리케이션의 공유 저장소로 EFS를 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 7 | efs-lifecycle-management | 자주 읽지 않는 EFS 파일도 즉시 접근해야 한다면 수명 주기 관리로 IA에 옮겨 접근성을 유지하면서 비용을 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 8 | efs-ia-file-size-threshold | EFS IA 전환의 비용 효과를 판단할 때 접근 빈도뿐 아니라 128KB 파일 크기 기준도 확인해야 함을 이해한다. | keep | — | true | (현재) | — | 2 | 2A |
| 9 | efs-lifecycle-transition-to-primary | EFS에서 IA로 옮긴 파일을 읽은 뒤 기본 계층으로 되돌리려면 IA 전환 규칙과 별도의 되돌리기 설정이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 10 | efs-mount-target-per-az | EFS 접근 지연과 가용 영역 간 전송을 줄이려면 클라이언트가 있는 각 가용 영역에 마운트 대상을 두고 같은 영역으로 연결해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 11 | efs-cross-account-mount | 다른 계정의 EFS를 복사하지 않고 함께 쓰려면 네트워크 경로·NFS 포트 허용·파일 시스템 접근 정책을 함께 갖춰야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 12 | efs-replication-one-way | EFS 자체 복제의 읽기 전용 대상과 단방향 제약 때문에 양쪽 리전에서 쓰는 동기화는 별도의 반대 방향 전송 작업이 필요함을 이해한다. | keep | — | true | (현재) | — | 1 | hold |
| 13 | fsx | FSx 계열의 파일 시스템마다 지원하는 공유 프로토콜과 사용 환경이 달라 요구에 맞는 유형을 구분해야 함을 이해한다. | keep | — | true | (현재) | — | 4 | 2A |
| 14 | fsx-windows-file-server | Windows 서버들이 SMB로 파일을 공유하고 장애에도 접근을 이어가려면 FSx for Windows File Server와 다중 AZ 배포를 함께 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 15 | sql-server-always-on-shared-storage | SQL Server 클러스터를 직접 구성할 때 노드들이 사용할 공유 저장 계층으로 FSx for Windows File Server를 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 16 | fsx-windows-storage-auto-scaling | SMB 파일 공유의 저장량이 계속 늘어날 때 FSx for Windows File Server의 자동 스토리지 확장으로 수동 용량 관리를 줄일 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 17 | fsx-for-lustre | 여러 계산 노드가 높은 입출력 성능으로 파일을 공유해야 할 때 FSx for Lustre를 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 18 | fsx-lustre-sub-millisecond-latency | 다수 노드의 공유 파일 접근에 1ms 이내 지연이 요구되면 범용 파일 저장소와 구분해 FSx for Lustre를 선택해야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 19 | fsx-lustre-persistent-deployment | FSx for Lustre에서 대규모 병렬 처리를 장기간 반복하며 내구성과 가용성도 유지하려면 영구 배포 유형을 골라야 함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 20 | fsx-lustre-s3-data-repository-association | FSx for Lustre의 데이터 리포지토리 연결로 S3 원본을 파일로 읽고 처리 결과를 다시 내보내는 데이터 흐름을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 21 | fsx-ontap-multi-az | 여러 가용 영역의 서버가 낮은 지연으로 같은 데이터를 사용해야 할 때 FSx for NetApp ONTAP의 다중 AZ 공유 스토리지를 선택하는 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 22 | fsx-ontap-multi-protocol-tiering | NFS와 SMB로 같은 파일을 함께 쓰면서 접근 빈도에 따라 저장 비용을 줄이려면 ONTAP의 다중 프로토콜과 자동 계층화를 결합할 수 있음을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 23 | fsx-ontap-iscsi-block | FSx for NetApp ONTAP은 파일 공유뿐 아니라 iSCSI로 여러 가용 영역에서 접근하는 블록 저장소도 제공함을 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 24 | fsx-ontap-snapmirror | 온프레미스 NetApp을 FSx for NetApp ONTAP으로 이전할 때 작은 파일이 많은 환경에서는 SnapMirror의 블록 증분 복제가 유리한 이유를 이해한다. | keep | — | true | (현재) | — | 1 | ① |
| 25 | fsx-file-gateway | 온프레미스에서 파일 저장소로 접속하는 통로와 클라우드 애플리케이션이 함께 사용할 파일 시스템 자체를 구분해야 함을 이해한다. | keep | — | false | (현재) | — | 1 | ① |
