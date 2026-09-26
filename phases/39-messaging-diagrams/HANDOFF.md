# phase 39 인수인계 — 메시징 주제의 도식 넷

**새 세션에서 이 phase를 이어받으면 이 문서를 먼저 읽어라.** 2026-09-24 기준이다.

## 한 줄

**2026-09-26 갱신: step 0~3이 모두 끝났고 실측·문서까지 마쳤다.** 결과는 `verification.md`,
실측은 `measurements.md`에 있다. 남은 것은 `외부 SaaS` 경로 판단(아래 「남은 일」 4)과
develop 병합뿐이며 둘 다 사용자 판단이다. 아래 본문은 2026-09-24 시점의 기록이다.

`sqs-sns-eventbridge` 주제에 도식 네 장을 넣는 중이다. **step 0이 끝났고 step 1~3이 남았다.**

## 왜 하는가

사용자가 SQS·SNS·EventBridge·Amazon MQ·SES를 두고 "어떻게 연결되고 어떻게 쓰이는지 헷갈리고,
기능이 비슷해서 구분이 안 간다"고 했다. 그 말에서 **서로 다른 두 요구**가 나왔고 도식도
그렇게 갈린다 — 다섯을 **구분**하는 도식(step 0)과 실제로 어떻게 **이어지는지** 보여주는
도식(step 1~3)이다.

사용자는 "길어도 공부에 도움이 된다면 필요하다"며 네 장을 모두 승인했다(2026-09-24).
**개념 읽기 화면이 길어지는 것은 감수한 비용이지 문제가 아니다.**

## 지금 상태

```
develop                       15fe9da  phase 39 설계 문서
worktree ../aws-saa-c03-quiz-p39  [feat-39-messaging-diagrams]
  87eb27d  feat(39-messaging-diagrams): step 0 — messaging-shapes
  58327f2  chore(39-messaging-diagrams): step 0 output
```

| step | 이름 | 상태 |
|---|---|---|
| 0 | messaging-shapes | **completed** |
| 1 | eventbridge-routing | pending |
| 2 | sns-fanout | pending |
| 3 | sqs-message-life | pending |

`main`은 건드리지 않았다. **병합도 push도 하지 않았다.**

## 재개하는 법

```bash
cd /Volumes/zimablue_ssd/dev/etc/aws-saa-c03-quiz-p39
python3 scripts/execute.py 39-messaging-diagrams --agent codex
```

completed인 step 0은 건너뛰고 step 1부터 간다. 한 step씩 검토하며 가려면 `--max-steps 1`을
붙인다(step 0이 그렇게 실행됐다). 구현은 codex가 맡는 것이 이 저장소의 방식이다.

**worktree에 `npm install`은 이미 되어 있다.**

## step 0 결과 — 관문을 통과했다

step 0은 이 phase의 관문이었다. 노드가 가장 많고 라벨이 가장 길어서, 280 폭 규약이 이 주제에서
성립하는지 여기서 판정하게 했다. **성립한다.**

- `src/components/diagrams/MessagingShapesDiagram.tsx` — `viewBox 0 0 280 592`, 노드 14,
  그룹 박스 3(보내는 쪽 / AWS 전달 장치 / 받는 쪽), 시나리오 5.
- `registry.ts`에 `'sqs-sns-eventbridge.sqs'` 한 줄. 변경 파일은 셋뿐이다.
- 전폭으로 편 노드는 `bus`(240)와 `targets`(240), 나머지 12개는 2열(112).

**AC를 자기 보고로 믿지 말고 직접 돌려 확인했다**(2026-09-24):

```
npm run build                                      ✓
npm run lint                                       ✓ 경고 0
npm test                                           ✓ 34 files / 666 tests
node scripts/check-structure.mjs                   ✓
node phases/38-service-diagrams/tools/check-path-crossings.mjs
                                                   ✓ 노드 57·경로 52, 상자 내부를 지나는 선 없음
```

브라우저 실측과 눈으로 본 결과는 **`measurements.md`에 있다.** 320/390/1280px 세 뷰포트 값이
phase 38의 「전 도식 공통」과 어긋나지 않았고 가로 넘침이 없다. **그 파일에 없는 숫자를 쓰지 마라.**

## 설계에서 정한 것 — 뒤집기 전에 이유를 읽어라

1. **step 0·1의 앵커는 개념군의 맨 앞이다**(`sqs`, `eventbridge`). phase 38의 도식 다섯은
   "읽은 것의 정리"라 개념군 뒤쪽에 붙었지만, 이 둘은 **"읽기 전의 지도"**다. 사용자의
   결정이다(2026-09-24). 그래서 도식에 아직 안 읽은 이름이 먼저 나온다. **의도한 것이다.**
2. **EventBridge 파이프를 step 1 도식에 넣는다.** 규칙 줄 옆에 "점 대 점"으로 서서 라우팅과
   대비된다. 노드가 17개로 늘지만 세로는 얼마든 길어져도 된다(UI_GUIDE 「도식」).
3. **step 3(큐 안의 메시지)은 시간축이 아니라 배치도다.** 축을 그리면 본문에 없는 시간 관계를
   좌표로 지어내게 된다 — ADR-036의 "비용은 축으로 그리지 않는다"와 같은 이유다.
   「SQS 큐」 박스의 안과 밖이 1차 채널이다.
4. **step 2에서 틀린 구성에 빨강·X를 쓰지 않는다.** 빨강은 오답 표시가 점유했고(ADR-036),
   애초에 그 둘은 틀린 것이 아니라 다른 요구에 맞는 구성이다.
5. **새 ADR은 없다.** 규약을 전부 UI_GUIDE 「도식」과 ADR-036에서 가져다 쓰므로 새로 정한 것이 없다.

## 남은 일

### 1. step 1~3 실행 (harness)

위 「재개하는 법」 그대로. step 1이 가장 크고(노드 17·시나리오 7) **경로가 네 단을 가로질러
내려와 교차 검사에 걸릴 가능성이 가장 높다.** 걸리면 경로를 우회시키거나 노드를 옮긴다 —
**검사기를 고쳐서 통과시키지 마라.**

### 2. 실측 (harness 밖, Chrome 필요)

codex 세션은 로컬 페이지 접근 권한이 없어 브라우저 실측을 못 한다. step 0도 그래서
`summary`에 "브라우저 실측 미수행"이 적혀 있다. 네 장이 다 나오면 Chrome으로 잰다.

```bash
cd /Volumes/zimablue_ssd/dev/etc/aws-saa-c03-quiz-p39 && npm run dev   # 5173
# http://localhost:5173/#/topic/sqs-sns-eventbridge
```

방법은 `measurements.md`의 「잰 방법」에 적어 두었다(고정 크기 iframe 320/390/1280).
그 파일의 「도식별」 표에서 step 1~3 줄이 비어 있으니 채운다.

### 3. 문서 갱신

- `docs/UI_GUIDE.md` 「도식」 절의 **"다섯 도식 모두 320·390·1280px에서…"**가 이제 아홉 장이다.
  숫자와 문장을 고치고, phase 39 실측 기록을 함께 가리킨다.
- `verification.md` 작성. 선례는 `phases/37-question-relink/verification.md`.

### 4. 열린 판단 하나 — `EventBridge` 시나리오의 `외부 SaaS`

step 0 도식에서 `외부 SaaS`가 선명한데 아무 선도 붙지 않아 **떠 있는 노드처럼 보인다.**
step 0 명세가 "선이 셋이면 280 폭에서 엉킨다"고 보아 경로를 하나만 그리게 한 결과인데,
실측해 보니 왼쪽 통로(x=8)가 그 시나리오에서 비어 있어 **경로 하나를 더해도 엉키지 않는다.**
근거도 있다 — `eventbridge-event-bus-types`가 파트너 버스를 외부 SaaS의 통로로 설명한다.

**고치지 않았다.** step 0은 명세대로 구현됐고 명세를 바꿀지는 사용자의 판단이다.
자세한 것은 `measurements.md`의 「고칠 후보 하나」에 있다.

## 하지 말 것

- **`main`에 손대지 마라.** 병합과 push는 사람이 판단한다(CLAUDE.md 「Git 전략」).
- **`DiagramFrame.tsx`를 고치지 마라.** 이제 도식 아홉 장이 공유한다.
- **`src/data/` 아래 JSON을 고치지 마라.** 이 phase의 범위가 아니다.
- **개념 본문 문장을 캡션에 그대로 옮기지 마라.** 사실만 가져오고 문장은 직접 쓴다(ADR-009).
