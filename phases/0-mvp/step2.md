# Step 2: concepts-core

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ADR.md` — **ADR-006이 이 step의 핵심이다.** 원본에 없는 내용을 지어내지 마라.
- `/docs/PRD.md` — "개념 읽기" 화면이 이 데이터를 어떻게 쓰는지
- `/docs/source/concepts-raw.md` — **원본. 이 step의 유일한 출처다.**
- 이전 step 산출물: `src/types/content.ts`, `src/data/index.ts`, `src/data/data.test.ts`

## 작업

`docs/source/concepts-raw.md`의 **1~18페이지**를 읽고, 아래 8개 주제를
`src/data/topics.json`에 `Topic[]` 형태로 채운다.

원본은 `<!-- ===== PAGE N ===== -->` 주석으로 페이지가 구분돼 있다.

### 채울 주제 (순서대로)

| id | title | importance | sourcePages |
|---|---|---|---|
| `aws-core-services` | AWS 핵심 서비스 개요 — EC2·RDS·S3·Route 53·ELB·CloudFront·Lambda | 0 | [1, 4] |
| `region-availability` | 리전·가용성·가용 영역·다중 AZ | 0 | [5, 6] |
| `onpremise-migration` | 온프레미스와 마이그레이션 | 0 | [7, 7] |
| `s3-storage-classes` | S3 스토리지 클래스 유형 | 3 | [8, 9] |
| `s3-versioning-lifecycle` | S3 버전 관리·객체 잠금·수명 주기 정책 | 3 | [10, 12] |
| `s3-encryption-batch` | S3 암호화(SSE)·S3 Batch Operations | 2 | [13, 13] |
| `block-file-storage` | EBS·EFS·FSx·인스턴스 스토어 | 3 | [14, 15] |
| `data-transfer-services` | DataSync·Snowball Edge·Transfer Family·Storage Gateway | 3 | [16, 18] |

id·title·importance·sourcePages는 위 표 그대로 쓴다. 임의로 바꾸지 마라.

### Concept 나누는 기준

원본에서 `✅`로 시작하는 항목 하나가 `Concept` 하나다.

- `id`: `{topicId}.{서비스 slug}` 형식. 예: `s3-storage-classes.standard-ia`.
  slug는 kebab-case 영문. 전역에서 유일해야 한다.
- `name`: 서비스/개념의 표시 이름. 예: `S3 Standard-IA`. 원본 표기를 따른다.
- `summary`: 한 줄 요약. 원본에 `💡한 줄 요약 :`이 있으면 그 문장을 쓴다.
  없으면 원본 첫 문장에서 한 줄로 뽑는다. 60자 이내.
- `paragraphs`: 설명 본문을 문단 단위로 나눈 평문 배열.

### 원본을 다룰 때 지킬 것

- **내용을 보태지 마라.** 원본에 없는 AWS 지식(예: 정확한 요금, 원본에 없는 서비스,
  최신 기능)을 끌어오지 마라. ADR-006이다.
- **다음은 걷어내라** — 원본의 추출 아티팩트다:
  - 페이지 하단에 반복되는 머리말과 쪽번호
  - `📖` `✅` `💡` 같은 이모지 (UI_GUIDE에서 이모지를 금지한다)
  - `출처 : https://...` 줄
- **여는 괄호가 유실된 구간을 복원하라.** 원본에 `DNSDomain Name System)` 같은 형태가 있다.
  올바른 표기는 `DNS(Domain Name System)`다. 의미로 판단해 여는 괄호를 넣어라.
- 문단 안에서 줄이 끊긴 곳은 이어 붙여 한 문단으로 만들어라. 원본은 PDF 줄바꿈이 그대로 남아 있다.
- 원본의 표현과 어투는 유지한다. 매끄럽게 다시 쓰지 마라.

### 파일

`src/data/topics.json`에 8개 주제를 **배열로** 쓴다. 나머지 14개 주제는 step 10, 11에서
같은 배열에 이어 붙일 것이므로, 구조를 그때 확장할 수 있게 둔다.

## Acceptance Criteria

```bash
npm run lint
npm run build
npm run test     # data.test.ts 의 스키마·유일성·참조 검사 포함
```

추가 확인:
```bash
node -e "const t=require('./src/data/topics.json'); console.log(t.length, t.map(x=>x.id).join(','))"
# 8 과 위 표의 id 8개가 순서대로 나와야 한다
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 데이터 체크리스트를 확인한다:
   - 8개 주제가 전부 있는가? id·importance·sourcePages가 표와 일치하는가?
   - 각 주제의 concept이 원본의 `✅` 항목 수와 맞는가?
   - concept id가 전역에서 유일한가?
   - 이모지·쪽번호·머리말·출처 URL이 남아 있지 않은가?
   - 원본에 없는 내용을 넣지 않았는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

`summary`에는 주제 수와 concept 총 개수를 적어라. 다음 step이 참고한다.

## 금지사항

- 9번 이후 주제(RDS, Aurora, VPC, IAM 등)를 넣지 마라. 이유: step 10, 11의 범위다.
- 문제(`questions.json`)를 만들지 마라. 이유: step 7의 범위다.
- UI 컴포넌트를 만들지 마라. 이유: step 4부터다.
- 원본을 요약하거나 재서술하지 마라. 문단을 옮기되 내용을 바꾸지 마라.
- 원본에 없는 서비스나 수치를 추가하지 마라. 이유: ADR-006. 검수 기준이 사라진다.
- `docs/source/concepts-raw.md`를 수정하지 마라. 이유: 원본은 읽기 전용이다.
- 기존 테스트를 깨뜨리지 마라.
