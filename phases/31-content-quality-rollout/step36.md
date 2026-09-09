# Step 36: rollout-wrapup

이 phase는 **phase 29가 시범 주제 하나에서 세운 콘텐츠 품질 기준을 나머지 38개 주제로
넓히는 일**이고, 앞 36개 step이 주제를 전부 훑었다. 이 step은 **콘텐츠를 고치지 않는다.**
불변식을 전 주제로 넓히고, 남은 것을 세어 기록한다.

## 작업

1. **명사구 단언을 전 주제로 넓힌다.** `src/data/data.test.ts`에서 앞 step들이 주제마다
   더한 명사구 단언들을 **주제 39개 전부를 도는 단언 하나로 합친다.**
   `topics.flatMap(t => t.concepts).forEach(c => expect(c.name).not.toMatch(/다$/))` 꼴이다.
   **통과시키려고 예외 목록을 만들지 마라.** 이유: 목록이 생기는 순간 거기에 개념이 추가되어
   사각지대가 되살아난다(ADR-026의 경고, ADR-030이 되풀이한 것). 남은 위반이 있으면
   **고치지 말고 `blocked`로 멈춰 어느 주제인지 알려라** — 어느 step이 빠뜨린 것이다.
2. **`node scripts/content-audit.mjs`를 전체로 돌려 착수 대비 표를 만든다.**
   착수 시점(2026-09-09)은 ① 183 · ② 144 · ③ 62 · ④ 1 · ⑤ 3 · ⑥ 8쌍이었다.
3. **문체 기준 넷이 전 주제에서 지켜졌는지 훑는다.** 사용자가 step 0~2를 검수하고 낸
   기준이고 각 step 파일의 「문체 기준 넷」에 적혀 있다. 개념·문항 본문에서
   `/자리|축이|축을|축은|갈린|갈리|밀린|맡는 것/`과
   `/앞의 (둘|셋|넷)|여기서부터|여기까지|이제 그것|앞에서 본/`을 주제별로 세어,
   **한 주제에 여러 건 남은 곳을 목록으로 만들어 `summary`에 적어라.** 고치는 것은
   이 step의 일이 아니다 — 어느 step이 기준을 놓쳤는지가 드러나야 한다.
4. **`docs/ADR.md`에 이 phase의 ADR을 쓴다.** 번호는 `grep '^### ADR-0' docs/ADR.md`로
   확인한 다음 빈 자리를 쓴다 — **step 이름이나 이 문서에 적힌 번호를 믿지 마라**(phase 29에서
   같은 실수가 났다). 내용은 **주제 단위 통독이 결함 종류별 훑기보다 나았는가**의 판정과,
   앞 step들의 `summary`에서 되풀이된 판정 유형을 기준으로 끌어올린 것이다.
5. **`phases/NEXT.md`를 다시 쓴다.** 이 파일은 다음 phase를 고르기 전까지의 인수인계만
   담는다. phase 29·30·31의 지난 이야기는 걷어내고, **남은 것과 다음 후보**만 남겨라.
   사용자 검수 요청(무엇을 어느 화면에서 읽어야 하는가)을 반드시 넣어라.

## Acceptance Criteria

```bash
npm test                              # 전 주제 명사구 단언 포함, 전부 통과
npm run build
node scripts/check-structure.mjs      # exit 0
node scripts/coverage.mjs             # 618/618
node scripts/check-verbatim.mjs
node scripts/content-audit.mjs        # 전체. ①②④ 0건이어야 한다
```

## 금지사항

- **콘텐츠를 고치지 마라.** 이유: 이 step은 불변식과 기록만 맡는다. 남은 위반은 고치지 말고
  `blocked`로 멈춰라 — 어느 step이 빠뜨렸는지가 드러나야 다음에 같은 일이 없다.
- **예외 목록으로 테스트를 통과시키지 마라.** 이유: 위 1번.
- 기존 테스트를 깨뜨리지 마라.

## 검증 절차

1. 위 AC를 전부 실행한다.
2. `phases/31-content-quality-rollout/index.json`의 이 step을 `completed`로 갱신하고
   `summary`에 착수 대비 표와 쓴 ADR 번호를 남긴다.
