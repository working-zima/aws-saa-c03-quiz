# Step 0: dump-extract

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/CLAUDE.md` — 특히 "원본 데이터" 절
- `/docs/ADR.md` — ADR-006(출처 제한), ADR-008(덤프 해설을 두 번째 출처로 인정 + 오류 예외),
  ADR-009(전사 금지), ADR-019(세 번째 출처를 더한 전례)
- `/docs/source/exam-gaps.md` — 이 phase가 만들 문서의 **형식 전례**.
  헤더·항목 구조·인용 표기·"원본 수정 이력" 절을 그대로 따른다.
- `/scripts/extract-pdf.py` — 추출 스크립트의 기존 형태
- `/.gitignore`
- `/src/data/topics.json`

## 작업

880문항 덤프 해설집을 이후 step들이 나눠 읽을 수 있는 형태로 준비하고, 출처로 인정하는 근거를 남긴다.

### 1. `scripts/extract-dump.py`

`docs/source/pdf/SAA-C03_해설집.pdf`(595p, 880문항)에서 텍스트를 뽑아
**50문항 단위 슬라이스 18개**를 `docs/source/dump-slices/`에 쓴다.

- 추출 라이브러리는 **`pypdfium2`**. PyPDF2를 쓰지 마라. 이유: 이 계열 PDF는 라틴 폰트의
  ToUnicode 매핑이 깨져 있어 PyPDF2로 뽑으면 영문에 붙은 숫자가 치환된다(`EC2`→`EC~`, `S3`→`S\x87`).
  `docs/source/exam-gaps.md` 헤더에 기록된 실측이다.
- 실행 인터프리터는 **Python 3.13 이상**. 저장소 기본 `python3`는 3.7이라 pypdfium2가 깔리지 않는다.
  스크립트 docstring에 준비 절차를 적어라:
  `python3.13 -m venv .venv && .venv/bin/pip install pypdfium2`
- 문항 분할: 페이지 텍스트에서 `^Q(\d{3})$` 줄이 문항 시작이다. **880개가 나와야 한다.**
- 문항마다 **원본 쪽번호**를 알아야 한다. 페이지를 순회하며 현재 쪽번호를 들고 다니다가
  문항 시작을 만나면 그 값을 기록하라. 슬라이스에는 `<!-- Q123 p456 -->` 형태로 남긴다.
  이유: `dump-gaps`의 인용 표기 `[Q123 p456]`가 이 값을 쓴다.
- 각 문항에서 아래 잡음을 제거한다:
  - 페이지 머리말 `AWS SAA-C03 해설집 SAA-C03 V29.35`와 뒤따르는 쪽번호 줄.
  - 해설 끝의 `참고 자료:` / `참고 문헌:` / `참고 발췌문:` / `AWS 참조:` / `참고:` **이후 전부**.
    이유: 이 꼬리말은 AWS 문서 링크 목록이라 정답 근거가 아니다. 실측하면 `Well-Architected`가
    76문항에 등장하는데 전부 이 꼬리말이고 문제·보기에는 0건이다. 남겨 두면 이후 step이
    이걸 개념으로 착각한다.
- 출력 파일명: `Q001-Q050.md`, `Q051-Q100.md`, …, `Q801-Q850.md`, `Q851-Q880.md` (마지막은 30문항).

### 2. `scripts/concept-index.py`

`src/data/topics.json`에서 개념 182개의 `{topicId}.{conceptId}` / `name` / `summary`를 뽑아
`docs/source/concept-index.md`로 쓴다.

이유: 이후 step은 "앱에 이미 있는 개념"과 중복을 걸러야 하는데, `topics.json` 전체는 110KB라
매 세션 읽으면 슬라이스를 읽을 컨텍스트가 남지 않는다. 이름과 한 줄 요약만 있으면 판단에 충분하다.

### 3. `.gitignore`에 세 줄 추가

```
.venv/
docs/source/dump-slices/
docs/source/concept-index.md
```

`dump-slices/`와 `concept-index.md`는 스크립트로 재생성되는 파생물이다. 특히 슬라이스는
덤프 전문이라 저장소에 넣지 않는다. `docs/source/concepts-raw.md`와 같은 취급이다.

**`.venv/`를 먼저 넣어라. 순서가 중요하다.** 이유: `execute.py`의 `_commit_step`은 `git add -A`를
쓴다. pypdfium2를 깔려고 만든 가상환경이 gitignore에 없으면 수십 MB가 그대로 커밋된다.
venv를 만들기 **전에** 이 줄을 넣어라.

### 4. `docs/ADR.md`에 ADR-021 추가

파일 끝에 기존 ADR과 같은 형식으로 붙인다.

제목: `### ADR-021: 네 번째 출처로 880문항 덤프 해설집을 인정한다 (ADR-006·ADR-008 개정)`

담을 내용:

- **결정**: `docs/source/dump-gaps/`를 출처로 인정한다. ADR-008이 163문항 덤프에 준 지위를
  880문항 해설집(`docs/source/pdf/SAA-C03_해설집.pdf`, 덤프 V29.35)에 동일하게 준다.
  **문항 자체는 앱에 넣지 않는다. 개념만 가져온다.**
- **이유**: 현재 182개념으로는 이 해설집의 정답 근거를 댈 수 없는 문항이 최소 152개(17%)다.
  앱에 아예 없는 서비스가 39종이고(DMS 29문항, QuickSight 20, CloudFormation 19,
  Redshift Spectrum 9, Elastic Beanstalk 9, SageMaker 8, Neptune 8, Lake Formation 7,
  Control Tower 7 …), 이미 다루는 서비스의 세부 갭(S3 Object Lambda, SAML 2.0 페더레이션 등)은
  이 집계에 잡히지 않으므로 실제 갭은 더 크다. 앱이 이걸 다루지 않으면
  "이 앱으로 학습하면 덤프를 풀 수 있다"는 전제가 깨진다.
- **문항을 넣지 않는 이유**: 복수정답이 78문항(5지선다 61 + 6지선다 17)이라 ADR-005의
  4지선다 단일정답과 어긋나고, 문제 전문을 저장소에 넣으면 ADR-009의 전사 금지 취지와
  정면으로 부딪힌다. 개념만 가져오면 둘 다 피하면서 목적을 이룬다.
- **ADR-008의 오류 예외를 그대로 승계한다**: 이 해설집은 문서 2쪽에서 스스로
  "원본에 해설이 없던 21개 문제는 새로 작성했고 `[AI 작성 해설]`로 표시했다.
  그중 6개 문제는 원본에 기록된 정답이 AWS 기준과 어긋난다"고 고지했다.
  명백한 사실 오류는 옮기지 않고 "원본 수정 이력"에 남긴다.
- **트레이드오프**: 출처가 넷이 되어 검수 기준이 하나 더 늘었다. 대신 모든 항목에
  `[Q번호 p쪽]` 인용을 붙여 어느 해설에서 왔는지 되짚을 수 있게 한다.

### 5. `docs/source/dump-gaps/` 뼈대 생성

- `docs/source/dump-gaps/README.md` — 헤더. `exam-gaps.md` 헤더 형식을 따라 원본 정보,
  추출 방법(pypdfium2 + Python 3.13), 인용 표기 `[Q번호 p쪽]`, 슬라이스 18개 구성,
  "원본 수정 이력"을 각 슬라이스 파일 끝에 둔다는 규칙을 적는다.
- `docs/source/dump-gaps/_index.md` — 빈 목록 파일. 헤더 한 줄과 빈 목록만 둔다.
  이후 step들이 새로 만든 개념을 한 줄씩 append하며, 이것이 step 간 중복 방지 장치다.

이 두 파일과 각 step의 결과 파일은 **커밋 대상이다**. `exam-gaps.md`가 커밋돼 있는 것과 같은 취급이다.

## Acceptance Criteria

```bash
python3.13 scripts/extract-dump.py
ls docs/source/dump-slices/*.md | wc -l                  # 18
cat docs/source/dump-slices/*.md | grep -c '^<!-- Q'     # 880
python3.13 scripts/concept-index.py
grep -c '^- ' docs/source/concept-index.md               # 182
test -f docs/source/dump-gaps/README.md
test -f docs/source/dump-gaps/_index.md
grep -c 'ADR-021' docs/ADR.md                            # 1 이상
npm run build && npm test                                # 회귀 없음
git status --short                                       # dump-slices/, concept-index.md 는 안 잡혀야 한다
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 슬라이스를 하나 열어 문항 하나가 `<!-- Q### p### -->` + 문제 + 보기 + `정답 X` + 해설 순서로
   들어 있는지, 참고자료 꼬리말이 지워졌는지 눈으로 확인한다.
3. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md 디렉토리 구조를 따르는가?
   - ADR 기술 스택을 벗어나지 않았는가?
   - CLAUDE.md CRITICAL 규칙을 위반하지 않았는가?
4. 결과에 따라 `phases/25-dump-gaps/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `src/` 아래를 건드리지 마라. 이유: 이 phase는 출처 문서만 만든다. 개념 데이터 반영은 phase 26이다.
- PyPDF2로 추출하지 마라. 이유: 위 1번에 적은 숫자 치환 문제.
- 덤프 PDF를 커밋하지 마라. 이미 `.gitignore`의 `*.pdf`가 막고 있으니 그 규칙을 풀지 마라.
- 슬라이스 파일이나 `concept-index.md`를 커밋하지 마라. 이유: 파생물이고 덤프 전문이다.
- `scripts/extract-pdf.py`를 고치지 마라. 이유: 그 스크립트는 다른 PDF(개념 원문) 담당이고
  지금 건드릴 이유가 없다. 새 스크립트를 따로 만든다.
- 기존 테스트를 깨뜨리지 마라.
