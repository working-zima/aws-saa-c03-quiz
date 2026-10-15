# phase 59 검증 보고 (2026-10-15)

## 실행

- 설계: develop `b8026e4`. 구현: worktree `../aws-saa-c03-quiz-apigw-sfn` [`feat-59-apigw-sfn-visuals`].
- **첫 시도(`--agent codex`)는 step 0을 시작하기 전에 죽었다.** `WinError 206`(파일 이름이나 확장명이 너무 깁니다)이다. `execute.py`의
  `_codex_cmd`는 프롬프트를 명령줄 인자로 넘기는데, 프롬프트에 매번 들어가는 CLAUDE.md + docs/*.md만으로 3만 자가 넘어 Windows `CreateProcess`의
  32,767자 한도를 넘는다. `_claude_cmd`의 주석이 이미 같은 이유로 stdin을 쓴다고 적어 두었다. 이전 phase들은 macOS에서 codex로 돌았다.
  남은 것은 `started_at` 한 줄뿐이라 되돌렸고, `execute.py`는 고치지 않았다.
- 그래서 기본 에이전트(claude)로 돌렸다. step 0~2는 08:36~08:48, 사용자 확인 뒤 step 3~4는 08:55~09:02다. 재시도는 0이다.
- 출발점 좌표에서 바뀐 것은 step 2의 하나다. 엣지 그룹 폭 272 → 256(x 4..260), 곁말 `via-edge` x 262 → 246. 명세는 리전 화살표가 "엣지 박스를
  피해" 간다고 썼는데, 준 좌표로는 x 270 통로가 엣지 박스(4..276) 안을 지났다. 이 모순을 에이전트가 쓴 테스트가 잡았다. step 3은 교차 검사기가
  따옴표 붙은 경로 키만 읽는 것을 보고 `retry` 키에 따옴표를 붙였다. 좌표는 그대로다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 (청크 크기 경고는 기존과 같다) |
| `npm run lint` | exit 0 (경고 0) |
| `npm test` | 77개 파일 · 1382개 테스트 통과 (설계 직후 1290 → +92) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-path-crossings.mjs` | 노드 208 · 경로 177, 교차 없음 (설계 직후 183 · 153) |

## 범위 확인

- 바뀐 소스는 명세한 파일뿐이다. 새 컴포넌트 다섯(`apiGatewayTables`, `ApiIntegrationDiagram`, `ApiEndpointPathDiagram`,
  `StateMachineDiagram`, `MapStateDiagram`)과 그 테스트, `api-gateway-step-functions.json`, `registry.ts`(import 다섯·키 여섯),
  `data/index.ts`(import 하나·키 하나)다.
- `topics.json`·`questions.json`·`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`docs/`와 기존 테스트는 설계 커밋 뒤 바뀌지 않았다
  (`git diff --stat b8026e4 HEAD`가 비어 있다).
- 표 두 개의 제목·열·열 폭·행 아홉, 도식 네 장의 물음·캡션 열넷·곁말 열일곱이 step 문서와 한 글자도 다르지 않다(스크립트로 대조).
  `glossary`는 빈 배열이다.
- 칸·캡션·곁말에 데이터에 없는 사실이 없다. 타임아웃 초 수, 스로틀링 한도, HTTP API의 리소스 정책 지원 여부, CloudFront 배포 관리 주체, 캐시 TTL,
  리전 이름, 상태 이름(Task·Wait), 재시도 횟수, Map의 동시 실행 수·모드 이름이 없다. 청록(`diagram-resource`)을 쓰지 않았다.
- 브라우저 실측은 `measurements.md`에 있다. Windows 스크롤바 때문에 320px의 표 폭이 273px로 설계 기준(288px)보다 좁았는데도 낱말 끊김은 0개였다.

## 사람에게 남긴 것

- **병합과 push는 하지 않았다.** `feat-59-apigw-sfn-visuals`는 로컬에만 있고, 설계 커밋 `b8026e4`도 로컬 develop에만 있다.
- `execute.py`의 codex 경로는 Windows에서 여전히 같은 이유로 실패한다. 고칠지(예: codex에도 stdin을 쓰기)는 이번 요청 범위 밖이라 두었다.
- `docs/ARCHITECTURE.md` 56행의 "지금은 `vpc-networking` 주제만 … 가진다"는 이번 phase 전부터 사실과 달랐다(visuals JSON이 이미 7개였다).
  요청 범위 밖이라 고치지 않았다.
