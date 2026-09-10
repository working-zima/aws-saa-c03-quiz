# Step 11: notation-report

앞선 step 0~10이 표기 통일을 끝냈다. 이 step은 **콘텐츠를 고치지 않는다.**
사용자가 요구한 여섯 항목을 세어 보고하는 것이 전부다.

## 읽어야 할 파일

- `phases/33-notation-standardization/index.json` — step 0~10의 `summary`가 보고서의 원자료다
- `phases/NEXT.md` — 보고서를 여기 맨 앞에 넣는다

## 작업 — 사용자가 요구한 여섯 항목을 그 순서대로

`phases/NEXT.md`의 **맨 앞**에 「phase 33 결과 보고」 절로 넣어라.

### 1. 항목별 실제 수정 건수

표기 짝마다 몇 곳을 바꿨는지. **자기 보고가 아니라 실측으로 낸다.**

```bash
node scripts/notation-diff.mjs 7f46259 --list
```

이 도구가 찍는 「표준이 아닌 표기가 남은 자리」 표를 착수 시점 값과 나란히 놓아라.
착수 시점 값은 아래다(occurrence 기준).

| 표기 | 착수 |
|---|---|
| 토픽 / 주제 | 61 / 25 |
| FIFO 대기열 / FIFO 큐 | 4 / 14 |
| 네트워크 접근 제어 목록 / 네트워크 ACL | 9 / 21 |
| 권한 세트 / Permission Set | 14 / 8 |
| 액세스 키 / Access Key | 30 / 14 |
| AWS IAM Identity Center / IAM Identity Center / Identity Center | 0 / 7 / 25 |
| 가상 프라이빗 게이트웨이 / Virtual Private Gateway | 13 / 2 |
| 프라이머리 노드 / 주 노드 | 9 / 14 |
| Performance Insights / Performance Insight | 6 / 14 |
| 전용 하드웨어 보안 모듈 / 전용 하드웨어 모듈 | 8 / 10 |
| 음성 / 말소리 | 5 / 3 |
| 퍼블릭 IP / 퍼블릭 주소 | 3 / 2 |
| IP 세트 / IP Set | 19 / 3 |
| 결제 콘솔 / 결제 대시보드 | 5 / 2 |
| 기본 부하 / 기준이 되는 부하 | 4 / 2 |

### 2. `paragraphs`/`explanation`을 포함한 필드별 변경 건수

`notation-diff.mjs`가 찍는 필드별 표를 그대로 옮긴다. **이번 phase는 그 두 필드를 열었으므로
거기서 몇 건이 바뀌었는지가 사용자가 특히 보려는 숫자다.**

### 3. 정답 보기 변경 문항 목록

`notation-diff.mjs`가 「정답 보기의 글자가 바뀐 문항」으로 찍는다. **문항마다 보기 넷을
함께 봤는지, 표기가 넷 사이에서 갈리지 않는지**를 각 step `summary`에서 모아 적어라.

### 4. `answerIndex`·id·문항 순서·수치·조건이 그대로인지

`notation-diff.mjs`가 exit 0이면 앞의 셋은 기계로 확인된 것이다. **수치와 조건은 그보다
강하게 보장된다** — 바뀐 것이 전부 표기 치환으로 설명된다는 뜻이므로 숫자가 든 자리는
애초에 바뀔 수 없다. 그 논리를 보고서에 적어라.

### 5. 테스트·build·lint·구조 검증 결과

`npm test` 개수, `npm run build`, `npm run lint`, `check-structure`, `coverage`,
`check-verbatim`의 결과를 표로.

### 6. 표기 통일 후에도 두 표기가 남은 경우와 그 이유

**이것이 가장 중요한 절이다.** 남은 것은 실패가 아니라 판정이다. 아래를 구분해서 적어라.

- **다른 대상을 가리켜 남긴 것** — ElastiCache의 `주 노드`, `q210`의 `퍼블릭 IPv4`,
  `SELECT INTO OUTFILE S3` 같은 자리
- **약칭이라 남긴 것** — `NACL`, `VIF`, `OU`
- **사용자가 통일하지 말라고 정한 것** — `네트워크 ACL` 전면 통일을 하지 않기로 한 결정
- **그 밖에 판단으로 남긴 것** — 이유를 한 줄씩

## Acceptance Criteria

```bash
npm test
npm run build
npm run lint
node scripts/check-structure.mjs
node scripts/notation-diff.mjs 7f46259       # exit 0
node scripts/coverage.mjs
node scripts/check-verbatim.mjs
node scripts/content-audit.mjs             # 착수 대비 늘어난 지표가 없어야 한다
```

## 금지사항

- **콘텐츠를 고치지 마라.** 이유: 이 step은 보고만 맡는다. 눈에 걸리는 것이 있으면 6절에 적어라.
- **`docs/ADR.md`에 ADR을 쓰지 마라.** 이유: 표기 표준을 ADR로 굳힐지는 사용자가 판단한다.
- 기존 테스트를 깨뜨리지 마라.
