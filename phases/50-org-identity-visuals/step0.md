# Step 0: source-sentences

## 배경

사용자가 Organizations를 이해하려고 "IAM Identity Center에서 계정 A에 관리자 권한을 할당하면 계정 A에 IAM 역할이 자동으로 생기고, 사용자가
그 역할로 접근한다"는 그림을 가져왔다(2026-10-09). 이 phase는 그 내용을 도식 두 장으로 그린다(step 1·2). 그런데 도식이 그릴 사실 가운데 둘이
데이터에 없다.

- 권한 세트를 할당하면 그 계정에 IAM 역할이 생기고, 사용자는 그 역할을 맡아 들어간다.
- SCP는 멤버 계정에만 걸리고 관리 계정에는 걸리지 않는다.

사용자 결정으로 두 사실을 AWS 공식 문서에서 가져와 본문에 먼저 넣는다. 그림이 본문에 없는 것을 말하면 안 되기 때문이다(ADR-036
"도식은 콘텐츠다"). 근거와 URL은 `docs/source/aws-docs.md`에 있고, 결정은 ADR-039 끝의 「2026-10-09 확장 — … (phase 50)」에 있다.
아래 문구는 사용자가 승인한 것이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-010, ADR-039**(끝의 확장 문단 둘 포함)
- `docs/source/aws-docs.md`의 「권한 세트 할당과 IAM 역할」, 「SCP와 관리 계정」
- `src/data/topics.json`의 `identity-federation.identity-center-permission-set`, `organizations-cloudtrail-config.scp-attachment-targets`
- `src/data/questions.json`의 `q718`
- `src/data/data.test.ts`: 끝의 `describe('ADR-039 확장 — Lambda 동시 실행 수와 예약된 동시성', …)`가 바로 앞 phase의 같은 종류 테스트다.
  `'연결한 자리 아래에만 적용된다'`를 단언하는 기존 테스트가 있다 — 새 문구에서도 그 구절은 그대로다.
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs`

## 작업

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 데이터를 고친다.

### 1. `src/data/topics.json`

**파일 형식을 지켜라.** 개념 하나가 한 줄인 형식을 `check-structure.mjs`가 검사한다. 파일 전체를 다시 직렬화하지 말고 해당 줄 안의 문자열만
바꾼다. 아래 문구를 **글자 그대로** 쓴다(ADR-009 — 이미 직접 쓴 문장이다). `id`·`name`·`summary`는 바꾸지 않는다.

**(가) `identity-federation.identity-center-permission-set`**: 지금 첫 문단과 둘째 문단 **사이에** 새 문단을 넣는다(문단 2개 → 3개).
기존 두 문단은 한 글자도 바꾸지 않는다.

```
권한 세트를 계정에 할당하면 IAM Identity Center가 그 계정 안에 IAM 역할을 만들고, 권한 세트에 담긴 정책을 그 역할에 붙인다. 사용자는 AWS 접근 포털이나 CLI에서 이 역할을 맡아 그 계정에 들어간다. 할당하지 않은 계정에는 이 역할이 생기지 않는다. 권한 세트를 고치면 Identity Center가 이미 만든 역할도 함께 고친다.
```

**(나) `organizations-cloudtrail-config.scp-attachment-targets`**: 첫 문단 **끝에** 공백 하나를 두고 아래 두 문장을 붙인다. 문단 수는 그대로(2개)다.

```
다만 관리 계정은 예외다. SCP는 멤버 계정에만 걸리고, 루트에 붙여도 관리 계정의 사용자와 역할은 제한하지 않는다.
```

바꾼 뒤 첫 문단은 다음과 같다.

```
SCP를 붙일 수 있는 자리가 조직 단위(OU)만은 아니다. 조직의 루트, OU, 그리고 개별 멤버 계정에 연결할 수 있고 연결한 자리 아래에만 적용된다. 다만 관리 계정은 예외다. SCP는 멤버 계정에만 걸리고, 루트에 붙여도 관리 계정의 사용자와 역할은 제한하지 않는다.
```

### 2. `src/data/questions.json`: `q718`

정답 위치(`answerIndex` 1)는 바꾸지 않는다. `prompt`와 다른 보기 셋도 그대로다. 파일 형식(문항 하나가 한 줄)을 지켜라.

| 필드 | 바꾸기 전 | 바꾼 뒤 |
|---|---|---|
| `choices[1]` | `SCP는 연결한 자리 아래 전부에 적용되므로 루트에 붙이면 조직의 모든 계정이 걸린다` | `SCP는 연결한 자리 아래 전부에 적용되므로 루트에 붙이면 조직의 모든 멤버 계정이 걸린다` |
| `explanation` 안의 구절 | `제한할 생각이 없던 계정까지 빠짐없이 건다` | `제한할 생각이 없던 멤버 계정까지 빠짐없이 건다` |

"바꾸기 전" 문자열은 각각 정확히 한 번 있다. 없거나 두 번 이상 있으면 고치지 말고 `blocked`로 멈춘다.

### 3. 문항 기준선

`node scripts/sync-baseline.mjs --dry-run`으로 무엇이 바뀌는지 먼저 보고, `questionsSha256`만 바뀌면 `node scripts/sync-baseline.mjs`로
갱신한다. 다른 항목(개념 `name` 등)까지 바꾸려 하면 쓰지 말고 `blocked`로 멈춘다.

### 4. 테스트

`src/data/data.test.ts` 끝에 `describe('ADR-039 확장 — 권한 세트가 만드는 IAM 역할과 SCP의 관리 계정 예외', …)`를 더한다.

1. `identity-federation.identity-center-permission-set`의 문단이 3개이고, 둘째 문단이 위 (가) 문구와 같다. 첫 문단과 셋째 문단은 바꾸기 전의
   첫 문단·둘째 문단과 같다(지금 값을 문자열로 단언한다). `summary`도 그대로다.
2. `organizations-cloudtrail-config.scp-attachment-targets`의 문단이 2개이고, 첫 문단이 위 (나)의 "바꾼 뒤" 문구와 같다.
3. `q718`의 `answerIndex`가 1이고, `choices[1]`에 `조직의 모든 멤버 계정이 걸린다`가 있으며, 어느 보기에도 `조직의 모든 계정이`가 없다.
   해설에 `제한할 생각이 없던 멤버 계정까지`가 있다.

**기존 테스트는 고치지 마라.** 깨지면 고치지 말고 `blocked`로 멈춘 뒤 어느 단언인지 적는다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/check-verbatim.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff src/data/topics.json`이 두 줄(개념 둘)만 바꿨는가.
   - `git diff src/data/questions.json`이 한 줄(`q718`)만 바꿨고, 그 줄에서 `choices[1]`과 `explanation`만 달라졌는가.
   - `scripts/topics-baseline.json`에서 `questionsSha256`만 바뀌었는가.
3. `phases/50-org-identity-visuals/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념 둘과 문단 수 변화, q718의 바뀐 필드, 기준선 갱신, 더한 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **위 문구를 다듬거나 사실을 더하지 마라.** 이유: 사용자가 승인한 문장이고, 새 사실은 `docs/source/aws-docs.md`에 적힌 것만 허용된다(ADR-039).
  역할 이름 규칙, 세션 지속 시간, 위임 관리자, 서비스 연결 역할 예외를 덧붙이지 마라.
- **Identity Center가 어느 계정에서 켜지는지(관리 계정 등)를 쓰지 마라.** 이유: 이번에 출처를 더하지 않았다(ADR-037 「phase 50」).
- **q718 말고 다른 문항, 위 두 개념 말고 다른 개념을 고치지 마라.**
- **`topics.json`·`questions.json`을 다시 직렬화하지 마라.** 이유: 한 줄 형식이 깨진다.
- **도식·`src/data/visuals/`·컴포넌트를 만들지 마라.** 이유: step 1·2의 범위다.
- 기존 테스트를 깨뜨리거나 고치지 마라.
