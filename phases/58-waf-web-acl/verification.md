# phase 58 검증 — WAF의 Web ACL 정의와 표기 통일

검증한 날: 2026-10-14. 설계 커밋 `b4bb173`(develop), 구현 커밋 `3523abe`(codex, step 0 `web-acl-terms`, 재시도 0).

## 시험 적용(설계 단계)

scratchpad 사본에 `changes.json`을 줄 단위로 적용해 봤다.

- 기존 테스트 1286개가 **수정 없이** 모두 통과했다. 그래서 step 문서에 testEdits가 없다.
- build·lint 통과.
- `check-structure.mjs`는 `questionsSha256`만 걸렸고, `sync-baseline.mjs`로 갱신한 뒤 「구조 이상 없음」.
- `check-verbatim.mjs`(원본 파일 있음) 「전사 이상 없음」.
- `content-audit.mjs`·`explanation-audit.mjs`·`coverage.mjs` 출력이 적용 전과 같다.
- `verify-waf-web-acl.mjs`를 p58 worktree에서 시험 적용본 데이터로 돌리면 남는 위반은 「새 describe 없음」 하나뿐이었다.
  JS 기대값과 Python 시험 적용본이 바이트 단위로 같다는 뜻이다.

## 구현 뒤 재실행(사람이 실제 git으로)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | exit 0 |
| `npm test` | 72 파일, 1290개 통과(새 `describe('ADR-039 확장 — WAF의 Web ACL')` 4개) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-verbatim.mjs` | 원본 파일을 잠시 복사해 실행 — 전사 이상 없음(실행 뒤 지움) |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-waf-web-acl.mjs` | 개념 3개와 문항 구절 5곳이 명세와 한 글자도 다르지 않고 questionsSha256만 갱신 |

데이터 세 파일의 sha256이 시험 적용본과 같다.

- `src/data/topics.json` `d6c06a15…`
- `src/data/questions.json` `c738e822…`
- `scripts/topics-baseline.json` `5cfa36a6…`

바뀐 파일은 `src/data/topics.json`(3줄), `src/data/questions.json`(3줄), `scripts/topics-baseline.json`(1줄), `src/data/data.test.ts`(끝에 64줄),
phase 메타데이터뿐이다. 새 테스트 넷은 step 문서의 명세와 같다.

## 화면 실측(Chrome, `vite preview` localhost:4379)

창 크기 조절이 반영되지 않아 320·390px은 같은 출처 iframe 안에서 쟀고, 넓은 화면은 1440px 창에서 쟀다.

| 개념 | 폭 | `<p>` 수(요약 포함) | `<strong>` | 가로 넘침 |
|---|---|---|---|---|
| `waf-shield.waf` | 320 / 390 / 1440 | 6 / 6 / 6 | 3 (L7 애플리케이션 계층, Web ACL, 기본 동작) | 0 |
| `elastic-load-balancing.alb-routing-conditions` | 320 / 390 / 1440 | 3 / 3 / 3 | 0 | 0 |
| `identity-federation.cognito-social-idp-federation` | 320 / 390 / 1440 | 3 / 3 / 3 | 1 | 0 |

- 세 개념 모두 화면 텍스트에 `웹 ACL`과 날것의 `**`가 없다.
- 콘솔 오류 0.
- WAF 개념은 넷째 문단(Web ACL)과 다섯째 문단(평가 순서·기본 동작) 뒤에 들여쓴 딸린 개념 「WAF를 붙일 수 있는 곳」이 이어진다.

## 범위 밖으로 남긴 것

- Web ACL을 풀이 없이 쓰는 해설: `q669`·`q674`·`q675`.
- Web ACL 문항을 새로 만드는 일.
- protection pack, Count·CAPTCHA 동작, WCU, 리소스당 Web ACL 하나라는 제약, 글로벌·리전 범위(ADR-039 「2026-10-14 확장」).
