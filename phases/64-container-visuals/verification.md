# phase 64 검증 보고 — 컨테이너 기본 개념 둘과 ECS·EKS·Fargate 시각 자료 (ADR-049, ADR-037 phase 64 확장)

검증일 2026-10-21. 대상 `feat-64-container-visuals` `323c931`(설계 `ed125fb` 위 step 0~9)과 실측 뒤 곁말 수정 `ddbda70`.
이 브랜치는 `origin/develop`(`3077937`, phase 63 병합)에서 팠다.

## 실행

| step | 이름 | 내용 | 시간 |
|---|---|---|---|
| 0 | `container-basics` | 기본 개념 둘(`container`·`container-orchestration`)과 문항 q740·q741 | 13:02–13:04 |
| 1 | `container-tables` | 주제 JSON·로더 키, 오케스트레이션·라우팅·Connector·Anywhere·실행 방식 표 | 13:23–13:27 |
| 2 | `image-flow-diagram` | 컨테이너 이미지 흐름 | 13:27–13:32 |
| 3 | `ecs-structure-diagram` | ECS 구성 | 13:32–13:37 |
| 4 | `ecs-roles-diagram` | ECS 역할 | 13:37–13:43 |
| 5 | `awsvpc-diagram` | awsvpc 네트워크 경로 | 13:43–13:48 |
| 6 | `task-placement-diagram` | 태스크 배치 | 13:48–13:53 |
| 7 | `eks-compute-diagram` | EKS 컴퓨팅 방식 | 13:53–13:58 |
| 8 | `eks-scaling-diagram` | EKS 확장 두 층 | 13:58–14:03 |
| 9 | `pod-permissions-diagram` | EKS 파드 권한 | 14:03–14:08 |

step 0을 `--max-steps 1`로 돌려 결과를 본 뒤, 사용자가 멈추지 말고 진행하라고 해서 step 1~9는 이어서 돌렸다. 열 step 모두 `completed`이고,
step 2~9의 summary는 "좌표·문구는 출발점(design-spec.mjs) 그대로이고 바꾼 것은 없다"이다. 두 실행 로그 모두 재시도 줄(`retry`)이 없다.
step마다 3~6분이 걸렸다.

## AC 재실행 (검증자가 직접)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 102개 파일, **2552개** 통과(착수 2245개, +307) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `세로 노드 345개·경로 268개, 가로 노드 345개·경로 268개`, 교차 없음 |
| `node phases/64-container-visuals/tools/check-design.mjs` | 문제 없음 — 도식 8장(노드 48·경로 31), 표 4개 |
| `node phases/64-container-visuals/verify-content.mjs` | 데이터 세 파일(`topics.json`·`questions.json`·`topics-baseline.json`)이 `changes.json` 적용 결과와 같다. 「바뀐 파일 목록」 검사는 step 1~9의 파일 21개를 위반으로 센다 — step 0 전용 검사라 예정된 결과다 |

step 0은 새 테스트 없이 기존 데이터 테스트 둘(개념 수, 블록 순서)의 기대값을 바꿨다. step 1~9의 새 테스트 합(24+37+35+35+32+31+35+39+39)이 307이다.
교차 검사의 수는 phase 63 끝(297·237)보다 노드 48개·경로 31개가 늘었고, 설계 검사기가 센 여덟 장의 합과 같다. 가로 수가 세로 수와 같으므로
여덟 장 모두 가로형을 가졌다. 곁말 수정 뒤에도 위 명령을 모두 다시 돌려 같은 결과를 얻었다.

검증은 이 기기의 Node 24.19.0으로 했다(이 기기에는 18.17.1이 없다). 각 step의 summary도 같은 환경이다.

## 승인본과의 대조

설계 때 미리보기를 만든 스펙 `tools/design-spec.mjs`를 그대로 두고, 실행 결과를 거기에 대조했다.

- **문구**: `src/data/visuals/ecs-eks-fargate.json`의 도식 여덟(`label`·`svgLabel`·`question`·`idleCaption`·`legend`·`sources`·노드·그룹·곁말·
  시나리오의 label·caption·sources)과 표 넷(`label`·`columns`·`columnWidths`·`rows`·`sources`)이 승인본과 **글자 단위로 같다.**
  여덟 장 모두 그룹 박스가 있다. 승인본에 없는 항목은 없다.
- **좌표**: 여덟 컴포넌트의 `groups`·`nodes`·`paths`·`notes`와 `wide…` 짝, 두 배치의 `viewBox`, 세로형 노드 색, 시나리오마다 켜는 노드·경로,
  곁말이 보이는 시나리오가 승인본과 같다. **다른 곳은 하나다.** ECS 구성 도식 세로형의 곁말 `stopped`(`멈춘 태스크`)를 실측 뒤 y 128 → 131로
  옮겼다(`ddbda70`). 한글 글리프가 위 태스크 상자의 테두리에 닿았기 때문이다. 이유와 수치는 [measurements.md](measurements.md) 「곁말·그룹 라벨」에 있다.
  `design-spec.mjs`는 승인 기록이라 고치지 않았다.
- **registry**: 이 주제의 줄 열둘이 승인본의 순서(주제 안 개념 순서)와 같다.
- **기본 개념과 문항**: `verify-content.mjs`의 데이터 검사가 통과한다. 새 개념 둘은 `ecs` 바로 위에, q740·q741은 문항 끝에 명세 글자 그대로 있다.

## 범위

착수 커밋 `ed125fb`부터의 diff(phase 문서 제외)는 아래 25개 파일이다.

- 새 파일: `containerTables.tsx`·`.test.tsx`, `ContainerImageDiagram`·`EcsStructureDiagram`·`EcsRolesDiagram`·`AwsvpcPathDiagram`·
  `TaskPlacementDiagram`·`EksComputeDiagram`·`EksScalingDiagram`·`PodPermissionsDiagram`의 `.tsx`·`.test.tsx`, `src/data/visuals/ecs-eks-fargate.json`
- 고친 파일: `registry.ts`(+21), `src/data/index.ts`(+2), `topics.json`(+2), `questions.json`(+3 −1), `src/data/data.test.ts`, `scripts/topics-baseline.json`

`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·다른 도식은 그대로다.

## 브라우저 실측

[measurements.md](measurements.md)에 있다. 요약하면 320·390·767·768·1024·1440px 모두 가로 넘침이 없고, 상태 30개를 두 배치에서 눌러 봐도
(위 곁말 수정 뒤) 곁말·그룹 라벨이 다른 것과 겹친 자리가 없다. 노드 라벨의 실측 여백은 가장 빠듯한 것이 23(기준 12)이다.
표 넷은 문서 폭 320px에서 단어 가운데에서 끊기지 않는다. Windows 스크롤 막대 15px가 낀 320px iframe에서는 `애플리케이션을`(두 곳)·`App2Container`·
`마이그레이션`이 끊긴다. 표는 UI_GUIDE의 기준 폭으로는 맞으므로 고치지 않았고, 그 여유를 UI_GUIDE 표 폭 항목에 적어 두었다.

## 남은 것

- **사용자 검수**: 도식이 본문을 넘지 않는지는 ADR-037 phase 64 확장에 적은 경계대로 만들었지만, "공부에 도움이 되는가"는 화면을 보고 판정할 일이다.
- **병합과 push**는 사람이 판단한다(CLAUDE.md).
- ADR-049 「남겨 둔 것」: 다른 주제 8곳 9개념이 `컨테이너`·`쿠버네티스`를 풀이 없이 쓴다(ADR-029). ECR 개념의 `리포지토리`는 정의 근거가 없다.
- 실측에서 재지 못한 것(실제 기기·macOS·배포 사이트·확인 문제의 개념 보기)은 measurements.md 끝에 있다.
