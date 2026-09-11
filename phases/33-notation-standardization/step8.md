# Step 8: emr-primary-node

**EMR 주 노드 → 프라이머리 노드** — 이 step이 맡은 표기는 이 하나다.

## 이 phase의 범위 — 용어 표기 치환뿐이다

사용자의 말을 그대로 옮긴다.

> 이번 phase의 목적은 용어 표기 통일뿐이다.
> **사실관계, 정답 논리, 문항 구조, 수치나 조건은 변경하지 마.**
> `paragraphs`와 `explanation`도 이번 phase에서는 필요한 범위에 한해 수정 가능하게 하되,
> **표기 치환 외의 문장 수정은 하지 마.**

**phase 32와 다른 점이 하나 있다.** 그때는 `paragraphs`·`explanation`이 얼어 있었지만
이번에는 열린다 — 같은 대상을 두 이름으로 부르는 자리가 그 두 필드에 걸쳐 있어 열지 않으면
통일할 수 없기 때문이다. **열렸다는 것은 고쳐도 된다는 뜻이지 다듬어도 된다는 뜻이 아니다.**
낱말을 바꾸는 것 외에 문장을 손대면 아래 도구가 잡는다.

## 가드레일 — 기계가 잡는다

```bash
node scripts/notation-diff.mjs 7f46259          # 바뀐 것이 표기 치환으로 설명되는지 본다
node scripts/notation-diff.mjs 7f46259 --list   # 바뀐 항목의 id를 전부 찍는다
```

이 도구는 승인된 표기 짝을 같은 자리표로 바꾼 뒤 기준 커밋과 대조한다.

| 결과 | 뜻 |
|---|---|
| 정규화한 것이 같다 | 바뀐 것은 표기뿐이다. **통과** |
| 정규화해도 다르다 | 표기 말고 문장·수치·조건이 바뀌었다. **exit 1** |
| 구조가 바뀌었다 | `answerIndex`·id·순서·개수·문단 수·보기 수. **exit 1** |

**exit 1이면 되돌려라.** 부분 치환은 통과한다 — SNS의 `토픽`만 바꾸고 Kafka의 `토픽`을
두는 것이 이번 요구이므로 그렇게 설계돼 있다.

## 표준을 이렇게 정한 근거

AWS 한국어 EMR 문서 제목이 "노드 유형 이해: **프라이머리, 코어 및 태스크 노드**"다(예전 master node에서 개명된 이름).

## 이 step의 주의점

**⚠ 가장 조심해야 하는 step이다. `주 노드`는 두 서비스에 있다.** `emr-glue-athena`와 `q629`·`q617` 계열의 것은 **EMR**이라 바꾸고, `elasticache-purpose-built-db.elasticache-multi-az-failover`와 `q429`의 것은 **ElastiCache Redis의 노드**라 **사용자가 건드리지 말라고 명시했다.** 일괄 치환하면 ElastiCache까지 바뀐다. **주제 id로 먼저 갈라라.**

## 지켜야 할 것

1. **문맥을 먼저 갈라라.** 같은 낱말이라도 다른 대상을 가리키면 **건드리지 않는다.**
   아래 대상 목록에 문맥 조각을 붙여 두었으니 읽고 판단해라.
2. **정답 보기가 걸린 문항은 보기 넷을 통째로 본다.** 한 보기만 표기를 바꾸면 그 보기가
   나머지 셋과 결이 달라지고 **그 차이가 정답을 가리키는 신호가 된다.** 넷 중 둘 이상이 같은
   낱말을 쓰고 있으면 **함께 바꾼다.** 한쪽만 바꿔야 할 이유가 있으면 `summary`에 적어라.
3. **`data.test.ts`가 글자로 고정한 자리는 단언도 함께 고친다.** 대상 목록에 `⚠단언`으로
   표시했다. **단언의 뜻을 바꾸거나 지우지 마라.** 문구만 새 표기로 맞춘다.
4. **개념 `name`을 고쳤거나 `questions.json`을 고쳤으면 `node scripts/sync-baseline.mjs`를
   돌린다.** `scripts/topics-baseline.json`을 손으로 고치지 마라.
5. **받침이 달라지면 조사를 반드시 함께 고쳐라.** `토픽이` → `주제가`, `토픽을` → `주제를`,
   `토픽이어야` → `주제여야`가 그런 자리다. 한국어 문법이 강제하는 것이라 고치지 않으면
   비문이 된다. `notation-diff.mjs`는 자리표 뒤의 조사와 계사 활용을 함께 눌러 대조하므로
   **이런 변경은 위반으로 잡지 않는다.** 반대로 조사를 안 고치고 두면 문장이 깨진다.

## 대상 목록 — `주 노드`이 든 자리 11곳

**이 목록이 전부다.** 문맥 조각을 읽고 바꿀 자리와 둘 자리를 갈라라.

**`elasticache-purpose-built-db`**

- `elasticache-purpose-built-db.elasticache-multi-az-failover` `summary` — 다중 AZ를 켜면 다른 가용 영역에 복제 노드를 두고, 주 노드가 죽으면 그 복제본을 자동으로 승격시킨다.
- `elasticache-purpose-built-db.elasticache-multi-az-failover` `paragraphs[0]` — ElastiCache의 다중 AZ 구성은 주 노드와 복제 노드를 서로 다른 가용 영역에 둔다. 장애를 감지하면…
- `q429` `prompt` — ElastiCache 클러스터의 주 노드에 장애가 났을 때 사람이 손대지 않고 넘어가야 하는 상황이다…
- `q429` `explanation` — …che의 다중 AZ(Availability Zone) 구성은 주 노드와 복제 노드를 서로 다른 가용 영역에 두고, 장애를 감지하면…

**`emr-glue-athena`**

- `emr-glue-athena.emr-node-instance-family-choice` `summary` — …드가 요구하는 제품군은 그쪽에 쓰고, 클러스터를 관리만 하는 주 노드는 범용으로 둔다.
- `emr-glue-athena.emr-node-instance-family-choice` `paragraphs[0]` — 주 노드는 조정과 모니터링을 포함한 클러스터 운영을 맡을 뿐 데이터를…
- `emr-glue-athena.emr-node-instance-family-choice` `paragraphs[2]` — 주 노드에만 좋은 제품군을 몰아주면 데이터를 처리하지 않는 노드에 붙…
- `q629` `choices[0]★` — 코어 노드와 태스크 노드에 사용하고 주 노드는 범용으로 둔다
- `q629` `choices[1]` — 주 노드에만 사용하고 나머지는 범용으로 둔다
- `q629` `choices[2]` — 주 노드와 코어 노드에 사용하고 태스크 노드는 범용으로 둔다
- `q629` `explanation` — 주 노드는 조정과 모니터링을 포함한 클러스터 운영을 맡을 뿐 데이터를…


### 정답 보기가 걸린 문항 — 보기 넷을 한 벌로 보고 판단해라

**`q629`** — 테라바이트 규모의 데이터를 메모리에 올려 다루는 EMR 작업에 메모리 최적화 인스턴스를 도입하려는 상황이다. 이 제품군을 어느 노드에 사용해야 …

- ★정답 `c0` — 코어 노드와 태스크 노드에 사용하고 주 노드는 범용으로 둔다
-   오답 `c1` — 주 노드에만 사용하고 나머지는 범용으로 둔다
-   오답 `c2` — 주 노드와 코어 노드에 사용하고 태스크 노드는 범용으로 둔다
-   오답 `c3` — 모든 노드를 범용으로 두고 노드 수만 늘린다


## 작업 순서

1. 아래 대상 목록을 **문맥 조각과 함께** 읽고, 바꿀 자리와 둘 자리를 먼저 가른다.
2. 바꾼다. **낱말만 바꾼다.**
3. 정답 보기가 걸린 문항은 보기 넷을 다시 읽는다.
4. `node scripts/sync-baseline.mjs` → `npm test` → 깨지면 단언 문구만 맞춘다.
5. `node scripts/notation-diff.mjs 7f46259`가 exit 0인지 본다.

## Acceptance Criteria

```bash
npm test                                    # 전부 통과
npm run build                               # tsc 타입체크 포함
npm run lint
node scripts/sync-baseline.mjs              # 거부당하면 범위를 넘은 것이다
node scripts/check-structure.mjs            # exit 0
node scripts/notation-diff.mjs 7f46259        # exit 0 — 표기 치환으로만 설명돼야 한다
node scripts/coverage.mjs                   # 618/618
node scripts/check-verbatim.mjs
```

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `node scripts/notation-diff.mjs 7f46259 --list`를 읽고 **이 step이 맡은 표기 말고
   다른 것이 바뀌지 않았는지** 확인한다.
3. `phases/33-notation-standardization/index.json`의 이 step을 갱신한다.
   - 성공 → `"status": "completed"`, `"summary"`
   - 3회 시도 후에도 실패 → `"status": "error"`, `"error_message"`
   - 사용자 판단 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## `summary`에 남길 것

마지막 step이 이것만 보고 사용자 보고서를 쓴다.

1. **바꾼 건수** — 표기별로, 그리고 필드별로(`name`·`summary`·`paragraphs`·`prompt`·`choices`·`explanation`)
2. **문맥이 달라 두고 온 자리와 그 이유** — 이것이 이 step의 핵심 산출물이다
3. **정답 보기를 고친 문항 id와, 보기 넷을 함께 봤는지**
4. **`data.test.ts` 단언을 고쳤으면 어느 것을 어떻게**

## 금지사항

- **표기 치환 외의 문장 수정을 하지 마라.** 이유: 사용자가 이 phase의 목적을 표기 통일
  하나로 못 박았고, `notation-diff.mjs`가 exit 1로 잡는다.
- **`answerIndex`·id·문항 순서·문단 수·보기 수를 바꾸지 마라.** 이유: 정답이 달라지고
  `data.test.ts`·`check-structure.mjs`가 불변식으로 고정한다.
- **수치·조건·서비스 특성·제한 사항을 건드리지 마라.**
- **다른 step이 맡은 표기를 건드리지 마라.** 이유: step마다 표기를 나눈 것이 이 phase의 구조다.
- **`Deny`와 `거부`를 통일하지 마라.** 이유: 표기 갈림이 아니다. `Deny`는 IAM 정책의
  `Effect` 값이고 `거부`는 그 동작을 설명하는 서술어다. 사용자가 작업 대상에서 뺐다.
- **`scripts/topics-baseline.json`을 손으로 고치지 마라.** `sync-baseline.mjs`를 써라.
- 기존 테스트를 깨뜨리지 마라.
