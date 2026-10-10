# phase 52 검증 보고 (2026-10-10)

## 실행

- 설계: develop `1483dca`. 구현: worktree `../aws-saa-c03-quiz-p52` [`feat-52-vpc-comparison-table`].
- step 0을 `--agent codex`로 실행했다(11:11~11:14). 재시도와 사용량 한도는 없었다.

## AC (worktree에서 다시 실행)

| 검사 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| `npm test` | 69개 파일 · 1230개 테스트 통과 (+11: 새 `vpcTables.test.tsx` 6, 앵커 매개변수 테스트 다섯이 새 표로 하나씩 늘어 5) |
| `check-structure.mjs` | 구조 이상 없음 |
| `check-path-crossings.mjs` | 노드 183 · 경로 153, 교차 없음 |

## 범위 확인

- 바뀐 소스는 명세한 파일뿐이다. `vpc-networking.json`(새 표 하나, `private-connectivity`의 `columnWidths` 세 값), `vpcTables.tsx`(래퍼 하나),
  `registry.ts`(import 하나, `comparison` 값 하나), 새 `vpcTables.test.tsx`, 기존 테스트 세 곳.
- 기존 테스트 세 곳은 step 문서가 적은 만큼만 바뀌었다. `ComparisonTableFigure.test.tsx`는 앵커 한 줄과 테스트 이름,
  `VpcPathsDiagram.test.tsx`는 figure 수와 바로 앞 형제 단언, `VpcDestinationDiagram.test.tsx`는 figure 수·인덱스·이름이다.
- `ComparisonTableFigure.tsx`·`DiagramFrame.tsx`·`VpcPathsDiagram.tsx`·`VpcDestinationDiagram.tsx`·`topics.json`·`questions.json`은 바뀌지 않았다.
- 새 표의 label·열·폭·sources·네 행 문구가 step 문서와 글자 그대로 같다(diff 대조). 칸에 비용, 라우팅 테이블, 엔드포인트 정책,
  게이트웨이·인터페이스 유형, 확장 한계가 없다. 판정에 색·O/X가 없다.
- 브라우저 실측은 `measurements.md`에 있다. 세 폭 모두 가로 넘침과 단어 중간 끊김이 없고, 320px에서 `PrivateLink`가 두 표 모두 한 줄이다.

## 남겨 둔 것

- `docs/UI_GUIDE.md` 「도식」의 "열여섯 도식과 비교표 아홉" 문단은 phase 38~42의 실측 기록 목록이다. phase 43 이후의 표(Route 53·거버넌스)도
  거기 더해지지 않았으므로 이번에도 고치지 않았다.
