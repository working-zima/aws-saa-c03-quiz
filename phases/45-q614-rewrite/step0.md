# Step 0: q614-rewrite

## 배경

q614(`route53.private-hosted-zone-vpc-only`)는 지문과 묻는 것이 어긋나 애매했다(사용자 지적, 2026-09-27). 지문은 "사내 DNS 서버의 사설
도메인을 VPC 안의 인스턴스가 해석하게 하려 한다"는 상황을 주는데, 정작 묻는 것은 "프라이빗 호스팅 영역을 무엇에 연결할 수 있나"라는
사실이다. 정답 `VPC`를 골라도 지문의 상황은 풀리지 않는다.

사용자는 상황을 살려 해결책을 묻는 방향을 제안했다. 그런데 그렇게 하면 q121·q220과 정답(아웃바운드 엔드포인트)이 겹친다. 그래서
**상황은 살리되, 정답이 이 개념의 고유한 사실(프라이빗 호스팅 영역은 VPC에만 연결된다)이 되는 판단형**으로 바꾸기로 했다(사용자 결정).
오답 셋은 각각 다른 개념을 확인한다.

- ①: 연결 제약을 모르는 경우
- ③: 엔드포인트 방향을 혼동한 경우
- ④: 사설 이름을 공개하면 안 된다는 요구를 어긴 경우

예시 도메인은 본문과 도식이 쓰는 `db.corp.local`이다(ADR-038과 같은 이름).

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-034**
- `src/data/questions.json`의 q614 항목과 그 앞뒤 항목(형식 확인용)
- `src/data/topics.json`의 `route53.private-hosted-zone-vpc-only`, `route53.resolver`, `route53.route53-resolver-forward-rule`,
  `route53.private-hosted-zone`
- `scripts/check-structure.mjs`, `scripts/topics-baseline.json`의 `questionsSha256`
- `src/data/data.test.ts`: 정답 위치 분포와 금지 문구 테스트

## 작업

### 1. q614를 아래 값으로 바꾼다

`id`·`topicId`·`conceptId`는 그대로 둔다. `prompt`·`choices`·`answerIndex`·`explanation`을 **아래 문구 그대로** 쓴다. 이 문구는
원문을 옮긴 것이 아니라 이미 새로 쓴 것이다(ADR-009).

- `prompt`: `사내 DNS 서버가 관리하는 사설 도메인 db.corp.local을 VPC 안의 인스턴스가 해석해야 한다. 팀원이 프라이빗 호스팅 영역을 만들어 온프레미스 네트워크에 연결하자고 제안했다. 이 제안에 대한 판단으로 옳은 것은?`
- `choices`:
  0. `적절하다. 프라이빗 호스팅 영역은 VPC와 온프레미스 네트워크 모두에 연결할 수 있다`
  1. `부적절하다. 이 영역은 VPC에만 연결되므로 아웃바운드 엔드포인트와 전달 규칙이 필요하다`
  2. `부적절하다. Resolver 인바운드 엔드포인트를 만들어 사내 DNS로 질의를 넘겨야 한다`
  3. `부적절하다. 사내 레코드를 퍼블릭 호스팅 영역으로 옮겨 Route 53이 응답하게 해야 한다`
- `answerIndex`: `1` (지금과 같다. 정답 위치 분포 테스트에 영향이 없다)
- `explanation`: `프라이빗 호스팅 영역을 연결할 수 있는 대상은 VPC(Virtual Private Cloud)뿐이라, 온프레미스 네트워크에 붙이자는 제안은 성립하지 않는다. 사내 DNS(Domain Name System) 서버가 가진 사설 이름을 VPC에서 풀려면 Route 53 Resolver 아웃바운드 엔드포인트를 두고, db.corp.local 같은 도메인을 사내 DNS 서버로 넘기는 전달 규칙을 그 VPC에 연결해야 한다. 엔드포인트의 방향은 AWS를 기준으로 나뉘므로 인바운드 엔드포인트는 반대로 온프레미스가 AWS의 사설 이름을 풀 때 쓰는 입구이고, VPC에서 나가는 질의를 사내로 넘기지 못한다. 사내 레코드를 퍼블릭 호스팅 영역으로 옮기면 내부 이름이 인터넷에 드러나 사설 DNS라는 요구 자체를 어긴다.`

JSON 파일의 들여쓰기·줄바꿈 형식은 지금 파일의 형식을 그대로 따른다. q614 말고 다른 줄은 한 글자도 바꾸지 않는다.

### 2. 구조 검사 기준 해시

`scripts/topics-baseline.json`의 `questionsSha256`을 새 `src/data/questions.json`의 sha256으로 갱신한다. 다른 필드는 건드리지 않는다.

### 3. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 데이터를 고친다. 기존 테스트 파일 가운데 문항을 단언하는 곳(`src/data/data.test.ts`)
끝에 테스트 하나를 더한다.

- q614의 `conceptId`가 `route53.private-hosted-zone-vpc-only`이고, `prompt`에 `db.corp.local`과 `온프레미스 네트워크에 연결`이 있다.
- `choices[answerIndex]`에 `VPC에만 연결`이 있다.
- 보기 넷이 모두 `적절하다.` 또는 `부적절하다.`로 시작하고, `적절하다.`로 시작하는 보기는 하나다.
- `corp.example.local`이 어디에도 없다.

기존 테스트는 고치지 마라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff src/data/questions.json`에 q614 한 항목만 바뀌었는가.
   - `topics.json`이 그대로인가.
3. `phases/45-q614-rewrite/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 필드, 새 `questionsSha256`, 더한 테스트를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **위 문구를 다듬거나 바꾸지 마라.** 이유: 사용자와 정한 문구다. 틀렸다고 판단되면 고치지 말고 `blocked`로 멈춘다.
- **q121·q220·q615 등 다른 문항을 고치지 마라.** 이유: 이번 범위는 q614 하나다.
- **`conceptId`를 바꾸지 마라.** 이유: 정답이 이 개념의 사실(VPC에만 연결)이므로 ADR-034 기준으로 그대로가 맞다.
- **`topics.json`을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
