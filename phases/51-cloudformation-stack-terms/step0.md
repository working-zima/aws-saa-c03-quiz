# Step 0: stack-terms

## 배경

사용자가 드리프트 감지의 요약 "스택으로 만든 리소스가 템플릿과 달라졌는지 보는 기능이라, 스택 밖 리소스는 보지 못한다"를 읽고 "스택으로
만들었다"가 무슨 뜻인지 모르겠다고 했다(2026-10-10). 데이터는 `스택`과 `드리프트`를 쓰기만 하고 정의하지 않는다. 사용자 결정으로 AWS 공식
문서를 근거로 정의를 더한다(ADR-039 「2026-10-10 확장 — CloudFormation의 템플릿·스택·드리프트(phase 51)」). 근거와 URL은
`docs/source/aws-docs.md`의 「템플릿·스택·드리프트」에 있다. 아래 문구는 사용자가 승인한 것이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-010, ADR-029, ADR-039**(끝의 확장 문단 모두)
- `docs/source/aws-docs.md`의 「템플릿·스택·드리프트」
- `src/data/topics.json`의 `governance-iac.cloudformation`, `governance-iac.cloudformation-drift-detection`
- `src/data/questions.json`의 `q296`, `q299`, `q301`
- `src/data/data.test.ts`: 끝의 `describe('ADR-039 확장 — …', …)` 묶음들이 같은 종류 테스트의 선례다. 거버넌스 주제 테스트가
  `'인프라 구성을 파일로 적어 두고 그대로 배포하며'`와 `'계정의 모든 지원 리소스를 대상으로 삼는 쪽은 AWS Config다'`를 단언한다 — 두 구절은 그대로 남는다.
  서비스 분류 첫 문장 테스트가 `governance-iac.cloudformation`의 첫 문단을 본다 — 첫 문단은 바꾸지 않는다.
- `scripts/check-structure.mjs`, `scripts/sync-baseline.mjs`

## 작업

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 데이터를 고친다.

### 1. `src/data/topics.json`

**파일 형식을 지켜라.** 개념 하나가 한 줄인 형식을 `check-structure.mjs`가 검사한다. 파일 전체를 다시 직렬화하지 말고 해당 줄 안의 문자열만
바꾼다. 아래 문구를 **글자 그대로** 쓴다(ADR-009 — 이미 직접 쓴 문장이다). `id`·`name`은 바꾸지 않는다.

**(가) `governance-iac.cloudformation`**: 지금 첫 문단과 둘째 문단 **사이에** 새 문단을 넣는다(문단 2개 → 3개). `summary`와 기존 두 문단은
한 글자도 바꾸지 않는다.

```
CloudFormation에서 만들 리소스와 설정을 적어 두는 파일이 **템플릿**(template)이고, 그 템플릿을 제출해 실제로 만든 리소스 묶음이 **스택**(stack)이다. 스택을 만들면 CloudFormation이 템플릿에 적힌 리소스를 모두 만들고, 그 뒤로 이 리소스들은 스택 단위로 함께 고치고 함께 지운다. 예를 들어 로드 밸런서와 데이터베이스를 적은 템플릿으로 스택을 만들면, 둘은 한 스택에 속해 하나의 단위로 관리된다.
```

**(나) `governance-iac.cloudformation-drift-detection`**

`summary`를 바꾼다.

- 바꾸기 전: `스택으로 만든 리소스가 템플릿과 달라졌는지 보는 기능이라, 스택 밖 리소스는 보지 못한다.`
- 바꾼 뒤: `CloudFormation 스택에 속한 리소스가 템플릿과 달라졌는지 보는 기능이라, 스택 밖에서 만든 리소스는 보지 못한다.`

`paragraphs`의 **맨 앞에** 새 문단을 넣는다(문단 2개 → 3개). 기존 두 문단은 한 글자도 바꾸지 않는다.

```
스택에 속한 리소스도 누군가 CloudFormation을 거치지 않고 콘솔 등에서 직접 바꿀 수 있다. 이렇게 템플릿에 적힌 값과 실제 값이 달라진 상태를 **드리프트**(drift)라 하고, 드리프트 감지는 두 값을 비교해 달라진 리소스를 찾는다.
```

### 2. `src/data/questions.json`

세 문항의 `explanation`에서 아래 구절만 바꾼다. `prompt`·`choices`·`answerIndex`·`conceptId`·`topicId`와 해설의 나머지 문장은 그대로다.
파일 형식(문항 하나가 한 줄)을 지켜라.

| 문항 | 바꾸기 전 | 바꾼 뒤 |
|---|---|---|
| `q301` | `CloudFormation이 만들고 관리하는 리소스에만 동작하고 스택이 있어야 하므로` | `CloudFormation이 템플릿으로 만들어 한 단위로 관리하는 리소스 묶음, 곧 스택에 속한 리소스에만 동작하므로` |
| `q296` | `드리프트 감지는 스택으로 만든 리소스가` | `드리프트 감지는 CloudFormation 스택으로 만든 리소스가` |
| `q299` | `드리프트 감지는 스택으로 만든 리소스가` | `드리프트 감지는 CloudFormation 스택으로 만든 리소스가` |

각 "바꾸기 전" 구절은 그 문항의 해설에 정확히 한 번 있다. 없거나 두 번 이상 있으면 고치지 말고 `blocked`로 멈춘다.

### 3. 문항 기준선

`node scripts/sync-baseline.mjs --dry-run`으로 무엇이 바뀌는지 먼저 보고, `questionsSha256`만 바뀌면 `node scripts/sync-baseline.mjs`로
갱신한다. 다른 항목(개념 `name` 등)까지 바꾸려 하면 쓰지 말고 `blocked`로 멈춘다.

### 4. 테스트

`src/data/data.test.ts` 끝에 `describe('ADR-039 확장 — CloudFormation의 템플릿·스택·드리프트', …)`를 더한다.

1. `governance-iac.cloudformation`의 문단이 3개이고 둘째 문단이 위 (가) 문구와 같다. 첫 문단과 셋째 문단은 바꾸기 전의 첫 문단·둘째 문단과
   같다(지금 값을 문자열로 단언한다). `summary`도 그대로다.
2. `governance-iac.cloudformation-drift-detection`의 `summary`가 위 "바꾼 뒤"와 같다. 문단이 3개이고 첫 문단이 위 (나) 문구와 같다.
   둘째·셋째 문단은 바꾸기 전의 두 문단과 같다.
3. `q301`의 해설에 `곧 스택에 속한 리소스에만 동작하므로`가 있고 `스택이 있어야 하므로`가 없다. `q296`·`q299`의 해설에
   `드리프트 감지는 CloudFormation 스택으로 만든 리소스가`가 있다. 세 문항의 `answerIndex`가 `q296` 0, `q299` 0, `q301` 2다.

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
   - `git diff src/data/questions.json`이 세 줄(문항 셋)만 바꿨고, 각 줄에서 `explanation`만 달라졌는가.
   - `scripts/topics-baseline.json`에서 `questionsSha256`만 바뀌었는가.
3. `phases/51-cloudformation-stack-terms/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 개념 둘과 문단 수 변화, 바꾼 해설 셋, 기준선 갱신, 더한 테스트 수와 전체 테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **위 문구를 다듬거나 사실을 더하지 마라.** 이유: 사용자가 승인한 문장이고, 새 사실은 `docs/source/aws-docs.md`에 적힌 것만 허용된다(ADR-039).
  변경 세트·중첩 스택·드리프트 상태 코드·지원하지 않는 리소스 목록을 덧붙이지 마라.
- **`governance-iac.control-tower-controls`의 "스택 작업"이나 다른 개념·문항을 고치지 마라.** 이유: 이번 범위는 위 다섯 자리다.
- **도식(`DriftScopeDiagram`)과 `src/data/visuals/`를 고치지 마라.** 이유: 도식의 "스택" 그룹은 이 정의와 맞고, 이번 범위가 아니다.
- **보기·정답·`prompt`를 바꾸지 마라.**
- **`topics.json`·`questions.json`을 다시 직렬화하지 마라.** 이유: 한 줄 형식이 깨진다.
- 기존 테스트를 깨뜨리거나 고치지 마라.
