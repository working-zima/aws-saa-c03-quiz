# Step 0: basic-terms

## 배경

사용자가 Route 53을 공부하다 "대상 그룹이랑 DNS 레코드가 뭔지 모르겠다"고 했다(2026-09-27). 데이터를 확인해 보니 세 용어 모두 정의가 없다.

- `레코드`: Route 53 개념 여럿이 쓴다.
- `호스팅 영역`: 프라이빗·퍼블릭은 설명하지만, 호스팅 영역 자체는 정의하지 않는다.
- `대상 그룹`: ELB 주제와 Route 53 별칭 레코드 개념에 한 번씩 나온다.

두 원본에도 정의가 없어서, 사용자 결정에 따라 AWS 공식 문서를 근거로 정의 문장을 넣는다(ADR-039). 근거와 URL은
`docs/source/aws-docs.md`에 있다. 문장은 사용자가 승인한 것이다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-010, ADR-028, ADR-029, ADR-039**
- `docs/source/aws-docs.md`
- `src/data/topics.json`의 `route53.route53`, `route53.route53-alias-record`, `elastic-load-balancing.elb`
- `src/data/data.test.ts`: 「용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다」 테스트(ELB 문단 수 3 단언), 「TCP와 UDP 풀이…」 테스트,
  카테고리 첫 문장 테스트(`['elastic-load-balancing.elb', 'ELB는', …]`, `['route53.route53', 'Route53은', …]`)
- `scripts/check-structure.mjs`

## 작업

### 1. `src/data/topics.json`: 세 개념의 `paragraphs`만 바꾼다

`id`·`name`·`summary`·개념 순서는 바꾸지 않는다. 아래 문구를 **그대로** 쓴다(ADR-009 — 이미 직접 쓴 문장이다).

**(가) `route53.route53`**: 지금 문단 하나 **뒤에** 새 문단 하나를 더한다(문단 1개 → 2개).

```
이 변환에 쓰이는 정보는 **호스팅 영역**(hosted zone)에 **레코드**(record)로 적어 둔다. 호스팅 영역은 example.com 같은 도메인 하나의 레코드를 모아 두는 그릇이다. 인터넷에서 오는 질의에 답하는 것이 퍼블릭 호스팅 영역, VPC 안에서만 답하는 것이 프라이빗 호스팅 영역이다. 레코드 하나에는 www.example.com 같은 이름, 레코드 유형, 그리고 응답으로 돌려줄 값(IP 주소 등)이 들어간다. 레코드를 만들 때는 라우팅 정책도 함께 고르는데, 같은 이름을 물었을 때 Route 53이 어떻게 답할지를 이 정책이 정한다.
```

**(나) `route53.route53-alias-record`**: 첫 문단의 첫 문장 **바로 뒤에** 한 문장을 끼워 넣는다. 문단 수는 그대로(2개)다. 바꾼 뒤 첫 문단은 아래와 같다.

```
별칭 레코드는 이름을 로드 밸런서 같은 AWS 리소스에 연결한다. **대상 그룹**(target group)은 로드 밸런서가 요청을 넘길 EC2 인스턴스 같은 대상을 등록해 두는 묶음이다. 로드 밸런서가 안정적인 접속 지점이 되고 그 뒤의 대상 그룹이 인스턴스 등록을 맡으므로, 인스턴스가 교체되면 대상 그룹만 바뀌고 DNS 레코드는 그대로다.
```

**(다) `elastic-load-balancing.elb`**: 지금 문단 셋 **뒤에** 넷째 문단을 더한다(3개 → 4개). 앞의 세 문단은 한 글자도 바꾸지 않는다.

```
로드 밸런서가 요청을 넘길 곳은 **대상 그룹**(target group)으로 정한다. 대상 그룹은 EC2 인스턴스 같은 대상을 등록해 두는 묶음이고, 상태 검사도 대상 그룹마다 설정한다. 로드 밸런서는 등록된 대상 가운데 정상인 것에만 요청을 보낸다. 요청이 늘면 대상을 더 등록하고, 줄거나 점검이 필요하면 등록을 해제한다. 대상이 이렇게 바뀌어도 클라이언트가 접속하는 곳은 로드 밸런서 하나로 그대로다.
```

JSON 파일의 형식(들여쓰기·줄바꿈·이스케이프)은 지금 파일을 그대로 따른다. 세 개념 말고는 바꾸지 않는다.

### 2. 테스트

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 데이터를 고친다.

`src/data/data.test.ts` 끝에 테스트를 더한다(하나로 묶어도 된다).

1. `route53.route53`의 문단이 2개이고, 둘째 문단에 `**호스팅 영역**(hosted zone)`, `**레코드**(record)`, `라우팅 정책`이 있다. 첫 문단은 그대로 `Route53은`으로 시작한다.
2. `route53.route53-alias-record`의 문단이 2개이고, 첫 문단에 `**대상 그룹**(target group)은 로드 밸런서가 요청을 넘길`이 있다.
   이 문장이 `대상 그룹이 인스턴스 등록을 맡으므로`보다 앞에 온다(주제 안 첫 등장 자리에서 풀이한다 — ADR-029).
3. `elastic-load-balancing.elb`의 문단이 4개이고, 넷째 문단이 `로드 밸런서가 요청을 넘길 곳은 **대상 그룹**(target group)`으로 시작하며
   `상태 검사도 대상 그룹마다`가 있다.
4. 세 개념의 `summary`가 바뀌지 않았다. 지금 값을 문자열로 단언한다.

**고쳐도 되는 기존 단언은 하나뿐이다**: 「용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다」 테스트의
`expect(byId['elastic-load-balancing.elb'].paragraphs).toHaveLength(3)`을 `4`로 바꾸고, 바로 위에 이유를 주석 한 줄로 단다
(예: `// ADR-039가 대상 그룹 정의 문단을 더해 4가 됐다. phase 13의 편집 범위 단언이었다.`). 그 테스트의 다른 줄과 테스트 이름은 그대로 둔다.
다른 기존 테스트는 고치지 마라.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

`check-structure.mjs`는 개념 id·name·개수·순서와 문항 파일 해시를 본다. 이 step은 `paragraphs`만 바꾸므로 기준 파일을 고치지 않고도
통과해야 한다. **통과하지 않으면 기준 파일을 고치지 말고** 무엇이 바뀌었는지 확인하라.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - `git diff src/data/topics.json`에 세 개념의 `paragraphs`만 바뀌었는가.
   - `questions.json`·`scripts/topics-baseline.json`이 그대로인가.
3. `phases/46-dns-lb-basic-terms/index.json`의 step 0을 갱신한다.
   - 성공 → `"summary"`에 바꾼 세 개념과 문단 수 변화, 고친 기존 단언, 더한 테스트를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **위 문구를 다듬거나 사실을 더하지 마라.** 이유: 사용자가 승인한 문장이고, 사실은 `docs/source/aws-docs.md`에 적힌 것만 허용된다(ADR-039).
  리스너 규칙·Lambda 대상·IP 대상·TTL·레코드 유형 목록(A·CNAME 등)을 덧붙이지 마라.
- **`summary`를 바꾸지 마라.** 이유: ADR-010 — 풀이는 `paragraphs`에만 들어간다.
- **다른 개념·주제에 같은 풀이를 퍼뜨리지 마라.** 이유: 이번 범위는 세 개념이다(ADR-039 「자리」).
- **도식·`src/data/visuals/`·`questions.json`을 고치지 마라.**
- 위에서 허용한 단언 하나 말고 기존 테스트를 깨뜨리거나 고치지 마라.
