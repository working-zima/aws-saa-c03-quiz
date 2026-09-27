# Step 3: keyword-quiz-ui

## 배경

키워드 퀴즈(ADR-040)의 풀이 화면 컴포넌트 둘을 만든다. 4지선다 러너와 플래시카드다. 암호 입력, 모드 선택, 라우트는 step 4가 맡는다.
이 컴포넌트들은 이미 복호화된 데이터를 props로 받기만 한다.

## 읽어야 할 파일

- `docs/UI_GUIDE.md` 전체. 특히 「보기 버튼 (확인 문제)」, 「버튼」, 「랜덤 문제 완료 화면」, 「터치 영역」, 「AI 슬롭 안티패턴」
- `docs/ADR.md`의 **ADR-040**
- `src/types/keywords.ts`, `src/lib/keyword-quiz.ts`: step 1·2 산출물
- `src/components/QuizRunner.tsx`, `src/components/QuizRunner.test.tsx`: 보기 버튼의 클래스, 정답·오답 표시, "다음" 흐름, 완료 화면의 선례.
  **클래스와 시각 규칙을 따르되, 이 컴포넌트를 재사용하거나 고치지는 마라.**

## 작업

### 1. `src/components/KeywordQuizRunner.tsx`

```tsx
interface KeywordQuizRunnerProps {
  mode: KeywordChoiceMode
  questions: KeywordQuestion[]
  keywords: Keyword[]      // 정답 해설에 쓴다(keywordId → Keyword)
  onRestart: () => void    // "한 판 더"
  onExit: () => void       // "처음으로"
}
export function KeywordQuizRunner(props: KeywordQuizRunnerProps): JSX.Element
```

- 문항 하나씩 보여 준다. 위에 `n / 전체` 진행을 표시하고, 아래에 `prompt`와 보기 버튼 넷을 둔다.
- 보기를 누르면 정답을 공개한다. 고른 보기가 틀렸으면 오답 표시를 하고, 정답 보기에는 정답 표시를 한다. `QuizRunner`의 클래스를 따른다.
  공개한 뒤에는 보기를 다시 누를 수 없다.
- 공개한 뒤 보기 아래에 정답 키워드의 `term`과 `summary`를 함께 보여 준다. 어느 모드에서든 짝을 한 번 더 보게 하려는 것이다.
- "다음" 버튼으로 넘어간다. 마지막 문항 뒤에는 완료 화면을 보여 준다: `맞힌 수 / 전체`, "한 판 더"(`onRestart`), "처음으로"(`onExit`).
- `questions`가 바뀌면(한 판 더) 첫 문항부터 새로 시작한다. 부모가 `key`를 바꿔 다시 마운트하는 방식이어도 된다. 방식은 step 4와 맞춘다.
  어느 쪽인지 `summary`에 적어라.

### 2. `src/components/KeywordFlashcards.tsx`

```tsx
interface KeywordFlashcardsProps {
  cards: Keyword[]
  onRestart: () => void
  onExit: () => void
}
export function KeywordFlashcards(props: KeywordFlashcardsProps): JSX.Element
```

- 카드 앞면에는 `term`이 있다. "뒤집기" 버튼을 누르면 `summary`가 드러난다.
- 뒤집은 뒤에만 "알았음"과 "몰랐음" 두 버튼이 나타나고, 누르면 다음 카드로 간다. 진행 `n / 전체`를 표시한다.
- 끝나면 `알았음 a · 몰랐음 b`와 "한 판 더"·"처음으로"를 보여 준다. 몰랐던 카드를 따로 모으거나 저장하지 않는다.

### 3. 테스트 (먼저 쓴다)

`src/components/KeywordQuizRunner.test.tsx`, `src/components/KeywordFlashcards.test.tsx`. 픽스처는 테스트 안의 가짜 키워드다.
`@testing-library/user-event`로 사용자 관점에서 검사한다.

- 러너: 첫 문항의 `prompt`와 보기 넷이 보인다. 정답을 누르면 정답 표시가 되고, 오답을 누르면 오답 표시와 정답 표시가 함께 된다.
  공개 뒤 `term`·`summary`가 보이고, 보기를 다시 눌러도 바뀌지 않는다. 끝까지 풀면 맞힌 수가 맞게 나오고, 두 버튼이 각 콜백을 부른다.
- 플래시카드: 처음에는 `summary`가 보이지 않는다. 뒤집으면 보이고, 그 전에는 "알았음"·"몰랐음"이 없다. 끝나면 개수가 맞고, 두 버튼이 콜백을 부른다.
- 두 컴포넌트 모두 버튼의 터치 영역 클래스(`min-h-[44px]`)를 확인한다(UI_GUIDE 「터치 영역」).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 변경된 파일이 위의 새 파일 넷뿐이다.
   - 두 컴포넌트가 `localStorage`·`useProgress`·`keyword-crypto`·`src/data`를 import하지 않는다.
3. `phases/47-keyword-egg/index.json`의 step 3을 갱신한다.
   - 성공 → `"summary"`에 두 컴포넌트의 props와 "한 판 더" 재시작 방식을 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **`QuizRunner`·`ConceptList`·기존 컴포넌트를 고치지 마라.** 이유: 기존 퀴즈는 진행률·복습과 엮여 있고, 이 기능은 거기서 분리돼야 한다(ADR-040).
- **결과를 저장하지 마라.** "몰랐음"을 모으는 기능도 넣지 마라. 이유: 기록 없음이 사용자 결정이다.
- **새 색을 들이지 마라.** 이유: UI_GUIDE의 색 체계를 따른다. 정답·오답 표시는 `QuizRunner`의 클래스를 그대로 쓴다.
- 기존 테스트를 깨뜨리지 마라.
