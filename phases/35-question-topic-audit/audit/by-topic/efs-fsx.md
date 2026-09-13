# EFS·FSx(Windows·Lustre·ONTAP)

`efs-fsx` · `tools/aggregate.mjs`가 `audit/verdicts.jsonl`에서 만든 파일이다. 손으로 고치지 않는다. 전체 집계는 [report.md](../report.md).

- 문항 32개 · keep 31 · ambiguous 1 · move-recommended 0
- 이동 후보 비율 0.0% — 없음
- conceptFit yes 28 · partial 4 · no 0
- 이 주제로 들어올 이동 후보 0개

권장 topic·개념이 현재와 같으면 `(현재)`로 적는다.

| id | 현재 개념 | verdict | confidence | conceptFit | 권장 topic | 권장 개념 | coverageConflict | decidingKnowledge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| q042 | efs | keep | — | yes | (현재) | (현재) | false | EFS는 NFS로 여러 컴퓨터가 같은 파일 시스템에 동시에 접근하게 하는 공유 파일 스토리지다. |
| q043 | efs | keep | — | partial | (현재) | efs-lifecycle-management | false | EFS IA에 옮긴 파일도 밀리초 단위 지연으로 즉시 읽을 수 있어 아카이브처럼 복원을 기다리지 않는다. |
| q045 | fsx | keep | — | partial | (현재) | fsx-lustre-s3-data-repository-association | false | FSx for Lustre는 계산 집약적인 분석에 쓰는 고성능 파일 시스템이며 S3 버킷의 데이터를 연동해 사용할 수 있다. |
| q046 | fsx | keep | — | partial | (현재) | fsx-ontap-multi-protocol-tiering | false | FSx for NetApp ONTAP은 NFS와 SMB를 함께 지원해 서로 다른 운영체제의 클라이언트가 같은 데이터를 사용할 수 있다. |
| q047 | fsx | keep | — | yes | (현재) | (현재) | false | FSx 계열에서 SMB만 지원하는 유형은 Windows File Server이며 ONTAP의 NFS·SMB 동시 지원과 구분된다. |
| q048 | fsx | keep | — | yes | (현재) | (현재) | false | FSx for OpenZFS는 NFS만 지원하므로 SMB 전용·복수 프로토콜·Lustre 고유 프로토콜 유형과 구분된다. |
| q177 | efs-lifecycle-management | keep | — | yes | (현재) | (현재) | false | EFS 수명 주기 관리는 접근하지 않는 파일을 EFS IA로 자동 이동하면서 필요할 때 즉시 읽을 수 있게 한다. |
| q178 | fsx-ontap-multi-az | keep | — | yes | (현재) | (현재) | false | FSx for NetApp ONTAP은 다중 AZ 배포와 밀리초 미만의 공유 데이터 접근을 함께 제공한다. |
| q327 | fsx-windows-file-server | keep | — | yes | (현재) | (현재) | false | SMB로 공유 파일에 접근하는 Windows 워크로드의 가용 영역 장애 대응에는 FSx for Windows File Server의 다중 AZ 배포가 맞다. |
| q328 | fsx-for-lustre | keep | — | yes | (현재) | (현재) | false | FSx for Lustre는 많은 계산 노드가 동시에 높은 IOPS로 접근하는 HPC용 공유 파일 시스템이다. |
| q329 | fsx-file-gateway | keep | — | yes | (현재) | (현재) | false | FSx File Gateway는 온프레미스에서 FSx에 접근하는 접점이며 클라우드 애플리케이션에 공유 파일 시스템 자체를 제공하는 서비스가 아니다. |
| q330 | efs-throughput-modes | keep | — | yes | (현재) | (현재) | false | EFS 버스팅 처리량은 저장 데이터 양에 연동되므로 크기 증가에 맞춘 처리량이면 별도 프로비저닝 비용 없이 대응한다. |
| q331 | efs-throughput-modes | keep | — | yes | (현재) | (현재) | false | EFS의 프로비저닝된 처리량은 저장량과 무관하게 필요한 값을 지정해 적은 데이터와 높은 처리량의 조합에 대응한다. |
| q332 | efs-elastic-throughput | keep | — | yes | (현재) | (현재) | false | EFS Elastic 처리량은 예측하기 어려운 부하에 맞춰 처리량을 자동으로 늘리고 줄인다. |
| q333 | efs-performance-modes | keep | — | yes | (현재) | (현재) | false | EFS의 최대 I/O 성능 모드는 많은 클라이언트가 큰 파일에 병렬 접근하는 작업의 처리량을 위한 설정이다. |
| q334 | efs-performance-modes | keep | — | yes | (현재) | (현재) | false | EFS 범용 성능 모드는 높은 병렬성보다 짧은 응답 지연을 우선할 때 선택한다. |
| q335 | efs-one-zone | keep | — | yes | (현재) | (현재) | false | EFS One Zone은 재생성 가능한 NFS 파일 데이터를 한 AZ에 두어 복원력을 내주는 대신 저장 비용을 줄인다. |
| q336 | efs-posix-permissions | keep | — | yes | (현재) | (현재) | false | EFS는 POSIX 파일 권한과 공유 파일 시스템 동작을 유지해 Linux 애플리케이션을 코드 수정 없이 여러 서버에서 쓰게 한다. |
| q337 | fsx-lustre-sub-millisecond-latency | keep | — | yes | (현재) | (현재) | false | FSx for Lustre는 수백 노드의 병렬 파일 접근에서 1ms 이내 지연을 제공하는 공유 파일 시스템이다. |
| q338 | fsx-lustre-persistent-deployment | keep | — | yes | (현재) | (현재) | false | FSx for Lustre의 영구 배포 유형은 데이터를 장기간 반복 사용하면서 내구성·가용성과 지속적인 고성능 처리를 제공한다. |
| q339 | fsx-ontap-multi-protocol-tiering | keep | — | yes | (현재) | (현재) | false | FSx for NetApp ONTAP은 NFS·SMB 동시 접근과 접근 빈도에 따른 SSD·용량 풀 자동 계층화를 함께 지원한다. |
| q340 | fsx-ontap-iscsi-block | keep | — | yes | (현재) | (현재) | false | FSx for NetApp ONTAP은 LUN을 iSCSI로 제공하고 다중 AZ 배포로 영역 간 공유 블록 접근과 장애 조치를 지원한다. |
| q341 | fsx-ontap-snapmirror | keep | — | yes | (현재) | (현재) | false | NetApp SnapMirror는 블록 수준 증분 복제로 작은 파일이 매우 많은 ONTAP 이전에서 구조·권한을 유지하고 전환 중단을 줄인다. |
| q342 | sql-server-always-on-shared-storage | keep | — | yes | (현재) | (현재) | false | EC2에 직접 구성하는 SQL Server Always On의 공유 스토리지 요구에는 SQL Server 클러스터링과 호환되는 FSx for Windows File Server가 맞는다. |
| q343 | efs-ia-file-size-threshold | keep | — | yes | (현재) | (현재) | false | EFS IA는 128KB보다 크고 드물게 읽는 파일을 겨냥하므로 작은 파일 위주이면 계층화의 비용 절감 폭이 작다. |
| q344 | efs-ia-file-size-threshold | keep | — | partial | (현재) | efs-lifecycle-management | false | EFS에서 오래 접근하지 않는 파일은 수명 주기 관리로 IA 계층에 자동 전환해 저장 비용을 줄인다. |
| q345 | efs-lifecycle-transition-to-primary | keep | — | yes | (현재) | (현재) | false | EFS 수명 주기에는 IA 전환과 별개로 액세스된 파일을 기본 스토리지로 되돌리는 설정이 있다. |
| q346 | efs-mount-target-per-az | keep | — | yes | (현재) | (현재) | false | EFS 마운트 대상을 클라이언트가 있는 AZ마다 두고 같은 AZ의 대상으로 접속하면 영역 간 통신과 그 지연·전송 비용을 피한다. |
| q347 | efs-cross-account-mount | keep | — | yes | (현재) | (현재) | false | 다른 계정의 EFS도 VPC 연결과 마운트 대상의 NFS 포트 허용을 통해 복사 없이 원본 파일 시스템에 직접 마운트할 수 있다. |
| q348 | efs-replication-one-way | ambiguous | — | yes | (현재) | (현재) | false | EFS 자체 복제는 읽기 전용 대상을 두는 단방향 기능이고, 양쪽 쓰기를 반영하는 대안은 반대 방향의 DataSync 작업 두 개다. |
| q349 | fsx-windows-storage-auto-scaling | keep | — | yes | (현재) | (현재) | false | FSx for Windows File Server의 자동 스토리지 확장은 SMB 공유 파일의 저장 수요 증가에 맞춰 용량을 늘린다. |
| q350 | fsx-lustre-s3-data-repository-association | keep | — | yes | (현재) | (현재) | false | FSx for Lustre의 데이터 리포지토리 연결은 S3 객체를 파일로 읽고 계산 결과를 S3로 내보내 고성능 파일 접근과 버킷 연동을 함께 제공한다. |
