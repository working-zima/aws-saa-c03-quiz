# phase 54 검증 보고 (2026-10-10)

## 실행

- 설계: develop `a1381c8`. 구현: worktree `../aws-saa-c03-quiz-p54` [`feat-54-block-heads`].
- 설계 전에 scratchpad의 시험 worktree에 `changes.json`을 적용해 테스트·가드레일·원문 전사·콘텐츠 점검을 먼저 돌렸다. 실패한 테스트
  아홉을 고친 결과가 `data-test.patch`다.
- step 0을 `--agent codex`로 실행했다. codex 사용량 한도가 20:11에 풀린 뒤 20:13에 자동으로 시작해 20:18에 끝났다(재시도 0).
- codex 샌드박스에서 `git`을 쓸 수 없어 codex는 `verify-heads.mjs`를 저장소 객체를 직접 읽는 임시 방식으로 돌렸다(step 요약). 아래 AC는
  worktree에서 실제 `git`으로 다시 실행한 결과다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 (exit 0) |
| `npm test` | 70개 파일 · 1261개 테스트 통과 (새 테스트 없음, 바뀐 단언 아홉) |
| `check-structure.mjs` | 구조 이상 없음 |
| `sync-baseline.mjs --dry-run` | 갱신할 것이 없다 |
| `verify-heads.mjs` | 기준 `a1381c8` — 새 개념 8개, 이동 3개, parentId 41개 추가, 문항 재연결 9개, 개념 626줄. 데이터 세 파일이 명세와 한 글자도 다르지 않다 |

## 범위 확인

- 바뀐 파일은 `src/data/topics.json`, `src/data/questions.json`, `scripts/topics-baseline.json`, `src/data/data.test.ts` 넷과 phase
  메타데이터뿐이다.
- `data.test.ts`의 변경은 `data-test.patch`와 diff까지 같다.
- 데이터 세 파일과 `data.test.ts`의 sha256이 시험 적용본과 같다. 그래서 시험 적용본에서 돌린 두 검사도 그대로 유효하다.
  - `check-verbatim.mjs`: 전사 이상 없음(원본과 32자 이상 겹치는 본문 없음).
  - `content-audit.mjs`: 바뀐 다섯 주제에서 개념 수 말고는 지표가 하나도 늘지 않았다.
- 소개 개념 `elb`·`ec2`·`iam`·`ecs`·`fsx`의 본문, 문항의 프롬프트·보기·정답·해설은 바뀌지 않았다. 문항은 아홉의 `conceptId`만 바뀌었다.
- 브라우저 실측은 `measurements.md`에 있다. 117회 모두 판정과 같고 가로 넘침과 콘솔 오류가 없다.

## 남겨 둔 것

- 2단계 후보 일곱(IAM 정책, 루트 사용자, Systems Manager, EC2 인스턴스 제품군, RDS 백업과 스냅샷, 재해 복구 전략, EC2 배치 그룹)은
  AWS 공식 문서 근거와 새 문항이 필요해 사용자 결정을 기다린다(ADR-042 「남겨 둔 것」).
- `docs/PRD.md`의 「개념 618개」 문장은 그 시점의 기록이라 고치지 않았다. 지금 개념 수는 626개다.
