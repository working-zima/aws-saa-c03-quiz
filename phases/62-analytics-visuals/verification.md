# phase 62 검증 보고 — EMR·Glue·Athena·Lake Formation 시각 자료 (ADR-037 phase 62 확장)

검증일 2026-10-19. 대상 `feat-62-analytics-visuals` `7ba035d`(설계 `b533184` 위 step 0~5). 이 브랜치는 아직 develop에 들어가지 않은
`feat-61-wide-diagrams-rest`(`b4f3301`) 위에서 시작했다. 새 도식이 처음부터 가로형을 갖게 하려는 것이다(ADR-048).

## 실행

| step | 이름 | 내용 | 시간 |
|---|---|---|---|
| 0 | `analytics-tables` | 주제 JSON·로더 키, 분석 서비스 역할 표, 로그 저장 위치 표 | 13:41–13:44 |
| 1 | `cluster-cost-diagram` | 클러스터 수명과 노드 수 (경로 없음) | 13:44–13:50 |
| 2 | `node-roles-diagram` | 노드 역할 | 13:50–13:55 |
| 3 | `runtime-role-diagram` | 런타임 역할과 보안 구성 | 13:55–14:01 |
| 4 | `lake-permissions-diagram` | Lake Formation 권한 경로 | 14:01–14:08 |
| 5 | `columnar-diagram` | 열 지향 형식 | 14:08–14:13 |

step 0을 `--max-steps 1`로, step 1~3을 `--max-steps 3`으로 돌렸다. 사용자가 "한번에" 진행하라고 해서 step 4~5는 멈추지 않고 이어서 돌렸다.
여섯 step 모두 `completed`이고, 각 summary는 "출발점 좌표에서 바꾼 것 없음"이다. step 0의 실행 로그에는 재시도가 없었다. step 1~5는 실행 로그를
남기지 않아 재시도 횟수를 따로 확인하지 못했다. step마다 5~6분 반이 걸렸다.

## AC 재실행 (검증자가 직접)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 84개 파일, **1941개** 통과(착수 1736개, +205) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `세로 노드 247개·경로 200개, 가로 노드 247개·경로 200개`, 교차 없음 |

교차 검사의 수는 착수 때(208·177)보다 노드 39개·경로 23개가 늘었고, 다섯 장의 합(9+4+10+9+7 노드, 0+3+12+7+1 경로)과 같다. 가로 수가 세로 수와
같으므로 다섯 장 모두 가로형을 가졌다.

검증은 이 기기의 Node 24.19.0으로 했다(이 기기에는 18.17.1이 없다). 각 step의 summary도 같은 환경이다.

## 승인본과의 대조

설계 때 미리보기를 만든 스펙(좌표)과 문구 파일을 그대로 두고, 실행 결과를 거기에 대조했다.

- **문구**: `src/data/visuals/emr-glue-athena.json`의 도식 다섯(`label`·`svgLabel`·`question`·`idleCaption`·`legend`·`sources`·노드·그룹·곁말·
  시나리오의 label·caption·sources)과 표 둘(`label`·`columns`·`columnWidths`·`rows`·`sources`)이 승인본과 **글자 단위로 같다.**
- **좌표**: 다섯 컴포넌트의 `groups`·`nodes`·`paths`·`notes`와 `wide…` 짝, 두 배치의 `viewBox`, 세로형 노드 색이 승인본과 **모두 같다.**

## 범위

착수 커밋 `b533184`부터의 diff(phase 문서 제외)는 아래 15개 파일이고 전부 추가다.

- 새 파일: `analyticsTables.tsx`·`.test.tsx`, `EmrClusterCostDiagram`·`EmrNodeRolesDiagram`·`EmrRuntimeRoleDiagram`·`LakePermissionsDiagram`·
  `ColumnarFormatDiagram`의 `.tsx`·`.test.tsx`, `src/data/visuals/emr-glue-athena.json`
- 고친 파일: `registry.ts`(+13), `src/data/index.ts`(+2)

`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식은 그대로다.
registry의 이 주제 줄은 명세의 순서(주제 안 개념 순서)와 같다.

## 브라우저 실측

[measurements.md](measurements.md)에 있다. 요약하면 320·390·767·768·1024·1440px 모두 가로 넘침이 없고, 장면 23개를 두 배치에서 눌러 봐도
곁말·그룹 라벨이 다른 것과 겹친 자리가 없으며, 표 두 개는 320px에서 단어 가운데에서 끊기지 않는다. 노드 라벨의 실측 여백은 가장 빠듯한
것이 14.5(기준 12)다.

## 남은 것

- **병합 순서**: 이 브랜치는 `feat-61-wide-diagrams-rest`를 품는다. develop에 넣으려면 phase 61을 먼저(또는 함께) 넣어야 한다. 병합과 push는
  사람이 판단한다(CLAUDE.md).
- **사용자 검수**: 도식이 본문을 넘지 않는지(특히 클러스터 수명 막대와 Parquet 행 기준 장면)는 ADR-037 phase 62에 적은 경계대로 만들었지만,
  "공부에 도움이 되는가"는 화면을 보고 판정할 일이다.
- 실측에서 재지 못한 것(실제 기기·macOS·배포 사이트·확인 문제의 개념 보기)은 measurements.md 끝에 있다.
