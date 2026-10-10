# phase 53 검증 보고 (2026-10-10)

## 실행

- 설계: develop `75aba6f`, 나머지 34개 주제의 step 3·4 설계는 feat `d75a06f`. 구현: worktree `../aws-saa-c03-quiz-p53` [`feat-53-concept-indent`].
- step 0~3은 `--agent codex`로 실행했다. step 1은 codex 사용량 한도로 한 번 끊겨 한도가 풀린 뒤 상태를 `pending`으로 되돌려 다시
  실행했다(재시도 0).
- step 2 뒤 표본 5개 주제를 사람이 화면에서 확인하고 나머지를 진행하기로 했다(세로선 `#262626` 유지, WAF `cloudfront`는 주제 맨 앞).
- step 4는 codex 한도로 시작하자마자 끊겼고(아무것도 바꾸지 않음), 사용자 요청으로 `--agent claude`로 실행했다(16:34~16:37, 재시도 0).

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| `npm test` | 70개 파일 · 1261개 테스트 통과 (+31: `concept-groups.test.ts` 18, `data.test.ts`의 `개념 계층 (ADR-041)` 1, `ConceptList.test.tsx` 12) |
| `check-structure.mjs` | 구조 이상 없음 (개념 id·name·parentId 대조) |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-hierarchy.mjs 4` | parentId 301개, 적용 주제 39개. 문항·본문·순서·스냅샷의 나머지는 착수 시점과 같다 |

## 범위 확인

- 코드: `content.ts`(`parentId`·`ConceptGroup`), 새 `concept-groups.ts`, `ConceptList.tsx`. 도식·페이지·`QuizRunner`는 바뀌지 않았다.
- 데이터: `topics.json`·`topics-baseline.json`의 변경은 `parentId` 삽입 301곳과 WAF 이동 하나다. `verify-hierarchy.mjs`가 둘을 되돌린 해시를
  착수 시점(develop `c7de9a7`)과 비교해 확인한다. `questions.json`은 한 글자도 바뀌지 않았다.
- 가드레일: `check-structure.mjs`가 `parentId`를 대조하고, `sync-baseline.mjs`는 `parentId`가 다르면 갱신을 거부한다.
- 기존 테스트는 두 곳만 바뀌었다. `backupTables.test.tsx`의 제목 레벨 단언 하나(`headingLevel + 1`, step 2)와 `data.test.ts`의
  WAF 순서 단언 한 블록(step 4)이다. 둘 다 step 문서가 적은 내용 그대로다.
- 브라우저 실측은 `measurements.md`에 있다. 39개 주제 × 세 폭 117회에서 무리 102·딸린 개념 301·h3 301이 판정과 같고, 가로 넘침과
  콘솔 오류가 없다.

## 남겨 둔 것

- ADR-041 「남은 자리」 2~5(Aurora·Route 53·VPC·IAM)는 순서를 옮겨야 묶이는 자리라 이번에는 평평하게 두었다.
- 세로선 `#262626`은 320px에서 옅게 보인다. 무리를 가르는 일은 주로 17px 들여쓰기가 한다. 바꾸려면 `ConceptList.tsx`의
  `border-border` 하나다.
- `governance-iac.cloudformation` 비교표의 가운뎃점 뒤 줄바꿈은 phase 48 실측에 있던 것이고 무리 밖이라 손대지 않았다.
