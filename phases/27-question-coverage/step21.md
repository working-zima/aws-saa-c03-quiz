# Step 21: docs-update — 커버리지 100% 이후의 문서를 맞춘다

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
- `/docs/UI_GUIDE.md` — 「검색 화면」의 상한 서술
- `/src/pages/TopicListPage.tsx` · `/src/pages/ConceptReadPage.tsx` — "확인 문제 준비 중" 가드
- step 0~20가 `index.json`의 `summary`에 남긴 기록

## 작업

문항이 246개에서 크게 늘고 커버리지가 100%가 됐다. **그 결과로 낡은 서술을 실제 값에 맞춘다.**
먼저 `node scripts/coverage.mjs`와 `python3 -c` 등으로 **실제 숫자를 세고 나서** 고쳐라.
추정값을 적지 마라.

1. **PRD** — 「문제 은행」의 문항 수와, "문항이 하나도 없는 주제가 5개 있다"는 서술을 고친다.
   그 문장은 이제 사실이 아니다. 커버리지 100%를 달성했다는 것과 실제 문항 수를 적는다.
2. **ARCHITECTURE** — 「개념·주제 검색」·라우트 표 등에 문항 수가 박힌 곳을 고친다.
   **「화면 전환 시 스크롤」의 실측표는 손대지 마라.** 문항이 늘어 복습 화면이 더 길어졌지만,
   그 표는 실측값이고 다시 재기 전에는 새 숫자를 넣지 않는다는 규칙이 그 절에 적혀 있다.
   대신 **문항이 늘어 그 값이 다시 낡았다는 한 문장을 표 아래에 덧붙인다.**
3. **ADR** — ADR-026(step 0)에 결과를 덧붙이거나 새 ADR로 남긴다. 최종 문항 수, 커버리지 100%,
   그리고 **"확인 문제 준비 중" 가드가 실데이터에서 더는 쓰이지 않게 됐다는 사실**을 적는다.
4. **"확인 문제 준비 중" 코드는 지우지 마라.** `TopicListPage`의 상태 표시와
   `ConceptReadPage`의 대체 주 액션은 그대로 둔다. 이유: 앞으로도 문항 없는 주제가 생길 수
   있고, 그때 학습자를 막다른 화면으로 보내지 않는 가드다. **테스트도 지우지 마라.**
   실데이터에서 타지 않게 된 것과 코드가 불필요해진 것은 다른 이야기다.
5. **`docs/source/dump-gaps/README.md`** 등 "문항 배치는 뒤 phase가 정한다" 류의 예고가 남아
   있으면 결과를 가리키게 고친다.

## Acceptance Criteria

```bash
npm run build
npm test                              # 전부 통과 — 문서 변경이므로 수가 그대로여야 한다
node scripts/check-structure.mjs      # ✓
node scripts/coverage.mjs | tail -3   # 100%
```

문서에 적은 숫자가 위 커맨드 출력과 같은지 눈으로 대조해라.

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

- **실측하지 않은 숫자를 적지 마라.** 이 phase의 앞선 step들이 남긴 summary도 참고는 되지만,
  최종 숫자는 직접 세라.
- `src/data/`를 고치지 마라. 이 step은 문서와 (필요하면) 주석만 다룬다.
- 스크롤 실측표의 숫자를 바꾸지 마라. 이유: 그 표는 브라우저에서 실제로 잰 값이다.
- 기존 테스트를 깨뜨리지 마라.
