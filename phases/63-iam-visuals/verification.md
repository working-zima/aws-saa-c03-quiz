# phase 63 검증 보고 — IAM 사용자·그룹·역할·정책·권한 경계·Access Analyzer 시각 자료 (ADR-037 phase 63 확장)

검증일 2026-10-21. 대상 `feat-63-iam-visuals` `1cea70e`(설계 `88eacb4` 위 step 0~8). 이 브랜치는 아직 develop에 들어가지 않은
`fix-iam-access-key-revocation`(`be93c83`) 위에서 시작했다. 자격 증명 비교표의 「멈추는 방법」 행이 그 수정(ADR-039 「2026-10-19 확장」)과 같은 사실을 쓰기 때문이다(ADR-037 phase 63 확장).

## 실행

| step | 이름 | 내용 | 시간 |
|---|---|---|---|
| 0 | `iam-tables` | 주제 JSON·로더 키, 그룹에 넣을 수 있는 것·자격 증명·권한 검토 도구 표 | 10-19 16:51–16:55 |
| 1 | `group-policy-diagram` | 그룹 정책 | 10-19 17:12–17:17 |
| 2 | `role-paths-diagram` | 역할을 맡는 세 경로 | 10-21 08:30–08:36 |
| 3 | `abac-diagram` | ABAC 태그 비교 | 10-21 08:36–08:40 |
| 4 | `boundary-diagram` | 권한 경계와 SCP 부착 요구 | 10-21 08:40–08:46 |
| 5 | `policy-evaluation-diagram` | 정책 평가 순서 | 10-21 08:46–08:51 |
| 6 | `notaction-diagram` | NotAction 거부 | 10-21 08:51–08:56 |
| 7 | `region-condition-diagram` | 출발지와 목적지 리전 | 10-21 08:56–09:02 |
| 8 | `delegated-admin-diagram` | 위임 관리자 지정 순서 | 10-21 09:02–09:07 |

step 0·1은 2026-10-19에 돌리고 검증했다. step 2~3을 `--max-steps 2`로 돌린 뒤, 사용자가 "한번에 쭉" 진행하라고 해서 step 4~8은 멈추지 않고
이어서 돌렸다. 아홉 step 모두 `completed`이고, step 1~8의 summary는 "출발점 좌표는 바꾼 것 없음"이다. step 2~8의 실행 로그에는 재시도 줄
(`↻ Step N: retry`)이 없다. step 0·1은 앞 세션의 실행이라 그 로그가 남아 있지 않다. step마다 4~6분이 걸렸다.

## AC 재실행 (검증자가 직접)

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과(경고 0) |
| `npm test` | 93개 파일, **2245개** 통과(착수 1944개, +301) |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `세로 노드 297개·경로 237개, 가로 노드 297개·경로 237개`, 교차 없음 |
| `node phases/63-iam-visuals/tools/check-design.mjs` | 문제 없음 — 도식 8장(노드 50·경로 37), 표 3개 |

착수 테스트 수는 step 0 summary의 1964개에서 그 step의 새 테스트 20개를 뺀 값이다. 아홉 step의 새 테스트 합(20+37+37+31+37+36+37+35+31)이 301이다.
교차 검사의 수는 phase 62 끝(247·200)보다 노드 50개·경로 37개가 늘었고, 설계 검사기가 센 여덟 장의 합과 같다. 가로 수가 세로 수와
같으므로 여덟 장 모두 가로형을 가졌다.

검증은 이 기기의 Node 24.19.0으로 했다(이 기기에는 18.17.1이 없다). 각 step의 summary도 같은 환경이다.

## 승인본과의 대조

설계 때 미리보기를 만든 스펙 `tools/design-spec.mjs`를 그대로 두고, 실행 결과를 거기에 대조했다.

- **문구**: `src/data/visuals/iam-permissions.json`의 도식 여덟(`label`·`svgLabel`·`question`·`idleCaption`·`legend`·`sources`·노드·그룹·곁말·
  시나리오의 label·caption·sources)과 표 셋(`label`·`columns`·`columnWidths`·`rows`·`sources`)이 승인본과 **글자 단위로 같다.**
  그룹 박스가 없는 도식(ABAC 등)은 명세대로 JSON에 `groups` 키를 두지 않았다.
- **좌표**: 여덟 컴포넌트의 `groups`·`nodes`·`paths`·`notes`와 `wide…` 짝, 두 배치의 `viewBox`, 세로형 노드 색, 시나리오마다 켜는 노드·경로,
  곁말이 보이는 시나리오가 승인본과 **모두 같다.**
- **registry**: 이 주제의 줄 열하나가 승인본의 순서(주제 안 개념 순서)와 같다.

## 범위

착수 커밋 `88eacb4`부터의 diff(phase 문서 제외)는 아래 21개 파일이고 전부 추가다.

- 새 파일: `iamTables.tsx`·`.test.tsx`, `GroupPolicyDiagram`·`RolePathsDiagram`·`AbacTagDiagram`·`PermissionsBoundaryDiagram`·
  `PolicyEvaluationDiagram`·`NotActionDenyDiagram`·`RegionConditionDiagram`·`DelegatedAdminDiagram`의 `.tsx`·`.test.tsx`,
  `src/data/visuals/iam-permissions.json`
- 고친 파일: `registry.ts`(+20), `src/data/index.ts`(+2)

`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ConceptList.tsx`·`useWideDiagram.ts`·`topics.json`·`questions.json`·다른 도식은 그대로다.

## 브라우저 실측

[measurements.md](measurements.md)에 있다. 요약하면 320·390·767·768·1024·1440px 모두 가로 넘침이 없고, 상태 32개를 두 배치에서 눌러 봐도
곁말·그룹 라벨이 다른 것과 겹친 자리가 없으며, 표 셋은 320px에서 단어 가운데에서 끊기지 않는다. 노드 라벨의 실측 여백은 가장 빠듯한
것이 17(기준 12)이다. 가장 빠듯한 표 칸은 `비활성화하거나`(여유 2px)라 UI_GUIDE의 표 폭 항목에 적어 두었다.

## 남은 것

- **병합 순서**: 이 브랜치는 `fix-iam-access-key-revocation`(`1f55c24`·`be93c83`)을 품는다. develop에 넣으면 그 수정도 함께 들어간다.
  수정만 먼저 넣을지 함께 넣을지, 병합과 push는 사람이 판단한다(CLAUDE.md).
- **사용자 검수**: 도식이 본문을 넘지 않는지는 ADR-037 phase 63에 적은 경계대로 만들었지만, "공부에 도움이 되는가"는 화면을 보고 판정할 일이다.
- 실측에서 재지 못한 것(실제 기기·macOS·배포 사이트·확인 문제의 개념 보기)은 measurements.md 끝에 있다.
