# Step 2: endpoint-path-diagram

## 배경

전 세계에 흩어진 사용자가 API를 부를 때 지연을 줄이는 방법이 이 주제의 개념 둘에 있다.

- `api-gateway-endpoint-types`: **엣지 최적화 엔드포인트**로 배포한 API는 요청이 CloudFront의 엣지를 거쳐 들어와 멀리 있는 사용자의 지연이 준다.
  **리전 엔드포인트**는 그 리전으로 직접 받으므로 그 지연이 그대로 남는다. **API Gateway 캐싱**을 켜면 같은 응답을 백엔드까지 가지 않고 돌려준다.
- `api-gateway-behind-cloudfront`: CloudFront 배포 하나에 S3 버킷과 HTTP API를 **둘 다 오리진으로** 두면 정적 파일과 동적 응답이 모두 엣지를
  거쳐 나간다. 버킷 주소를 그대로 나눠 주고 API를 따로 두면 어느 쪽에도 엣지가 없다.

문항 q536·q537·q538은 이 선택지들을 서로의 오답으로 낸다. 이 step은 요청이 지나는 자리를 `엣지`와 `리전` 두 박스로 나눠 그리고, 시나리오 버튼으로
경로를 바꿔 본다. 사용자 결정(2026-10-15)은 `docs/ADR.md` ADR-037 끝의 「2026-10-15 확장 — API Gateway·Step Functions 주제(phase 59)」와
ADR-038 끝 문단에 있다. **물음형 제목을 단다**(ADR-038). 늘 보이는 예시 곁말은 없다.

**앵커는 `api-gateway-step-functions.api-gateway-behind-cloudfront`다.** 경로를 다루는 두 개념을 다 읽은 자리다. 이 개념에는 기존 도식이
없으므로 registry 값은 컴포넌트 하나다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-009, ADR-036, ADR-037**(확장 문단 모두, 특히 끝의 phase 59), **ADR-038**(끝 문단 포함)
- `docs/UI_GUIDE.md`의 **「도식 전용 색상」, 「도식」 절 전체**
- `phases/59-apigw-sfn-visuals/index.json`의 step 0·1 `summary`
- `src/types/visuals.ts`, `src/data/index.ts`
- `src/data/visuals/api-gateway-step-functions.json`: 여기에 `diagrams["endpoint-path"]`를 더한다. **표 둘과 `integration` 도식은 고치지 마라.**
- `src/components/diagrams/ApiIntegrationDiagram.tsx`와 그 테스트: step 1이 만든 같은 주제의 도식이다. **구조와 테스트 방식을 맞춰라.** 이 파일은 고치지 마라.
- `src/components/diagrams/EdgeToOriginDiagram.tsx`: CloudFront 주제의 엣지 도식이다. 이 도식과 겹치지 않게 범위를 API로 한정한다. 고치지 마라.
- `src/components/diagrams/DiagramFrame.tsx`: **고치지 마라.**
- `src/components/diagrams/registry.ts`
- `src/lib/svg-bounds.ts`
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 노드 블록·경로 형식과 노드 높이 32를 지켜라.
- `src/data/topics.json`의 `api-gateway-step-functions` 주제 전부

## 작업

### 자리

- 컴포넌트: `src/components/diagrams/ApiEndpointPathDiagram.tsx`
- 문구: JSON `diagrams["endpoint-path"]`
- 매핑: `registry.ts`에 `'api-gateway-step-functions.api-gateway-behind-cloudfront': ApiEndpointPathDiagram` 한 줄을 더한다. import는 기존 정렬
  방식을 따르고, 키는 이 주제의 줄들 뒤에 둔다.

### 모양

맨 위에 사용자, 가운데에 `엣지` 박스(안에 CloudFront), 아래에 `리전` 박스(안에 S3 버킷·API Gateway·Lambda 함수)를 둔다.

```
            [전 세계 사용자]
┌ 엣지 ──────────────────────────────┐
│           [CloudFront]              │
└────────────────────────────────────┘
┌ 리전 ──────────────────────────────┐
│ [S3 버킷]           [API Gateway]   │
│                     [Lambda 함수]   │
└────────────────────────────────────┘
```

리전 엔드포인트로 직접 들어오는 화살표는 엣지 박스를 피해 **오른쪽 바깥 통로(x 270)**로 내려가 API Gateway의 오른쪽 변으로 들어간다.

아래 좌표는 경계·라벨 폭·교차를 미리 맞춰 본 **출발점**이다. 테스트나 교차 검사가 실패할 때만 고치고, 고쳤다면 summary에 적는다.
`viewBox`는 `0 0 280 276`이다.

**그룹 박스**(`const groups`, 흐려지지 않는다, 라벨은 크기 9·`fill-muted`, 박스 왼쪽 위 안쪽):

| id | 라벨 | x, y, 폭, 높이 |
|---|---|---|
| `edge` | 엣지 | 4, 56, 272, 64 |
| `region` | 리전 | 4, 136, 272, 132 |

**노드**(`const nodes = [...]`, 높이 32, 라벨 크기 10):

| id | 라벨 | 색 | x, y, 폭 |
|---|---|---|---|
| `user` | 전 세계 사용자 | `stroke-disabled` | 82, 8, 116 |
| `cloudfront` | CloudFront | `stroke-diagram-managed` | 82, 80, 116 |
| `s3` | S3 버킷 | `stroke-diagram-managed` | 20, 168, 108 |
| `api` | API Gateway | `stroke-diagram-managed` | 152, 168, 108 |
| `lambda` | Lambda 함수 | `stroke-diagram-managed` | 152, 224, 108 |

**경로**(`paths` 맵, 직교 M/H/V만, 화살표는 기존 도식과 같은 마커):

| id | 뜻 | `d` |
|---|---|---|
| `user-cloudfront` | 요청이 엣지로 들어온다 | `M140 40 V80` |
| `cloudfront-api` | 엣지가 API로 넘긴다 | `M180 112 V168` |
| `cloudfront-s3` | 엣지가 버킷으로 넘긴다 | `M100 112 V168` |
| `user-api` | 요청이 리전의 API로 직접 간다 | `M198 24 H270 V184 H260` |
| `api-lambda` | API가 백엔드 함수로 넘긴다 | `M206 200 V224` |

**곁말**(`notes`, 크기 9, `fill-muted`). 시나리오에 따라 보이고 숨는다. `전체`에서는 모두 숨는다.

| id | 문구 | 자리(x, y, `textAnchor`) | 보이는 시나리오 |
|---|---|---|---|
| `via-edge` | 엣지를 거쳐 들어옴 | 262, 70, `end` (엣지 그룹 라벨 줄의 오른쪽) | `edge` |
| `latency-remains` | 멀리서는 지연이 그대로 | 262, 150, `end` (리전 그룹 라벨 줄의 오른쪽, 오른쪽 통로 왼쪽) | `regional` |
| `from-cache` | 캐시에서 응답 | 206, 215, `middle` (API Gateway와 Lambda 함수 사이) | `cache` |
| `static` | 정적 파일 | 74, 215, `middle` (S3 버킷 아래) | `cdn-origins` |
| `dynamic` | 동적 응답 | 206, 215, `middle` (API Gateway 아래) | `cdn-origins` |

### 시나리오 넷

| id | label | 선명한 노드 | 보이는 경로 | 곁말 | 캡션 | `sources` |
|---|---|---|---|---|---|---|
| `edge` | 엣지 최적화 | `user`, `cloudfront`, `api`, `lambda` | `user-cloudfront`, `cloudfront-api`, `api-lambda` | `via-edge` | 엣지 최적화 엔드포인트는 요청을 CloudFront 엣지로 받아, 전 세계 사용자의 지연을 줄인다. | `api-gateway-step-functions.api-gateway-endpoint-types` |
| `regional` | 리전 | `user`, `api`, `lambda` | `user-api`, `api-lambda` | `latency-remains` | 리전 엔드포인트는 그 리전으로 직접 받는다. 멀리 있는 사용자의 지연이 그대로 남는다. | `api-gateway-step-functions.api-gateway-endpoint-types` |
| `cache` | API 캐싱 | `user`, `api` | `user-api` | `from-cache` | 캐싱을 켜면 같은 응답을 백엔드까지 가지 않고 API Gateway가 바로 돌려준다. | `api-gateway-step-functions.api-gateway-endpoint-types` |
| `cdn-origins` | CloudFront 오리진 | `user`, `cloudfront`, `s3`, `api` | `user-cloudfront`, `cloudfront-s3`, `cloudfront-api` | `static`, `dynamic` | 배포 하나에 S3 버킷과 HTTP API를 오리진으로 두면 정적·동적 응답이 다 엣지를 거친다. | `api-gateway-step-functions.api-gateway-behind-cloudfront` |

- 캡션은 위 문구를 **그대로** 쓴다. 이미 원문을 옮기지 않고 새로 쓴 것이며(ADR-009), 기존 도식 캡션의 길이 범위(최대 57자) 안이다.
- `question`: `전 세계 사용자의 요청은 어디를 거쳐 갈까?`
- `idleCaption`: `설정을 고르면 요청이 어디를 거쳐 응답을 받는지 볼 수 있다.`
- `legend`: `파랑: AWS 서비스 · 회색: 사용자. 위 박스는 CloudFront의 엣지, 아래 박스는 API가 배포된 리전이다.`
- `label`: `API 엔드포인트 경로 도식`, `svgLabel`: `엣지 최적화·리전 엔드포인트와 CloudFront 오리진`
- 도식의 `sources`: `api-gateway-step-functions.api-gateway`, `api-gateway-step-functions.api-gateway-endpoint-types`,
  `api-gateway-step-functions.api-gateway-behind-cloudfront`

### 테스트: `ApiEndpointPathDiagram.test.tsx`

**테스트를 먼저 쓰고, 실패하는 것을 확인한 뒤** 구현한다.

1. 물음형 제목이 시나리오 버튼보다 앞에 보인다(헤딩이 아니다).
2. 처음(`전체`)에는 노드 다섯이 모두 선명하고, 경로와 곁말이 없다.
3. 시나리오마다 선명한 노드 집합, 보이는 경로, 보이는 곁말이 위 표와 같다.
4. 시나리오마다 선명한 노드 밖의 노드는 opacity가 `0.25`다. 특히 `regional`·`cache`에서 `cloudfront`가, `cache`에서 `lambda`가 `0.25`다.
   그룹 박스 둘은 어느 시나리오에서도 흐려지지 않는다.
5. `user-api`는 `regional`·`cache`에서만, `cloudfront-s3`는 `cdn-origins`에서만 보인다.
6. 관문 5(`boxesOutsideViewBox`로 모든 `rect`가 `viewBox` 안), 관문 6(`estimateTextWidth(라벨, 10) + 12 <= 노드 폭`),
   관문 7(폭 280)을 통과한다. 곁말 다섯과 그룹 라벨 둘은 `estimateTextWidth(문구, 9)`로 잰 가로 범위(`textAnchor`를 반영)가 `0..280` 안이다.
7. JSON의 시나리오 id 집합과 컴포넌트의 시나리오 id 집합이 같다.
8. `ConceptList`에 `api-gateway-step-functions.api-gateway-behind-cloudfront` 개념을 주면 본문 뒤에 이 도식이 온다.
9. 두 번 렌더해도 화살표 마커 id가 겹치지 않는다(`useId`).

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs
```

**검사기를 고쳐서 통과시키지 마라.** 경로가 노드 상자를 뚫으면 통로를 옮긴다.

## 검증 절차

1. AC를 실행한다.
2. 다음을 확인한다.
   - 캡션·곁말·범례에 위 표 밖의 사실이 없는가.
   - 이모지·O/X·빨강·애니메이션이 없는가.
   - `DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ApiIntegrationDiagram.tsx`·`EdgeToOriginDiagram.tsx`·`topics.json`·`questions.json`과 JSON의
     표 둘·`integration` 도식이 그대로인가.
3. `phases/59-apigw-sfn-visuals/index.json`의 step 2를 갱신한다.
   - 성공 → `"summary"`에 최종 `viewBox`, 출발점 좌표에서 바꾼 것(없으면 없다고), 교차 검사 결과(노드·경로 수), 새 테스트 수와 전체
     테스트 수를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **엣지 최적화가 쓰는 CloudFront 배포를 누가 관리하는지, 캐시 유지 시간(TTL), 엣지 로케이션 수, 리전 이름을 쓰지 마라.** 이유: 데이터에 없다.
  리전은 `리전`으로만 부른다(ADR-038 「예시의 경계」).
- **콘텐츠 인코딩·예약된 동시성 시나리오를 더하지 마라.** 이유: 둘 다 요청이 들어오는 경로를 바꾸지 않아 이 도식에 그릴 것이 없다(ADR-037 phase 59).
- **프라이빗 엔드포인트·VPC를 그리지 마라.** 이유: 이 도식의 근거 개념은 엣지 최적화·리전 엔드포인트와 CloudFront 오리진이다.
- **캐싱 시나리오에 "지연이 줄지 않는다" 같은 비교를 쓰지 마라.** 이유: 본문은 캐싱이 백엔드 왕복을 없앤다는 것만 말한다.
- **청록(`diagram-resource`)을 쓰지 마라.** 이유: 이 도식에는 VPC 안 자원이 없다.
- **흐르는 점·자동 재생 같은 애니메이션을 넣지 마라.** 이유: UI_GUIDE 「애니메이션」.
- **`DiagramFrame.tsx`·`ComparisonTableFigure.tsx`·`ApiIntegrationDiagram.tsx`·`EdgeToOriginDiagram.tsx`·`topics.json`·`questions.json`·JSON의
  표 둘·`integration` 도식을 고치지 마라.**
- 기존 테스트를 깨뜨리지 마라.
