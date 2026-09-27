# Step 0: keyword-source

## 배경

사용자가 원본 PDF에 나온 키워드만 간단한 퀴즈로 복습하려 한다. 사용자 혼자 쓰는 숨은 화면이고, 데이터는 암호문으로만
저장소에 들어간다(ADR-040). 이 step은 그 **평문 데이터**를 만든다. 암호화와 화면은 다음 step들이 맡는다.

**이 step의 데이터는 ADR-009의 예외다.** 키워드 정의는 PDF 원문을 **그대로** 쓴다(사용자 결정). 이 평문 파일은
gitignore 대상이라 커밋되지 않으며, 공개되는 것은 step 1이 만드는 암호문뿐이다. `topics.json`·`questions.json`에는
여전히 ADR-009가 적용되므로 이 step에서 두 파일을 건드리지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009**, **ADR-040**
- `docs/source/concepts-raw.md`: 원본 PDF 50쪽의 추출본(gitignore 대상, 이 worktree에 복사돼 있다). 파일 헤더에 추출 아티팩트
  (여는 괄호 유실, 쪽 머리말·쪽번호 잔존)가 적혀 있다.
- `docs/source/pdf/AWS SAA-C03 자격증 벼락치기 - 딱 169문제로 2주만에 합격하기 (26.02.12.) 복사본.pdf`: 원본이다. 괄호가 유실된 곳은
  이 PDF의 텍스트로 확인할 수 있다. `pypdfium2`는
  `/Volumes/zimablue_ssd/dev/etc/aws-quiz/.venv/bin/python`에 설치돼 있다. 이 PDF에서 뽑은 텍스트는 괄호가 온전하다.
- `.gitignore`: `docs/source/keywords-raw.json`이 무시 대상인지 확인한다.
- `scripts/check-verbatim.mjs`: "원본이 없으면 건너뜀(exit 0)" 패턴의 선례다.

## 작업

### 1. `docs/source/keywords-raw.json` (평문, 커밋하지 않는다)

JSON 배열이다. 원소 하나가 키워드 하나다.

```json
[
  { "id": "kw-001", "term": "EC2 (Elastic Compute Cloud)", "summary": "컴퓨터를 빌려서 원격으로 접속해 사용하는 서비스이다.", "section": "[간단 요약] EC2, RDS, S3, Route53, ELB, CloudFront, Lambda", "page": 1 }
]
```

- `id`: `kw-001`부터 3자리로 빈틈 없이 매긴다. 순서는 PDF에 처음 나오는 순서다.
- `term`: PDF에 쓰인 키워드 이름이다. 괄호로 풀네임이 붙어 있으면 함께 쓴다(`SSE (Server Side Encryption)`).
  `란 ?`·`이란 ?`는 뗀다.
- `summary`: 그 키워드의 정의다. 아래 「요약 고르는 법」을 따른다.
- `section`: 그 정의가 나온 PDF 단원의 제목이다. `concepts-raw.md`에서 `📖` 바로 다음 줄(들)의 제목이며, 별점 표기
  `(★★★)`는 뗀다. 오답 보기를 같은 단원에서 고르는 데 쓰인다.
- `page`: 그 정의가 나온 PDF 쪽(1~50). `concepts-raw.md`의 `<!-- ===== PAGE n ===== -->` 표시로 안다.

#### 키워드를 고르는 법

PDF의 `✅` 제목은 97개다. 제목마다 아래 넷 중 하나로 처리한다.

1. **키워드**: 서비스·기능·개념 하나를 가리키는 제목이다(`✅ S3 버전 관리`, `✅ Transit Gateway`). 키워드 하나가 된다.
2. **묶음 제목 → 하위 항목으로 푼다**: 제목이 여러 항목을 묶는 경우다(`✅ S3 스토리지 클래스 유형`, `✅ SSE 종류`,
   `✅ RDS 스토리지 유형`, `✅ 기능`, `✅ Route53 라우팅 정책` 등). 제목 자체는 키워드로 만들지 않는다. 그 아래에서 자기 설명을 가진
   하위 항목(`S3 Standard-IA`, `SSE-KMS`, `Read Replica`, `가중치 기반 라우팅` 등)을 하나씩 키워드로 만든다. 설명이 없는 하위 항목은 뺀다.
3. **중복 → 하나로 합친다**: 같은 키워드가 여러 번 나온다. EC2·RDS·ELB·Lambda·Route53·Data Firehose가 둘씩, CloudFront가 셋이다.
   키워드는 하나만 만든다. `summary`는 `💡 한 줄 요약`이 있는 쪽에서 가져오고, 없으면 먼저 나온 쪽에서 가져온다.
   `section`·`page`는 `summary`를 가져온 쪽을 따른다. 표기가 다른 것(`Route 53`/`Route53`, `RDS (Relational Database Service)`/`RDS`)도
   같은 키워드로 본다.
4. **뺀다**: `vs` 비교 제목(`✅ NAT Gateway vs VPC Endpoint vs PrivateLink vs VPC 피어링` 등)은 키워드가 아니다. 비교되는 쪽들은
   각자의 제목에서 키워드가 된다.

판단이 서지 않으면 키워드로 만들고, 보고서에 그 판단을 적는다.

#### 요약 고르는 법

- `💡 한 줄 요약`이 있으면 그 문장을 쓴다.
- 없으면 본문에서 그 키워드가 **무엇인지** 말하는 문장을 쓴다. 대개 첫 문장이다. 한두 문장이면 되며, 200자를 넘기지 않는다.
  하위 항목은 이름 뒤의 설명(`S3 Standard : 기본 스토리지` → `기본 스토리지`)을 쓴다.
- **원문 그대로 쓴다.** 고치는 것은 추출 아티팩트뿐이다. 유실된 여는 괄호는 PDF 텍스트로 확인해 되살리고, 섞여 들어간
  쪽 머리말·쪽번호는 지우고, 줄바꿈 때문에 끊긴 단어(`다\n른` → `다른`)는 붙인다. 표현을 다듬거나 사실을 보태지 마라.
- **요약 안의 키워드 이름은 `○○`로 가린다.** 가리지 않으면 요약만 보고 정답을 고를 수 있다. 약어와 풀네임을 모두 가린다
  (`S3 수명 주기 정책은 파일을…` → `○○은 파일을…`, `EBS (Elastic Block Store)`의 요약에서는 `EBS`와 `Elastic Block Store`를 모두 가린다).
  조사는 원문 그대로 둔다.
- **요약이 같은 키워드가 둘 이상이면** 같은 PDF 단원에 있는 다른 사실로 구분한다. 예를 들어 `S3 Standard-IA`와
  `S3 Glacier Instant Retrieval`은 PDF의 설명이 한 글자도 다르지 않다. 그 단원의 다른 줄(접근 빈도 분류 등)에 둘을 가르는 사실이 있으면
  그 원문 구절을 요약 뒤에 덧붙인다. 그런 사실이 없으면 **둘 다 빼고** 보고서에 적는다. 같은 요약이 남으면 퀴즈의 정답이 둘이 된다.

### 2. `scripts/check-keywords.mjs` (커밋한다)

`docs/source/keywords-raw.json`을 검사한다. 파일이 없으면 `건너뜀: docs/source/keywords-raw.json 없음`을 출력하고 exit 0으로 끝난다.
원본이 없는 clone 환경을 위한 것이다(`check-verbatim.mjs`와 같은 방식). 검사가 하나라도 실패하면 이유를 모두 출력하고 exit 1로 끝난다.
통과하면 `N개 통과`와 단원별 개수를 출력한다.

검사 항목:

1. 배열이고, 원소마다 필드가 정확히 `id`·`term`·`summary`·`section`·`page` 다섯 개이며, 문자열 필드는 비어 있지 않다. `page`는 1~50의 정수다.
2. `id`는 `kw-001`부터 빈틈 없이 연속이다.
3. `term`이 겹치지 않는다. 비교할 때는 공백을 지우고 소문자로 바꾼다(`Route 53` = `Route53`).
   풀네임 괄호를 뗀 앞부분(`RDS (Relational Database Service)` → `RDS`)도 겹치면 안 된다.
4. `summary`가 겹치지 않는다(공백을 지우고 비교한다).
5. `summary`에 자기 `term`이 남아 있지 않다. `term`을 `이름 (풀네임)`으로 나눈 이름과 풀네임 각각이 대상이며, 공백을 지우고 소문자로
   비교한다. 두 글자 이하의 이름(`S3` 등)은 검사하지 않는다. 오탐이 많기 때문이다.
6. `summary`가 200자 이하다.
7. 단원(`section`)이 셋 이상이다.

이 스크립트는 `npm test`·`npm run build`에 엮지 않는다. 평문이 clone 환경에 없기 때문이다.

### 3. `phases/47-keyword-egg/keywords-report.md` (커밋한다)

이 파일은 공개된다. 그러므로 **`summary` 문장은 한 줄도 적지 마라.** 적는 것은 아래 셋뿐이다.

- 전체 키워드 수와 단원별 개수.
- `✅` 제목 97개 전부의 처리 결과 표: `| PDF 쪽 | ✅ 제목 | 처리(키워드/하위 항목으로 풂/합침/뺌) | 만든 키워드 id 또는 합친 대상 |`.
  묶음 제목은 만든 하위 키워드의 `term`을 나열한다.
- 판단이 필요했던 곳: 요약이 같아 구분하거나 뺀 쌍, 설명이 없어 뺀 하위 항목, 키워드인지 애매했던 제목, 요약 고르기가 애매했던 곳.
  키워드 이름과 사유만 적는다.

## Acceptance Criteria

```bash
git check-ignore -q docs/source/keywords-raw.json   # 평문이 무시 대상이다
node scripts/check-keywords.mjs | grep -q "통과"      # 건너뜀이 아니라 실제로 검사해 통과했다
test -z "$(git status --porcelain docs/source/keywords-raw.json)"
npm run build
npm run lint
npm test
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `keywords-report.md`의 표가 `✅` 97행이고, 모든 행에 처리 결과가 있다.
   - `keywords-report.md`에 요약 문장이 없다.
   - `git status`에 `src/` 변경이 없다.
3. `phases/47-keyword-egg/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 키워드 수, 단원 수, 뺀 항목 수, 만든 파일을 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **평문 파일을 커밋하지 마라.** `git add -f`를 쓰지 말고, `.gitignore`의 해당 줄을 지우지 마라. 이유: 원문이 공개된다(ADR-009·ADR-040).
- **요약 문장을 커밋되는 파일(`keywords-report.md`, 스크립트, 테스트, step 출력)에 적지 마라.** 이유: 같다.
  `check-keywords.mjs`에 키워드 이름을 하드코딩하지도 마라.
- **추출용 임시 스크립트를 커밋하지 마라.** 필요하면 쓰되 끝나면 지운다. 이유: 이 step이 남기는 것은 위 세 파일뿐이다.
- **요약을 다듬거나 사실을 더하지 마라.** 이유: 원문 그대로가 사용자 결정이다. 아티팩트를 고치는 것과 `○○`로 가리는 것만 허용된다.
- **`src/`·`topics.json`·`questions.json`을 고치지 마라.** 이유: 이 step은 데이터 원본만 만든다.
- 기존 테스트를 깨뜨리지 마라.
