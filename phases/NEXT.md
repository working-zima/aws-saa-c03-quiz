# 다음에 할 일 — 기기를 옮겨 이어받을 때 읽는 문서

작성 시점: 2026-09-08. phase 28(해설 재작성)의 마지막 step까지 끝낸 직후다.
이 파일은 **다음 phase를 고르기 전까지의 인수인계**만 담는다. 결정이 끝나면 그 내용은
step 명세와 ADR로 옮겨가고 이 파일은 다시 짧아진다.

## 지금 상태

| | |
|---|---|
| `feat-28-explanation-rewrite` | phase 28의 작업 브랜치. `develop`보다 29 커밋 앞서 있고 **아직 병합·push하지 않았다** |
| `develop` | `3afe768` — phase 28 step 명세. origin보다 1 커밋 앞서 있다 |
| `main` | `1a28bd5` — release. origin과 같고 GitHub Pages 배포 성공(1분 24초) |
| 배포 주소 | https://working-zima.github.io/aws-saa-c03-quiz/ |
| 문항 | 732개 (q001~q732) — phase 28은 문항을 더하지 않고 `explanation`만 다시 썼다 |
| 개념 커버리지 | 618/618 (100%) — `data.test.ts`의 불변식으로 고정돼 있다 |
| 해설 길이 | 전 구간 187자 이상. 732문항 평균 382자, 최소 187자(`q254`) — `data.test.ts`의 불변식이다 |
| 테스트 | 454개 통과 |

`phases/index.json`의 phase 27은 `completed`이고, `phases/28-explanation-rewrite/index.json`도
step 13까지 `completed`다. **병합과 push는 사람이 판단한다**(CLAUDE.md) — 지금 남아 있는 일은
`feat-28-explanation-rewrite` → `develop` 병합과 `develop` push다.

## 다른 기기에서 시작하는 법

```bash
git clone https://github.com/working-zima/aws-saa-c03-quiz.git
cd aws-saa-c03-quiz && git checkout develop
npm install          # Node 18.17.1. 상위 메이저를 요구하는 패키지는 쓰지 않는다(CLAUDE.md)
npm test             # 454개 통과해야 정상
node scripts/coverage.mjs   # 618/618, exit 0
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
그대로 진행할 수 있다.

## 다음 phase 후보 — 아직 고르지 않았다

소요 시간은 `phases/*/index.json`의 `started_at`·`completed_at`으로 실측한 값이다.
과거 실적: UI 변경 phase는 1~5 step에 2~20분(22-concept-search만 3 step에 62분),
콘텐츠 대량 phase는 19~22 step에 222~333분. phase 27의 문항 작성 step은 24문항당 평균 12분.
phase 28(해설 재작성)은 14 step에 약 2.6시간이고, 그중 해설을 실제로 쓴 step 1~12가 135분에
246문항이었다 — **한 step이 평균 11분에 20문항**이다. 기존 문항의 해설만 고치는 작업은
새 문항을 쓰는 것보다 문항당 두 배 가까이 빠르다.

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

### E. 개념 본문의 낡은 수·오타 정리 — 2~3 step, 30~60분

phase 28이 해설을 쓰며 근거 본문에서 찾아 **고치지 않고 남긴 것 다섯 건**이다. 목록과 근거는
ADR-027의 결과 절에 있다. `s3-storage-classes.retrieval-time`의 `일곱 개 클래스`가 여덟이 된
것(가장 큰 것 — 수와 목록이 함께 낡았다), 오타 셋(`몹이다`·`기억해 둠다`·`빠리`),
`Systems Manager`의 `s`가 빠진 `name` 둘이다. 마지막 것은 `name` 필드라
`scripts/topics-baseline.json`을 함께 고쳐야 한다.

`vpc-networking`의 두 본문이 인터페이스 엔드포인트를 두고 어긋나 보이는 자리도 있는데,
**그건 오타가 아니라 원본 대조가 필요한 사안이라 이 후보에 넣지 않는다.**

## 이어받을 때 주의할 것

- **harness를 돌리기 전에 이미 돌고 있는 것이 없는지 확인한다: `pgrep -f execute.py`.**
  2026-09-07 밤에 같은 worktree에서 실행 두 개가 겹쳐 두 에이전트가 같은 문항 id 범위를
  써서 중복 24문항이 커밋됐다. 복구는 됐지만 시간을 버렸다. worktree를 나누는 규칙은
  CLAUDE.md 「에이전트를 여러 개 동시에 돌릴 때」에 있다.
- **긴 phase는 사용량 한도에 걸린다.** phase 27은 실행 시간 249분에 실제 경과 7시간이었고,
  차이는 전부 한도로 멈춰 있던 시간이다. 멈추면 `phases/{phase}/index.json`에서 해당 step을
  `pending`으로 되돌리고 `error_message`를 지운 뒤 다시 실행하면 그 step부터 이어진다.
- 이 기기에는 phase 27 worktree(`../aws-saa-c03-quiz-p27`)와 `feat-25`·`feat-26`·`feat-27`
  브랜치가 남아 있다. 전부 `develop`에 병합된 것이라 지워도 잃는 것은 없다.
