# 다음에 할 일 — 이어받을 때 읽는 문서

## phase 33 결과 보고 (2026-09-11) — 용어 표기 통일이 끝났다

`feat-33-notation-standardization`에서 step 0~11을 전부 끝냈다. 같은 대상을 두 이름으로
부르던 **표기 짝 15개**를 통일했고, phase 32와 달리 **`paragraphs`와 `explanation`을 열었다** —
갈린 자리가 그 두 필드에 걸쳐 있어 열지 않으면 통일할 수 없었기 때문이다.
그 대신 `scripts/notation-diff.mjs`가 매 step **「바뀐 것이 표기 치환으로 설명되나」**를 확인해,
사실관계·정답 논리·수치·조건이 움직이지 않았음을 기계로 보장했다.
아래 여섯 절은 사용자가 완료 후 정리해 달라고 한 항목이고, 그 순서 그대로다.
**아직 push하지 않았다.**

> 아래쪽의 「phase 32 결과 보고」와 그보다 앞선 절들은 이 절보다 먼저 쓰인 것이라 낡았다.
> 당시 기록으로 그대로 둔다.

### 1. 항목별 실제 수정 건수

기준은 phase 착수 커밋 `7f46259`이고, 아래는 `node scripts/notation-diff.mjs 7f46259 --list`의
**잔량 실측**이다(occurrence 기준). 각 step의 `summary`에 적힌 자기 보고 수치가 아니다.

| 표기 짝 (**표준** / 비표준) | 착수 | 지금 | step |
|---|---|---|---|
| **주제** / 토픽 | 25 / **61** | **86** / 0 | 0 |
| **FIFO 대기열** / FIFO 큐 | 4 / **14** | **18** / 0 | 1 |
| **네트워크 ACL** / 네트워크 접근 제어 목록 | 21 / **9** | **30** / 0 | 2 |
| **권한 세트** / Permission Set | 14 / **8** | **22** / 0 | 3 |
| **액세스 키** / Access Key | 30 / **14** | **44** / 0 | 4 |
| **IAM Identity Center** / Identity Center | 7 / **25** | **21**(+ AWS형 8) / 3 | 5 |
| **가상 프라이빗 게이트웨이** / Virtual Private Gateway | 13 / **2** | **15** / 0 | 9 |
| **프라이머리 노드** / 주 노드 | 9 / **14** | **17** / 6 | 8 |
| **Performance Insights** / Performance Insight | 6 / **14** | **20** / 0 | 6 |
| **전용 하드웨어 보안 모듈** / 전용 하드웨어 모듈 | 8 / **10** | **18** / 0 | 7 |
| **음성** / 말소리 | 5 / **3** | **8** / 0 | 9 |
| **퍼블릭 IP** / 퍼블릭 주소 | 3 / **2** | **5** / 0 | 9 |
| **IP 세트** / IP Set | 19 / **3** | **22** / 0 | 9 |
| **결제 콘솔** / 결제 대시보드 | 5 / **2** | **7** / 0 | 9 |
| **기본 부하** / 기준이 되는 부하 | 4 / **2** | **6** / 0 | 9 |

**열다섯 짝 중 열셋이 비표준 0이다.** 남은 둘은 실패가 아니라 판정이다 —
`Identity Center` 3건과 `주 노드` 6건이며 이유는 6절에 있다.

**낱말 총량이 한 줄도 어긋나지 않는다.** 각 줄에서 `착수 표준 + 착수 비표준 = 지금 표준 + 지금 비표준`이
정확히 성립한다(주제 25+61=86, FIFO 4+14=18, ACL 21+9=30, 권한 세트 14+8=22, 액세스 키 30+14=44,
Identity Center 계열 0+7+25=8+21+3=32, VGW 13+2=15, 노드 9+14=17+6=23, Insights 6+14=20,
HSM 8+10=18, 음성 5+3=8, 퍼블릭 IP 3+2=5, IP 세트 19+3=22, 결제 콘솔 5+2=7, 기본 부하 4+2=6).
**낱말이 사라지거나 새로 생긴 자리가 없다는 뜻이고**, 치환이 온전히 1:1이었음을
잔량 집계만으로 독립 확인해 준다.

### 2. 필드별 변경 건수 — `paragraphs`·`explanation`이 이번 phase의 핵심이다

`notation-diff.mjs`가 찍는 필드별 표다. 도구는 **슬롯(필드 하나) 단위**로 센다.

| 필드 | 바뀐 슬롯 | 모수 |
|---|---|---|
| 개념 `name` | 8 | 618 |
| 개념 `summary` | 12 | 618 |
| **개념 `paragraphs`** | **28** | 618개념의 전체 문단 |
| 문항 `prompt` | 7 | 732 |
| 문항 `choices` | 56 | 732×4 |
| **문항 `explanation`** | **34** | 732 |
| 합계 | **145** | |

**이번에 연 두 필드에서 62건이 바뀌었다 — 전체 145건의 43%다.** phase 32가 그 둘을 얼려 둔 채로는
손댈 수 없던 자리이고, 실제로 `explanation` 34건 중 상당수가 **보기·프롬프트는 새 표기인데 해설만
옛 표기로 남아 같은 화면에서 두 이름을 가르치던 자리**였다(`q243`은 정답 보기가 「결제 콘솔」인데
해설이 「결제 대시보드」였고, `q725`는 프롬프트·정답 보기가 「기본 부하」인데 해설이 「기준이 되는
부하」였으며, `q229`·`q660`은 프롬프트가 「전용 하드웨어 보안 모듈」인데 해설이 아니었다).

**`paragraphs` 28건 중 26건이 표기 치환이고 2건은 약칭 도입이다** — step 10이
`virtual-private-gateway[0]`과 `scp-attachment-targets[0]`의 첫 등장에 정식 이름을 덧붙인 자리다.

**자기 보고 합계 154와 도구의 145가 9 어긋나는 이유**: step별 실측은
0=43 / 1=14 / 2=9 / 3=8 / 4=12 / 5=21 / 6=14 / 7=10 / 8=7 / 9=14 / 10=2 = **154자리**이고
각 step의 `summary`와 정확히 일치한다. 도구는 **합집합**을 세므로 145다.
**두 step 이상이 같은 슬롯을 건드린 자리가 7개**(겹침 9회)이기 때문이다.

| 슬롯 | 건드린 step |
|---|---|
| 문항 `explanation` `q156` | 3, 4, 5 |
| 문항 `explanation` `q157` | 3, 4, 5 |
| 개념 `paragraphs` `identity-federation.identity-center[0]` | 3, 5 |
| 문항 `explanation` `q158` | 3, 5 |
| 문항 `explanation` `q159` | 3, 4 |
| 문항 `explanation` `q160` | 4, 5 |
| 문항 `explanation` `q562` | 0, 1 |

`identity-federation` 주제를 세 step(권한 세트 → 액세스 키 → 서비스 이름)으로 쪼갠 결과이고,
어긋난 것이 아니라 **세는 단위가 다르다.** 되짚을 때는 `notation-diff.mjs`가 유일한 기준이다.

### 3. 정답 보기가 바뀐 문항 15건

`notation-diff.mjs`가 `★`로 표시해 따로 찍는다. **문항마다 보기 넷을 한 벌로 읽고**
「표기의 결이 정답을 가리키게 되지 않는가」를 판정했다.

| 문항 | step | 정답 | 함께 바꾼 보기 | 판정 근거 |
|---|---|---|---|---|
| `q553` | 0 | c0★ | c3 | 같은 낱말을 쓰는 보기를 함께 바꿔 갈린 자리가 없다 |
| `q562` | 0·1 | c3★ | c0·c1 | 〃 (c0은 step 1의 FIFO 몫) |
| `q571` | 0 | c3★ | c1 | 〃 |
| `q573` | 0 | c2★ | c1·c3 | 〃 |
| `q575` | 0 | c1★ | c0·c2 | 〃 |
| `q667` | 0 | c2★ | — | c2에만 「토픽」이 있었으나 다른 보기의 「SQS 큐」와 결이 같다 |
| `q569` | 1 | c2★ | c3 | c0은 「표준 큐」라 대상 밖. c2★도 뒷부분에 「큐」를 품고, 넷을 가르는 축은 표준 ↔ FIFO다 |
| `q594` | 2 | c0★ | c1·c3 | c2는 보안 그룹이라 대상 밖. 갈린 자리가 없다 |
| `q595` | 2 | c1★ | — | 나머지 셋이 전부 보안 그룹이라 함께 바꿀 짝이 없었다. 치환 전에도 서브넷 ACL을 가리키는 보기는 c1 하나뿐이었고, **오히려 저장소에서 흔한 쪽(네트워크 ACL 30건)으로 맞춰 정답만 낯선 표기를 쓰던 상태가 해소됐다** |
| `q596` | 2 | c2★ | c0 | c1 보안 그룹·c3 WAF는 대상 밖 |
| `q159` | 3 | c2★ | c0 | step 3이 정답만 한글로 만들었으나 **step 4가 c0을 한글로 바꿔 2:2가 됐다**. 축은 「권한 템플릿 ↔ 자격 증명」이다 |
| `q157` | 4 | c0★ | c2 | c2가 step 3에서 이미 한글이라 2:2. 프롬프트에 「키」가 없어 글자로 이어지지 않는다 |
| `q158` | 5 | c1★ | — | 치환 전에도 c1★만 두 낱말짜리라 길이의 결이 새로 갈리지 않았고, 프롬프트에 `IAM`·`Identity`가 없다. **c0 「IAM」과 c1★ 「IAM Identity Center」가 둘 다 정식 이름이 되어 `q155`와 이루는 거울 쌍이 선명해졌다** |
| `q649` | 6 | c0★ | — | **신호가 오히려 줄었다.** 치환 전에는 c0★만 단수 `Insight`, c2만 복수 `Insights`라 정답이 접미사로 도드라졌는데, 지금은 둘 다 `Insights`로 끝난다 |
| `q629` | 8 | c0★ | c1·c2 | 넷 중 셋이 같은 표기라 정답만 결이 다르지 않다. 축은 「처리 노드에 제품군을 쓰는가」다 |

**정답 보기만 바뀌고 함께 바꿀 짝이 없던 것은 넷이다**(`q667`·`q595`·`q158`·`q649`).
넷 다 위 표의 근거로 「표기가 변별 신호가 되지 않는다」를 개별 판정했고,
`q595`·`q649`는 **치환이 기존 신호를 없앤 쪽**이다.
기계 지표로도 뒷받침된다 — `content-audit`의 **③ 정답 노출 후보가 62건에서 62건으로 변동이 없다.**

### 4. `answerIndex`·id·문항 순서·수치·조건이 그대로인지

**그대로다. 두 층으로 보장된다.**

**(1) 구조 — `notation-diff.mjs`의 `structural` 검사가 0건이다.** 이 검사는 표기와 무관하게
**어떤 경우에도 허용하지 않는** 항목을 본다. 아래 전부가 착수 시점과 같다.

- 주제: 개수 · 배열 순서 · `id` · `title` · `importance` · `sourcePages`
- 개념: 주제별 개수 · 배열 순서 · `id` · **문단 개수**
- 문항: 개수 · 배열 순서 · `id` · `topicId` · `conceptId` · **`answerIndex`** · 보기 개수

`scripts/check-structure.mjs`가 개념 `id`·`name`과 `questionsSha256`을 baseline과 따로 대조해
같은 결론을 낸다(exit 0).

**(2) 수치와 조건 — 구조 검사보다 강하게 보장된다.** `notation-diff.mjs`가 exit 0이라는 것은
「바뀐 것이 전부 표기 치환으로 설명된다」는 뜻이고, 그 판정은 이렇게 이뤄진다.

```
표기 짝의 낱말을 전부 자리표(⟨KEY⟩)로 누르고, 받침 때문에 강제로 바뀌는 조사도 ⟨J⟩로 누른 뒤
  normalize(착수 문자열) === normalize(지금 문자열)
```

**글자 단위 완전 일치다.** 그러므로 자리표로 눌린 표기 낱말과 그 뒤 조사를 뺀 나머지는
**한 글자도 다를 수 없다.** 숫자(`35일`·`5분`·`12시간`·`최대 16개`), 한정어(`~만`·`~를 제외한`),
부정형(`~이 아니다`·`~할 수 없다`), 비교 축, 정답 논리를 담은 문장은 애초에 바뀔 수가 없다 —
바뀌었다면 정규화 후 문자열이 갈려 exit 1이 됐을 것이다. 145건 전부가 이 검사를 통과했다.

이 보장이 미치지 못하는 곳은 하나다. **같은 짝 안에서 어느 방향으로 바꿨는지**는 정의상 통과하므로
사람이 판정해야 하고, 그 판정이 1절의 「표준」 열이다.

### 5. 테스트·build·lint·구조 검증 결과

| 검사 | 결과 |
|---|---|
| `npm test` | **492 passed (492)** — 22개 파일, 실패 0 |
| `npm run build` | exit 0 |
| `npm run lint` | exit 0 (`--max-warnings 0`) |
| `node scripts/check-structure.mjs` | exit 0 — 개념 `id`·`name`, 주제 메타데이터, 개념 개수·순서, 문항 파일 모두 기준과 같다 |
| `node scripts/notation-diff.mjs 7f46259` | **exit 0** — 설명된 변경 145건, 위반 0건 |
| `node scripts/coverage.mjs` | exit 0 — 개념 **618/618 (100%)**, 문항 732개, 문항 없는 주제 0 |
| `node scripts/check-verbatim.mjs` | exit 0 — **원본과 실제로 대조했다**(이 기기에 `concepts-raw.md`가 있다). 넘긴 겹침 1건은 ADR-025가 허용한 서비스 이름 나열 |
| `node scripts/content-audit.mjs` | ① 0 / ② 74 / ③ 62 / ④ 1 / ⑤ 3 / ⑥ 8 — **착수와 여섯 지표가 글자까지 같다** |
| `node scripts/sync-baseline.mjs` | 「갱신할 것이 없다」 |

`data.test.ts`의 단언은 phase 전체에서 **2건만 문구를 맞췄다**(step 4의 `q156`·`q160` 프롬프트,
step 5의 `serviceCategories` 표 한 줄). 나머지 step은 한 글자도 고치지 않았고, 단언의 **뜻**을
바꾼 자리는 없다.

#### ⚠ 도구를 한 번 고쳤다 — `b0f13f4`

step 10이 약칭의 첫 등장에 정식 이름을 덧붙여 `VIF` → `가상 인터페이스(VIF)`,
`OU` → `조직 단위(OU)`가 됐는데, `notation-diff.mjs`의 `TERMS`에 그 짝이 없어
**두 자리가 「문장을 손댔다」로 잡히며 exit 1이었다.** step 10이 처방을 적어 두고
사용자 판단으로 남긴 자리인데, step 11의 AC가 exit 0을 요구하므로 그 처방을 적용했다.
**콘텐츠는 한 글자도 건드리지 않았고 커밋을 따로 뒀으니 `git revert b0f13f4` 하나로 되돌아간다.**
판단이 다르면 되돌린 뒤 위 예외를 6절 방식으로 남기면 된다.

알아 둘 것 둘. **`key`를 `VIF`·`OU`로 지으면 안 된다** — 자리표 `⟨VIF⟩` 안의 글자를 variants가
다시 쳐서 `⟨⟨VIF⟩⟩`가 되고 조사 정규화까지 깨진다(그래서 `VIRTUAL_IF`·`ORG_UNIT`이다).
그리고 **잔량 표의 `OU 12`는 실제 OU 8 + `SELECT INTO OUTFILE S3` 4다** — 도구가 `split/join`이라
단어 경계를 못 본다. 표시만 부풀고 대조에는 영향이 없다(실측으로 확인했다).

### 6. 표기 통일 후에도 두 표기가 남은 경우와 그 이유

**남은 것은 실패가 아니라 판정이다.** 네 갈래로 나뉜다.

#### (가) 다른 대상을 가리켜 남긴 것

| 남은 표기 | 건수 | 이유 |
|---|---|---|
| ElastiCache의 `주 노드` | 6 (4자리) | **EMR의 프라이머리 노드와 다른 대상이다.** AWS 한국어 문서도 ElastiCache는 primary/replica를 별개 개념으로 다룬다. **사용자가 작업 대상에서 뺐다.** `elasticache-multi-az-failover`의 `summary`·`p[0]`와 `q429`의 프롬프트·해설이다. step 8은 일괄 치환 대신 **JSON 줄 번호로 범위를 좁혀** EMR 두 줄에만 치환을 걸었다 |
| `q210`의 `퍼블릭 IPv4` | 2 | NAT 게이트웨이가 IPv6에서 하는 일을 IPv4와 대비하는 자리라 `q305`(프라이빗 서브넷 SSH)와 대상이 다르다. 애초에 표준 낱말에 버전 접미사가 붙은 형태다. **명세가 「건드리지 마라」로 못 박았다** |
| `SELECT INTO OUTFILE S3` | 4 | **MySQL 구문**이지 낱말이 아니다. `aurora-select-into-outfile-s3`와 `q395`(정답 보기 포함) |
| `표준 큐` | 9 | FIFO의 반대쪽을 가리키는 말이라 이번 짝(`FIFO 큐` ↔ `FIFO 대기열`)의 대상이 아니다. `TERMS`에 짝이 없어 바꾸면 곧바로 위반이 된다 |

#### (나) 약칭이라 남긴 것

약칭은 **없애야 할 비표준 표기가 아니라 정식 이름을 도입한 뒤에 쓰는 짧은 이름**이다.
step 10이 「약칭이 정식 이름을 도입한 뒤에 쓰이는가」를 개념·문항 단위로 전수 판정했고,
**도입 없이 약칭만 쓰는 문항은 0건**이었다.

| 약칭 | 건수 | 판정 |
|---|---|---|
| `NACL` | 41 | 정식 `네트워크 ACL` 30건과 공존한다. 아래 (다)를 봐라 |
| `VIF` | 6 | 정식 `가상 인터페이스` 18건 + 도입형 `가상 인터페이스(VIF)` 3건이 앞선다. step 10이 `virtual-private-gateway[0]`에 도입을 하나 보탰다 |
| `OU` | 8 | 정식 `조직 단위` 28건 + 도입형 `조직 단위(OU)` 2건. step 10이 `scp-attachment-targets[0]`에 도입을 보탰다 |
| `Container Insights` | 4 | 정식 `CloudWatch Container Insights` 4건이 같은 문항·같은 개념 안에서 앞선다. **`Performance Insights`와 이름만 닮은 다른 서비스다** |

#### (다) 사용자가 통일하지 말라고 정한 것

- **`네트워크 ACL` 전면 통일을 하지 않기로 했다.** step 2는 **최소안**만 했다 — 긴 형태
  `네트워크 접근 제어 목록` 9건을 없애 0으로 만들되, **`NACL` 41건은 손대지 않았다.**
  해설 쪽은 애초에 ADR-015 형식(`네트워크 ACL(Access Control List)`·`NACL(Network Access
  Control List)`)이었으므로, step 2가 한 일은 프롬프트·보기를 그 표준에 맞춘 것이다.
- **ElastiCache의 `주 노드`** — 위 (가).
- **`Deny` ↔ `거부`는 `TERMS`에 아예 없다.** 표기 갈림이 아니라 IAM 정책의 `Effect` 값과
  그 동작을 설명하는 서술어라서 사용자가 작업 대상에서 뺐다.

#### (라) 그 밖에 판단으로 남긴 것 — **전부 도구의 사각지대이고 다음 phase 후보다**

아래 넷은 「문맥이 달라서」가 아니라 **`TERMS`가 그 형태를 몰라서** 남았다. 바꾸면 정규화가
겹치지 않아 `notation-diff`가 위반으로 잡고 exit 1이 되므로, 명세가 「exit 1이면 되돌려라」로
못 박은 규칙에 걸렸다.

| 남은 자리 | 건수 | 상태 |
|---|---|---|
| `FIFO(First In First Out) 큐` — `q568`·`q569`·`q570` 해설 | 3 | **같은 삽입형을 이미 `FIFO(...) 대기열`로 쓰는 자리가 4건 있다**(`q092`·`q093`·`q203`·`q550`). 즉 삽입형에서도 표준은 이미 대기열이다. 그 대가로 `q568`은 프롬프트 「FIFO 대기열에서」와 해설 「FIFO(...) 큐의」가, `q569`는 정답 보기와 해설이 어긋난다 |
| `IAM(Identity And Access Management) Identity Center` — `q249`·`q703`·`q704` 해설 | 3 | 이미 `IAM Identity Center`인데 `IAM`만 ADR-015로 풀린 형태다. `IAM`을 또 붙이면 `IAM(...) IAM Identity Center`가 된다 |
| 홑 `하드웨어 모듈` — `q229` 해설 | 1 | 앞에서 세운 대상을 줄여 부르는 자리(「그 정도 요구에 … 까지 필요한지」)라 두 이름으로 가르치는 자리는 아니다 |
| `STS Token`(`q157` c1·`q159` c1) ↔ `STS 토큰`(`q156` c1) | 3 | **같은 대상을 두 표기로 쓴다.** `TERMS`에 짝이 없고 명세의 대상 목록에도 없어 step 3·4가 관찰만 남겼다 |

**앞의 셋은 `b0f13f4`이 쓴 것과 똑같은 두 줄짜리 기법으로 풀린다** — `TERMS`의 해당 짝에
삽입형 variants를 더하면 정규화가 겹쳐 exit 0을 유지한 채 고칠 수 있다. 넷째는 짝을 새로
정해야 하므로 표준을 사용자가 골라야 한다(`STS Token` / `STS 토큰`).

**그리고 이 phase가 새로 만든 ADR-015 어긋남 4건이 있다** — `q158`·`q161`·`q705`·`q707`의 해설에서
약어 `IAM`의 첫 등장이 서비스 이름 `(AWS )IAM Identity Center` 안으로 옮겨 갔는데 풀이
`IAM(Identity And Access Management)`는 그 뒤에 그대로 남았다. 착수 시점에는 0건이었다.
**테스트는 깨지지 않는다** — 「풀이가 해설 어딘가에 있는가」를 보고, 첫 등장 자리를 글자로
고정한 단언은 `q130`·`q080` 둘뿐이기 때문이다. 풀이를 새 첫 등장 자리로 옮기면 위 삽입형이 되므로
`TERMS`를 넓히는 것과 같은 문제다.

#### 범위 밖이라 손대지 않은 관찰 하나

`emr-glue-athena`는 `content-audit`의 **② 관용 표현이 16건**(개념 6·문항 10)으로 39개 주제 중
가장 많다. 「돌린다」 계열이고 ADR-030 기준 5의 대상이지만 표기 갈림이 아니라 이 phase의 대상이
아니었다.

### 다음에 할 일

1. **`b0f13f4`(도구 수정)을 그대로 둘지 판단한다.** 되돌리려면 `git revert b0f13f4`이고,
   그러면 `notation-diff 7f46259`이 step 10의 두 자리를 위반으로 다시 잡는다.
2. **(라)의 남은 표기 넷을 다음 phase로 할지 정한다.** 앞의 셋은 `TERMS` 두 줄로 풀리고,
   `STS Token` / `STS 토큰`은 표준을 골라야 한다.
3. **표기 표준을 ADR로 굳힐지 판단한다.** step 11은 ADR을 쓰지 않았다 — 사용자 판단이라
   명세가 금지했다. 굳힌다면 1절의 표가 그대로 표준 목록이 된다.
4. **병합·push는 사람이 판단한다.** 요청받지 않아 하지 않았다.

---

## phase 32 결과 보고 (2026-09-11) — 네 필드 문체 일관성 정리가 끝났다

`feat-32-field-consistency`에서 step 0~24를 전부 끝냈다. 범위는 **개념 `name`·`summary`와
문항 `prompt`·`choices` 넷**이고, `paragraphs`·`explanation`·`answerIndex`·id·순서·주제
메타데이터는 얼어 있었다(`scripts/field-diff.mjs`가 매 step 이것을 확인했다).
**사실관계와 정답 논리는 건드리지 않았다.** 아래 넷은 사용자가 완료 후 정리해 달라고 한
항목이고, 그 순서 그대로다. **아직 push하지 않았다** — 4를 봐라.

> 아래쪽의 「phase 31 결과 보고」와 그보다 앞선 절들은 이 절보다 먼저 쓰인 것이라 낡았다.
> 당시 기록으로 그대로 둔다.

### 1. 필드별 수정 건수

기준은 phase 착수 커밋 `04f6946`(merge: phase 31 문체 확대 적용을 develop에 들인다)이고,
아래는 그 커밋과 HEAD의 JSON을 **필드 단위로 비교한 실측**이다
(`node scripts/field-diff.mjs 04f6946 --list`). 각 step의 `summary`에 적힌 자기 보고 수치가
아니다.

| 필드 | 바뀐 항목 | 전체 | 비율 |
|---|---|---|---|
| 개념 `name` | **198** | 618 | 32% |
| 개념 `summary` | **107** | 618 | 17% |
| 문항 `prompt` | **13** | 732 | 1.8% |
| 문항 `choices` | **12** | 732 | 1.6% |

**`name` 198건은 거의 전부 문장형 제목을 명사구로 내린 것이다.** ADR-030 기준 1이고,
착수 시점 181건이던 문장형 제목이 0건이 됐다. `summary`는 「본문·해설은 새 말을 쓰는데
요약만 옛말·다른 용어로 남은」 자리를 맞춘 것이고, `prompt`·`choices`가 두 자릿수 초반에
그친 것은 phase 30이 프롬프트를, phase 31이 해설을 이미 훑었기 때문이다.

**자기 보고 합계와 1건씩 어긋나는 이유**: step `summary`를 합하면
name 198 / summary 108 / prompt 13 / choices 13이다. `field-diff.mjs`는 **항목(개념·문항)
단위**로 세고 step은 **수정 자리 단위**로 셌기 때문이다 — 한 개념의 `summary` 안에서 두
곳을 고친 자리(step 21의 `iam-roles-anywhere`, step 23의 `appconfig` 등)와 한 문항의 보기
두 개를 고친 자리(step 4의 `q384` c0·c3)가 그 차이다. 어긋난 것이 아니라 세는 단위가 다르다.
**되짚을 때는 `field-diff.mjs`가 유일한 기준이다.**

#### 주제별 내역 — 개념 `name` / `summary`

| 주제 | `name` | `summary` |
|---|---|---|
| `aws-core-services` | — | — |
| `s3-storage-classes` | 1 | — |
| `s3-versioning-lifecycle` | — | 3 |
| `s3-encryption-batch` | — | 1 |
| `s3-access-control` | 6 | 1 |
| `ebs-instance-store` | 4 | 2 |
| `efs-fsx` | 14 | 3 |
| `data-transfer-services` | 10 | 3 |
| `storage-gateway-migration` | 1 | 3 |
| `rds-storage-features` | 10 | 3 |
| `aurora` | 8 | 6 |
| `dynamodb` | 7 | 1 |
| `elasticache-purpose-built-db` | 4 | 2 |
| `ec2-autoscaling` | 4 | 3 |
| `elastic-load-balancing` | 10 | 2 |
| `cloudfront-global-accelerator` | 9 | 3 |
| `lambda` | 10 | 7 |
| `ecs-eks-fargate` | 6 | 7 |
| `api-gateway-step-functions` | 8 | 6 |
| `sqs-sns-eventbridge` | 14 | 1 |
| `backup-disaster-recovery` | 4 | 3 |
| `vpc-networking` | 6 | 3 |
| `security-groups-nacl` | 4 | — |
| `hybrid-connectivity` | 5 | 3 |
| `route53` | 6 | 1 |
| `emr-glue-athena` | 5 | 6 |
| `kinesis-streaming` | 5 | 3 |
| `redshift-opensearch-quicksight` | 5 | 5 |
| `cloudwatch-xray` | 3 | 2 |
| `secrets-encryption` | 4 | 2 |
| `waf-shield` | 3 | 4 |
| `guardduty-macie-inspector` | 3 | 3 |
| `iam-permissions` | 9 | 4 |
| `identity-federation` | 2 | 2 |
| `organizations-cloudtrail-config` | 2 | 1 |
| `cost-management` | 6 | 3 |
| `governance-iac` | — | 1 |
| `systems-manager` | — | 3 |
| `ai-ml-services` | — | 1 |
| **합계** | **198** | **107** |

**한 글자도 안 바뀐 주제가 하나 있다 — `aws-core-services`다.** step 0이 그 주제를 훑고
고칠 것을 찾지 못했다(문장형 제목 0건, 요약도 본문과 어긋난 자리가 없었다). 이 주제는
착수 시점에도 content-audit 여섯 지표가 모두 0건이었다.

#### 주제별 내역 — 문항 `prompt` / `choices`

| 주제 | `prompt` | `choices` |
|---|---|---|
| `dynamodb` | — | 2 |
| `efs-fsx` | 1 | 1 |
| `data-transfer-services` | — | 1 |
| `rds-storage-features` | — | 1 |
| `elasticache-purpose-built-db` | — | 1 |
| `ec2-autoscaling` | 1 | — |
| `elastic-load-balancing` | 3 | — |
| `cloudfront-global-accelerator` | — | 1 |
| `ecs-eks-fargate` | 1 | — |
| `api-gateway-step-functions` | 2 | — |
| `sqs-sns-eventbridge` | 1 | — |
| `backup-disaster-recovery` | — | 1 |
| `vpc-networking` | — | 2 |
| `emr-glue-athena` | 1 | — |
| `cloudwatch-xray` | 1 | — |
| `iam-permissions` | 1 | 2 |
| `systems-manager` | 1 | — |
| **합계** | **13** | **12** |

바뀐 문항 id는 이렇다 — `prompt`: q303 · q329 · q452 · q453 · q460 · q466 · q522 · q535 ·
q546 · q552 · q617 · q650 · q685. `choices`: q348 · q356 · q384 · q415 · q416 · q432 ·
q474 · q584 · q587 · q589 · q691 · q699.

#### 정답 보기의 글자가 바뀐 문항 — 2건

`field-diff.mjs`가 경고로 찍는 값이고, **사람이 한 번 더 읽어야 하는 자리라 따로 밝힌다.**

| 문항 | 바뀐 것 | 근거 |
|---|---|---|
| `q356` c1 | 「일정을 걸어 하루 한 번 **돌린다**」 → 「하루 한 번 **실행한다**」 | 개념 본문 문단 1과 이 문항 해설이 모두 "일정을 걸어 실행한다"로 쓴다. 오답 포인트 셋(파일 게이트웨이의 "간격 없이 계속", 볼륨 게이트웨이의 "파일이 아닌 스냅샷", Transfer Family의 "스스로 가져오지 않는다")은 하나도 건드리지 않았다 |
| `q474` c3 | 「엔드포인트를 노출하는 **자리에는** 맞지 않는다」 → 「노출하는 **데는** 맞지 않는다」 | 옛 어휘 「자리」 하나만 바꿨다. 같은 보기의 "CDN을 지나는 요청과 응답을 손보기"는 얼어 있는 본문·해설이 글자 그대로 쓰는 말이라 그대로 뒀고, 오답 포인트 셋도 달라지지 않았다 |

나머지 10건의 `choices` 수정은 **전부 오답 보기**다. 각 step이 오답 포인트가 그 표현에
걸려 있지 않은지 확인한 뒤에만 고쳤고, 보기 넷의 종결 형태와 결도 맞췄다.

#### 기계 지표 대조 — `node scripts/content-audit.mjs`

기준 커밋 `04f6946`의 지표는 phase 31 보고서에 있다.

| 지표 | 착수(`04f6946`) | 지금 | 판정 |
|---|---|---|---|
| ① 문장형 제목 | 181건 (34개 주제) | **0건 (0개 주제)** | **목표 달성** |
| ② 관용 표현 | 91건 | **74건** | 줄었다 |
| ③ 정답 노출 후보 | 62건 | 62건 | 늘지 않았다 |
| ④ 소속 없는 용어 | 1건 | 1건 | 늘지 않았다 |
| ⑤ 장문 | 3건 | 3건 | 늘지 않았다 |
| ⑥ 중복 후보 | 8쌍 | 8쌍 | 늘지 않았다 |

**늘어난 지표는 하나도 없다.** 여섯 지표가 모두 0건인 주제는 6개다 —
`aws-core-services` · `s3-storage-classes` · `s3-encryption-batch` ·
`redshift-opensearch-quicksight` · `guardduty-macie-inspector` · `governance-iac`.

**② 관용 표현이 74건 남은 이유를 정직하게 적는다.** `content-audit.mjs`의 ②는 개념을
`summary`+`paragraphs`로, 문항을 `prompt`+`choices`+`explanation`으로 묶어 **항목 단위**로
센다. 그러므로 `paragraphs`나 `explanation`에 그 낱말이 있으면 이 phase가 고칠 수 있는 네
필드를 다 고쳐도 건수가 줄지 않는다. 남은 74건이 몰려 있는 곳은 `ecs-eks-fargate` 21 ·
`emr-glue-athena` 16 · `lambda` 13이고, 이 셋은 phase 31이 본문·해설에서 「돌리다·띄우다」
계열을 표준어로 쓴 주제다. **범위 안 필드에는 남은 것이 거의 없다** — 아래 2의 「얼어 있는
본문·해설이 같은 관용 표현을 쓴다」가 그 목록이다.

#### 래칫을 닫았다

`src/data/data.test.ts`의 명사구 단언 **둘을 하나로 합쳤다.** phase 29가 시범 주제에 건
`it('S3 암호화 주제의 개념 제목이 …')`와 끝낸 주제를 하나씩 더해 온 `nounPhraseRatchet`
목록(38개)을 지우고, **전 주제 검사** `it('개념 제목이 모두 문장이 아니라 명사구다')` 하나로
바꿨다. 「제목은 이름표이지 주장이 아니다」와 「예외 목록을 만들지 마라」 주석은 옮겨 살렸고,
범위를 한정하는 이유를 적은 문단은 사실이 아니게 되어 지웠다.

**단언 하나를 새로 더했다** — `it('한 주제 안에서 개념 제목이 겹치지 않는다')`. 제목을
명사구로 줄이는 과정에서 **한 주제 안에 같은 제목이 둘 생기면** 개념 목록에서 구분되지
않는데, 그것이 이 phase가 새로 만들 수 있던 유일한 종류의 회귀였다. 착수 시점에 0건이었고
지금도 0건이다. **주제를 넘는 중복은 검사하지 않는다** — 같은 서비스가 두 주제에 나오면
제목이 같은 것이 자연스럽고 착수 시점에도 3건 있었다.

### 2. 보류한 항목과 이유

step 0~23이 남긴 「보류」를 한 목록으로 합쳐 사유별로 묶었다. **사유가 같은 것이 압도적으로
많다** — 아래 첫 두 분류가 그것이고, 둘 다 이 phase가 네 필드만 고칠 수 있다는 범위에서
나온다.

#### (가) 얼어 있는 `paragraphs`·`explanation`이 같은 말을 쓴다 — 가장 큰 분류

**고치면 어긋남이 없어지는 것이 아니라 새로 생긴다.** UI가 요약 바로 아래에 본문을 두고
(개념 읽기), 확인 문제 화면은 해설과 개념 펼치기를 한 화면에 둔다(ADR-016). 그러므로 범위
안 필드만 고치면 같은 화면에서 같은 것을 두 말로 부르게 된다. step 7이 `q438`에서 처음
내린 판정이고 step 10·11·14·16·17·18·22·23이 그것을 이었다.

**관용 표현이 얼어 있는 자리 (20건 남짓)**
- `ec2-autoscaling` — `ec2-image-builder` 문단 1 · `gpu-instance-family` 문단 1의 "인스턴스를 띄우는", `q435`·`q438` 해설의 "띄우려면"·"띄우고". `q438` c3은 정답 보기다
- `lambda` — 개념 4곳·해설 6곳. 보기 쪽 `q490`·`q507`·`q508`이 자기 해설과 짝이고 `q507` c1은 정답 보기다
- `ecs-eks-fargate` — 개념 문단 8곳(`eks`·`eks-compute-options`·`fargate-no-time-limit`·`fargate-spot`·`batch-fargate-compute-environment`·`eks-fargate-pod-isolation`·`ecs-task-role-vs-task-execution-role`·`fargate-per-second-billing`)과 해설 12곳. `q516` c3은 정답 보기다
- `emr-glue-athena` — 본문·해설 16곳. 보기 5건(`q621` c3 · `q623` c2(정답) · `q624` c0 · `q626` c3 · `q628` c1)이 전부 이 자리다. `q628` c1은 근거 개념 문단이 **글자 그대로** 쓴다
- `sqs-sns-eventbridge` — `eventbridge-event-pattern-vs-polling` 문단 1, `q556` 보기·해설의 "인스턴스를 띄워"
- `backup-disaster-recovery` — `elastic-disaster-recovery` 요약·문단 0과 `q577` 해설의 "띄우는". `q577` c0은 정답 보기다
- `hybrid-connectivity` — `outposts-data-residency` 문단 0과 `q604` 해설의 "관리형 서비스를 띄우고". `q604` c2는 정답 보기다
- `kinesis-streaming` — `kinesis-client-library` 문단 2와 `q641` 해설의 "장기 실행 컨테이너로 띄우면". `q641` c0은 정답 보기다
- `organizations-cloudtrail-config` — `organizational-unit` 문단 1과 `q711` 해설의 "계정마다 템플릿을 돌려"
- `cost-management` — `rds-reserved-instance` 문단 1과 `q726` 해설의 "오래 돌릴"
- `ai-ml-services` — `sagemaker-autopilot` 문단 0과 `q315`·`q316` 해설의 "자동으로 돌려 주는". `q315` c1은 정답 보기다
- `api-gateway-step-functions` — `step-functions-map-state` 문단 0과 `q544` 해설의 "돌리거나"

**옛 어휘·표현이 얼어 있는 자리**
- `s3-storage-classes` — `lifecycle-vs-intelligent-tiering`의 "갈림길"·"식는"(`intelligent-tiering-monitoring-fee` 문단 0과 `q323` 프롬프트가 쓴다)
- `s3-access-control`·`ebs-instance-store` — `batch-copy-vs-replication` 요약("앞으로 들어올 객체를 계속 따라 보내는 장치")이 `q281` 해설과 짝, `s3-access-point`·`s3-storage-lens`·`ebs-recycle-bin` 요약의 "장치"
- `efs-fsx` — `efs-performance-modes` 요약이 `q334` 해설과 글자까지 같다. `q333` 프롬프트의 "가능한 짧은", `q341` c1·`q343` c3·`q350` c1
- `data-transfer-services` — `file-gateway-vs-datasync-continuous`의 "갈림길", `q360` c1의 "스트리밍 서비스의 몫"
- `rds-storage-features` — `q377` c2(정답)의 "비밀번호 자리", `q182` c1의 "Multi-AZ", `q059` 프롬프트의 "짧은 지연 시간", `rds-proxy-failover` 요약의 "승격"
- `aurora` — `aurora-endpoint-types` 요약의 1인칭 "내가", `aurora-zdr-and-activity-streams`의 "쪽이라", `aurora.aurora`의 "및"
- `dynamodb`·`elasticache-purpose-built-db` — `elasticache-redis-vs-memcached`의 "갈림길", `dynamodb-incremental-export` 요약이 `q416` 해설·정답 보기와 짝, `q417` 프롬프트의 "가르는", `elasticache-multi-az-failover` 요약의 "죽으면"
- `ec2-autoscaling` — `ami-and-launch-template` 요약이 `q435` 해설과 짝, `scheduled-scaling`·`target-tracking-vs-simple-scaling`의 "갈림길"(`data.test.ts`가 그 문구를 단언으로 잡고 있다)
- `elastic-load-balancing` — `q476` 프롬프트의 "밀리는"(해설이 같은 말을 쓴다), `alb-listener-rule-fixed-response` 요약의 "건드리지 않고"
- `cloudfront-global-accelerator` — `q193` c3의 "가중치 라우팅", `q474` c3의 "손보기", 개념 9·23 요약의 "엣지에서 도는", `q468` c0·`q475` c0·`q477` c1의 "얹어"
- `lambda` — `q495` 프롬프트의 "밀리는", `lambda-reserved-concurrency` 요약의 "몫"
- `ecs-eks-fargate` — `eks-fargate-pod-isolation` 요약이 문단 0·`q516` 해설과 **두 곳에서 글자까지 같다**, `app2container`·`eks-aws-load-balancer-controller`·`eks-connector`·`fargate-efs-mount` 요약의 "도는"
- `api-gateway-step-functions` — `api-gateway-websocket-api` 요약의 "연결을 열어 둔 채", `q546` c3의 "손대지 않고"
- `sqs-sns-eventbridge` — `eventbridge-private-api-target`의 "길", `eventbridge-ordering-and-retention`의 "보장하지 않는 것", `sns-is-not-a-queue` 요약의 "밀려드는", `sqs-message-size-limit` 요약의 "페이로드", `eventbridge-pipes` 요약의 "장치"
- `backup-disaster-recovery` — `q560` c1의 "대상 자리"(설정에서 값을 적는 칸이다), `backup-s3-continuous-backup` 요약의 "뜨는"
- `vpc-networking`·`security-groups-nacl` — `q134` 프롬프트의 "손대지 않은"(`data.test.ts`가 글자로 고정한 자리다), `security-group-stateful-vs-nacl-stateless`의 "상태 저장", `nacl-deny-at-source-subnet` 요약의 "반대가 된다", `endpoint-pricing` 요약의 "비용"
- `hybrid-connectivity`·`route53` — `direct-connect-vif-types` 요약이 `q607` 해설과 짝, `q610` c3의 "갈아 끼우게", `transit-gateway` 요약의 "다수", `region-attached-edge-options` 요약의 "완전히", `onprem-connectivity-heuristic` 요약의 "떠올린다"
- `emr-glue-athena` — `emr-security-configuration` 요약의 "워크로드", `q625` 프롬프트의 두 물음
- `kinesis-streaming`·`redshift-opensearch-quicksight` — `redshift-spectrum` 요약·`q269` c2·`q270` c3의 "그 자리에서", `streaming-services-comparison` 요약의 "담당", `msk-kafka-connect` 요약이 `q642` c1(정답)과 짝, `dynamodb-to-s3-analytics` 요약이 `q270` c1(정답)과 짝, `q639` c0의 "손수", `q640` 프롬프트의 "밀어내지"
- `cloudwatch-xray`·`secrets-encryption` — `kms-key-per-tenant` 요약이 `q661` c1(정답)의 "가른다"와 짝, `acm-dns-validation` 요약의 "사람 손을 타지 않고", `cloudwatch-alarm-state-change-event` 요약의 "끼우지", `secrets-manager-batch-get-secret-value` 요약의 "반복하는"
- `waf-shield`·`guardduty-macie-inspector` — `security-hub` 요약·`q679`·`q682` 프롬프트의 "한자리", `security-service-lineup`의 "헷갈리기"(정규식 오검출), `guardduty-finding-to-eventbridge` 요약의 "흘러가고", `cloudfront` 요약이 `q151` 해설과 글자까지 같다
- `iam-permissions`·`identity-federation` — `q685` c0의 "권한이 갈리게", `q695` c2의 "밀어냈는지"
- `organizations-cloudtrail-config`·`cost-management` — `scp-attachment-targets`의 "자리"(정책을 붙이는 **위치**를 가리키는 구체어이고 본문 6곳이 쓴다. `q709` c0·`q718` c1은 정답 보기다), `q714` 프롬프트·c3의 "갈라", `q723` c1의 "스캔", `trusted-advisor` 요약의 "진단"
- `ai-ml-services`·`systems-manager` — 위 관용 표현 항목과 같다

#### (나) 얼어 있는 텍스트 자체가 두 표기로 갈려 있다 (12건)

**어느 쪽으로 맞춰도 나머지 절반과 어긋난다.** 게다가 보기 넷이 한 벌로 같은 표기를 쓰는
자리에서 하나만 바꾸면 그 차이가 변별 신호가 된다. step 14가 처음 내린 판정이다.

| 갈린 짝 | 양쪽이 얼어 있는 자리 |
|---|---|
| 「토픽」 ↔ 「주제」 (SNS) | 보기·프롬프트는 토픽 27회로 한쪽인데 개념 문단 3곳·해설 3곳이 「주제」 |
| 「FIFO 대기열」 ↔ 「FIFO 큐」 | `sqs`·`sqs-details`가 대기열, `sqs-fifo-*`가 큐 |
| 「NACL」 ↔ 「네트워크 ACL」 ↔ 「네트워크 접근 제어 목록」 | 개념 문단과 `q130`·`q134`·`q135` 해설이 NACL, `q594`~`q596` 해설과 `nlb-security-group` 문단 1이 네트워크 ACL |
| 게이트웨이 이름의 한글 ↔ 영문 | `q215` 해설은 `Virtual Private Gateway`, `q599` 해설은 「가상 프라이빗 게이트웨이」 |
| 「VIF」 ↔ 「가상 인터페이스」 | 문단 0이 약칭을 도입하고 `q607` 해설은 풀어 쓴 쪽만 쓴다 |
| 「주 노드」 ↔ 「프라이머리 노드」 (EMR) | `emr-node-instance-family-choice` 계열이 주 노드, `emr-node-types` 계열이 프라이머리 노드 |
| 「Performance Insight」 ↔ 「Performance Insights」 | `q126`·`q648`~`q652` 해설이 단수, `q653`·`q655` 해설이 복수 |
| 「전용 하드웨어 모듈」 ↔ 「전용 하드웨어 보안 모듈」 | 개념 4·10 요약과 `q660` 해설이 짧은 쪽, `q229` 프롬프트·해설이 긴 쪽 |
| 「Deny」 ↔ 「거부」 | 문단 0은 `Deny`, `q696` 해설은 「거부」이고 `q696` c1·c2가 한 벌 |
| 「권한 세트」 ↔ 「Permission Set」 / 「액세스 키」 ↔ 「Access Key」 / 「Identity Center」 ↔ 「IAM Identity Center」 | 개념 name과 문단이 각각 다른 쪽 |
| 「조직 단위」 ↔ 「OU」 | 보기는 전부 「조직 단위」로 이미 한쪽이고 갈린 쪽이 문단이다 |
| 「음성」 ↔ 「말소리」 / 「퍼블릭 IP」 ↔ 「퍼블릭 주소」 | `media-ai-service-lineup` name·요약, `q305` c1·해설 |
| 「IP Set」 ↔ 「IP 세트」 | `waf` 문단 2가 영문, `q152`·`q154` 해설이 한글 |
| 「결제 콘솔」 ↔ 「결제 대시보드」 / 「기본 부하」 ↔ 「기준이 되는 부하」 | 앞쪽이 `data.test.ts`가 글자로 고정한 요약, 갈린 쪽이 문단 |

#### (다) 문항 설계 문제라 문체 범위 밖이다

- **중복 후보 8쌍** — `q031`·`q033` / `q040`·`q041` / `q096`·`q097` / `q113`·`q116` /
  `q129`·`q136` / `q130`·`q137` / `q141`·`q145` / `q146`·`q148`. 각 step이 확인한 결과
  **여덟 짝 모두 정답은 같지만 묻는 것이 다르다**(예: `q129`는 통제 단위가 개별 리소스라는
  것, `q136`은 여러 리소스를 묶으면서 서브넷에 매이지 않는다는 것)
- **두 가지를 묻는 프롬프트 2건** — `q625`("기능과 그 기능이 겨냥하지 않는 용도를 함께"),
  `q650`("그 이유와 대신 놓이는 서비스를 함께"). 보기 넷이 "A이며, B" 꼴로 한 벌을 이뤄
  고치려면 문항을 다시 설계해야 한다
- **보기 넷의 모양이 갈리는 자리 3건** — `q504` c2·`q624` c3만 줄표를 쓰고, `q675`는
  c0·c3이 명사구·c1·c2가 서술문이다. 맞추려면 정답 보기를 다시 써야 한다
- **장문 3건** — `q054`(63자) · `q079`(63자) · `q029`(62자). 줄이려면 변별 조건을 깎아야
  한다
- **소속 없는 용어 1건** — `q650`의 「객체」. S3의 객체가 아니라 「객체 스토리지」라는 일반
  용어이고 정규식이 그 합성어를 갈라 센 것이다(오검출)

#### (라) 정답 노출 후보 62건 — ADR-030의 예외에 해당한다

**착수 시점과 같은 62건이고 한 건도 늘지 않았다.** 각 step이 전부 읽어 갈랐고 판정은 둘로
나뉜다 — **전제로 쓰인 이름**(`q037`의 `SSE-KMS`, `q182`의 `RDS`처럼 정답이 아니라 상황을
세우는 말)과 **그 낱말이 없으면 문항이 성립하지 않는 상황 단서**(`q327`의 "Windows 애플리케이션
서버", `q456`의 "UDP 트래픽", `q643`의 "500KB", `q307`의 "AMI"). ADR-015가 풀이 대상에서
뺀 상식 토큰(`AWS`·`DB`·`IP`·`API`)이 겹쳐 잡힌 것도 여럿이다.

#### (마) 저장소 전체에 걸친 표기 규칙 문제 — 한 주제만 맞추면 오히려 갈린다

**개념 `name`의 괄호 앞 공백이 갈려 있다.** 「EBS (Elastic Block Store)」·「EFS (Elastic File
System)」·「KMS (Key Management Service)」·「보안 그룹 (Security Group)」에는 공백이 있고,
「Elastic Fabric Adapter(EFA)」·「전역 보조 인덱스(GSI)」·「데드레터 큐(DLQ)」·「조직 단위(OU)」·
「서비스 계정용 IAM 역할(IRSA)」에는 없다. **개념 618개 전체에 걸친 규칙이라 step 1이 처음
보류하고 step 2·3·6·11·13·15·19·21·22·23이 같은 판정을 이었다.** 한 주제만 맞추면
저장소 안에서 오히려 갈린다 — 전체를 한 번에 고르는 일이므로 별도 결정으로 다뤄야 한다.

#### (바) 사실 판정이 필요해 이 phase가 다룰 수 없다 (3건)

이 셋은 **다음 phase의 후보**다. 고치려면 출처를 다시 대조해야 한다.

1. `cloudfront-global-accelerator.cloudfront-functions` — 요약은 "Lambda@Edge와는 실행
   모델도 **용도도 다르다**"고 하는데 같은 개념 문단 1은 "둘 다 겨냥하는 것은 CDN을 지나는
   요청과 응답을 손보는 일이다"라 하고 `q474`의 정답 보기도 본문 쪽에 서 있다. 어느 쪽이
   맞는지 정하는 것이 사실 판정이다
2. `api-gateway-step-functions.api-gateway-api-key-not-auth` — 요약의 "**사용량을 재는**
   식별자"가 이 개념 본문에도 이 주제 해설에도 없다. 빼면 요약이 들고 있던 사실이 하나
   사라져 「의미 삭제」가 되고, 두면 근거를 대조할 수 없다
3. `redshift-opensearch-quicksight.quicksight-ml-forecast` — 요약의 "**시계열** 예측"이
   이 주제의 얼어 있는 텍스트에 한 번도 없다(문단 0은 "앞으로의 추세"다). 위와 같은 자리다

### 3. 의미 변경 위험 때문에 손대지 않은 항목

**2와 따로 적는다.** 여기 들어가는 것은 「고치면 사실·조건·수치의 뜻이 달라질 것 같아서」·
「오답 보기의 함정이 그 표현에 걸려 있어서」·「대체어가 사실을 넓히거나 좁힐 수 있어서」인
것들이다. **항목마다 무엇이 달라질 뻔했는지를 한 줄로 적었다** — 그것이 이 목록의 쓸모다.

#### (가) 수치·경계값이 달라진다

| 자리 | 손대면 달라지는 것 |
|---|---|
| `rds-multi-az-failover-rto` 요약 "5분 **이내**" ↔ 본문·`q387` "5분 **미만**" | 경계값 5분을 포함하느냐가 갈린다 |
| `warm-standby-for-low-rto` 요약 "**분 단위 아래**" ↔ 본문·`q579` "**60초**" | 위와 같다. 수치로 바꾸면 경계가 새로 정해진다 |
| `savings-plan-details` 요약 "1년/3년 약정" | 슬래시를 풀어 쓰면 **수치 표기**를 손대는 일이 된다 |
| `q731` c0 "100퍼센트" ↔ 본문 "60%" | 수치 표기이고, 보기 넷 중 숫자가 든 것이 이 하나뿐이라 표기를 바꾸면 변별 신호가 된다 |
| `dynamodb-single-digit-latency` 요약 "**응답**을 유지" ↔ 본문 "**성능**" | 응답을 성능으로 넓히면 조건이 흐려진다 |
| `kinesis-retention-and-fanout`·`kinesis-record-size-limit` 요약의 "최대 365일"·"최대 1MB" | 수치라 하나도 건드리지 않았다 |
| `multivalue-answer-details` 요약 "최대 **8개**" | 이 개념의 이름값이고 `q221` 프롬프트와 짝이다 |
| `aurora-global-database-dr-targets` 요약 "RPO 1분·RTO 5분" | 조건 자체다 |
| `direct-connect-caveats` 요약 "몇 주에서 몇 달" | 물결표만 바꿨고 수치는 그대로다 |

#### (나) 사실의 범위가 넓어지거나 좁아진다

| 자리 | 손대면 달라지는 것 |
|---|---|
| `aurora-endpoint-types` 요약 "내가 고른 **복제본**" ↔ 본문 "**인스턴스**를 골라 묶고" | 사용자 지정 엔드포인트가 묶을 수 있는 범위가 달라진다 |
| `abac` 요약 "**리소스**에 붙인 태그" ↔ 본문 "리소스**와 주체**에" | ABAC가 보는 태그의 범위가 달라진다 |
| `route53-alias-record` 요약 "**ALB** 같은" ↔ 본문 "**로드 밸런서** 같은" | 별칭 레코드가 겨눌 수 있는 대상의 범위가 달라진다 |
| `waf-attach-targets` 제목 "붙일 수 있는 곳" | 붙는 쪽만 제목에 올리면 붙지 않는 대상(NLB·S3)이 가려져 범위가 좁아 읽힌다 |
| `amazon-inspector` 요약 "**고치지는** 않는다" ↔ 본문 "**패치를 적용하는** 서비스가 아니다" | 패치로 좁히면 이 서비스가 하지 않는 일의 범위가 줄어든다 |
| `internet-gateway-is-not-per-az` 요약 "**고**가용성" ↔ 본문 "가용성" | 단언의 세기가 달라진다 |
| `centralized-onprem-egress` 요약 "**퍼블릭 서브넷**을 두지 않는다" ↔ 본문 "**인터넷 게이트웨이**를 붙이지 않는다" | 무엇을 두지 않는지의 초점이 옮겨가 정답 보기가 거는 조건이 달라 보인다 |
| `sns-fifo-topic` 요약 "쓰는 **유일한** 선택지" | 덜어내면 SQS FIFO·EventBridge와 견줘 이것뿐이라는 결론이 사라진다 |
| `fargate-per-second-billing` 요약 "**수십 초**짜리" ↔ 본문 "**10초** 만에 끝나는" | 요약이 거는 범위가 좁아지거나 넓어진다 |
| `snowball-edge-compute` 요약 "쿠버네티스 클러스터" ↔ 본문 "**EKS Anywhere** 클러스터" | 지원 범위가 그 배포판 하나로 좁아 읽힌다 |
| `kinesis-client-library` 요약 "**샤드 할당**" ↔ 해설 "**샤드 수준 제어**" | 통제의 대상이 달라진다 |
| `service-catalog` 요약 "제품 **묶음**을 카탈로그로" | 맞추려면 덜어내야 해서 **의미 삭제**가 된다 |
| `control-tower-controls` 요약 "찾아낸다" ↔ 본문 "찾아 **보고하며**" | 보고를 보태면 요약을 늘려 사실을 더하는 일이 된다 |
| `sagemaker` 요약 "**옮기지** 않고" ↔ 본문 "**복사하지** 않고" | 원본이 남는지 여부의 초점이 달라진다 |
| `alb-cookie-stickiness` 요약 "이 방식이 아니다" ↔ 본문 "그대로 주지 않는다" | 본문이 둔 여지가 사라져 서술의 강도가 달라진다 |
| `gateway-load-balancer` 요약 "**일반** 트래픽" ↔ 본문 "웹이나 게임 트래픽" | 본문 말로 좁히면 요약이 두 예시에만 걸려 오히려 범위가 좁아진다 |
| `nlb-security-group` 요약 "**특정** 소스 IP" ↔ 본문 "**지정한** 소스 IP 범위" | 허용 목록을 누가 정하는지의 초점이 달라진다 |
| `config-configuration-recorder` 요약 "**건드리지** 않고" ↔ 본문 "설치하거나 설정을 바꾸는 일이 없으므로" | "수정하지 않고"로 좁히면 설치까지 포함하던 범위가 줄어든다 |
| `redshift-concurrency-scaling` 요약 "클러스터 **크기**를 건드리지 않는다" ↔ 본문 "클러스터를 그대로 둔 채" | 크기를 바꾸지 않는다는 초점이 클러스터 전체로 넓어진다 |
| `rds-custom` 요약 "직접 **손대야**" | 접근인지 사용자 지정인지로 좁아질 수 있다(step 4가 세운 판정이고 step 8·9·18·22가 이었다) |
| `sql-server-license-cost` 요약 "**Microsoft** 라이선스" ↔ 본문 "**상용 데이터베이스** 라이선스" | 어느 회사의 라이선스인지가 사라진다. 반대로 본문에 없는 회사 이름을 근거로 삼는 것도 이 phase의 일이 아니다 |
| `efs-one-zone` 요약 "잃어도 다시 만들 수 있는" | 이 배포 형태를 고르는 조건 자체라 다듬으면 넓어지거나 좁아진다 |
| `elasticache-not-a-durable-store` 요약 "고가용성과 확장성을 갖춘" | 요구 조건 자체라 풀어 쓰면 경계가 달라진다 |
| `reserved-instance-types` 요약 "**덜 싸다**" | 비교 대상이 적혀 있지 않고 본문("스팟만큼")과 해설("표준만큼")이 다르다. 풀려면 둘 중 하나를 골라야 하고 그것이 새 해석이다 |
| `fsx-ontap-multi-az` 요약 "밀리초 미만 공유 스토리지" | 풀어 쓰면 지연이 걸리는 대상(스토리지인가 접근인가)을 새로 해석하게 된다 |
| `alb-least-outstanding-requests` 요약 "**처리 중인** 요청" ↔ 본문 "**아직 응답하지 않은**" | 세는 대상의 경계가 달라 보인다 |
| `datasync-task-status-event` 요약 "SUCCESS나 ERROR" | 이벤트가 싣는 상태 값 자체라 한글로 바꾸면 그 값이 사라진다 |

#### (다) 오답 보기의 함정이 그 표현에 걸려 있다 / 정답 보기라 보수적으로 다뤘다

| 자리 | 손대면 달라지는 것 |
|---|---|
| `q328` c3 "**EBS 볼륨**을 붙이고" ↔ 해설 "**블록 볼륨**을 따로 붙여" | 해설이 일부러 상위 범주로 일반화한 것으로 읽히고, 보기의 서비스 이름을 손대면 변별 신호가 달라진다 |
| `q497` c1 "호출을 **흩어 보낸다**" | 이 보기의 함정이 "버퍼가 되지 못한다"이고 그것이 여러 수신자에게 퍼뜨리는 동작이라는 표현에 걸려 있다 |
| `q193` c2 "**멀티 오리진**" | 보기 넷이 짧은 라벨로 통일돼 있어 하나만 풀어 쓰면 결이 갈리고 그 차이가 변별 신호가 된다 |
| `q187` c2(정답) "DynamoDB DAX" · `q642` c1(정답) "이기종 소스" · `q270` c1(정답) "변경분" | 정답 보기의 표기를 건드리면 그 글자가 변별 신호가 된다 |
| `q034`·`q282` (phase 29가 이미 다룬 자리) | 오답을 프롬프트가 묻는 범주 안에 세우는 일과 얽혀 있다 |
| `q024` 프롬프트 "법·감사 목적의 장기 보관에 쓰는 클래스 가운데" | 보기 넷 중 둘이 그 범위 밖이라 고치려면 프롬프트를 다시 설계해야 한다 |
| `q228` 프롬프트 "허가된 사용자만" ↔ 본문 "복호화 권한을 따로 가진 사용자만" | 수단을 넣으면 정답(KMS 키로 암호화한다) 쪽으로 글자가 이어져 변별 신호가 생긴다 |
| `q351` 프롬프트 "그 자리에서 처리" | 본문의 "현장에서"는 정답 보기 c0에만 있는 낱말이라 프롬프트에 넣으면 정답 쪽으로 글자가 이어진다 |
| `q466` 프롬프트 "한 곳에 모아 둔" | "한 계정에"로 구체화하면 정답 보기의 "네트워킹 계정" 쪽으로 글자가 이어진다 |

#### (라) 이미 자연스러워 억지로 바꾸지 않았다 / 본문 문장을 되풀이하게 된다

UI가 개념 요약 바로 아래에 본문을 두므로, **요약을 본문 말로 맞추면 같은 문장이 두 번
보인다.** 이 사유로 남긴 자리가 스무 곳 남짓이다 — `parquet-columnar-format`·
`emr-security-configuration`·`cloudwatch`·`ecs-awsvpc-mode`·`instance-profile`·
`private-hosted-zone`·`waf-rate-based-rule`·`backup-long-term-retention`·
`backup-and-restore-dr`·`lambda-function-url-iam-auth`·`api-gateway-custom-domain-name`·
`secrets-manager-vs-parameter-store`·`kms-multi-region-key`·`cloudfront-signed-url`·
`organizations-scp` 등이다. `q186`·`q029` 프롬프트처럼 `data.test.ts`가 글자로 고정하고
지금 문체로도 자연스러운 자리도 여기 든다.

#### (마) 시험 풀이 관점의 표현 — 본문이 이미 그 관점으로 쓰여 있다

`connection-issue-heuristic`("연결 문제의 정답 신호") · `onprem-connectivity-heuristic`
("온프레미스 연결 문제의 출발점") · `rotation-heuristic`(step 19가 "자동 순환을 가리키는
신호"로 명사구화했다) 셋이다. 같은 주제의 얼어 있는 본문이 "선택지는 오답이다"(
`multi-az-standby-limits`) · "문제와 선택지에는"(`storage-type-names`)처럼 이미 그 관점으로
쓰여 있어, 제목·요약만 고치면 본문과 결이 갈린다. **step 4가 이 판정을 세우고 step 16·19가
이었다.**

#### (바) 명사구지만 「무엇을 못 하는가」를 제목으로 둔 자리

`multi-az-standby-limits`("다중 AZ 대기 인스턴스로는 할 수 없는 것") ·
`eventbridge-ordering-and-retention`("EventBridge가 보장하지 않는 것") ·
`shield-standard-network-layer`("Shield Standard가 다루지 않는 계층") ·
`waf-attach-targets`("WAF를 붙일 수 있는 곳") 넷이다. `/다$/`에 걸리지 않는 명사구이고,
무엇을 못 하는지를 제목에 넣으면 더 또렷해지지만 `data.test.ts`가 글자로 고정한 프롬프트와
짝을 이루거나(`q180`) 범위가 좁아 읽힌다. **step 4가 처음 남기고 step 13·20이 이었다.**

### 4. 마지막 커밋 상태

| 항목 | 값 |
|---|---|
| 브랜치 | `feat-32-field-consistency` |
| 분기 지점 | `04f6946` — `merge: phase 31 문체 확대 적용을 develop에 들인다` |
| `develop` 대비 | **52 커밋** — step 0~23의 feat·chore 쌍 51개에 이 step의 feat 커밋 하나다. 앞선 step들처럼 `chore: step 24 output` 커밋이 뒤따르면 53이 된다 |
| 마지막 커밋 | `feat(32-field-consistency): step 24 — ratchet-closeout-and-report` — **이 절을 담은 커밋 자체라 해시를 여기 적을 수 없다**(적으면 그 값을 넣는 순간 해시가 다시 바뀐다). 지금 값은 `git log -1 --format='%h %s'`로 읽어라 |
| **push** | **하지 않았다.** 병합과 push는 사람이 판단한다(CLAUDE.md 「Git 전략」). 원격에 이 브랜치는 없다 |
| 워킹 트리 | 이 커밋 시점에 깨끗하다. 내가 만들지 않은 변경은 없었다 |

`src/` 변경 규모(`git diff 04f6946..HEAD --stat -- src/`):

```
 src/data/data.test.ts   |  47 ++++-
 src/data/questions.json |  50 ++---
 src/data/topics.json    | 532 ++++++++++++++++++++++++------------------------
 3 files changed, 332 insertions(+), 297 deletions(-)
```

#### 검증 결과

| 검사 | 결과 |
|---|---|
| `npm test` | **492개 통과** (22 파일). 명사구 단언이 전 주제로 걸린 상태다 |
| `npm run build` | 통과 (tsc 타입체크 포함) |
| `npm run lint` | 통과 (`--max-warnings 0`) |
| `node scripts/check-structure.mjs` | exit 0 — 개념 id·name, 주제 메타데이터, 개념 개수·순서, 문항 파일 모두 기준과 같다 |
| `node scripts/field-diff.mjs 04f6946` | exit 0 — **얼어 있는 필드는 그대로다**(`paragraphs`·`explanation`·`answerIndex`·id·순서·주제 메타데이터) |
| `node scripts/coverage.mjs` | exit 0 — 개념 **618개 중 618개(100%)**, 문항 732개, 문항 없는 주제 0개 |
| `node scripts/check-verbatim.mjs` | exit 0 — 32자 이상 겹치는 개념 본문 없음. 넘긴 겹침 1건은 ADR-025가 허용한 S3 클래스 이름 나열이다 |
| `node scripts/content-audit.mjs` | exit 0 — **① 문장형 제목 0건**. ②는 91→74로 줄고 ③④⑤⑥은 늘지 않았다 |

`scripts/topics-baseline.json`은 매 step `sync-baseline.mjs`로 갱신했고 손으로 고치지
않았다. `docs/ADR.md`에는 ADR을 쓰지 않았다 — 이번 범위는 문체 수정이고 새로 정할 설계
결정이 없었다. **문체 기준을 ADR로 굳힐지는 사용자가 판단한다.**

#### 다음 세션이 먼저 할 일

**코드가 아니라 사용자 검수다.** phase 29·30·31이 남긴 교훈이 그대로 적용된다 —
합격 기준은 「한국어로 자연스럽게 읽히는가」이고 기계로는 판정할 수 없다.
`npm run dev`로 실제 화면을 열어, 개념 목록에서 **제목 198개가 이름표로 읽히는지**를
먼저 봐 달라고 청하는 것에서 시작한다. **검수를 테스트 통과나 grep으로 갈음하지 마라.**

열려 있는 후보는 셋이다 — 위 2의 (바) 사실 판정 3건, (마) 개념 `name`의 괄호 앞 공백
표기 통일(618개 전체), 그리고 phase 31이 본문·해설에 쓴 「돌리다·띄우다」 계열
74건을 손댈지 여부(그 필드를 여는 결정이 필요하다).

---

작성 시점: 2026-09-09. phase 30(문제 은행 문체 다듬기)의 step 0~28을 **전부 끝낸** 직후다.
이 파일은 **다음 phase를 고르기 전까지의 인수인계**만 담는다. 결정이 끝나면 그 내용은
step 명세와 ADR로 옮겨가고 이 파일은 다시 짧아진다.

> **다음 세션이 먼저 할 일은 코드가 아니라 사용자 검수다.** phase 30이 문항 732개 중
> 718개의 프롬프트를 다시 썼지만, 합격 기준은 **"한국어로 자연스럽게 읽히는가"**이고
> 기계로는 판정할 수 없다. `npm run dev`로 실제 화면을 열어 읽어 달라고 청하는 것에서
> 시작한다. phase 29가 남긴 교훈이 그대로 적용된다 — **검수를 테스트 통과나 grep으로
> 갈음하지 마라.**

## phase 31 결과 보고 (2026-09-10) — 문체 확대 적용이 끝났다

`feat-31-content-quality-rollout`에서 step 0~25를 전부 끝냈다. 범위는 **문체와 가독성 수정**
하나였고 사실관계는 건드리지 않았다. 아래 넷은 사용자가 완료 후 정리해 달라고 한 항목이다.
**아직 push하지 않았다** — 4를 봐라.

> **아래쪽의 「지금 상태」와 「phase 31 — 명세를 짜 두었다. 아직 돌리지 않았다」 두 절은
> 이 절보다 앞서 쓰인 것이라 낡았다.** 테스트 471개·`fix-vpc-endpoint-fact` 미병합·
> phase 31 미실행은 전부 이 절의 4가 대신한다. 두 절은 당시 기록으로 그대로 둔다.

### 1. 무엇을 얼마나 고쳤나

**주제 39개를 전부 훑었다.** step 0~2가 세 주제, step 3~25가 나머지 36개다.
기준선은 phase 착수 커밋 `4453434`이고, 아래 수치는 그 커밋과 HEAD의 JSON을 **필드 단위로
비교한 실측**이다(요약에 적힌 자기 보고 수치가 아니다).

| 대상 | 총계 | 바뀐 것 |
|---|---|---|
| 주제 | 39 | **39** — 한 글자도 안 바뀐 주제가 없다 |
| 개념 | 618 | **405** (65%) |
| 개념 문단 `paragraphs` | — | **545곳** |
| 문항 | 732 | **521** (71%) |
| 문항 해설 `explanation` | — | **520** |

파일 단위(`git diff 4453434..HEAD --stat -- src/`):

```
 src/data/data.test.ts   |  321 +++++++++++++++
 src/data/questions.json | 1042 +++++++++++++++++++++++------------------------
 src/data/topics.json    |  810 ++++++++++++++++++------------------
 3 files changed, 1247 insertions(+), 926 deletions(-)
```

**step 3에서 범위가 좁아진 것이 데이터에 그대로 남아 있다.** step 0~2와 그 정리 커밋
(`e81b594`)까지는 `name`·`summary`·문단 개수·`prompt`·`choices`도 손댔고,
**step 3~25는 개념 `paragraphs`와 문항 `explanation` 둘만** 고쳤다. 그 23개 step이 매번
"고정 필드 위반 0"이라고 적은 것이 실측으로 확인된다.

| 필드 | 착수 ~ `e81b594` | `e81b594` ~ HEAD (step 3~25) |
|---|---|---|
| 개념 `name` | 3 | **0** |
| 개념 `summary` | 1 | **0** |
| 개념 문단 개수 | 3 | **0** |
| 개념 문단 본문 | 53 | 492 |
| 문항 `prompt` | 6 | **0** |
| 문항 `choices` | 3 | **0** |
| 문항 `answerIndex` | 0 | **0** |
| 문항 `explanation` | 33 | 487 |

`scripts/content-audit.mjs`를 착수 커밋의 데이터에도 돌려 대조했다.

| 지표 | 착수(`4453434`) | 지금 | 차 |
|---|---|---|---|
| ① 문장형 제목 | 183 (34개 주제) | **181** (32개 주제) | −2 |
| ② 관용 표현 | 144 (개념 66·문항 78) | **91** (개념 39·문항 52) | **−53** |
| ③ 정답 노출 후보 | 62 | 62 | 0 |
| ④ 소속 없는 용어 | 1 | 1 | 0 |
| ⑤ 장문 | 3 | 3 | 0 |
| ⑥ 중복 후보 | 8쌍 | 8쌍 | 0 |
| 여섯 지표가 모두 0인 주제 | 3 | **4** | +1 |

**늘어난 지표가 하나도 없다.** 줄어든 것은 ①·② 둘뿐이고, 나머지 넷이 그대로인 이유는
전부 범위 밖 필드(`name`·`prompt`·`choices`)에 있기 때문이다 — 아래 2A를 봐라.

**이 표가 이 phase의 성과를 재지 못한다는 것을 분명히 적어 둔다.** 기계가 보는 것은 여섯
지표뿐이고, 실제로 고친 것은 은유적 추상어(`자리`·`축`·`갈린다`·`밀린다`), 줄표로 이어
붙인 문장, 지시어(`이쪽`·`그쪽`·`앞의 둘`), 개념 본문이 확인 문제를 가리키던 말,
문단 첫 문장의 순서, 주술 불일치다. 유형과 빈도는 3에 있다.

`scripts/topics-baseline.json`의 `questionsSha256`은
`145f5f7d…` → `d0e7634e…`로 26번 이어 갱신됐고, `conceptLineCount`와 주제 메타데이터는
그대로다.

### 2. 변경하지 않고 보류한 항목

각 step 요약의 「보류」를 합치면 **262건**이다. 사유별로 묶는다.

#### A. 범위 밖 필드에 있다 — 119건이 이 사유를 명시한다

step 3~25가 손댈 수 있던 것은 개념 `paragraphs`와 문항 `explanation` 둘뿐이었다.
같은 결함이 다른 필드에도 있으면 **한쪽만 고칠 때 한 주제 안에서 같은 것을 두 말로
부르게 되므로** 통째로 남긴 경우가 많다.

**A1 — 개념 `name`(문장형 제목) 181건, 32개 주제.** `content-audit.mjs`의 ① 값 그대로다.

| 건수 | 주제 |
|---|---|
| 14 | `efs-fsx`, `sqs-sns-eventbridge` |
| 10 | `lambda` |
| 9 | `elastic-load-balancing`, `iam-permissions` |
| 8 | `data-transfer-services`, `rds-storage-features`, `cloudfront-global-accelerator`, `api-gateway-step-functions` |
| 7 | `aurora`, `dynamodb` |
| 6 | `s3-access-control`, `ecs-eks-fargate`, `vpc-networking`, `cost-management` |
| 5 | `hybrid-connectivity`, `kinesis-streaming` |
| 4 | `ebs-instance-store`, `ec2-autoscaling`, `backup-disaster-recovery`, `emr-glue-athena` |
| 3 | `elasticache-purpose-built-db`, `security-groups-nacl`, `route53`, `redshift-opensearch-quicksight`, `cloudwatch-xray`, `secrets-encryption`, `waf-shield`, `guardduty-macie-inspector` |
| 2 | `identity-federation`, `organizations-cloudtrail-config` |
| 1 | `storage-gateway-migration` |
| 0 | `aws-core-services`, `s3-storage-classes`, `s3-versioning-lifecycle`, `s3-encryption-batch`, `governance-iac`, `systems-manager`, `ai-ml-services` |

**제목이 본문에서 없앤 말을 그대로 들고 있는 자리**를 step들이 여럿 짚었다 —
`ecs-task-role-vs-task-execution-role`(`…은 다른 자리다`),
`elasticache-not-a-durable-store`(`…두는 자리가 아니다`),
`scp-attachment-targets`(`SCP를 붙일 수 있는 자리`),
`data-lifecycle-manager`(`…정책으로 돌린다`),
`kms-automatic-key-rotation`(`…해마다 돈다`),
`alb-l7-vs-nlb-l4`(`계층으로 갈리는 …`),
`gpu-instance-family`(`… 서비스 자체가 갈린다`),
`emr-node-instance-family-choice`(`… 제품군이 갈린다`).

**A2 — 개념 `summary` 62건이 언급된다.** 본문·해설은 고쳤는데 요약만 옛말로 남은 자리다.
`efs-fsx`(3건)·`ecs-eks-fargate`(6건)·`lambda`(3건)가 많다.

**A3 — 문항 `prompt` 41건.** `q452`·`q453`·`q476`·`q522`·`q535`·`q546`·`q552`·`q650`처럼
개념·해설의 같은 표현은 고쳤는데 프롬프트만 남은 자리가 대부분이다.

**A4 — 문항 `choices` 51건.** `q348`·`q356`·`q384`·`q415`·`q416`·`q584`·`q587`·`q691`·
`q718 c1`처럼 보기 하나가 옛말을 그대로 쓴다. `q399`·`q404`·`q427`·`q488`·`q624`는
보기 넷이 같은 모양의 줄표(` — `)를 써서 한쪽만 끊으면 대칭이 깨진다.

**A5 — 「짝이 깨진 자리」 7건.** 위 A2~A4의 결과다. **반대로 step 21·22는 범위 밖 필드에
걸친 짝이 하나도 없어 그 두 step은 깨진 짝을 남기지 않았다.**

#### B. `src/data/data.test.ts`가 고정한 구절 — 7건

`toBe`/`toContain` 단언이 그 문장을 잡고 있어, 고치려면 단언까지 함께 고쳐야 한다.
「단언의 뜻을 바꾸지 마라」가 step 규칙이어서 전부 남겼다.

1. `backup-disaster-recovery.backup-and-restore-dr` p0 + `q578` 해설 — `컴퓨팅은 필요해질 때까지 띄우지 않는다`
2. `q130` 해설 **전문**(`toBe`) — `통제하는 자리가 서브넷이 아니라`
3. `guardduty-macie-inspector.amazon-inspector` p1 — `…다른 선택지와의 갈림길이 된다`
4. `iam-permissions.network-access-analyzer` p0 — `분석 대상이 네트워크인지 권한인지로 갈린다`(짝인 `q688` 해설도 함께 남김)
5. `organizations-cloudtrail-config.scp-attachment-targets` — `연결한 자리 아래에만 적용된다`
6. `ai-ml-services.comprehend` p0 — `글의 의미를 다루는 자리`(짝인 `q313` 해설도 함께 남김)
7. `route53` — `q221` 프롬프트 전문(`toBe`)이 `헬스 체크`/`상태 검사` 통일을 막는다

#### C. 고치면 「새 정보 추가」가 된다

**C1 — 기초 용어 풀이가 그 주제 안에 없다.** step 3~25가 다룬 36개 주제 **거의 전부**에서
나왔다(24개 항목이 「주제 전체」로 묶여 있다). ADR-010·014·028·029의 목록(22종) 밖이라
풀이를 세우려면 ADR을 먼저 고쳐야 한다. **618개념 어디에도 정의가 없다고 짚힌 낱말**이
특히 무겁다.

| 낱말 | 어디서 걸렸나 |
|---|---|
| `스냅샷` | `s3-storage-classes`·`ebs-instance-store` 등 다수 — 개념 넷의 주어인데 정의가 없다 |
| `파드` | `ecs-eks-fargate` 개념 여덟의 주어 |
| `샤드` | `kinesis-streaming` 개념 다섯의 주어 |
| `키 자료` | `secrets-encryption` 개념 넷의 주어 |
| `Web ACL` | `waf-shield` 개념 셋의 주어 |
| `신뢰 정책` | `iam-permissions` 개념 둘의 주어 |
| `배스천 호스트` | `systems-manager` 개념 둘·문항 셋의 전제 |
| `임시 포트 범위` | `security-groups-nacl` — 상태 비저장의 결과를 대는 유일한 근거 |
| `관리 계정`·`멤버 계정` | `organizations-cloudtrail-config`·`cost-management` 여섯 개념의 주어 |
| `오리진`·`배포` | `cloudfront-global-accelerator` 개념 절반, `api-gateway-step-functions` |
| `AZ`·`가용 영역` | `vpc-networking` 개념 넷을 비롯해 여러 주제 (step 1이 `s3-storage-classes`에서 세운 문구를 그대로 쓸 수 있다) |

**C2 — 도입 문장이 없어 그 서비스가 무엇인지가 `summary`에만 있다.** 문단이 한 문장뿐이거나
카테고리 한 줄 뒤가 곧바로 세부·오해 방지·요구여서, 한 문단 안에서 순서를 바꾸는 것으로는
풀리지 않는다. `lambda.lambda-function-url`·`lambda.lambda-vpc-access`·
`route53.resolver`·`cloudwatch-xray.performance-insight`·`ecs-eks-fargate.aws-batch`·
`ecs-eks-fargate.fargate-no-time-limit`·`waf-shield.waf-bot-control`·
`cost-management.cost-anomaly-detection`·`kinesis-streaming`의 정의 개념 셋 등이다.
**문단을 넘는 이동도 범위 밖이었다** — `cloudfront-geo-restriction`·
`cloudfront-s3-upload-with-oac`·`gpu-instance-family`·`security-group-referencing`처럼
정체가 `p1`에 있는 자리가 여기 든다.

#### D. 표기를 바꾸는 판단이라 문체 범위를 넘는다 — 같은 것의 두 이름 12자리

| 주제 | 두 이름 |
|---|---|
| `route53` | `상태 검사` / `헬스 체크` |
| `emr-glue-athena` | `프라이머리 노드` / `주 노드` |
| `elastic-load-balancing` | `타깃 그룹` / `대상 그룹`, `Auto Scaling 그룹` / `오토 스케일링 그룹` |
| `api-gateway-step-functions` | `Edge-optimized` / `엣지 최적화` |
| `waf-shield` | `IP Set` / `IP 세트` |
| `vpc-networking` | `VPC Endpoint` / `VPC 엔드포인트`, `NAT Gateway` / `NAT 게이트웨이` |
| `secrets-encryption` | `원본`(개념) / `오리진`(해설) |
| `sqs-sns-eventbridge` | `주제`(개념) / `토픽`(문항) |
| `elasticache-purpose-built-db` | `DB` / `데이터베이스` |
| `s3-access-control` | `콘텐츠 전송 네트워크` / `CloudFront` |
| `efs-fsx` | `Google Cloud`로 적힌 예시(`Google Drive`를 가리키는 듯하다) |

**`sqs-sns-eventbridge`의 `주제`는 특히 성가시다** — 이 앱의 데이터 모델에도 `Topic`이
있어서 같은 낱말이 두 층에서 쓰인다.

#### E. 대체어가 사실을 넓히거나 좁힐 수 있다 — 11건

비교 기준을 밝히지 않은 `앞선다`·`유리하다`·`떨어진다`·`뒤에 놓인다`·`값을 하다` 계열이다.
**기준이 같은 문장 안에 있으면 고쳤고**(step 8·13·16·23이 그렇게 했다) **없으면 남겼다** —
`낫다`·`유리하다`로 바꾸는 순간 원문에 없는 주장이 되기 때문이다. 걸린 자리는
`data-transfer-services.transfer-family-workflow` p1, `rds-storage-features.rds-custom-byol`·
`rds-custom` p1, `dynamodb.dynamodb-auto-scaling-target-utilization` p1,
`dynamodb.dynamodb-s3-export-vs-streams` p0, `q445`,
`cloudfront-global-accelerator.cloudfront-alb-origin` p0·`cloudfront-price-class` p1,
`ecs-eks-fargate.eks-aws-load-balancer-controller` p1,
`api-gateway-step-functions`의 셋, `cloudwatch-xray.log-analysis-options` p1이다.

#### F. 문항 재설계가 필요하다 — 기계 지표가 그대로인 이유

- **⑥ 중복 후보 8쌍 중 3쌍이 실제 중복이다**(`content-audit.mjs` 머리주석) —
  `q113`·`q116`, `q031`·`q033`, `q040`·`q041`. step 2가 `q031`의 프롬프트 축을 갈라
  세 문항이 서로 다른 것을 묻게 만들었지만 **개념과 정답 텍스트가 같아 도구에는 계속 뜬다.**
  중복이 아니라고 판정해 남긴 것은 `q096`·`q097`(step 16), `q141`·`q145`(step 21),
  `q146`·`q148`(step 22)이다.
- **③ 정답 노출 후보 62건은 위반 목록이 아니다.** 각 step이 전건을 손으로 읽어
  「그 낱말이 없으면 문항이 성립하지 않는다」(ADR-030 기준 3의 예외)로 판정했다.
  `AWS`·`DB`·`IP`처럼 ADR-015가 상식으로 뺀 토큰이 다수 섞인다.
- **⑤ 장문 3건**(`q029`·`q054`·`q079`)은 쉼표에서 「누가/무엇을/왜」로 끊겨 읽혀 남겼다.
  `q054`·`q055`·`q056`은 셋이 같은 모양이라 하나만 끊으면 대칭이 깨진다.
- **④ 소속 없는 용어 1건**은 `q650` 프롬프트의 `객체 스토리지`다.
- **요구가 둘인 문항**은 ADR-030 기준 2의 경계(`독립된 지식 둘을 곱해야 하는가`)로
  전부 판정해 남겼다 — `q003`·`q024`·`q170`·`q271`·`q272`·`q275`·`q279`·`q325`·`q326`.

#### G. 판단이 갈려 그대로 뒀다 — 나머지

「고치면 뜻이 미세하게 달라진다」로 남긴 자리들이다. 강조 마커(`**…**`)가 문단 안에 든 곳
(`data-transfer-services`·`vpc-networking`·`secrets-encryption`)은 **표기 정책이라 범위
밖**으로 뒀고, `security-service-lineup`의 `**용어** — 정의` 라벨형 줄표는 문단 넷이 같은
서식이라 손대면 대칭이 깨져 남겼다.

### 3. 반복적으로 발견한 문제 유형 (빈도순)

각 step이 「되풀이해서 나온 문제 유형」에 적은 것을 묶었다. 괄호 안은 **그 유형을 항목으로
적은 step 수**다. **다음 phase(사실관계 검수)가 무엇을 만나게 될지가 여기서 나온다.**

1. **`자리`가 문맥마다 다른 것을 가리킨다 (22개 step).** 압도적 1위다. 곳·일·역할·서비스·
   장치·도구·상황·조건·원인·요구·선택지·대상·위치를 두루 가리켰다. **처방은 하나로 고정할 수
   없다** — 그 문장이 실제로 가리키는 것을 넣어야 하고, 앞 문장이 이미 `서비스다`·`도구다`로
   끝났으면 명사를 또 넣지 말고 동사를 그대로 부정하는 쪽(`맡지 않는다`)이 짧다.
   최다 밀집은 `sqs-sns-eventbridge` 한 주제 35곳이었다.
   **`그 자리에서`(즉시·제자리)·`한자리에`·`비밀번호 자리`(입력 칸)는 대상이 아니다.**
2. **개념 본문과 해설이 같은 문장을 공유한다 (22개 step — step 4~25 전부).**
   주제마다 11~20쌍이다. ADR-016으로 확인 문제 화면에서 개념을 펼치면 둘이 같은 화면에
   보이므로, **한쪽만 고치면 그 자리가 두 이름을 갖는다.** 이 phase가 개념 545곳과 해설
   520개를 늘 짝으로 맞춘 이유다.
3. **줄표 ` — `로 두 문장을 이어 붙인다 (11개 step).** 네 모양이 있다 —
   「요지 → 근거」(마침표로 끊고 `~때문이다`로 받는다), 「선언 → 내용」(그냥 끊으면 된다),
   「총론 → 열거」(`A하고, B하고, C하는 것이다`로 닫아야 한다),
   **「주어/목적어 → 삽입구 → 서술어」(끊는 것만으로는 안 되고 문장 구조를 다시 짜야 한다).**
   해설 쪽이 개념 쪽보다 훨씬 많았다 — phase 28이 해설을 다시 쓸 때 들어온 형태로 보인다.
4. **`축`이 문맥마다 다른 것을 가리킨다 (11개 step).** 「가르는 기준」이면 `기준`으로 풀리지만,
   **`축이 하나 더 있다`처럼 갈래를 세는 자리는 낱말 치환으로 안 되고 문장을 다시 써야 한다**
   (`확인할 것이 하나 더 있다`·`두 가지에서 나뉜다`). 「비교 대상이 다루는 것이 다르다」는
   뜻이면 `다른 문제다`·`목적이 다르다`가 맞았다.
5. **개념 본문이 확인 문제를 직접 가리킨다 (8개 step).** `선택지는 오답이다`·
   `문제에 X가 보이면`·`같은 보기 줄에 오르는`이 그 모양이다. **개념 화면에는 가리킬 보기가
   없어 그 자리에서 읽히지 않는다.** 가장 밀집한 곳이 `iam-permissions`·`identity-federation`
   여섯, 그다음이 `organizations-cloudtrail-config`·`cost-management` 넷이었다.
   **해설의 `선택지`는 대상이 아니다** — 보기와 함께 읽히는 자리다.
6. **`띄우다`·`돌리다` 계열을 범위 밖 필드 때문에 통째로 보류 (7개 step).**
   **보류 여부는 그 낱말이 아니라 그 낱말이 `summary`·보기·프롬프트에 있느냐로 갈렸다** —
   `route53`·`secrets-encryption`·`cloudwatch-xray`·`systems-manager`는 본문·해설에만 있어
   전부 고쳤고, `ecs-eks-fargate`(22건)·`emr-glue-athena`(16건)·`lambda`(15건)는
   범위 밖 필드에 걸쳐 있어 하나도 못 고쳤다. **남은 ② 91건의 대부분이 이 셋이다.**
7. **정규식·도구를 한 번만 돌리면 놓친다 (5개 step).** 활용형이 패턴을 비껴가고
   (`밀리지 않는다`는 `밀린` 패턴에 안 걸린다), `길`·`오른다`·`모양`처럼 목록에 없는 은유가
   섞이며, 편집이 새 결함을 만들기도 한다. **편집을 마친 뒤 재스캔이 매번 마지막 몇 건을 줍었다.**
8. **해설이 개념보다 먼저 옳은 형태를 갖고 있다 (5개 step).** phase 28이 해설을 다시 쓰면서
   더 나은 표현을 이미 넣어 둔 자리다. **개념을 그쪽에 맞추면 사실을 건드리지 않고 풀린다.**
9. **문단 첫 문장에 정체가 없다 (유형으로 2개 step, 보류로 11건).** 오해 방지·소거·대비·
   문제 상황으로 열고 「이것이 무엇인가」가 뒤에 온다. 한 문단 안에서 순서를 바꾸거나 생략된
   주어를 되살리면 풀리지만, 정체가 다음 문단이나 `summary`에만 있으면 못 푼다(위 C2).
   **순서를 바꿀 때 첫 문장이 `summary`와 같아지면 안 된다** — UI가 요약 바로 아래에 본문을
   두므로 같은 문장이 두 번 보인다(step 0의 교훈).
10. **단발로 나온 것들.** 카테고리 한 줄 바로 뒤 주어 되풀이(step 6·22) /
    지시어를 이름으로 바꾸면 같은 이름이 이웃 문장에 두 번 남음(step 14) /
    약어 풀네임(ADR-015)이 지시어 치환을 제약함(step 11) /
    괄호 약어 풀이가 풀네임 가운데를 가름(step 7) /
    프롬프트가 이미 옳은 낱말을 쓰고 있어 그것을 근거로 삼음(step 17·18·23·25) /
    조사 하나가 구문을 바꿈(step 25) /
    굵은 표시 뒤 줄표는 마침표를 굵은 표시 안에 넣어 끊음(step 25).

**다음 phase에 넘기는 한 줄:** 이 phase는 **문장이 어떻게 읽히는가**만 봤고
**그 문장이 사실인가**는 한 번도 검증하지 않았다. 위 C1(기초 용어)과 D(같은 것의 두 이름)는
문체 문제로 잡혔지만 실은 **사실·표기의 문제**여서 다음 phase의 입력이 된다.

### 4. 마지막 커밋 상태

| 항목 | 값 |
|---|---|
| 브랜치 | `feat-31-content-quality-rollout` |
| 분기 지점 | `4453434` — merge: VPC 엔드포인트 사실 통일과 phase 31 명세를 develop에 들인다 |
| 마지막 커밋 | `8e43110` — chore(31-content-quality-rollout): step 25 output |
| 그 앞 | `a3c7a1e` — feat(31-content-quality-rollout): step 25 — governance-iac-and-systems-manager-and-ai-ml-services |
| `develop` 대비 | **56 커밋 앞선다**(이 보고서 커밋을 더하면 57) |
| `develop`에만 있는 것 | **커밋 하나** — `cf54a5d` docs: worktree에 concepts-raw.md가 없으면 전사 검사가 조용히 건너뛴다는 것을 남긴다. **병합할 때 함께 봐라.** |
| push | **하지 않았다.** 병합과 push는 사람이 판단한다(CLAUDE.md). |

검증(전부 이 보고서를 쓰기 직전에 직접 돌렸다):

| 명령 | 결과 |
|---|---|
| `npm test` | **492개 통과 (22개 파일)** — 착수 시점과 같다. step 0~2가 21개를 더했고(471→492) step 3~25는 단언을 하나도 더하거나 고치지 않았다 |
| `npm run build` | 통과 (tsc 타입체크 포함, 877ms) |
| `node scripts/check-structure.mjs` | 이상 없음 — 개념 id·name, 주제 메타데이터, 개념 개수·순서, 문항 파일 전부 기준과 같다 |
| `node scripts/coverage.mjs` | 개념 618개 중 618개 덮임 (100%), 문항 732개, 문항 없는 주제 0개 |
| `node scripts/check-verbatim.mjs` | 전사 이상 없음 (ADR-025가 넘기기로 한 서비스 이름 나열 1건만 보고됨) |
| `node scripts/content-audit.mjs` | **착수 대비 늘어난 지표 0** — 1의 표를 봐라 |

## 먼저 읽어라 — 다른 기기에서 이어받는 법 (2026-09-09에 갱신)

**phase 28~30은 `develop`을 거쳐 `main`까지 나갔다**(`7339754`, 배포된 사이트에 반영돼 있다).
아래 본문 곳곳에 "phase 29·30은 push되지 않았다"고 적힌 것은 **병합 전에 쓰인 문장이니 믿지
마라** — 최신은 아래 「지금 상태」 표다.

지금 병합·push를 기다리는 것은 브랜치 `fix-vpc-endpoint-fact` 하나다. 커밋 둘이 들어 있다 —
**(1) 후보 E 판정(ADR-031)**, **(2) phase 31 명세**. **병합과 push는 사람이 판단한다**(CLAUDE.md).

**phase 31을 돌리기 전에 이 브랜치를 `develop`에 병합해라.** harness가 현재 브랜치에서
`feat-31-content-quality-rollout`을 파므로, 병합하지 않고 돌리면 step 21(`vpc-networking`)이
ADR-031이 이미 고친 자리를 다시 열게 된다.

```bash
git checkout develop
npm install            # Node 18.17.1
npm test               # 471개 통과해야 정상
node scripts/check-structure.mjs   # 이상 없음이어야 정상
```

`python3`는 없을 수 있다 — Windows에서는 `py` 또는 `python`이 Python 3.13이다.

### phase 30 — 끝났다. 남은 것은 사용자 검수다

사용자 요청은 **"AWS 퀴즈 문장을 전체적으로 다시 검토해달라 — 의미만 전달되는 번역체가
아니라 한국어로 자연스럽게 읽히는 문제 문장으로"**였다. step 29개를 모두 실행해
주제 39개 전부를 훑었다.

세션 도중 사용자가 step 0·1의 대조표를 보고 **"이대로 계속"**으로 문체 기준을 확정했다.
그때 함께 짚은 것 하나 — 이 phase는 `쓰다→사용하다`·`부르다→호출하다`·`훑다→살피다`처럼
**고유어를 한자어로 바꾸는 치환**을 체계적으로 했고, 이것이 "번역체를 줄인다"는 요청과
반대 방향일 수 있다고 알렸다. 사용자는 그대로 진행하기로 판정했다. **다시 묻지 마라.**

| 지표 (세는 규칙은 아래 각주) | 착수 | 완료 |
|---|---|---|
| 프롬프트가 체언으로 끊긴 것(`…서비스는?`·`…것은?`) | 488 (67%) | **35 (5%)** |
| 명시적 물음(`…는가?`·`…인가?`)으로 닫은 것 | 228 (31%) | **697 (95%)** |
| 사용자가 제안한 `~하는 상황이다` 형태 | 0 | **486** |
| 끝맺음 형태 종류 | 163종 | **28종** |

> 각주: 이 표의 세는 규칙은 착수 조사(616/84%)와 다르다. 여기서는 체언 종결을
> `/(은|는|것은|이|가)\?$/`에서 `(는가|인가)\?$`를 뺀 것으로, 명시적 물음을
> `/(는가|인가)\?$/`로 쟀다. **숫자를 되짚을 때 두 규칙을 섞지 마라.**

데이터 무결성은 착수 커밋(`a673518`)과 전수 대조해 확인했다.

| | |
|---|---|
| `prompt` 변경 | 718 / 732 |
| `choices` 변경 | 132 (표현만. 정답·오답의 변별점은 그대로) |
| `answerIndex` 변경 | **0** |
| `conceptId` 변경 | **0** |
| `explanation` 변경 | 21 — 전부 프롬프트 인용을 맞춘 것이다(명세가 허용한 유일한 사유) |
| 정답 텍스트가 프롬프트에 통째로 들어간 문항 | 착수 1건 → 완료 1건 (**새로 생긴 것 없음**) |

phase 30의 가장 큰 실패 방식은 **문장을 자연스럽게 만들려다 정답을 가르는 조건을 흘리는
것**이었는데, 위 마지막 줄이 그것이 일어나지 않았음을 보인다.

**남은 audit 지표** — ④ 소속 없는 용어 1건, ⑤ 장문 3건, ③ 정답 노출 후보 62건(위반 건수가
아니다), ② 관용 표현 144건, ① 문장형 제목 183건. **①은 `topics.json`의 개념 제목이라 이
phase의 범위가 아니었다**(step마다 그렇게 판정하고 넘겼다). ②도 대부분 개념 본문과 해설에
있고, 이 phase는 프롬프트만 손댔다.

#### step 18에서 겪은 것 — 사용량 한도로 죽으면 이렇게 된다

step 18(`polish-security-groups-nacl`)이 데이터 17문항을 커밋한 **직후** 한도에 걸려
headless `claude`가 3회 연속 exit 1로 죽었다. executor는 그 상태를 그대로 커밋하고
`error`로 찍는다. 결과는 **저장소가 깨진 채로 남는 것**이다 — 테스트 4개 실패,
`check-structure` 실패.

아래 「이어받을 때 주의할 것」은 "step을 `pending`으로 되돌리고 다시 실행하라"고 적고 있는데,
**데이터가 이미 커밋된 뒤에 죽었다면 그것만으로는 부족하다.** 이번에는 되돌리지 않고
뒤처리를 마저 했다(`6c275da`). 판단 근거는 데이터 작업 자체가 온전했다는 것이다 —
앞 커밋과 전수 대조해 `answerIndex`·`explanation`·`conceptId` 변경이 0건임을 확인했다.
빠져 있던 것은 셋이었다.

1. `data.test.ts`가 문자열로 고정한 프롬프트 갱신 — **이것이 테스트를 깨뜨린 원인이다.**
   vitest는 한 `it` 안에서 첫 단언에 멈추므로, 실패 목록에 뜬 개수보다 실제로 고칠 것이 많다.
   바뀐 문항 id로 `grep 'prompts\.qNNN' src/data/data.test.ts`를 전부 돌려야 한다.
2. `scripts/topics-baseline.json`의 `questionsSha256` 갱신. **이 파일은 1칸 들여쓰기이고
   `"questionsSha256":"..."`에 콜론 뒤 공백이 없다.** `JSON.stringify(…, null, 2)`로
   다시 쓰면 2905줄이 통째로 바뀐다 — sha 문자열만 치환해라.
3. phase index의 step 상태·`summary`.

### phase 29에서 배운 것 — 되풀이하지 마라

**검수를 테스트 통과나 데이터 grep으로 갈음하면 안 된다.** step 0이 용어를 첫 주제에만 넣고
"고쳤다"고 보고했는데 사용자가 실제 화면을 열어 30초 만에 같은 자리에서 다시 막혔다. 이 앱의
읽는 단위는 개념이 아니라 **주제 페이지**다(ADR-029가 그래서 나왔다). 그리고 기계 지표가
여섯 개 다 0건이어도 사람이 읽으면 남은 것이 보인다 — `q036`·`q039`가 그 자리였다.

---

## phase 29 — 끝났다. 무엇을 했고 무엇이 남았나

브랜치는 `feat-29-content-quality-pilot`이고 **`develop`은 아직 이 작업을 담고 있지 않다.**
병합과 push는 사람이 판단한다(CLAUDE.md).

```bash
git checkout feat-29-content-quality-pilot
npm install && npm test          # 468개 통과해야 정상
node scripts/content-audit.mjs   # 아래 「다음 phase의 입력」의 숫자가 나와야 정상
```

### 사용자가 답한 결정 — 다시 묻지 마라

phase 29를 기획할 때 사용자가 고른 셋이다.

1. **범위** — 개념 618개·문항 732개를 전수 검토하지 않는다. **시범 주제 하나
   (`s3-encryption-batch`)로 기준을 세우고 검수받은 뒤 넓힌다.**
2. **출처 제한** — ADR-010의 예외를 **AWS 고유 기초 용어까지 넓힌다.** step 0이 ADR-028을
   썼고 대상은 `버킷`·`객체`·`접두사` 3종으로 고정했다.
3. **`name` 개정 범위** — **`name`만 바꾸고 `id`는 유지한다.** 문항 732개가 `conceptId`로
   개념을 참조하므로 `id`를 바꾸면 파급이 크다. `name`을 고치면
   `scripts/topics-baseline.json`을 같은 커밋에서 갱신해야 한다.

phase를 실행하는 중에 사용자가 하나 더 정했다.

4. **용어가 안 닿는 문제** — 용어집 페이지나 툴팁이 아니라 **주제마다 본문 한 줄을
   되풀이한다.** step 3이 ADR-029로 ADR-010의 「한 번만」을
   「각 주제에서 처음 나오는 자리에서 한 번」으로 개정했다.

### 이 phase가 실제로 한 것

| step | 이름 | 무엇을 했나 |
|---|---|---|
| 0 | `adr-028-basic-vocabulary` | ADR-028. `버킷`·`객체`·`접두사` 뜻풀이를 허용하고 `aws-core-services.s3` 본문에 세 낱말을 도입했다 |
| 1 | `concept-titles-noun-phrase` | 시범 주제의 문장형 제목 넷을 명사구로 바꿨다. `topics-baseline.json` 갱신 |
| 2 | `concept-body-lead-in` | `s3-inventory-report`의 도입 문장을 다시 썼다. **개념 순서는 바꾸지 않았다** |
| 3 | `term-reachability` | ADR-029. 용어 여덟에 풀이·성격 한 줄을 붙이고 `평면 파일`을 없앴다 |
| 4 | `question-prompt-leak` | 프롬프트에 정답이 드러나던 문항 다섯(`q034`~`q038`)을 다시 썼다 |
| 5 | `question-scope-and-wording` | 문항 일곱을 고쳤다(`q039`·`q173`·`q277`·`q279`~`q282`). 관용 표현·용어 불일치 정리 |
| 6 | `content-audit-and-adr-029` | `scripts/content-audit.mjs`와 **ADR-030**(다섯 가지 기준). 콘텐츠는 고치지 않았다 |

**ADR 번호가 명세와 다르다.** step 6의 이름은 `adr-029`인데 실제로 쓴 것은 **ADR-030**이다 —
step 3이 신설되면서 ADR-029를 먼저 써 버렸다. step 이름은 번호를 다시 매기기 전에 붙은 것이다.

각 step이 무엇을 왜 그렇게 판정했는지는 `phases/29-content-quality-pilot/index.json`의
`summary`에 길게 적혀 있다. **다음 phase를 시작하기 전에 step 2·3·5의 `summary`는 읽어라** —
"고치지 않기로 판정한 것"과 그 근거가 거기에만 있다.

### 다음 phase의 입력 — `node scripts/content-audit.mjs`

새로 만든 보고 전용 스크립트다. 주제 id를 인자로 주면 그 주제만 본다.
**언제나 exit 0으로 끝나고 `npm test`·`npm run build`에 엮여 있지 않다** — 고치는 도중에는
미달이 정상이고, 빌드를 막으면 고치는 작업 자체가 진행되지 않는다(ADR-030 「트레이드오프」).

| 지표 | 남은 양 | 비고 |
|---|---|---|
| 남은 주제 | **38개** / 39개 | 시범 주제 하나만 끝났다 |
| ① 문장형 제목 | **183건** (34개 주제) | 세는 규칙은 `name`이 `-다`로 끝나는가 |
| ② 관용 표현 | **164건** — 개념 66개·문항 98개 | `돌리/돌린/돌릴/돌려/돌아가/띄우/태우` 계열 |
| ③ 정답 노출 후보 | **66건** | **위반 건수가 아니다.** 사람이 읽어야 갈린다 |

세 지표가 모두 0인 주제는 셋이다 — `s3-storage-classes`, `s3-encryption-batch`(시범),
`governance-iac`. ① 이 가장 많은 주제는 `efs-fsx` 14, `sqs-sns-eventbridge` 14, `lambda` 10,
`elastic-load-balancing` 9, `iam-permissions` 9다. ② 가 가장 많은 주제는 `ecs-eks-fargate` 22,
`lambda` 17, `emr-glue-athena` 16, `ec2-autoscaling` 14다.

**①의 183과 기획 때의 189은 걸린 항목이 아니라 세는 규칙이 다른 것이다.** 착수 조사가
종결어미 목록을 넓게 잡아 `HTTP API의 JWT 권한 부여자`·`샤드와 체크포인트를 직접 다루는 소비자`
둘을 함께 셌는데, 그 둘은 명사구의 마지막 글자가 `-자`인 것이라 위반이 아니다. `-다`로 재면
착수 시점 187건이고 step 1이 넷을 고쳐 183건이다(git으로 `187 → 183`을 확인했다).
**숫자를 되짚을 때는 `content-audit.mjs`의 규칙이 유일한 기준이다.**

**③이 후보 목록인 이유**를 스크립트 머리주석에 적어 두었다. `q327`은 프롬프트의
"Windows 애플리케이션 서버"가 정답 `FSx for Windows File Server`와 글자로 이어지지만
그 낱말을 빼면 어느 파일 시스템을 고를지 정할 근거가 사라진다 — **문항이 성립하지 않는다.**
`AWS`·`DB`·`IP`처럼 상식으로 통하는 토큰도 걸린다. 판정 기준은
**"그 낱말이 프롬프트에 없으면 문제가 성립하지 않는가"**이고 사람이 읽어야 갈린다.

### 다음 phase의 입력 하나 더 — 용어 불일치

**같은 동작이 저장소 안에서 두 이름으로 불리는 자리가 있다.** 이 phase가 발견한 것은
**키 교체**다. `자동 교체`와 `자동 순환`이 섞여 쓰이고 우세는 `자동 교체` 쪽이다
(출처 34:8, `topics.json` 20:6, `questions.json` 36:6 — 착수 시점 실측).

시범 주제는 커밋 `5ef218b`와 step 5가 `자동 교체`로 통일했고, **아직 남아 있는 자리는 다섯이다.**

- 개념 2개 — `secrets-encryption.secrets-manager-vs-parameter-store`,
  `secrets-encryption.rotation-heuristic`
- 문항 3개 — `q141`, `q142`, `q230`

**이것은 사용자가 지적한 일곱 항목에 없던 결함이다.** 「전체적으로 어색하고 애매하다」의 한
종류이므로 다음 phase가 전수로 훑을 때 같은 눈으로 찾아야 한다.
**키 교체 말고 다른 용어에도 같은 일이 있는지는 아직 조사하지 않았다.** `content-audit.mjs`는
이 결함을 세지 못한다 — 무엇이 같은 동작인지는 사람이 판정해야 한다.

### 다음 phase에 남은 판단

**기계로 검출되지 않는 결함 넷을 어떤 순서로 훑을 것인가.** ①기초 용어 미정의 ②도입 문장
③요구 겹치기 ⑦문항 목적이고, `content-audit.mjs`는 하나도 세지 못한다. 사용자가 정해야 할
것은 순서다.

- **주제 39개를 `topics.json` 배열 순서대로** 갈 것인가 — 학습 순서와 같아서 "앞에서부터
  읽어 지도를 얻는다"는 ADR-023의 전제를 그대로 따라간다. 대신 초반 주제가 이미 깨끗해서
  (`s3-storage-classes`·`s3-encryption-batch`) 첫 step들의 수확이 적다.
- **문항이 많은 주제부터** 갈 것인가 — `sqs-sns-eventbridge` 40, `efs-fsx` 32,
  `rds-storage-features` 28이다. ③⑦은 문항 결함이라 여기에 몰려 있다.
- **`content-audit.mjs`의 ①② 가 많은 주제부터** 갈 것인가 — `ecs-eks-fargate`·`lambda`·
  `efs-fsx`가 위로 온다. 기계 지표와 사람 지표가 같은 주제에 몰려 있다는 보장은 없다.

**나는 배열 순서를 추천한다.** 이 phase가 겪은 실패가 "주제 페이지 단위로 읽지 않아서"
생겼고(아래), 배열 순서로 가면 검수도 학습 순서대로 할 수 있어 사용자가 읽던 흐름과 같다.

그리고 **step을 얼마나 크게 잡을 것인가**도 정해야 한다. phase 29는 시범 주제 하나에 7 step을
썼고 실행 시간이 약 2.5시간이다(개념 13개·문항 16개). 38개 주제를 같은 밀도로 하면 규모가
맞지 않으므로, 결함 종류별로 가르지 말고 **주제 하나를 한 step에서 통째로** 보는 편이 낫다 —
①②③⑤⑥⑦이 같은 문단·같은 문항에서 얽혀 있어 종류별로 나누면 같은 자리를 여러 번 연다.

### 가장 중요한 교훈 — 검수를 grep이나 테스트로 갈음하지 마라

step 0이 `버킷`·`객체`·`접두사`를 첫 주제 `aws-core-services.s3`에만 넣고 "고쳤다"고
보고했는데, **사용자가 실제 화면을 열어 `s3-encryption-batch` 주제를 읽자 똑같은 자리에서
다시 막혔다.** 이 앱의 읽는 단위는 개념이 아니라 **주제 페이지**다. 다른 주제에 정의가 있다는
것은 지금 이 화면을 읽는 사람에게 도움이 되지 않는다. 그 판정이 ADR-029가 됐다.

`CloudTrail`이 같은 모양의 증거다 — `organizations-cloudtrail-config`에서만 정의되는데,
시범 주제를 고친 뒤에도 **다른 7개 주제의 개념 7곳**에서 소개 없이 쓰인다.

**그러므로 주제 페이지를 처음 읽는 사람의 눈으로 통독하고 소개 없이 등장하는 낱말을 직접
세어야 한다.** 사용자는 `npm run dev`로 30초 만에 네 자리를 더 찾아냈다.

### 이 phase가 고치지 않고 남긴 것 — 다음 phase가 판단할 후보

step들이 범위 밖이라 남긴 것들이다. 각각의 판정 근거는 `index.json`의 `summary`에 있다.

1. **시범 주제 안에 `버킷`·`객체` 풀이가 없다.** ADR-028의 3종 중 둘이고 ADR-029의 규칙대로면
   여기에도 서야 하지만, step 3의 대상 표가 `접두사` 하나만 들고 있어 범위 밖이었다.
   `버킷` 17회(첫 자리 `sse-types`), `객체` 29회(첫 자리 `client-side-encryption`)다.
2. **`q277`·`q281` 해설의 `서버리스`가 풀이 없이 쓰인다.** 개념 본문에는 step 3이 풀이를
   넣었지만 **해설은 단독으로 읽히므로**(ADR-015의 논리) 같은 결함이 남는다.
3. **`q036`과 `q173`이 정답(`SSE-KMS`)과 요구(자동 교체)를 공유한다.** `q173`의 주 축은
   봉투 암호화이고 프롬프트가 `data.test.ts`에 문자열로 고정돼 있어 손대지 않았다.
4. **`vpc-networking.vpc-endpoint`와 `endpoint-pricing`의 어긋남** — 아래 후보 E.
   **ADR-031이 판정해 끝났다(2026-09-09).**

**판정하고 그대로 두기로 한 것 둘**은 후보가 아니다. 되짚을 때 다시 열지 마라.

- `q278`·`s3-object-lambda`의 `돌려준다` — **반환**이지 실행의 비유가 아니다.
  step 2가 개념 쪽에서, step 5가 문항 쪽에서 같은 판정을 내렸다.
  `content-audit.mjs`가 이 뜻을 세지 않는 근거가 여기다.
- 시범 주제의 개념 순서 — step 2가 ②의 원인을 「도입 문장」으로 판정하고 순서를 바꾸지
  않았다. 갈래 우선으로 다시 묶으면 ADR-023의 층 순서와 `data.test.ts`의 단언이 함께 깨진다.

### 사용자 검수 요청 — 이것이 시범 주제 방식을 고른 이유다

**검수 대상**: `npm run dev` → `#/topic/s3-encryption-batch` (개념 읽기)와
`#/topic/s3-encryption-batch/quiz` (확인 문제 16문항).
**판정 기준**: "초보자가 개념을 익힌다는 느낌이 드는가."
이 기준은 테스트로 잴 수 없고 **사용자만 판정할 수 있다.**

사용자가 낸 지적 일곱이 각각 어떻게 고쳐졌는지의 대조표다. 원문은 아래
「사용자 피드백 원문」에 그대로 남겨 두었다.

| # | 지적 | 어디를 보면 되는가 | 무엇을 했나 |
|---|---|---|---|
| ① | `버킷`·`객체`·`접두사`가 무슨 말인지 모르겠다 | 첫 주제 `#/topic/aws-core-services`의 `Amazon S3` 개념 / 이 주제의 `배치 복사와 복제의 갈림길` 개념 | ADR-028로 뜻풀이를 허용하고 `aws-core-services.s3`에 세 낱말을 도입했다(step 0). ADR-029로 **주제마다 되풀이**하게 바꾸고 `접두사` 풀이를 이 주제에도 넣었다(step 3). **`버킷`·`객체`는 이 주제에 아직 없다** — 위 「남긴 것」 1번 |
| ② | `버킷의 객체 목록을 파일로 받아 둔다`가 갑자기 나와 당황스럽다 | `S3 인벤토리` 개념의 첫 문단 | 도입 문장을 「무엇인지 → S3 Batch Operations와 이어지는 자리 → 왜 필요한지」 순으로 다시 썼다. `SSE-KMS` 개념에 빠져 있던 주어도 세웠다. **개념 순서는 바꾸지 않았다**(근거는 위 「그대로 두기로 한 것」) |
| ③ | 한 문제가 두 요구를 만족하게 묻는다 | 확인 문제의 `q282`·`q279` | `q282`를 개념 하나만 묻게 다시 썼다. `q279`는 재보고 **결함이 아니라고 판정**했다 — 두 요구가 각각 단독으로도 같은 보기를 남겨서 지식 둘을 곱해야 풀리는 구조가 아니다. 스스로를 "두 요구"라 부르던 라벨만 뺐다 |
| ④ | `AWS KMS가 …하는 방식은?` → 답이 문제만 봐도 보인다 | 확인 문제의 `q034`~`q038` | 프롬프트에서 이름 조각을 전부 빼고 **요구로 갈랐다.** `q036`은 「키를 주기적으로 바꾸는데 그 교체를 사람이 챙기지 않는다」가 됐다 |
| ⑤ | 개념 제목이 문장이면 안 된다 | 개념 목록 전체(13개) | 문장형 넷을 명사구로 바꿨다 — 「S3 인벤토리」·「S3 Batch Operations의 Lambda 호출」·「SSE-C의 자동 교체와 감사 추적 한계」·「버킷 정책의 전송 구간 암호화 강제」. **사용자가 지정한 방법**(주어를 제목으로, 주장은 설명으로) 그대로다 |
| ⑥ | `돌릴 인스턴스`가 감이 오지 않는다 | 개념 본문 전체와 확인 문제 전체 | 개념(step 2)과 문항(step 5)에서 `돌리다` 계열을 없앴다 — 「그 스크립트를 실행할 서버를 따로 두어야 하므로」처럼 **하는 일을 그대로** 쓴다. 아울러 같은 동작을 두 이름으로 부르던 것을 통일했다(`자동 순환`→`자동 교체`, `평면 파일`→`인벤토리 보고서`) |
| ⑦ | `q282`는 문제의 목적이 뭔지 모르겠다 | 확인 문제의 `q282` | 묻는 것을 **SSE-C를 골랐을 때 키 관리를 어디까지 맡길 수 있는가** 하나로 좁혔다. 보기 넷이 모두 그 축 위에 있어 소거로 풀리지 않는다 |

**검수 결과에 따라 다음 phase가 갈린다.** 통과하면 위 「다음 phase에 남은 판단」의 순서를
정해 38개 주제로 넓힌다. 막히는 자리가 또 나오면 그 자리가 기준에 무엇이 빠졌는지를
알려주므로, ADR-030에 기준을 더하는 것이 먼저다.

---

## 사용자 피드백 원문 (2026-09-08) — 고치지 말고 그대로 둔다

사용자가 `S3 암호화(SSE)·Batch Operations·인벤토리` 주제를 읽다가 멈추고 낸 지적이다.
**특정 주제의 문제가 아니다.** 사용자의 마무리 문장을 그대로 옮긴다.

> 특정 부분을 예시로 들었지만 **전체적으로 어색하고 애매하며 초보자가 개념을 익힌다는
> 느낌이 들지 않아서** 확인해봐야 할 거 같아. 어떤 방향성이 잘못되었는지 모르겠다면
> 나에게 질문해줘. **기획부터 해보자.**

**① 기초 용어가 정의되지 않은 채 쓰인다.**

> `특정 접두사에 이미 쌓여 있는 객체` 무슨 말인지 모르겠음. S3에서 접두사가 무슨 역할이며
> 의미인지, 접두사에 쌓여 있다는 게 무슨 말이며 그런 게 무슨 의미를 가지는지 모르겠음.
> `버킷` 무슨 말인지 모르겠음. `객체` 무엇을 말하는지 모르겠음.

**② 개념이 왜 거기 있는지 없이 튀어나온다.**

> `버킷의 객체 목록을 파일로 받아 둔다` 갑자기 이게 개념 주제에 나와서 당황스러움.

**③ 한 문항이 두 요구를 겹친다.**

> 문제에서 두 요구를 만족하는 질문은 적절하지 않음. **한 문제당 하나의 개념을 학습할 수
> 있게 해야 함.**

**④ 프롬프트에 답이 드러난다.** 대상은 `q036` "AWS KMS가 암호화 키를 생성하고 관리하는
방식은?" → 정답 `SSE-KMS`.

> 답이 문제만 봐도 뭔지 알 수 있잖아.

**⑤ 개념 제목이 문장이다.**

> 개념에서 `배치 작업이 객체마다 Lambda를 부른다`처럼 문장이 제목이 되면 안 될 거 같아.
> 문장의 특정 제목의 개념의 설명으로 들어가야 맞는 거 같아.
>
> `전송 중 암호화는 버킷 정책 조건으로 강제한다` 부분의 경우 **`버킷 정책`이 제목으로 가고
> `aws:SecureTransport`이 설명 중 하나로** 되어야 하는 게 맞는 거 같아.

**⑥ 뜻이 통하지 않는 표현.** 대상은 `q281`의 "**돌릴 인스턴스**를 두지 않고".

> 돌린다는 게 `회전축을 기준으로 어떤 걸 돌리는 형태인건가?`라는 생각이 들 만큼 감이 오지
> 않는 표현이야.

**⑦ 문항의 목적이 불분명하다.** 대상은 `q282`(당시 프롬프트) "봉투 암호화와 암호화 키의
주기적 자동 교체, 그리고 키 사용 감사 추적이 한꺼번에 요구된다. 고객이 키를 직접 들고 오는
SSE-C가 후보에서 빠지는 까닭은?"

> **문제 자체가 이상해. 이 문제의 목적이 뭔지를 모르겠어.**

## 지금 상태

| | |
|---|---|
| `fix-vpc-endpoint-fact` | 후보 E 판정(ADR-031) + phase 31 명세. `develop`에서 팠고 **병합·push는 아직이다** |
| `develop` | phase 28·29·30 전부. `feat-30-prompt-korean-polish`와 같고 origin과도 같다 |
| `main` | `7339754` — release(phase 28~30). origin과 같다 |
| 배포 주소 | https://working-zima.github.io/aws-saa-c03-quiz/ |
| 문항 | 732개 (q001~q732) — phase 30은 문항을 더하거나 빼지 않고 프롬프트 718개를 다시 썼다 |
| 개념 | 618개 / 주제 39개 — phase 30은 `topics.json`을 건드리지 않았다 |
| 개념 커버리지 | 618/618 (100%) — `data.test.ts`의 불변식으로 고정돼 있다 |
| 해설 길이 | 전 구간 187자 이상 — `data.test.ts`의 불변식이다 |
| 테스트 | **471개 통과.** `check-structure`·`coverage`·`check-verbatim`·`lint`·`build` 모두 통과 |

`phases/index.json`의 phase는 0~30이 전부 `completed`이고, phase 28~30은 `develop`을
거쳐 `main`까지 나갔다(`7339754`). **위 인수인계 본문 곳곳에 "phase 29·30은 push되지
않았다"고 적혀 있는데 그것은 병합 전에 쓰인 문장이다** — 이 표가 최신이다.
지금 병합·push를 기다리는 것은 `fix-vpc-endpoint-fact` 하나다(사람이 판단한다).

## phase 31 — 명세를 짜 두었다. 아직 돌리지 않았다

`phases/31-content-quality-rollout/` 에 **step 0~36**이 있다. phase 29가 시범 주제 하나에서
세운 기준을 나머지 38개 주제로 넓힌다. `phases/index.json`에 `pending`으로 등록돼 있다.

### 사용자가 답한 결정 — 다시 묻지 마라

2026-09-09에 넷을 정했다.

1. **훑는 순서** — `topics.json` **배열 순서**다. 학습 순서와 같아서 검수도 사용자가 읽던
   흐름 그대로 할 수 있다. (문항이 많은 주제부터·audit 지표가 많은 주제부터는 탈락)
2. **step 크기** — **주제 하나가 step 하나**다. 결함 종류별로 가르지 않는다.
   `sqs-sns-eventbridge`(개념 33·문항 40)만 둘로 쪼갰고, 작은 주제 둘·셋은 묶었다.
3. **검수 리듬** — **처음 3 step 뒤에 끊는다.** `--max-steps 3`으로 돌리고 멈춰서, 사용자가
   `npm run dev`로 그 세 주제를 읽고 합격선을 확정한 뒤 나머지를 이어 돌린다.
   기준이 틀렸다면 3 step치만 되돌리면 된다.
4. **해설 범위** — **개념 본문과 어긋나는 자리만** 고친다. 전면 재작성이 아니다.
   phase 28이 732개를 이미 다시 썼고 187자 하한이 `data.test.ts`의 불변식이다.

### 돌리는 법

```bash
# 이 브랜치를 develop에 병합한 뒤 develop에서 실행한다
pgrep -f execute.py            # 이미 돌고 있는 것이 없는지 먼저 확인
python3 scripts/execute.py 31-content-quality-rollout --max-steps 3
# 멈추면 사용자 검수 → 통과하면 나머지를 이어 돌린다
```

**규모**: 37 step. phase 30이 29 step에 약 5시간이었고 이건 개념 본문까지 보므로 더 무겁다 —
**7~10시간**으로 본다. 사용량 한도에 걸릴 것을 전제해라(아래 「이어받을 때 주의할 것」).

### step 배치

주제 39개 중 `s3-encryption-batch`(phase 29의 시범)만 빠진다. `s3-storage-classes`와
`governance-iac`은 기계 지표가 0이지만 **넣었다** — 기계가 못 보는 다섯(기초 용어·도입
문장·요구 겹치기·문항 목적·용어 불일치)이 남아 있을 수 있고, 그게 phase 29가 배운 것이다.

| step | 맡은 주제 |
|---|---|
| 0~5 | `aws-core-services` `s3-storage-classes` `s3-versioning-lifecycle` `s3-access-control` `ebs-instance-store` `efs-fsx` |
| 6~11 | `data-transfer-services` `storage-gateway-migration` `rds-storage-features` `aurora` `dynamodb` `elasticache-purpose-built-db` |
| 12~17 | `ec2-autoscaling` `elastic-load-balancing` `cloudfront-global-accelerator` `lambda` `ecs-eks-fargate` `api-gateway-step-functions` |
| 18~19 | `sqs-sns-eventbridge` — A는 개념 33 + 문항 앞 20, B는 문항 뒤 20 |
| 20~26 | `backup-disaster-recovery` `vpc-networking` `security-groups-nacl` `hybrid-connectivity` `route53` `emr-glue-athena` `kinesis-streaming` |
| 27 | `redshift-opensearch-quicksight` + `cloudwatch-xray` |
| 28~34 | `secrets-encryption` `waf-shield` `guardduty-macie-inspector` `iam-permissions` `identity-federation` `organizations-cloudtrail-config` `cost-management` |
| 35 | `governance-iac` + `systems-manager` + `ai-ml-services` |
| 36 | 마무리 — 명사구 단언을 전 주제로, audit 전체 재측정, ADR·이 파일 갱신 |

### 각 step이 하는 일

콘텐츠를 고치는 것보다 **판정하고 그대로 두는 것**이 중요하고, 그 근거를 `summary`에 남기는
것이 step의 산출물이다. 기계 지표 여섯은 `content-audit.mjs`가 세고 ③⑤⑥은 후보 목록이라
사람이 갈라야 한다. 기계가 못 보는 다섯은 **주제 페이지를 처음 읽는 학습자의 눈으로 통독**하는
것 외에 찾는 방법이 없다 — step 파일이 "지표를 먼저 보면 지표가 있는 자리만 보게 되니
통독을 먼저 하라"고 못 박고 있다.

## 다른 기기에서 시작하는 법

```bash
git clone https://github.com/working-zima/aws-saa-c03-quiz.git
cd aws-saa-c03-quiz && git checkout develop
npm install          # Node 18.17.1. 상위 메이저를 요구하는 패키지는 쓰지 않는다(CLAUDE.md)
npm test             # develop은 454개, feat-29 브랜치는 468개 통과해야 정상
node scripts/coverage.mjs        # 618/618, exit 0
node scripts/content-audit.mjs   # feat-29 브랜치에만 있다. 보고 전용이라 항상 exit 0
```

## 옮겨가지 않는 파일 — gitignore로 로컬에만 두는 것들

아래는 저장소에 없다. 새 기기에는 **없는 것이 정상**이고, 없어도 앱과 테스트는 전부 돌아간다.
다만 개념 본문의 근거를 원본까지 거슬러 확인하는 일은 못 한다.

| 파일 | 없으면 못 하는 일 |
|---|---|
| `docs/source/concepts-raw.md` | `scripts/check-verbatim.mjs`가 검사를 건너뛴다(없으면 실패가 아니라 exit 0). 개념 본문의 전사 여부를 새로 검증할 수 없다 — 근거는 ADR-009. **해설을 고치는 작업에는 이 파일이 필요 없다** — ADR-027이 해설의 근거를 개념 본문·오답이 가리키는 이웃 개념 본문·`exam-gaps.md` 항목 셋으로 지정했고, phase 28이 246개를 그 근거만으로 다시 썼다. 전사 검사는 원래부터 `explanation`을 보지 않는다(ADR-025) |
| `docs/source/pdf/*.pdf` (3개, 약 21MB) | 덤프 원문을 다시 추출할 수 없다. `scripts/extract-dump.py`·`extract-pdf.py`가 쓰는 입력이다 |
| `docs/source/dump-slices/`, `docs/source/concept-index.md` | 위 PDF에서 스크립트로 재생성되는 파생물이라, PDF가 있으면 다시 만들면 된다 |

**문항을 쓰거나 고치는 작업의 근거는 `docs/source/dump-gaps/`(23개 파일)와
`docs/source/exam-gaps.md`이고, 이 둘은 커밋돼 있다.** 즉 아래 후보 D·E는 새 기기에서
그대로 진행할 수 있다. **위 「38개 주제로 넓히는 작업」도 그렇다** — 문항과 개념의 문구를
고치는 일이라 `concepts-raw.md`가 필요하지 않다(ADR-027과 같은 논리다).

## 그 밖의 phase 후보 — 위 검수와 확대가 끝난 뒤에 본다

소요 시간은 `phases/*/index.json`의 `started_at`·`completed_at`으로 실측한 값이다.
과거 실적: UI 변경 phase는 1~5 step에 2~20분(22-concept-search만 3 step에 62분),
콘텐츠 대량 phase는 19~22 step에 222~333분. phase 27의 문항 작성 step은 24문항당 평균 12분.
phase 28(해설 재작성)은 14 step에 약 2.6시간이고, 그중 해설을 실제로 쓴 step 1~12가 135분에
246문항이었다 — **한 step이 평균 11분에 20문항**이다.
**phase 29(콘텐츠 품질 시범)는 7 step에 약 2.5시간이고 대상이 주제 하나(개념 13·문항 16)였다** —
결함 종류별로 step을 가른 결과이므로, 주제 단위로 묶으면 주제당 이보다 빠를 것으로 본다.

**후보 A(기존 해설 246개 보강)는 phase 28이 끝냈다.** `q001`~`q246`의 해설 평균이
126자에서 434자가 됐고, 187자 하한이 732문항 전체에 걸린 `data.test.ts`의 불변식이다.
근거와 실측은 ADR-027의 「결과 — 실측으로 확인한 것」에 있다.

### B. 복습 화면 길이 대응 — 2~3 step, 20~40분

`ReviewPage`는 틀린 문항을 주제로 묶어 **한 화면에 전부** 나열한다. 문제 은행이 246→732로
커졌으므로 오답이 쌓이면 벽이 된다. ADR-026이 트레이드오프로 열어둔 문제이기도 하다.

**선행 조건: 픽셀 실측.** ARCHITECTURE 「화면 전환 시 스크롤」은 "다시 재기 전에는 새 숫자를
넣지 마라"고 못 박고 있다. 마지막 실측은 오답 246개 기준 36891px(390×844)이다.
재려면 정확히 390×844 iframe에서 `scrollHeight - innerHeight`를 읽어야 하고, 그러려면
브라우저가 필요하다 — 2026-09-08 기준 Claude in Chrome 확장이 연결돼 있지 않아 못 쟀다.

### C. 주제 확인 문제의 세션 크기 — 3~4 step, 30~60분

주제당 문항이 최소 7개, 중앙값 18개, 최대 40개(`sqs-sns-eventbridge`)다. 끊어 풀고
이어 가는 장치가 없어서, PRD의 학습자상("짧게 여러 번 들여다보며 개념을 눌러 담는 사람")과
어긋난다. 진행 상태 저장(localStorage)을 건드리므로 순수 UI 변경보다 크다.

### D. phase 27 문항 486개 품질 표본 검수 — 15~20 step, 3~4시간

하룻밤에 자동 생성된 문항이라 사실 오류나 변별력 없는 오답이 섞였을 수 있다. 다만 step별
검증(정답 위치 분포, 커버리지, 약어 규칙, 중복 prompt 0건)은 이미 통과한 상태다.
**위 「38개 주제로 넓히는 작업」과 대상이 겹친다** — `q247`~`q732`가 그 486개다. 둘을 따로
돌리지 말고 주제를 훑을 때 함께 보는 편이 싸다.

### E. VPC Endpoint 두 본문의 어긋남 판정 — **끝났다 (2026-09-09)**

**후보 E의 나머지(오타 셋·`name` 둘·`retrieval-time`)는 커밋 `5945daa`가 끝냈다.**
`retrieval-time`은 수를 7에서 8로 바꾸지 않았다 — `s3-express-one-zone` 본문이 "이 클래스는
그 축 바깥에 있다"고 하므로 일곱이 맞고, 어느 일곱인지를 밝히는 쪽으로 고쳤다. 그 판단의
근거는 그 커밋 메시지에 있다.

남아 있던 하나도 브랜치 `fix-vpc-endpoint-fact`가 끝냈다. 판정은 **ADR-031**이다.

원문을 대조할 수 있었다 — `concepts-raw.md` p33이 "인터페이스 VPC 엔드포인트는 인터넷을
거치지 않고 S3, DynamoDB 를 제외한 모든 AWS 리소스에 접근할 수 있게 해준다"고 적고 있고,
**이 문장의 "S3 제외"가 틀렸다.** S3에는 인터페이스 엔드포인트가 있으므로 덤프 인용
[네트워크1 #98 p203]을 담은 `endpoint-pricing` 쪽이 맞다.

**DynamoDB의 "제외"는 그대로 두었다.** 덤프 인용이 반박하는 것은 S3 하나뿐이고, DynamoDB에
인터페이스 엔드포인트가 있다고 말하는 출처는 없다. 반박의 사거리를 넘겨 고치면 틀린 문장을
지우는 대신 근거 없는 문장을 넣게 된다 — 그 규칙이 ADR-031의 본체다. 덕분에 `q104`
("S3와 DynamoDB 둘 다" → 게이트웨이)의 변별점이 살아서 **세 문항 모두 `prompt`·`choices`를
손대지 않고 해설만 고쳤다.**

**어긋남은 개념 본문 둘이 아니라 해설 셋까지였다.** `q104` 해설은 "인터페이스는 S3와
DynamoDB를 제외한 AWS 리소스에 연결하는 유형"이라 하고 `q209` 해설은 "인터페이스도 S3에
연결할 수는 있으나"라고 해서, 같은 문제 은행이 서로 반대되는 사실을 가르치고 있었다.
phase 28이 판정을 미루며 해설을 각 개념 본문에 맞춰 둔 결과다. 고친 자리는
`topics.json` 2개념·`questions.json` 3해설·`exam-gaps.md`(「원본 수정 이력」 4번)다.

## 이어받을 때 주의할 것

- **worktree를 새로 파면 `docs/source/concepts-raw.md`를 손으로 복사해 넣어라.** 이 파일은
  gitignore라 `git worktree add`가 옮기지 않는다. 없으면 `check-verbatim.mjs`가 **검사를
  건너뛰고 exit 0으로 끝난다** — 통과한 것처럼 보이지만 전사 검사가 돌지 않은 것이다(ADR-009).
  2026-09-09 phase 31의 첫 3 step이 이 상태로 돌았다. 원본을 넣고 다시 검사해 이상 없음을
  확인했지만, **다음 worktree에서는 harness를 돌리기 전에 복사해라.**
- **`concepts-raw.md`를 `grep`으로 뒤질 때는 `-a`를 붙여라.** macOS의 BSD grep이 이 파일을
  binary로 판정해서, `-a` 없이 부르면 **일치가 있어도 아무것도 출력하지 않고 exit 1로 끝난다**
  (`file`도 `data`라고 답한다). 후보 E가 "원문이 이 기기에 없어 대조할 수 없다"로 넘어갔던
  것이 실은 이 조용한 실패였다 — 파일은 있었다. 근거는 ADR-031 말미.
- **`python3`는 이 환경에 없다 — `py` 또는 `python`이 Python 3.13이다.** harness는
  `python scripts/execute.py <phase> --max-steps N`으로 돌린다.
- **harness를 돌리기 전에 이미 돌고 있는 것이 없는지 확인한다: `pgrep -f execute.py`.**
  `pgrep`은 Git Bash에 있고 PowerShell에는 없다 — PowerShell에서는
  `Get-CimInstance Win32_Process | Where-Object CommandLine -match 'execute\.py'`를 쓴다.
  **어느 쪽이든 `python3`가 아니라 `python`으로 뜬 프로세스를 찾아야 한다.**
  2026-09-07 밤에 같은 worktree에서 실행 두 개가 겹쳐 두 에이전트가 같은 문항 id 범위를
  써서 중복 24문항이 커밋됐다. 복구는 됐지만 시간을 버렸다. worktree를 나누는 규칙은
  CLAUDE.md 「에이전트를 여러 개 동시에 돌릴 때」에 있다.
- **긴 phase는 사용량 한도에 걸린다.** phase 27은 실행 시간 249분에 실제 경과 7시간이었고,
  차이는 전부 한도로 멈춰 있던 시간이다. 멈추면 `phases/{phase}/index.json`에서 해당 step을
  `pending`으로 되돌리고 `error_message`를 지운 뒤 다시 실행하면 그 step부터 이어진다.
  **단, 그 step이 데이터를 이미 커밋한 뒤에 죽었다면 되돌리는 것만으로는 부족하다** —
  executor가 깨진 상태를 커밋해 두었을 수 있다. `npm test`와
  `node scripts/check-structure.mjs`를 먼저 돌려 확인해라. phase 30 step 18이 그랬고,
  대응은 위 「step 18에서 겪은 것」에 적어 두었다.
- **ADR 번호는 다음 빈 자리를 쓴다.** phase 29에서 step을 다시 번호 매기면서 step 명세가
  적어 둔 ADR 번호(`adr-029`)와 실제 번호(ADR-030)가 갈렸다. step 명세의 번호를 믿지 말고
  `grep '^### ADR-0' docs/ADR.md`로 확인해라.
- 이 기기에는 phase 27 worktree(`../aws-saa-c03-quiz-p27`)와 `feat-25`·`feat-26`·`feat-27`
  브랜치가 남아 있다. 전부 `develop`에 병합된 것이라 지워도 잃는 것은 없다.
