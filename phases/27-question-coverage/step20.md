# Step 20: coverage-test — 커버리지를 테스트로 고정하고 baseline을 재생성한다

## 읽어야 할 파일

- `/CLAUDE.md` — 특히 "아키텍처 규칙"과 "원본 데이터", "개발 프로세스"(TDD)
- `/docs/PRD.md` — 「사용자」·「목표」·**「문제 은행」(step 0이 개정했다. 크기 기준이 커버리지다)**
- `/docs/ARCHITECTURE.md` — 「데이터 모델」·「테스트 경계」
- `/docs/ADR.md` — **ADR-026**(step 0이 추가한 커버리지 결정), ADR-021(덤프 해설의 지위),
  ADR-009(전사 금지), ADR-011(문항 표현 규칙), ADR-017(오답노트), ADR-023(주제 재편)
- `/src/types/content.ts` — `Question` 타입
- `/src/data/questions.json` — 고칠 대상. **여기에만 더한다**
- `/src/data/topics.json` — 근거 개념. **읽기만 한다**
- `/src/data/data.test.ts` — 문항 불변식
- `/scripts/coverage.mjs` — step 0이 만든 도구
- `/scripts/check-structure.mjs` · `/scripts/topics-baseline.json` — 재생성 대상
- step 1~19가 `index.json`의 `summary`에 남긴 id 범위 기록

## 작업

step 1~19가 문항을 더했지만, **커버리지가 다시 내려가는 것을 막는 장치가 없다.**
개념을 새로 더하면서 문항을 안 붙이면 조용히 사각지대가 생긴다. 그것을 테스트로 막는다.

### 1. 커버리지 테스트를 `src/data/data.test.ts`에 더한다

- **모든 개념이 문항 하나 이상을 갖는다** — 실패하면 덮이지 않은 개념 id가 메시지에 보이게 한다.
  이유: 이 phase의 결론이고, 앞으로 개념을 더하는 사람이 문항을 함께 만들도록 강제하는 장치다.
- 모든 문항의 `conceptId`가 실재하고, `topicId`가 그 개념의 주제와 같다.
- 문항 id가 `q001`부터 빈 번호 없이 이어진다.
- 새로 더한 전체 구간(`q247` 이후)에서 `answerIndex` 분포가 각각 20~30%다.
- 기존 slice 기반 테스트(`questions.slice(...)`)를 고치지 마라 — 앞쪽 문항은 그대로다.

### 2. `scripts/topics-baseline.json`을 재생성한다

- `questionsSha256`을 새 `questions.json` 기준으로 갱신한다.
- `conceptLineCount`와 주제·개념 목록은 **이 phase에서 바뀌지 않았다.** 개념을 건드리지
  않았으므로 그대로여야 한다. 달라졌다면 어느 step이 개념을 고쳤다는 뜻이니 멈추고
  `blocked_reason`에 적어라.
- 들여쓰기 1칸을 유지해 diff가 실제 변경만 담게 한다.

## Acceptance Criteria

```bash
npm run build
npm test                              # 커버리지 테스트를 포함해 전부 통과
node scripts/check-structure.mjs      # ✓ 구조 이상 없음 — 여기서 되살아난다
node scripts/coverage.mjs             # 전체 커버리지 100%
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/27-question-coverage/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 **네가 쓴 문항 id 범위와 개수, 주제별 문항 수, 담당 개념을 하나도 남기지
않았다는 확인**을 반드시 적어라. 다음 step이 그 뒤 id부터 이어 쓴다.

## 금지사항

- **커버리지 테스트를 "일부 개념 제외" 목록으로 통과시키지 마라.** 예외 목록을 만들면 다음
  사람이 거기에 개념을 추가해 사각지대를 되살린다. 덮이지 않은 개념이 있으면 그 step으로
  돌려보내는 것이 맞다 — `error`로 보고해라.
- 문항을 새로 쓰지 마라. 이 step은 검증과 baseline만 맡는다.
- 기존 테스트를 깨뜨리지 마라.
