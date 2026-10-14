# Step 0: web-acl-terms

## 배경

사용자가 "web acl에 대한 설명이 있나?"라고 물었다(2026-10-14). 데이터는 `Web ACL`을 WAF 주제의 개념 둘, 다른 주제의 개념 둘, 해설
열 곳에서 쓴다. 그런데 그것이 무엇인지 말하는 문장은 보안 그룹·NACL 주제의 `security-groups-nacl.web-acl-vs-nacl` 한 문장뿐이고, WAF의
기본 개념 `waf-shield.waf`에는 이 말이 나오지 않는다. 사용자 결정으로 AWS 공식 문서를 근거로 정의를 더한다(ADR-039 「2026-10-14 확장 —
WAF의 Web ACL(phase 58)」). 근거와 URL은 `docs/source/aws-docs.md`의 「Web ACL·규칙·기본 동작 (AWS WAF)」에 있다. 같은 phase에서
`웹 ACL` 표기를 `Web ACL`로 통일한다.

무엇을 바꾸는지는 **`phases/58-waf-web-acl/changes.json`에 글자 그대로 정해져 있다. 그대로 적용한다.** 문장을 판정하거나 다듬지 마라.
사용자가 승인한 문구다.

| `changes.json` 키 | 내용 | 수 |
|---|---|---|
| `concepts` | 개념 줄에서 바꿀 필드(`paragraphs`)의 새 값 전체 | 3 |
| `questions` | 문항 줄에서 바꿀 구절. `field`(`explanation` 또는 `choices.<번호>`)의 문자열에서 `old`를 `new`로 한 번 바꾼다 | 5 (문항 3개) |

바뀌는 내용은 다음과 같다.

- `waf-shield.waf`: 기존 세 문단 **뒤에** 두 문단을 더한다(3 → 5). 넷째는 Web ACL이 무엇인지, 다섯째는 규칙 평가 순서와 기본 동작이다.
  기존 세 문단과 `summary`는 그대로다.
- `elastic-load-balancing.alb-routing-conditions` 둘째 문단: `ALB에 웹 ACL을 붙이면` → `그 규칙을 담은 Web ACL을 ALB에 붙이면`.
- `identity-federation.cognito-social-idp-federation` 둘째 문단: `관리형 규칙을 붙인 WAF 웹 ACL을` → `WAF의 관리형 규칙을 담은 Web ACL을`.
- 문항 `q079`·`q454`·`q705`의 해설과 `q454`·`q705`의 셋째 보기(`choices[2]`)에서 `웹 ACL` → `Web ACL`. 정답 위치는 그대로다
  (`q454`는 1, `q705`는 2 — `q705`의 셋째 보기가 정답이다).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-010, ADR-029, ADR-039**(끝의 확장 문단 모두, 특히 「2026-10-14 확장 — WAF의 Web ACL(phase 58)」)
- `docs/source/aws-docs.md`의 「Web ACL·규칙·기본 동작 (AWS WAF)」
- `phases/58-waf-web-acl/changes.json`
- `phases/58-waf-web-acl/verify-waf-web-acl.mjs` — 머리 주석의 「기대값을 만드는 규칙」. 이 규칙대로 하면 통과한다
- `src/data/topics.json`에서 `changes.json`의 개념 id로 시작하는 줄, `src/data/questions.json`에서 `q079`·`q454`·`q705` 줄 — 바꿀 줄의 모양.
  `questions.json`은 줄 앞에 쉼표가 붙은 줄(`,{"id":…}`)과 아닌 줄이 섞여 있다. 떼어 낸 쉼표는 그대로 되돌려 붙인다
- `src/data/data.test.ts`의 끝 `describe` 몇 개(`ADR-039 확장 — CloudFormation의 템플릿·스택·드리프트`, `ADR-046 — 개념 본문 목록`) —
  새 `describe`를 쓸 모양. 기존 테스트 가운데 `waf-shield.waf`를 보는 것(주제 개념 순서, `**L7 애플리케이션 계층**` 포함 단언, XSS 풀이 위치,
  첫 문단의 서비스 분류 문장)은 새 문단과 함께 그대로 통과한다 — 설계 단계의 시험 적용에서 기존 테스트 1286개가 수정 없이 모두 통과했다
- `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` 머리 주석

## 작업

**테스트를 먼저 쓰고, 새 테스트가 실패하는 것을 확인한 뒤** 데이터를 고친다.

### 1. 테스트 — `src/data/data.test.ts` 맨 끝에 새 `describe`

`describe('ADR-039 확장 — WAF의 Web ACL', …)`를 **파일 맨 끝에 덧붙인다.** 기존 줄은 한 글자도 바꾸지 않는다. 기대 문자열은
`changes.json`의 값을 그대로 옮긴다. 테스트 넷이다.

1. **WAF 기본 개념의 기존 문단과 요약을 유지하고 뒤에 Web ACL과 기본 동작을 정의한다.** `waf-shield.waf`의 문단이 5개다.
   `paragraphs[0..2]`는 지금 값(바꾸기 전 세 문단)과 같고, `paragraphs[3]`·`paragraphs[4]`는 `changes.json`의 넷째·다섯째 값과 같다.
   `summary`는 `'웹 요청을 검사해 애플리케이션 계층의 공격을 차단한다.'` 그대로다.
2. **다른 주제에서 처음 나오는 Web ACL에 규칙 묶음이라는 풀이가 붙는다(ADR-029).**
   `elastic-load-balancing.alb-routing-conditions`의 `paragraphs[1]`에 `'그 규칙을 담은 Web ACL을 ALB에 붙이면'`이 있고,
   `identity-federation.cognito-social-idp-federation`의 `paragraphs[1]`에 `'WAF의 관리형 규칙을 담은 Web ACL을 함께 두면'`이 있다.
   두 개념 모두 문단이 2개다.
3. **데이터 어디에도 `웹 ACL` 표기가 없다.** 모든 개념의 `name`·`summary`·`paragraphs`와 모든 문항의 `prompt`·`choices`·`explanation`에
   `'웹 ACL'`이 없다. 실패하면 개념·문항 id가 메시지에 나오게 한다.
4. **표기를 바꾼 문항은 정답 위치를 유지한다.** `q454.choices[2]`가 `'ALB에 붙인 WAF Web ACL'`,
   `q705.choices[2]`가 `'Cognito 사용자 풀을 소셜 자격 증명 공급자와 연동해 REST API에 통합하고, 관리형 규칙을 붙인 WAF Web ACL을 함께 둔다'`다.
   `answerIndex`는 `q079` 1, `q454` 1, `q705` 2다. 세 문항의 해설에 `'Web ACL(Access Control List)'`이 있다.

테스트를 쓴 뒤 `npx vitest run src/data/data.test.ts`로 새 테스트 넷이 **실패하는 것을 확인한다**(데이터를 아직 고치지 않았으므로).

### 2. 데이터 — `src/data/topics.json`, `src/data/questions.json`

`verify-waf-web-acl.mjs` 머리 주석의 「기대값을 만드는 규칙」대로 줄 단위로 바꾼다.

- `topics.json`: `changes.json`의 `concepts` 3개마다 `      {"id":"<id>",`로 시작하는 줄 하나만 바꾼다. 앞 공백 6칸과 끝 쉼표를 떼고
  `JSON.parse` → `paragraphs`에 명세의 값을 대입 → `JSON.stringify` → 앞 공백과 끝 쉼표를 그대로 붙인다.
- `questions.json`: `changes.json`의 `questions` 5개마다, 앞 쉼표를 떼면 `{"id":"<id>",`로 시작하는 줄을 찾는다. 앞뒤 쉼표를 떼고
  `JSON.parse` → `field`의 문자열에서 `old`를 `new`로 바꾼다 → `JSON.stringify` → 쉼표를 그대로 붙인다. `old`는 그 문자열에 정확히
  한 번 있다. 없거나 두 번 이상 있으면 고치지 말고 `blocked`로 멈춘다.

**파일 전체를 `JSON.parse` → `JSON.stringify`로 다시 쓰지 마라.** 줄 단위로만 바꾼다. 치환에 쓸 일회성 스크립트는 저장소 밖(`/tmp` 등)에
두고 끝나면 지운다.

### 3. 문항 기준선

`node scripts/sync-baseline.mjs --dry-run`으로 무엇이 바뀌는지 먼저 본다. `questionsSha256`만 바뀌고 개념 `name`은 0건이면
`node scripts/sync-baseline.mjs`로 갱신한다. 개념 `name`까지 바꾸려 하면 쓰지 말고 `blocked`로 멈춘다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/check-verbatim.mjs
node scripts/sync-baseline.mjs --dry-run
node phases/58-waf-web-acl/verify-waf-web-acl.mjs
```

## 검증 절차

1. AC를 실행한다. 기대 결과:
   - `npm test` — 기존 1286개와 새 `describe('ADR-039 확장 — WAF의 Web ACL')`의 4개, 모두 1290개가 통과한다.
   - `check-structure.mjs` — 「구조 이상 없음」.
   - `check-verbatim.mjs` — 「전사 이상 없음」(원본 파일이 없는 환경이면 검사를 건너뛰고 exit 0).
   - `sync-baseline.mjs --dry-run` — 「갱신할 것이 없다」.
   - `verify-waf-web-acl.mjs` — 「개념 3개와 문항 구절 5곳이 명세와 한 글자도 다르지 않고, questionsSha256만 갱신됐다 …」.
2. `verify-waf-web-acl.mjs`가 실패하면 출력의 「처음 다른 곳」을 보고 고친다. 샌드박스에서 `git`을 실행할 수 없으면 그 사실을
   `"summary"`에 적는다. 사람이 다시 돌린다.
3. 바뀐 파일이 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts`, phase 메타데이터뿐인지
   확인한다.
4. `phases/58-waf-web-acl/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념 셋과 문단 수 변화, 바꾼 문항 구절 수, 기준선 갱신, 더한 테스트 이름과 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`, `"error_message"`에 구체적 내용.

## 금지사항

- **`changes.json`의 문구를 다듬거나 사실을 더하지 마라.** 이유: 사용자가 승인한 문장이고, 새 사실은 `docs/source/aws-docs.md`에 적힌 것만
  허용된다(ADR-039). Count·CAPTCHA 동작, WCU, 리소스당 Web ACL 하나, 글로벌·리전 범위, protection pack이라는 콘솔 이름을 덧붙이지 마라.
- **`changes.json`에 없는 개념·문항을 고치지 마라.** `security-groups-nacl.web-acl-vs-nacl`과 그 도식, Web ACL을 풀이 없이 쓰는 다른 해설
  (`q669`·`q674`·`q675` 등)도 그대로 둔다. 이유: 이번 범위는 위 여덟 자리이고, `verify-waf-web-acl.mjs`가 나머지 줄의 바이트 일치를 본다.
- **개념 `id`·`name`·`summary`·`parentId`와 문항의 `prompt`·`answerIndex`·`conceptId`·`topicId`를 바꾸지 마라.** 보기는 명세한 두 개의
  표기만 바꾼다.
- **기존 테스트를 고치거나 지우지 마라.** 새 `describe` 하나만 파일 끝에 더한다. 이유: 시험 적용에서 기존 테스트는 수정 없이 모두 통과했다.
  다른 테스트가 깨지면 설계가 예상하지 못한 의존이므로 멈추고 `"status": "error"`에 테스트 이름을 적는다.
- **`src/` 아래 코드(테스트가 아닌 파일), `scripts/*.mjs`, `docs/`를 고치지 마라.** 이유: 이번 phase는 데이터와 데이터 테스트만 바꾸고,
  문서는 설계 커밋에 있다.
- **`topics.json`·`questions.json`을 다시 직렬화하지 마라.** 이유: 한 줄 형식이 깨진다.
