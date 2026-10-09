# phase 50 검증 보고 (2026-10-10)

## 실행

- 설계: develop `b718ab4`. 구현: worktree `../aws-saa-c03-quiz-p50` [`feat-50-org-identity-visuals`].
- 2026-10-09 23:44~23:57에 step 0~2를 모두 `--agent codex`로 실행했다. 재시도와 사용량 한도는 없었다(phase 49 때 걸린 한도는 21:27에 풀렸다).
- 두 도식 모두 출발점 좌표를 바꾸지 않았다(step 1·2 summary).

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (경고 0) |
| `npm test` | 68개 파일 · 1216개 테스트 통과 (1180 → +36) |
| `check-structure.mjs` | 구조 이상 없음 (`questionsSha256`은 `sync-baseline.mjs`로 갱신) |
| `check-verbatim.mjs` | 전사 이상 없음 (원본 `concepts-raw.md`를 worktree에 복사해 실제로 대조했다) |
| `check-path-crossings.mjs` | 노드 183 · 경로 153, 교차 없음 |

## 범위 확인 (설계 커밋과 대조하는 스크립트로)

- 바뀐 개념 필드는 둘뿐이다: `identity-federation.identity-center-permission-set`의 `paragraphs`(2 → 3, 새 둘째 문단),
  `organizations-cloudtrail-config.scp-attachment-targets`의 `paragraphs`(첫 문단 끝 두 문장). `summary`·`name`은 그대로다.
- 바뀐 문항 필드는 `q718`의 `choices`(정답 보기 하나)와 `explanation`(구절 하나)뿐이다. `answerIndex` 1과 나머지 보기 셋은 그대로다.
- 새 문구는 사용자가 승인한 것과 글자 그대로 같다.
- 새 visuals JSON 둘(`organizations-cloudtrail-config.json`, `identity-federation.json`)의 물음·캡션·곁말·범례·근거 id가 step 문서와 같다.
  두 파일 모두 `tables`는 빈 객체, `glossary`는 빈 배열이다.
- `registry.ts`에는 import 둘과 키 둘, `data/index.ts`에는 import 둘과 키 둘만 더해졌다. 기존 테스트 줄은 지워지거나 바뀌지 않았다.
- 도식에 사람 이름·이메일·부서 이름·역할 이름 규칙·세션 시간이 없다. Identity Center는 계정 박스 밖에 있고, 관리 계정은 조직 박스 안에 있다.
- 브라우저 실측은 `measurements.md`에 있다. 첫 실측 시도 때는 Chrome 확장이 연결되어 있지 않았고, 사용자가 Chrome을 연 뒤 다시 쟀다.
