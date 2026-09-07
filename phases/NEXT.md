# 다음에 할 일 — 기기를 옮겨 이어받을 때 읽는 문서

작성 시점: 2026-09-08. phase 27까지 끝내고 배포한 직후다.
이 파일은 **다음 phase를 고르기 전까지의 인수인계**만 담는다. 결정이 끝나면 그 내용은
step 명세와 ADR로 옮겨가고 이 파일은 다시 짧아진다.

## 지금 상태

| | |
|---|---|
| `develop` | `2b728c5` — phase 27 병합. origin과 같다 |
| `main` | `1a28bd5` — release. origin과 같고 GitHub Pages 배포 성공(1분 24초) |
| 배포 주소 | https://working-zima.github.io/aws-saa-c03-quiz/ |
| 문항 | 732개 (q001~q732) |
| 개념 커버리지 | 618/618 (100%) — `data.test.ts`의 불변식으로 고정돼 있다 |
| 테스트 | 453개 통과 |

`phases/index.json`의 phase 27은 `completed`다. 커밋되지 않은 작업은 없다.

## 다른 기기에서 시작하는 법

```bash
git clone https://github.com/working-zima/aws-saa-c03-quiz.git
cd aws-saa-c03-quiz && git checkout develop
npm install          # Node 18.17.1. 상위 메이저를 요구하는 패키지는 쓰지 않는다(CLAUDE.md)
npm test             # 453개 통과해야 정상
node scripts/coverage.mjs   # 618/618, exit 0
```

## 옮겨가지 않는 파일 — gitignore로 로컬에만 두는 것들

아래는 저장소에 없다. 새 기기에는 **없는 것이 정상**이고, 없어도 앱과 테스트는 전부 돌아간다.
다만 개념 본문의 근거를 원본까지 거슬러 확인하는 일은 못 한다.

| 파일 | 없으면 못 하는 일 |
|---|---|
| `docs/source/concepts-raw.md` | `scripts/check-verbatim.mjs`가 검사를 건너뛴다(없으면 실패가 아니라 exit 0). 개념 본문의 전사 여부를 새로 검증할 수 없다 — 근거는 ADR-009 |
| `docs/source/pdf/*.pdf` (3개, 약 21MB) | 덤프 원문을 다시 추출할 수 없다. `scripts/extract-dump.py`·`extract-pdf.py`가 쓰는 입력이다 |
| `docs/source/dump-slices/`, `docs/source/concept-index.md` | 위 PDF에서 스크립트로 재생성되는 파생물이라, PDF가 있으면 다시 만들면 된다 |

**문항을 쓰거나 고치는 작업의 근거는 `docs/source/dump-gaps/`(23개 파일)와
`docs/source/exam-gaps.md`이고, 이 둘은 커밋돼 있다.** 즉 아래 후보 A·D는 새 기기에서
그대로 진행할 수 있다.

## 다음 phase 후보 — 아직 고르지 않았다

소요 시간은 `phases/*/index.json`의 `started_at`·`completed_at`으로 실측한 값이다.
과거 실적: UI 변경 phase는 1~5 step에 2~20분(22-concept-search만 3 step에 62분),
콘텐츠 대량 phase는 19~22 step에 222~333분. phase 27의 문항 작성 step은 24문항당 평균 12분.

### A. 기존 해설 246개 보강 — 12~13 step, 2.5~3시간

ADR-026이 "해설은 정답을 정당화하는 글이 아니라 그 개념을 가르치는 글"이라고 정했지만,
그 규칙 이전에 쓰인 `q001~q246`은 아직 낡은 상태다.

| 구간 | 문항 | 해설 평균 | 150자 미만 |
|---|---|---|---|
| q001~q246 | 246 | 126자 | **184개** |
| q247~q732 (phase 27) | 486 | 356자 | 0개 |

문제만 푸는 학습자에게 해설은 유일한 설명 텍스트이므로, 지금은 문항 4개 중 1개가
틀려도 배울 것이 없는 상태다. **앱의 목적에 가장 크게 기여하는 후보다.**

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
