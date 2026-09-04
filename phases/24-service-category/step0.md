# Step 0: service-category-lead

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ADR.md` — 특히 ADR-006·008·009(출처 제한), ADR-010·014(용어 풀이의 형태),
  ADR-015(출처 규칙을 넓힌 전례), ADR-019(이 step의 근거)
- `/docs/source/service-categories.md` — 카테고리 표기와 개념 75개의 배치. **유일한 근거다.**
- `/docs/ARCHITECTURE.md` — 데이터 모델
- `/src/types/content.ts`
- `/src/data/topics.json`
- `/src/data/data.test.ts`
- `/scripts/check-structure.mjs`

## 작업

개념 본문에 그 서비스가 AWS 공식 분류로 어느 갈래인지 밝히는 한 줄을 넣는다.

1. `src/data/topics.json`에서 `docs/source/service-categories.md`의 매핑 표에 있는
   개념 **75개**의 `paragraphs[0]` 맨 앞에 문장 하나를 붙인다. 형태는
   `{주어}는 AWS 분류로는 {카테고리} 쪽 서비스다.`이고, 뒤에 공백 하나를 두고 기존 문장이
   이어진다. 주어·조사·카테고리 표기는 매핑 표에 적힌 것을 그대로 쓴다.
   `cost-management.savings-plan`만 서술이 `쪽에 속한다`다.
2. `src/data/data.test.ts`에 `serviceCategories` 표와 테스트를 더해 75개 전부와 표기를
   강제한다. 표에 없는 개념에는 문장이 없어야 하고, 개념마다 문장은 한 번만 있어야 한다.

`topics.json`은 **개념 하나가 정확히 한 줄**이어야 한다. JSON 라이브러리로 파일 전체를
재직렬화하면 이 포맷이 깨진다. 줄 단위로 파싱해 `separators=(',', ':')` 같은 compact 포맷으로
그 줄만 되돌려 쓰거나, 문자열 치환으로 처리하라. `scripts/check-structure.mjs`가 이를 검사한다.

## Acceptance Criteria

```bash
node scripts/check-structure.mjs   # 구조 위반 0건
npm run build                      # 타입체크·빌드 통과
npm test                           # 테스트 전부 통과
npm run lint                       # 경고 0건
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/24-service-category/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **`docs/source/service-categories.md`에 없는 카테고리나 배치를 쓰지 마라.**
  이유: 그 파일이 ADR-019가 인정한 세 번째 출처의 추출본이고, 모델이 아는 AWS 지식으로
  보강하는 것은 ADR-006·009가 금지한다. 표에 없는 서비스는 대상이 아니다.
- **`AWS 분류로는`을 빼고 `{주어}는 {카테고리} 쪽 서비스다.`로 쓰지 마라.**
  이유: `EMR`의 정의 문장은 `컴퓨팅 서비스다`, `RedShift`는 `AWS 데이터베이스 서비스다`인데
  백서 카테고리는 둘 다 분석이다. 프레임이 없으면 두 문장이 서로 다투는 것처럼 읽힌다.
- **`summary`·`name`·개념 id·개념 개수·주제 배치를 바꾸지 마라.**
  이유: `summary`는 개념 제목 아래 한 줄 요약으로 렌더되고, 문항이 `conceptId`로 개념을
  참조한다. ADR-010이 정한 범위이고 `check-structure.mjs`가 강제한다.
- **`src/data/questions.json`을 건드리지 마라.**
  이유: 카테고리는 어떤 문항의 정답 근거도 아니다. sha256으로 고정돼 있다.
- **뱃지·용어집 페이지·툴팁을 만들거나 주제 목록을 갈래별로 다시 묶지 마라.**
  이유: ADR-010·019가 정한 형태는 본문 인라인 한 줄뿐이다. 읽던 자리에서 해결되는 것이
  목적인데 새 화면을 만들면 그 목적이 깨진다.
- 기존 테스트를 깨뜨리지 마라
