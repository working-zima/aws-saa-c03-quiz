# Step 0: term-gloss

## 배경 — 풀이 없는 용어에서 문단이 막힌다

개념 182개를 훑으면 **AWS 고유 사실이 아닌 일반 IT 용어 13종**이 풀이 없이 쓰인다.
`NFS 프로토콜만 지원한다`, `MFA 삭제 조합은`, `JWT 인증을 기본 기능으로 제공하지 않는다` 같은
문장이다. 원본 자료는 독자가 이 정도는 안다고 전제하고 쓰였지만, 이 앱은 개념을 읽고 바로
확인 문제를 푸는 학습 도구라서 여기서 막히면 그 문단 전체가 읽히지 않는다.

원본 두 파일을 확인한 결과 **`FTP`·`JWT`·`DDoS`가 무엇인지는 어느 출처에도 없다.**
그래서 이 step은 `docs/ADR.md`의 **ADR-010**을 근거로 삼는다. ADR-010은 일반 IT 용어의
풀네임과 한 줄 풀이에 한해 출처 제한(ADR-006·ADR-008·ADR-009)의 예외를 인정한다.
**ADR-010을 먼저 읽어라.** 특히 "경계 — 무엇이 예외가 아닌가" 절이 이 step의 범위를 정한다.

## 결정된 동작

**아래 13개 문장을 지정된 개념의 지정된 문단에 정확히 한 번씩 넣는다.**
문단을 새로 만들지 않고, 기존 문단 문자열의 앞이나 뒤에 문장 하나를 잇는다.

한 용어는 **처음 등장하는 개념에서 한 번만** 풀이한다. 뒤에 같은 용어가 또 나와도
되풀이하지 않는다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-010** — 이 step의 근거이자 범위 제한이다.
- `src/data/topics.json` — 이 step에서 값을 고치는 **유일한 데이터 파일**이다.
- `src/data/data.test.ts` — 테스트를 덧붙인다. 기존 테스트는 건드리지 마라.
- `scripts/check-structure.mjs` — 구조 가드레일. 이 step에서 반드시 통과해야 한다.

## 작업

CLAUDE.md의 TDD 규칙에 따라 **아래 "테스트" 절을 먼저 작성해 실패를 확인한 뒤**
`topics.json`을 고쳐 통과시킨다.

### 편집 방식 — 먼저 읽어라

`src/data/topics.json`은 **개념 하나가 정확히 한 줄**인 포맷이다.
`scripts/check-structure.mjs`가 이 줄 수(182)를 검사한다.

- **파일 전체를 JSON 라이브러리로 다시 직렬화하지 마라.** `json.dump`나 `JSON.stringify`로
  파일을 통째로 다시 쓰면 개념 한 줄 포맷이 깨져 `check-structure.mjs`가 즉시 실패한다.
- 해당 문단의 **문자열 값만** 제자리에서 치환해라.
- 넣는 문장은 앞 문장과 **공백 한 칸**으로 잇는다. 줄바꿈(`\n`)을 넣지 마라.

### 넣을 문장 13개

각 항목의 `문단`은 그 개념 `paragraphs` 배열의 0부터 세는 인덱스다.
`앞에`는 문단 맨 앞에, `뒤에`는 문단 맨 뒤에 잇는다는 뜻이다.

---

**1. MFA** — `s3-versioning-lifecycle.object-lock-prerequisites` 문단 1 · **앞에**

```
MFA(Multi-Factor Authentication)는 비밀번호에 더해 OTP나 SMS 인증 코드 같은 수단을 한 번 더 확인하는 다중 인증이다.
```

이 문단만 앞에 붙인다. 문단 1이 이미 `루트 사용자가 MFA 인증을 거치면`으로 결론을 내고 있어,
뒤에 붙이면 결론 다음에 용어 설명이 오게 된다.

---

**2. NFS** — `block-file-storage.efs` 문단 0 · **뒤에**

```
NFS(Network File System)는 네트워크로 연결된 여러 컴퓨터가 같은 파일을 공유하게 하는 표준 프로토콜이다.
```

`block-file-storage.fsx` 문단 1의 `NFS는 Linux와 Unix 계열에서, SMB는 Windows에서 사용하는
파일 공유 프로토콜이다`는 **그대로 둔다.** 그쪽은 SMB와 대비하는 문장이라 역할이 다르고,
EFS가 FSx보다 먼저 읽히므로 첫 등장은 EFS 쪽이다.

---

**3. FTP·SFTP·FTPS** — `data-transfer-services.transfer-family` 문단 0 · **뒤에**

```
FTP(File Transfer Protocol)는 서버에 접속해 파일을 올리고 내려받는 표준 방식이고, SFTP와 FTPS는 그 통신을 암호화한 방식이다.
```

---

**4. NoSQL** — `aurora-dynamodb-cache.dynamodb` 문단 0 · **뒤에**

```
NoSQL은 행과 열로 짜인 표 대신 키-값이나 문서 같은 형태로 데이터를 다루는 방식이다.
```

---

**5. 캐시** — `aurora-dynamodb-cache.dynamodb` 문단 2 · **뒤에**

```
캐시는 자주 읽는 데이터를 미리 담아 두었다가 곧바로 돌려주는 저장 공간이다.
```

문단 2가 DAX를 `DynamoDB와 호환되는 캐시`라고만 설명하고 끝나서, 캐시를 모르면 DAX가
무엇을 하는지 알 수 없다. 같은 개념에 두 문장이 들어가는 유일한 경우다(문단 0과 문단 2).

---

**6. 엔드포인트** — `aurora-dynamodb-cache.aurora-reader-endpoint` 문단 0 · **앞에**

```
엔드포인트는 애플리케이션이 접속할 주소를 뜻하며, Aurora의 Reader Endpoint로 요청을 보내면 읽기 전용 복제본들에 자동으로 나뉘어 전달된다.
```

이 개념이 앱 전체에서 `엔드포인트`가 처음 등장하는 자리다(주제 7 · 개념 4). 뒤에 나오는
`VPC Endpoint`, `Route 53 Resolver 엔드포인트`, `Lambda 함수 URL`은 **건드리지 마라.**

문단 0이 `RDS for MySQL에는 Reader Endpoint를 통한 부하 분산 기능이 없다`로 시작해서,
뒤에 붙이면 "없다"는 대비가 그것이 무엇인지보다 먼저 온다. 그래서 **앞에** 붙인다.

뒷절의 `읽기 전용 복제본들에 자동으로 나뉘어 전달된다`는 ADR-010의 예외가 아니라
`docs/source/exam-gaps.md`의 인용("Reader Endpoint를 통한 부하 분산은 Amazon Aurora에서만
제공하는 기능이다")에 근거한다. **Writer Endpoint는 두 출처에 없으므로 쓰지 마라.**

---

**7. TCP·UDP** — `compute-delivery.elb` 문단 **1** · **뒤에**

```
TCP와 UDP는 데이터를 어떤 방식으로 실어 나를지 정하는 전송 계층 규약이고, HTTP와 HTTPS는 그 위에서 웹 요청을 주고받는 규약이다.
```

첫 등장은 ALB를 다루는 문단 0이지만, **문단 1에 넣는다.** 문단 0은 ALB가 TCP·UDP를
지원하지 않는다는 얘기로 끝나고, 문단 1의 NLB가 실제로 TCP·UDP를 다루기 때문에 여기가
설명이 붙을 자리다. 문단 0은 건드리지 마라.

---

**8. JWT** — `serverless-containers.api-gateway` 문단 1 · **뒤에**

```
JWT(JSON Web Token)는 로그인한 사용자의 정보를 위조할 수 없게 서명해 담은 토큰으로, 요청마다 이것을 보내 신원을 증명한다.
```

같은 문단의 `REST API`는 **풀이하지 마라.** API Gateway의 유형 이름이라 일반 IT 용어가 아니다.

---

**9. DDoS** — `threat-protection.shield` 문단 0 · **뒤에**

```
DDoS(Distributed Denial of Service)는 여러 곳에서 한꺼번에 대량의 요청을 보내 서비스를 마비시키는 공격이다.
```

---

**10. DRT** — `threat-protection.shield-advanced-drt` 문단 0 · **뒤에**

```
DRT(DDoS Response Team)는 공격이 진행되는 동안 대응을 돕는 AWS의 전담 인력이다.
```

---

**11. XSS·SQL Injection** — `threat-protection.waf` 문단 2 · **뒤에**

```
SQL Injection은 입력창에 데이터베이스 명령을 몰래 끼워 넣는 공격이고, XSS(Cross-Site Scripting)는 다른 사용자의 브라우저에서 실행될 스크립트를 심는 공격이다.
```

---

**12. CVE** — `threat-protection.security-service-lineup` 문단 1 · **뒤에**

```
CVE(Common Vulnerabilities and Exposures)는 공개적으로 알려진 보안 취약점에 붙는 공용 식별 번호다.
```

---

**13. SSL·TLS** — `secrets-encryption.acm` 문단 0 · **뒤에**

```
SSL과 TLS는 브라우저와 서버 사이의 통신을 암호화하는 규약이고 TLS가 SSL의 후속이며, 인증서는 그 상대가 진짜임을 증명하는 파일이다.
```

---

**이 13개가 이 step의 데이터 변경 전부다.** 문단 13개(개념 12개)만 달라진다.

### 핵심 규칙 — 벗어나지 마라

- **`summary`를 건드리지 마라.** UI에서 개념 제목 아래 작은 글씨로 렌더되는 한 줄 요약이다.
  괄호 풀이가 들어가면 요약 구실을 못 한다. 풀이는 `paragraphs`에만 넣는다.
- **개념 `id`·`name`, 주제 메타데이터, 개념 개수와 순서를 바꾸지 마라.**
- **`paragraphs` 배열의 길이를 바꾸지 마라.** 새 문단을 만들지 않고 기존 문단에 잇기만 한다.
- **`src/data/questions.json`을 건드리지 마라.** `check-structure.mjs`가 sha256으로 검사한다.
- **목록에 없는 용어를 풀이하지 마라.** `IOPS`는 이미 `rds-storage-features.storage-types`
  문단 1에 `Input과 Output에 대한 초당 작업 수`로 풀려 있고, `SMB`·`CDN`·`RDBMS`·`ETL`·
  `FIFO`·`HPC`·`ACL`·`IdP`·`SSE`·`STS`도 이미 풀이가 있다. `Lustre`·`ONTAP`·`OpenZFS`는
  제품 이름표라서 몰라도 문장이 읽히므로 대상이 아니다.
- **AWS 서비스의 사양·제약·비교를 새로 쓰지 마라.** ADR-010의 예외는 용어가 무엇을
  가리키는지에만 적용된다. 어떤 문항의 정답 근거가 될 수 있는 사실이면 예외가 아니다.
- **문장을 바꿔 쓰지 마라.** 위 13개 문장을 글자 그대로 넣는다.
- **검증 조건과 올바른 구현이 충돌하면 코드를 비틀지 말고 `blocked`로 멈추고 사유를 적어라.**

## 테스트

`src/data/data.test.ts`의 `describe('학습 데이터 무결성', ...)` 블록 **끝에** 두 개를 덧붙인다.
기존 `it`을 수정하거나 지우지 마라.

```ts
const termGlosses: Array<{ conceptId: string; anchor: string }> = [
  { conceptId: 's3-versioning-lifecycle.object-lock-prerequisites', anchor: 'Multi-Factor Authentication' },
  { conceptId: 'block-file-storage.efs', anchor: 'Network File System' },
  { conceptId: 'data-transfer-services.transfer-family', anchor: 'File Transfer Protocol' },
  { conceptId: 'aurora-dynamodb-cache.dynamodb', anchor: '키-값' },
  { conceptId: 'aurora-dynamodb-cache.dynamodb', anchor: '미리 담아 두었다가' },
  { conceptId: 'aurora-dynamodb-cache.aurora-reader-endpoint', anchor: '애플리케이션이 접속할 주소' },
  { conceptId: 'compute-delivery.elb', anchor: '실어 나를지 정하는' },
  { conceptId: 'serverless-containers.api-gateway', anchor: 'JSON Web Token' },
  { conceptId: 'threat-protection.shield', anchor: 'Distributed Denial of Service' },
  { conceptId: 'threat-protection.shield-advanced-drt', anchor: 'DDoS Response Team' },
  { conceptId: 'threat-protection.waf', anchor: 'Cross-Site Scripting' },
  { conceptId: 'threat-protection.security-service-lineup', anchor: 'Common Vulnerabilities' },
  { conceptId: 'secrets-encryption.acm', anchor: 'SSL의 후속' },
]

it('풀이 없이 쓰이던 일반 IT 용어 13종이 첫 등장 개념에서 한 번씩 풀린다', () => {
  const concepts = topics.flatMap((topic) => topic.concepts)

  termGlosses.forEach(({ conceptId, anchor }) => {
    const holders = concepts.filter((concept) =>
      concept.paragraphs.some((paragraph) => paragraph.includes(anchor)),
    )

    expect(holders.map(({ id }) => id)).toEqual([conceptId])
  })
})

it('용어 풀이가 개념 요약이 아니라 본문에만 들어간다', () => {
  const concepts = topics.flatMap((topic) => topic.concepts)

  concepts.forEach((concept) => {
    termGlosses.forEach(({ anchor }) => {
      expect(concept.summary).not.toContain(anchor)
      expect(concept.name).not.toContain(anchor)
    })
  })
})
```

`termGlosses` 배열은 두 `it`이 함께 쓰므로 `describe` 블록 안, 두 `it` **앞에** 둔다.

## 검증 절차

아래를 그대로 실행하고 출력을 step 출력에 붙여라.

```bash
npm run test
npm run lint
npm run build
node scripts/check-structure.mjs
```

```bash
python3 - <<'EOF'
import json, subprocess
old = json.loads(subprocess.check_output(['git', 'show', 'HEAD:src/data/topics.json']))
new = json.load(open('src/data/topics.json'))

def flat(ts):
    return [c for t in ts for c in t['concepts']]

o, n = flat(old), flat(new)
print('개념 수', len(o), '->', len(n), '(기대 182 -> 182)')
print('id 그대로', [c['id'] for c in o] == [c['id'] for c in n], '(기대 True)')
print('name 그대로', [c['name'] for c in o] == [c['name'] for c in n], '(기대 True)')
print('summary 그대로', [c['summary'] for c in o] == [c['summary'] for c in n], '(기대 True)')
print('문단 수 그대로', [len(c['paragraphs']) for c in o] == [len(c['paragraphs']) for c in n], '(기대 True)')

om = {c['id']: c for c in o}
changed = sorted(
    (c['id'], i)
    for c in n
    for i, p in enumerate(c['paragraphs'])
    if om[c['id']]['paragraphs'][i] != p
)
print('바뀐 문단 수', len(changed), '(기대 13)')
for cid, i in changed:
    print('   ', cid, 'paragraphs[%d]' % i)

# 바뀐 문단은 원래 문장을 그대로 품고 한 문장만 늘어야 한다
ok = all(om[cid]['paragraphs'][i] in dict((c['id'], c) for c in n)[cid]['paragraphs'][i] for cid, i in changed)
print('원문 보존', ok, '(기대 True)')
EOF
```

```bash
python3 - <<'EOF'
import json
topics = json.load(open('src/data/topics.json'))
concepts = [c for t in topics for c in t['concepts']]
anchors = ['Multi-Factor Authentication', 'Network File System', 'File Transfer Protocol',
           '키-값', '미리 담아 두었다가', '애플리케이션이 접속할 주소', '실어 나를지 정하는',
           'JSON Web Token', 'Distributed Denial of Service', 'DDoS Response Team',
           'Cross-Site Scripting', 'Common Vulnerabilities', 'SSL의 후속']
for a in anchors:
    hits = [c['id'] for c in concepts if any(a in p for p in c['paragraphs'])]
    print(f'{a:32s} {len(hits)}개 개념 {hits} (기대 1개)')
EOF
```

```bash
grep -c '^      {"id":"' src/data/topics.json   # 182
```

`git diff --stat`이 `src/data/topics.json`과 `src/data/data.test.ts` **두 파일만**
보여야 한다(`phases/` 갱신 제외).

## 완료 조건

- 위 네 명령(`test`·`lint`·`build`·`check-structure`)이 모두 통과한다.
- 검증 스크립트의 모든 줄이 기대값과 일치한다. 특히 **바뀐 문단 수가 정확히 13**이고,
  **id·name·summary·문단 수가 전부 `True`**여야 한다.
- `grep -c`가 182를 출력한다(개념 한 줄 포맷 유지).
- 변경된 파일이 `src/data/topics.json`, `src/data/data.test.ts` 둘뿐이다.
