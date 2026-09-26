# Phase 42 보안 그룹·NACL 시각 요소 검증 보고서

## 1. 한 줄 요약

`security-groups-nacl` 주제에 사용자가 가져온 비교표와 층 그림을 옮겼다. 비교표 7행(O/X 대신 짧은 말, 기본 규칙 행 추가)과,
세 곳을 바로잡은 층 도식이다. 모든 검증 명령이 통과했고 320·390·1280px에서 가로 넘침이 없다. 두 step 모두 codex가 구현했다.

## 2. step별 결과

| step | 이름 | 코드 커밋 | 결과 |
|---|---|---|---|
| 0 | sg-nacl-table | `406b29b` | 주제 JSON과 로더 키, 표 `sg-vs-nacl`, 앵커 registry를 `[경계 도식, 표]` 배열로 |
| 1 | layer-diagram | `16942af` | 노드 6·그룹 4·시나리오 5, `0 0 280 464`, WAF는 요청 경로 밖에서 ALB에 붙음 |

AC는 자기 보고로 끝내지 않고 직접 다시 돌렸고, JSON 문구(표 칸·캡션·곁말)를 읽어 근거 범위를 확인했다.

## 3. 원본 그림에서 바로잡은 것 (ADR-037 phase 42 확장)

- ALB에도 보안 그룹을 그렸고, EC2 보안 그룹의 소스가 ALB 보안 그룹임을 곁말로 적었다.
- ALB는 퍼블릭, EC2는 프라이빗 서브넷에 나눴다. 서브넷마다 NACL이 있다.
- WAF를 요청 화살표 줄 맨 앞에서 빼 ALB 옆에 붙였다. 검사 순서는 데이터에 근거가 없다.
- 인터넷 게이트웨이, "같은 서브넷 통신은 NACL을 안 지난다"는 넣지 않았다.

## 4. 캡션에서 빠진 두 번째 사실

step 문서는 "두 사실이 다 들어가지 않으면 앞의 사실을 남긴다"고 했고, 세 캡션이 뒤 사실을 뺐다.
`waf`(ALB·CloudFront에는 붙고 NLB에는 안 붙는다), `sg-ref`(IP가 바뀌어도 따라간다), `block-ip`(대규모·국가 단위는 WAF).
`waf`의 부착 대상은 도식의 `ALB에 붙음` 곁말이 일부 보인다. 나머지는 개념 본문에 있다.

## 5. 불변 조건

설계 커밋 `c2833e6`과 현재 `HEAD`를 비교했다.

| 조건 | 결과 |
|---|---|
| `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`SgNaclBoundaryDiagram.tsx` 불변 | 변경 없음 |
| `topics.json`·`questions.json` 불변 | 변경 없음 |
| VPC·백업 주제 JSON 불변 | 변경 없음 |
| 기존 테스트 변경 | `SgNaclBoundaryDiagram.test.tsx`의 figure 개수 단언 한 줄뿐(명세가 허용) |

## 6. 검증 명령과 결과

Node `v18.17.1`, phase 완료 상태(`a09fc37`)에서 직접 실행했고 모두 exit 0이다.

| 명령 | 결과 |
|---|---|
| `npm run build` | 통과 |
| `npm run lint` | 경고 0 |
| `npm test` | 52 파일 · 953 테스트 통과 |
| `node scripts/check-structure.mjs` | 구조 이상 없음 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | 노드 146 · 경로 125, 교차 0 |

## 7. 브라우저 실측

[measurements.md](./measurements.md).
