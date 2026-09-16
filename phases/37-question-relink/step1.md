# Step 1: apply-relink

**`relink.json`에 적힌 문항 16건의 `topicId`·`conceptId`를 실제로 바꾼다.** 그리고 그 변경 때문에
어긋나는 `src/data/data.test.ts` 단언 네 자리와 `scripts/topics-baseline.json`의
`questionsSha256`을 함께 갱신한다. **이 세 파일 말고는 아무것도 바꾸지 않는다.**

## 이 phase의 범위 — 사용자가 정한 것을 그대로 옮긴다

phase 35(문항 topic 감사)와 phase 36(개념 topic 감사)의 결과 중 **조건 없이 실행 가능한 문항
재연결 16건만** 고친다. 목록과 값은 step 0이 만든 `phases/37-question-relink/relink.json`에 있다.
**그 파일이 이 step의 유일한 입력이다.**

- **Type 2A (14건)** — 같은 주제 안에서 `conceptId`만 바꾼다.
- **Type 2B (2건)** — `topicId`와 `conceptId`를 함께 바꾼다.

**금지 — 범위 밖이다.** 개념 내용 수정 · 개념 배열 변경 · 개념 이동 · 주제 제목 변경 · 새 문항 추가 ·
문항의 `prompt`·`choices`·`explanation`·`answerIndex` 수정 · `ambiguous` 후보 정리 ·
`medium`/`low` 후보 수정 · `q152`·`q153`·`q154`·`q223`·`q225`·`q400`·`q728` 손대기.

## 읽어야 할 파일

- `phases/37-question-relink/step0.md` — 이 phase의 범위와 검증기 명세
- `phases/37-question-relink/relink.json` — **16건의 `from`→`to` 매핑과 수정 전 다이제스트**
- `phases/37-question-relink/tools/verify-relink.mjs` — 전용 검증기(`--pre`/`--post`)
- `docs/ADR.md` — ADR-026(개념당 최소 1문항), ADR-034(재배정은 `topicId`와 `conceptId`를 함께 옮긴다)
- `src/data/questions.json` — 문항 하나가 정확히 한 줄이다
- `src/data/data.test.ts` — 아래에서 고칠 네 자리가 들어 있다
- `scripts/check-structure.mjs`·`scripts/sync-baseline.mjs` — 구조 가드레일과 스냅샷 갱신 도구

## 작업

### 1. `src/data/questions.json` — 16개 문항의 연결만 바꾼다

**줄 단위로 바꿔라.** `JSON.parse` → `JSON.stringify`로 파일 전체를 다시 쓰지 마라.
이유: 이 파일은 **문항 하나가 정확히 한 줄**인 형식이고, 재직렬화하면 732줄 전부가 diff에 뜬다.
그러면 「16줄만 바뀌었다」를 사람이 눈으로 확인할 수 없고, `check-structure.mjs`가 지키는 한 줄
포맷의 의미도 사라진다.

각 줄은 반드시 아래 형태로 시작한다. **앞의 세 필드만 바꾸고 줄의 나머지는 바이트 그대로 둔다.**

```
{"id":"q037","topicId":"...","conceptId":"...","prompt":...
```

바꾸기 전에 그 줄의 현재 `topicId`·`conceptId`가 `relink.json`의 `from`과 같은지 확인하고,
다르면 **고치지 말고 멈춰라**(`blocked`).

바뀌는 줄은 정확히 **16줄**이고, 줄의 나머지가 그대로면 결과 파일의 sha256이 아래 값으로 결정된다.

```
6b59d6992fdba56d0f934ced16216476b057557c70df722c48d526586f6d0106
```

다른 값이 나오면 16줄 밖을 건드렸거나 파일을 재직렬화한 것이다. 해시를 맞추려고 파일을 억지로
주무르지 말고, 무엇이 더 바뀌었는지 찾아 그것을 되돌려라.

### 2. `src/data/data.test.ts` — 어긋나는 단언 네 자리만 갱신한다

16건 중 넷이 구간별 단언과 맞물린다. **아래 네 자리 말고는 이 파일을 건드리지 마라.**

#### (A) `step4Concepts` — `q344`가 `efs-fsx.efs-lifecycle-management`로 옮겨 온다

배열 끝에 한 줄을 더하고, 바로 위에 이유를 한 줄 주석으로 남긴다.

```ts
    'efs-fsx.fsx-lustre-s3-data-repository-association',
    // phase 37 — q344를 efs-lifecycle-management로 재연결해 이 구간이 덮는 개념이 하나 늘었다.
    'efs-fsx.efs-lifecycle-management',
  ]
```

같은 블록의 `it` 제목에서 개념 수를 고친다.

- `'공유 파일 스토리지 문제 24개가 담당 개념 21개를 빠짐없이 덮는다'`
  → `'공유 파일 스토리지 문제 24개가 담당 개념 22개를 빠짐없이 덮는다'`

#### (B) `step8Concepts` — `q465`가 `secrets-encryption.acm`으로 나간다

```ts
    'elastic-load-balancing.gwlb-endpoint-cross-account-inspection',
    // phase 37 — q465를 secrets-encryption.acm으로 재연결해 이 구간이 다른 주제의 개념 하나를 덮는다.
    'secrets-encryption.acm',
  ]
```

`it` 제목: `'EC2·로드 밸런서 문제 32개가 담당 개념 28개를 빠짐없이 덮는다'`
→ `'EC2·로드 밸런서 문제 32개가 담당 개념 29개를 빠짐없이 덮는다'`

같은 `it` 안의 `topicId` 단언을 고친다. `q465`는 이 구간(`q435`~`q466`)의 **31번째**다.

```ts
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(18).fill('ec2-autoscaling'),
      ...Array(12).fill('elastic-load-balancing'),
      'secrets-encryption',
      'elastic-load-balancing',
    ])
```

#### (C) `step9Concepts` — `q472`가 `global-accelerator-protocols`로 옮겨 온다

```ts
    'cloudfront-global-accelerator.cloudfront-functions-no-external-calls',
    // phase 37 — q472를 global-accelerator-protocols로 재연결해 이 구간이 덮는 개념이 하나 늘었다.
    'cloudfront-global-accelerator.global-accelerator-protocols',
  ]
```

`it` 제목: `'CloudFront·엣지 문제 22개가 담당 개념 19개를 빠짐없이 덮는다'`
→ `'CloudFront·엣지 문제 22개가 담당 개념 20개를 빠짐없이 덮는다'`

#### (D) `step10Concepts` — `q508`이 `rds-storage-features.rds-custom`으로 나간다

```ts
    'lambda.serverless-runtime-no-os-access',
    // phase 37 — q508을 rds-storage-features.rds-custom으로 재연결해 이 구간이 다른 주제의 개념 하나를 덮는다.
    'rds-storage-features.rds-custom',
  ]
```

`it` 제목: `'Lambda 문제 20개가 담당 개념 15개를 빠짐없이 덮는다'`
→ `'Lambda 문제 20개가 담당 개념 16개를 빠짐없이 덮는다'`

같은 `it` 안의 `topicId` 단언을 고친다. `q508`은 이 구간(`q489`~`q508`)의 **마지막**이다.

```ts
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(19).fill('lambda'),
      'rds-storage-features',
    ])
```

**다른 단언이 깨지면 그 자리를 먼저 보고하라.** 위 넷은 실측으로 확인한 전부다. 다섯 번째가
나오면 `relink.json`을 잘못 적용했을 가능성이 높다. 단언을 지우거나 느슨하게 만들어 통과시키지 마라.

### 3. `scripts/topics-baseline.json` — 해시만 갱신한다

```bash
node scripts/sync-baseline.mjs
```

이 도구는 개념 `name`과 `questionsSha256`만 고치고, 주제·개념의 구조가 어긋나 있으면 아무것도 쓰지
않고 exit 1로 끝난다. **손으로 고치지 마라.** 이번 phase에서는 `questionsSha256` 한 줄만 바뀐다 —
도구가 「개념 name 0건, questionsSha256 갱신」이라고 찍어야 한다. 개념 `name`이 하나라도 갱신됐다고
나오면 `topics.json`을 건드렸다는 뜻이므로 멈춰라.

## Acceptance Criteria

```bash
node phases/37-question-relink/tools/verify-relink.mjs --post

npm run lint
npm run build
npm test
node scripts/check-structure.mjs
node scripts/coverage.mjs

# questions.json은 16줄의 topicId·conceptId만 바뀐다 — 그러면 결과 파일의 해시가 결정된다
node -e "const c=require('crypto'),f=require('fs');const g=c.createHash('sha256').update(f.readFileSync('src/data/questions.json')).digest('hex');if(g!=='6b59d6992fdba56d0f934ced16216476b057557c70df722c48d526586f6d0106')throw new Error('questions.json이 기대한 결과와 다르다: '+g.slice(0,16));console.log('questions.json 16줄 재연결 결과 일치')"

# topics.json은 바이트 단위로 같다
node -e "const c=require('crypto'),f=require('fs');const g=c.createHash('sha256').update(f.readFileSync('src/data/topics.json')).digest('hex');if(!g.startsWith('5a227aea172ca391'))throw new Error('topics.json이 바뀌었다');console.log('topics.json 바이트 불변')"

# phase 35·36 감사 산출물은 그대로다
node -e "const c=require('crypto'),f=require('fs');const want={'phases/35-question-topic-audit/audit/verdicts.jsonl':'fc56b769b25279b4','phases/36-concept-topic-audit/audit/verdicts.jsonl':'7b3c6f3054b69783','phases/36-concept-topic-audit/audit/cross-phase35.jsonl':'effc860809f8605f'};for(const[p,h]of Object.entries(want)){const g=c.createHash('sha256').update(f.readFileSync(p)).digest('hex');if(!g.startsWith(h))throw new Error('감사 파일이 바뀌었다: '+p)}console.log('감사 산출물 3종 그대로')"
```

## 검증 절차

1. 위 AC 커맨드를 전부 실행한다. `coverage.mjs`는 「개념 618개 중 618개 덮임 (100%)」이어야 한다.
2. 아키텍처 체크리스트:
   - `src/data/questions.json`의 문항 한 줄 포맷이 유지되는가?
   - 학습 데이터가 여전히 빌드 타임 정적 JSON인가? 런타임 외부 호출을 넣지 않았는가?
   - 새 의존성을 추가하지 않았는가? (Node 18.17.1)
3. `phases/37-question-relink/index.json`의 step 1을 갱신한다.
   - 통과 → `"status": "completed"`, `"summary"`에 바뀐 파일과 16건 적용 결과를 한 줄로
   - 3회 수정 후에도 실패 → `"status": "error"` + `"error_message"`
   - `from`이 현재 데이터와 어긋남 → `"status": "blocked"` + `"blocked_reason"`에 어긋난 문항 id

## 금지사항

- **문항의 `prompt`·`choices`·`explanation`·`answerIndex`를 고치지 마라.** 이유: 이번 phase는
  연결 오류만 바로잡는다. 제품 콘텐츠 문구는 범위 밖이다.
- **`src/data/topics.json`을 고치지 마라.** 이유: 개념 내용·배열·이동은 전부 범위 밖이고, 이 파일은
  바이트 단위로 같아야 한다.
- **`JSON.parse`/`JSON.stringify`로 `questions.json` 전체를 다시 쓰지 마라.** 이유: 문항 한 줄
  포맷이 깨져 16줄만 바뀌었음을 확인할 수 없게 된다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** 이유: `sync-baseline.mjs`가 거부하는
  변경을 손으로 통과시키면 가드레일이 고무도장이 된다.
- **깨지는 단언을 지우거나 조건을 느슨하게 바꾸지 마라.** 이유: 지정한 네 자리 밖에서 단언이 깨지면
  적용이 잘못됐다는 신호다. 신호를 지우지 말고 보고하라.
- **`relink.json`과 `tools/verify-relink.mjs`를 고치지 마라.** 이유: step 0의 산출물이고,
  검증 대상이 검증기를 고치면 검증이 성립하지 않는다.
- 기존 테스트를 깨뜨리지 마라.
