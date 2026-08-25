# Step 0: contrast-clarify

## 배경 — 대비 대상이 빠져서 문장이 반대로 읽힌다

개념을 읽던 사용자가 두 자리에서 막혔다. 둘 다 **문장이 틀린 것이 아니라, 무엇과 대비되는지가
빠져서** 생긴 오독이다.

**1) `data-transfer-services.storage-gateway` 문단 0**

> Storage Gateway의 목적은 데이터를 한 번 옮기는 것이 아니라 스토리지를 연결한 채 사용하는 데 있다.

여기서 "옮기는 것이 아니라"는 **일회성 이사(마이그레이션)가 아니라는 뜻**인데, 대비 대상인
DataSync·Snowball Edge가 문단에 없어서 "데이터가 S3에 아예 안 간다"로 읽힌다.
바로 아래 문단 1~3이 세 유형 모두 "S3에 올린다"고 말하고 있어 앞뒤가 어긋나 보인다.

**2) `rds-storage-features.features` 문단 1~2**

Multi AZ DB Cluster와 Read Replica가 둘 다 "읽기 전용 DB를 추가한다"로 시작해서
차이가 보이지 않는다. 원본에는 이 구분이 괄호로 붙어 있었다(PAGE 19).

> Multi AZ DB Cluster … 정상적으로 작동한다. **(고가용성)** / 읽기 성능을 개선할 수 있다. **(읽기 성능 개선)**
> Read Replica … 읽기 성능을 향상시키고 기존 DB 의 부하를 줄이기 위한 기능

Read Replica 쪽에는 고가용성 언급이 없다. 즉 **원본에 있던 목적 구분이 옮겨 적는 과정에서
사라진 것**이지, 없던 사실이 아니다.

## 이 step이 새 사실을 넣지 않는다는 근거

두 변경 모두 **이미 두 원본 파일에 있는 사실을 같은 문단으로 끌어오는 것**이다.
ADR-006·ADR-008·ADR-009의 출처 제한 안에서 끝나며, **ADR-010(일반 IT 용어 예외)을 쓰지 않는다.**

| 넣을 사실 | 근거 |
|---|---|
| 세 게이트웨이 유형 모두 데이터를 S3에 저장한다 | `concepts-raw.md` PAGE 18 — 파일·볼륨·테이프 모두 "S3 에 저장해주는 게이트웨이" |
| DataSync·Snowball Edge는 옮기는 것 자체가 목적이다 | `concepts-raw.md` PAGE 16 "데이터를 전송하는 용도", PAGE 17 "대용량 데이터를 전송할 때 사용하는 서비스" |
| Multi AZ 배포 = 고가용성 | PAGE 19 "고가용성 … 확보를 위해 사용하는 기능", `exam-gaps.md` `multi-az-standby-limits` "다중 AZ 배포는 고가용성 전용 기능이다" |
| Read Replica = 읽기 확장 | PAGE 19 "읽기 성능을 향상시키고 기존 DB 의 부하를 줄이기 위한 기능", `exam-gaps.md` `connection-issue-heuristic` "읽기 전용 복제본은 읽기 부하를 나눌 뿐" |
| Multi AZ DB Cluster = 둘 다 | PAGE 19 "(고가용성)"과 "(읽기 성능 개선)" 둘 다 명시 |

**출처에 없어서 이 step이 쓰지 않는 것** — 아래를 문장에 넣지 마라. 넣으면 `blocked`다.

- 게이트웨이의 로컬 캐시 동작 (두 출처 어디에도 없다)
- Read Replica의 복제 지연·동기/비동기 구분 (없다)
- Read Replica에 자동 장애 조치가 없다는 서술 (없다 — 고가용성 언급이 *없을* 뿐이며,
  "없다"고 단정하는 것은 출처에 없는 새 사실이다)

## 실행 순서

`13-term-gloss`와 **순서가 무관하다.** 13이 손대는 문단 12개에 이 step의 대상 두 문단이
포함되지 않고, 13은 문단을 추가하지 않아 인덱스가 밀리지 않는다. 먼저 실행되어도 상관없다.

## 읽어야 할 파일

- `src/data/topics.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/check-structure.mjs` — 구조 가드레일. 이 step에서 반드시 통과해야 한다.
- `docs/ADR.md`의 ADR-009 — 원본 문장을 그대로 옮기지 않는 이유.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`topics.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/topics.json`은 **개념 하나가 정확히 한 줄**인 포맷이다.
`scripts/check-structure.mjs`가 이 줄 수(182)를 검사한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** `json.dump`나 `JSON.stringify`로
  파일을 통째로 다시 쓰면 개념 한 줄 포맷이 깨져 `check-structure.mjs`가 즉시 실패한다.
- 해당 문단의 **문자열 값만** 제자리에서 치환해라.
- 줄바꿈(`\n`)을 넣지 마라. 문장은 공백 한 칸으로 잇는다.

### 1. `data-transfer-services.storage-gateway` 문단 **0**

기존 두 문장 **사이에** 두 문장을 끼워 넣는다. 기존 문장은 글자 하나 바꾸지 않는다.

```
지금:
Storage Gateway의 목적은 데이터를 한 번 옮기는 것이 아니라 스토리지를 연결한 채 사용하는 데 있다. 자체 저장 공간을 제공하지 않으며 온프레미스와 S3 사이의 통로로 동작한다.
```

```
바꿔:
Storage Gateway의 목적은 데이터를 한 번 옮기는 것이 아니라 스토리지를 연결한 채 사용하는 데 있다. 데이터를 S3에 저장하지 않는다는 뜻은 아니며, 세 유형 모두 데이터를 S3에 저장한다. 옮기는 작업 자체가 목적인 DataSync·Snowball Edge와 달리 온프레미스에 연결된 채 계속 동작한다는 뜻이다. 자체 저장 공간을 제공하지 않으며 온프레미스와 S3 사이의 통로로 동작한다.
```

가운데 문장이 앞 문장의 "옮기는 것이 아니라"를 받고, 마지막 문장의 "자체 저장 공간을 제공하지
않으며"가 **게이트웨이 자신은 보관 주체가 아니라는 뜻**으로 읽히게 된다. 문단 1~3(파일·볼륨·
테이프 게이트웨이)은 **건드리지 마라.** 셋 다 이미 S3 저장을 말하고 있다.

### 2. `rds-storage-features.features` 문단 **2**

기존 두 문장 **사이에** 두 문장을 끼워 넣는다. 기존 문장은 글자 하나 바꾸지 않는다.

```
지금:
**Read Replica**는 읽기 요청을 맡을 전용 DB를 더해 읽기 처리 능력을 키우고 기존 DB에 걸리는 부하를 덜어 준다. 리전을 달리해 만드는 **Cross Region Read Replica**는 대규모 재해 후 서비스를 복구하는 DR(Disaster Recovery) 용도로 사용한다.
```

```
바꿔:
**Read Replica**는 읽기 요청을 맡을 전용 DB를 더해 읽기 처리 능력을 키우고 기존 DB에 걸리는 부하를 덜어 준다. 세 기능은 노리는 바가 다르다. Multi AZ 배포는 고가용성, Read Replica는 읽기 확장, Multi AZ DB Cluster는 그 둘을 함께 얻는 구성이다. 리전을 달리해 만드는 **Cross Region Read Replica**는 대규모 재해 후 서비스를 복구하는 DR(Disaster Recovery) 용도로 사용한다.
```

세 기능이 모두 정의된 **뒤**인 문단 2에 대비를 두는 것이 의도다. 문단 0(Multi AZ 배포)과
문단 1(Multi AZ DB Cluster)은 **건드리지 마라.** 문단 0은 이미 "성능 향상 효과는 없다",
문단 1은 이미 "읽기 성능까지 높인다"로 각자의 성질을 말하고 있다.

**이 두 문단이 이 step의 데이터 변경 전부다.** 개념 182개 중 2개의 문단 하나씩만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`summary`를 건드리지 마라.** 개념 제목 아래 한 줄 요약이다. 대비 문장이 들어가면 요약
  구실을 못 한다.
- **개념 `id`·`name`, 주제 메타데이터, 개념 개수와 순서를 바꾸지 마라.**
- **`paragraphs` 배열의 길이를 바꾸지 마라.** 새 문단을 만들지 않고 기존 문단 안에 끼워 넣는다.
- **`src/data/questions.json`을 건드리지 마라.** `check-structure.mjs`가 sha256으로 검사한다.
  문항은 이 step의 범위가 아니다.
- **위에 적힌 두 문단 외에는 어떤 문단도 고치지 마라.** `aurora-dynamodb-cache.aurora-reader-endpoint`,
  `rds-storage-features.multi-az-standby-limits`도 사용자가 지적한 자리지만 이 step의 범위가
  **아니다.** 둘은 출처 밖 사실이나 ADR 개정이 필요해 따로 다룬다.
- **문장을 바꿔 쓰지 마라.** 위 "바꿔" 블록의 문자열을 글자 그대로 넣는다.
- **`docs/source/`의 문장을 그대로 옮기지 마라**(ADR-009).
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 두 개를 덧붙인다.
기존 `it`을 수정하거나 지우지 마라.

```ts
it('Storage Gateway 문단이 일회성 전송과의 차이와 S3 저장 사실을 함께 밝힌다', () => {
  const concept = topics
    .flatMap((topic) => topic.concepts)
    .find(({ id }) => id === 'data-transfer-services.storage-gateway')

  expect(concept?.paragraphs).toHaveLength(4)
  expect(concept?.paragraphs[0]).toContain('스토리지를 연결한 채 사용하는 데 있다')
  expect(concept?.paragraphs[0]).toContain('세 유형 모두 데이터를 S3에 저장한다')
  expect(concept?.paragraphs[0]).toContain('DataSync·Snowball Edge와 달리')
  expect(concept?.paragraphs[0]).toContain('자체 저장 공간을 제공하지 않으며')
})

it('RDS 세 기능의 목적 차이가 Read Replica 문단에 드러난다', () => {
  const concept = topics
    .flatMap((topic) => topic.concepts)
    .find(({ id }) => id === 'rds-storage-features.features')

  expect(concept?.paragraphs).toHaveLength(5)
  expect(concept?.paragraphs[2]).toContain('Multi AZ 배포는 고가용성')
  expect(concept?.paragraphs[2]).toContain('Read Replica는 읽기 확장')
  expect(concept?.paragraphs[2]).toContain('Multi AZ DB Cluster는 그 둘을 함께 얻는 구성이다')
  expect(concept?.paragraphs[2]).toContain('Cross Region Read Replica')
})
```

## 검증 절차

아래를 그대로 실행하고 출력을 step 출력에 붙여라.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

```bash
python3 - <<'EOF'
import json, subprocess
old = json.loads(subprocess.check_output(['git', 'show', 'HEAD:src/data/topics.json']))
new = json.load(open('src/data/topics.json'))

def flat(ts):
    return [c for t in ts for c in t['concepts']]

o, n = flat(old), flat(new)
print('개념 수', len(o), '->', len(n), '(기대 182 -> 182)')
print('id 그대로', [c['id'] for c in o] == [c['id'] for c in n], '(기대 True)')
print('name 그대로', [c['name'] for c in o] == [c['name'] for c in n], '(기대 True)')
print('summary 그대로', [c['summary'] for c in o] == [c['summary'] for c in n], '(기대 True)')
print('문단 수 그대로', [len(c['paragraphs']) for c in o] == [len(c['paragraphs']) for c in n], '(기대 True)')

om = {c['id']: c for c in o}
nm = {c['id']: c for c in n}
changed = sorted(
    (c['id'], i)
    for c in n
    for i, p in enumerate(c['paragraphs'])
    if om[c['id']]['paragraphs'][i] != p
)
print('바뀐 문단', changed)
print("   (기대 [('data-transfer-services.storage-gateway', 0), ('rds-storage-features.features', 2)])")

# 끼워 넣기이므로 원문의 두 조각이 모두 남아 있어야 한다
frags = {
    ('data-transfer-services.storage-gateway', 0): [
        'Storage Gateway의 목적은 데이터를 한 번 옮기는 것이 아니라 스토리지를 연결한 채 사용하는 데 있다.',
        '자체 저장 공간을 제공하지 않으며 온프레미스와 S3 사이의 통로로 동작한다.',
    ],
    ('rds-storage-features.features', 2): [
        '**Read Replica**는 읽기 요청을 맡을 전용 DB를 더해 읽기 처리 능력을 키우고 기존 DB에 걸리는 부하를 덜어 준다.',
        '리전을 달리해 만드는 **Cross Region Read Replica**는 대규모 재해 후 서비스를 복구하는 DR(Disaster Recovery) 용도로 사용한다.',
    ],
}
for (cid, i), parts in frags.items():
    p = nm[cid]['paragraphs'][i]
    print(f'{cid} [{i}] 원문 조각 보존', all(f in p for f in parts), '(기대 True)')
EOF
```

```bash
python3 - <<'EOF'
import json
topics = json.load(open('src/data/topics.json'))
concepts = {c['id']: c for t in topics for c in t['concepts']}

# 출처 밖 서술이 들어가지 않았는지 — 전부 0이어야 한다
banned = ['캐시로', '캐싱', '비동기 복제', '동기 복제', '복제 지연', '자동 장애 조치가 없']
for word in banned:
    hits = [cid for cid, c in concepts.items()
            if any(word in p for p in c['paragraphs']) and cid in (
                'data-transfer-services.storage-gateway', 'rds-storage-features.features')]
    print(f'{word:16s} {hits} (기대 [])')
EOF
```

```bash
grep -c '^      {"id":"' src/data/topics.json   # 182
```

`git diff --stat`이 `src/data/topics.json`과 `src/data/data.test.ts` **두 파일만**
보여야 한다(`phases/` 갱신 제외).

## 완료 조건

- 위 네 명령(`test`·`lint`·`build`·`check-structure`)이 모두 통과한다.
- 검증 스크립트의 모든 줄이 기대값과 일치한다. 특히 **바뀐 문단이 정확히 그 둘**이고,
  **id·name·summary·문단 수가 전부 `True`**이며, **원문 조각 보존이 둘 다 `True`**여야 한다.
- 금지어 검사가 전부 `[]`다.
- `grep -c`가 182를 출력한다(개념 한 줄 포맷 유지).
- 변경된 파일이 `src/data/topics.json`, `src/data/data.test.ts` 둘뿐이다.
