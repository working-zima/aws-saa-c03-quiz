# Step 6: docs-and-report

## 배경

step 0~5가 앱에 도식 다섯 장을 넣었다. 그 과정에서 **문서가 금지하던 것을 하나 풀었다** —
PRD 「디자인」과 UI_GUIDE 「색상」이 "정답/오답/중요도 외에 새 색을 도입하지 마라"고
못박고 있었는데, 도식이 색 둘을 더했다. 문서를 그대로 두면 다음에 오는 사람이
**문서를 믿고 그 색을 지우거나, 반대로 문서가 죽었다고 보고 아무 색이나 더한다.**

이 step은 코드를 건드리지 않는다. 문서를 실제와 맞추고 검증 보고를 남긴다.

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md` ~ `step5.md` — 무엇을 왜 정했는지.
- `phases/38-service-diagrams/index.json` — step 0~5의 `summary`. **실측값이 거기 있다.**
- `docs/PRD.md` 「디자인」, `docs/ADR.md`, `docs/UI_GUIDE.md`, `docs/ARCHITECTURE.md`.
- `phases/37-question-relink/verification.md` — 검증 보고의 선례.
- `tailwind.config.js`, `src/components/diagrams/` 전체, `src/lib/svg-bounds.ts`.

## 작업

### 1. `docs/PRD.md` 「디자인」 개정

현재:

```
- 무채색 기반. 색은 정답/오답/중요도 표시에만 쓴다.
```

이 줄을 **도식 내부를 예외로 여는 문장으로 고친다.** 예외의 범위를 좁게 적어라 —
"도식 안에서 계층을 구분할 때"이지 "도식은 자유"가 아니다. 근거로 ADR-036을 가리킨다.
그 절의 다른 줄(다크모드 고정, 본문 가독성 우선, UI_GUIDE 참조)은 **건드리지 마라.**

### 2. `docs/ADR.md`에 ADR-036 추가

**번호를 확인하고 써라**: `grep '^### ADR-0' docs/ADR.md`로 마지막 번호를 보고 그다음을 쓴다.
step 명세가 적은 번호를 믿지 마라 — 이 규칙이 생긴 경위는 `phases/NEXT.md`에 있다.

제목 꼴은 기존 ADR을 따른다: `### ADR-036: <결정> (<무엇을 개정·보완하는지>)`.
개정 대상은 PRD 「디자인」과 UI_GUIDE 「색상」이다.

담을 것:

- **결정**: 도식 내부에 한해 색 두 개(`diagram-managed`·`diagram-resource`)를 쓴다.
  그 밖의 자리에서는 기존 규칙 그대로다.
- **이유**: 사용자의 결정이다(2026-09-20). 도식을 무채색으로만 그리는 안과 계층을 색으로
  나누는 안 중 사용자가 후자를 골랐다.
- **색을 고른 근거**: 보라·인디고는 UI_GUIDE 「AI 슬롭 안티패턴」이 금지한다.
  초록·빨강·주황은 정답/오답/중요도가 이미 점유했고, 도식 안에서 쓰면 학습자가 그 뜻으로 읽는다.
  남는 자리가 파랑·청록이었다.
- **색은 보조 채널이다**: 계층을 가르는 1차 채널은 라벨 붙은 그룹 박스의 안과 밖이다.
  색을 전부 회색으로 바꿔도 도식이 읽혀야 한다. 이 규칙이 있어서 색 둘이 늘어나도
  "색이 없으면 못 읽는 그림"이 생기지 않는다.
- **트레이드오프**: 색 쓰임이 늘어나는 문이 열렸다. 접두사 `diagram-`이 그 문을 좁히는
  장치다 — 토큰 이름이 쓰임을 밝히므로, 본문에서 `diagram-managed`를 쓰는 코드는
  읽는 즉시 잘못임이 드러난다.
- **비용은 축으로 그리지 않는다**: step 4에서 실제로 부딪힌 경계다. 개념 본문이 말하지 않은
  대소 관계를 좌표로 지어내게 되므로, 도식도 CLAUDE.md 「원본 데이터」 규칙 아래 있다는 것을
  여기 적어 둔다. **도식은 콘텐츠다.**

### 3. `docs/UI_GUIDE.md`

두 곳을 고친다.

**a. 「색상」 절** — `### 시맨틱 색상` 표 아래의 "이 네 가지 외에 새 색을 도입하지 마라"를
도식 예외를 가리키도록 고치고, 도식 색 둘을 표로 추가한다. 쓰는 곳 칸에
**"도식 내부에만"**을 명시해라.

**b. 「도식」 절 신설** — `## 레이아웃` **앞에** 둔다(컴포넌트 규칙이므로 `## 컴포넌트` 뒤가
자연스럽다). 담을 것은 step 0·1이 정한 규약이고, **실측값은 index.json의 summary에서 가져온다.**

- `viewBox` 폭은 **280**이다. **이 값은 1:1 비율이 아니라 좌표계의 약속이다.**
  실제 표시 폭은 `DiagramFrame`이 모바일에서 좌우 여백을 뚫어(`-mx-5 sm:mx-0` +
  SVG 래퍼 `-mx-4 sm:mx-0`) 확보한다. 그 유도와 실측값은 step 7에 있다 —
  **step 1 명세가 틀에 딸린 패딩을 빼먹어 320px에서 0.879배로 줄었고, step 7이 고쳤다.**
  UI_GUIDE에는 고친 뒤의 실측값을 적어라.
- 세로는 필요한 만큼 늘린다. 세로 스크롤은 이 앱의 기본 동작이고, 가로 넘침은 버그다.
- 감싸는 요소는 `w-full max-w-[380px]`. `mx-auto`를 붙이지 않는다(본문 좌측 정렬).
- 글자는 노드 라벨 10, 그룹 라벨·곁말 9 (viewBox 단위).
- 라벨을 줄이지 않는다. 안 들어가면 노드를 넓히거나 한 줄 전체 폭으로 편다.
  본문에 쓰인 말과 도식에 쓰인 말이 다르면 도식이 본문을 가리키지 못한다.
- 색은 보조 채널이다. 1차 채널은 위치.
- 강조는 opacity로 한다. 고르지 않은 노드는 0.25, 그룹 박스는 흐려지지 않는다.
- 접근성: `figure`에 `aria-label`, 캡션은 `aria-live="polite"`, 시나리오 버튼은 `aria-pressed`.
  **헤딩을 쓰지 않는다** — `ConceptList`가 호출 화면에 따라 헤딩 레벨을 바꾸기 때문이다.
- 넘침은 `src/lib/svg-bounds.ts`의 두 함수로 테스트에서 기계로 잡는다. 눈으로만 확인하지 않는다.

### 4. `docs/ARCHITECTURE.md`

두 곳을 고친다.

**a. 「디렉토리 구조」** — `components/` 아래에 `diagrams/`를 한 줄 더한다.
한 줄 설명은 "개념 본문 안에 들어가는 SVG 도식. 레이아웃이 서로 달라 도식마다 컴포넌트 하나."

**b. 「테스트 경계」 표** — 행을 하나 더한다.
대상 `components/diagrams/*`, 방식은 "@testing-library/react + 좌표 단언.
시나리오 동작에 더해 **viewBox 넘침과 라벨 넘침을 `src/lib/svg-bounds.ts`로 기계 검사**한다.
브라우저가 없는 환경에서 레이아웃 회귀를 잡는 유일한 장치다."

### 5. `phases/38-service-diagrams/verification.md`

`phases/37-question-relink/verification.md`의 꼴을 따른다. **자기 보고가 아니라 실측을 적어라.**

- 도식 다섯의 목록: 컴포넌트 파일, 앵커 개념 id, 노드 수, 시나리오 수, 최종 `viewBox`.
- 관문 검사 결과: 다섯 장 각각에서 `boxesOutsideViewBox`가 빈 배열인지, 라벨 넘침이 0인지,
  `viewBox` 폭이 280인지.
- 각 도식에서 **가장 긴 라벨**과 그 `estimateTextWidth(라벨, 10)` 값.
- 불변 확인: 문항 732·개념 618·커버리지 100%가 그대로인지
  (`node scripts/coverage.mjs`, `npm test`의 `src/data/data.test.ts`).
  **이 phase는 `src/data/`를 건드리지 않았으므로 전부 그대로여야 한다.**
- `node scripts/check-structure.mjs` 결과.
- `git diff --stat`으로 이 phase가 건드린 파일 전체 목록.
- **남은 것**: 눈으로 볼 사람이 확인해야 하는 것 — 글자 실제 렌더 크기, 겹침, 곡선 경로의
  가독성. 기계 검사는 `rect`의 좌표만 본다. `text`의 실제 폭은 어림값이다. 그 한계를 적어라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node scripts/coverage.mjs
```

## 검증 절차

1. 위 AC를 모두 실행한다. 다섯 다 통과해야 한다.
2. 체크리스트:
   - ADR 번호가 `grep '^### ADR-0' docs/ADR.md`의 마지막 다음 번호인가?
   - PRD 「디자인」의 개정된 줄이 ADR 번호를 가리키는가?
   - UI_GUIDE 「색상」의 "새 색을 도입하지 마라"가 도식 예외와 모순되지 않는가?
   - UI_GUIDE 「도식」 절의 숫자가 `index.json`의 `summary` 실측값과 일치하는가?
     **지어낸 숫자를 넣지 마라.** summary에 없으면 그 줄을 비우고 `verification.md`에 적어라.
   - `src/` 아래 파일이 하나도 변경되지 않았는가? (`git diff --stat`으로 확인)

## 금지사항

- **`src/` 아래 파일을 고치지 마라.** 이 step은 문서 step이다. 코드에 문제가 보이면
  고치지 말고 `verification.md`의 「남은 것」에 적어라.
- **`tailwind.config.js`를 고치지 마라.** step 0의 산출물이다.
- **`phases/NEXT.md`를 고치지 마라.** 그 파일의 정리는 사용자가 요청할 때 한다.
- **문서의 다른 절을 "개선"하지 마라.** 위 네 문서에서 지정된 자리만 고친다.
  낡아 보이는 다른 줄을 발견하면 고치지 말고 `verification.md`에 적어라.
- **병합·push하지 마라.** CLAUDE.md 「Git 전략」이 사람의 판단으로 못박고 있다.
- 기존 테스트를 깨뜨리지 마라.
