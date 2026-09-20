# Step 3: edge-to-origin

## 배경

`cloudfront-global-accelerator` 주제의 개념 24개는 "요청을 사용자 가까이에서 받는다"는
한 가지 생각의 여러 갈래다. 그런데 **어디서 받아 어디로 넘기는지**가 갈래마다 달라서,
엣지·리전·오리진이라는 세 층을 세워 두지 않으면 CloudFront와 Global Accelerator가
같은 서비스처럼 읽힌다.

step 1·2가 세운 규약을 그대로 따른다. **규약을 다시 정하지 마라.**

## 읽어야 할 파일

- `phases/38-service-diagrams/step0.md`, `step1.md` — 규약과 금지사항.
- `src/components/diagrams/VpcPathsDiagram.tsx`, `HybridPathsDiagram.tsx` — 먼저 그려진 둘.
- `src/components/diagrams/DiagramFrame.tsx`, `src/lib/svg-bounds.ts`.
- `src/data/topics.json`의 `cloudfront-global-accelerator` 개념들.

## 자리

- 컴포넌트: `src/components/diagrams/EdgeToOriginDiagram.tsx`
- 매핑: `registry.ts`에 `'cloudfront-global-accelerator.global-accelerator-vs-dns-failover': EdgeToOriginDiagram`

앵커가 `global-accelerator-vs-dns-failover`인 이유: 주제의 끝쪽이라 CloudFront와
Global Accelerator를 모두 읽은 자리이고, 그 개념 자체가 "무엇이 어디서 바뀌는가"를 다뤄
층 그림이 가장 필요한 지점이다.

## 도식 내용

### 층 (위에서 아래로)

1. `뷰어` — 맨 위 바깥.
2. `엣지 로케이션` 그룹 — 그 안에 CloudFront 배포와 Global Accelerator 고정 IP.
3. `리전 A` 그룹, `리전 B` 그룹 — **세로로 쌓는다.** 280 폭에 나란히 두지 마라.
4. 리전 밖 오리진 — 온프레미스 API.

`Route 53`은 엣지 층 옆에 두되 **경로의 한 칸으로 그린다.** 시나리오에 따라
경로에 들어가기도 하고 빠지기도 하는 것이 이 도식의 한 수다.

### 노드

| id | 라벨 | 자리 | 색 |
|---|---|---|---|
| `viewer` | 뷰어 | 맨 위 | 무채색 |
| `route53` | Route 53 | 엣지 층 옆 | 무채색 |
| `cf` | CloudFront 배포 | 엣지 로케이션 | `diagram-managed` |
| `ga` | Global Accelerator 고정 IP | 엣지 로케이션 | `diagram-managed` |
| `alb` | ALB | 리전 A | `diagram-resource` |
| `ec2` | EC2 | 리전 A | `diagram-resource` |
| `s3` | S3 버킷 | 리전 A | `diagram-managed` |
| `nlba` | NLB (리전 A) | 리전 A | `diagram-resource` |
| `nlbb` | NLB (리전 B) | 리전 B | `diagram-resource` |
| `onpremapi` | 온프레미스 API | 리전 밖 | 무채색 |

`s3`가 리전 A 안이되 **`diagram-managed`** 색인 것은 step 1과 같은 규칙이다 —
S3는 VPC 안에 만드는 자원이 아니다(`vpc-networking.s3-is-regional`).

### 시나리오 여섯

`caption`은 아래 개념 본문의 사실에서 **직접 써라.** 본문 문장을 옮기지 마라.
접두사는 모두 `cloudfront-global-accelerator.`다.

| id | label | 경로 | 근거 개념 id |
|---|---|---|---|
| `s1` | 엣지 캐시 적중 | viewer → cf (**여기서 끝난다**) | `cloudfront`, `cloudfront-ttl`, `edge-keyword` |
| `s2` | ALB 오리진 | viewer → cf → alb → ec2 | `cloudfront-alb-origin` |
| `s3` | S3 오리진 | viewer → cf → s3 | `cloudfront-s3-upload-with-oac` |
| `s4` | 온프레미스 오리진 | viewer → cf → onpremapi | `cloudfront-onprem-origin` |
| `s5` | Global Accelerator | viewer → ga → nlba | `global-accelerator`, `global-accelerator-static-ip`, `global-accelerator-endpoints` |
| `s6` | 리전 장애 조치 | viewer → ga → nlbb (**`route53`은 경로에 없다**) | `global-accelerator-vs-dns-failover` |

`s1`이 이 도식의 첫 수다 — **오리진까지 가지 않고 엣지에서 끝나는 경로**를 보여야
나머지 다섯의 "오리진으로 넘어간다"가 대비로 읽힌다.

`s6`의 캡션에는 **클라이언트가 보는 주소가 변하지 않아 DNS 캐시 만료를 기다리지 않는다**는
사실을 담아라. `s5`와 `s6`은 경로 모양이 거의 같고 캡션과 도착 리전만 다르다 — 그것이 요점이다.

## 강조 방식

step 1과 같다.

## 테스트

`src/components/diagrams/EdgeToOriginDiagram.test.tsx`를 먼저 쓴다.

1. 시나리오를 고르지 않으면 흐려진 노드가 없고 보이는 경로도 없다.
2. `엣지 캐시 적중`을 고르면 `alb`·`ec2`·`s3`·`onpremapi`가 모두 흐려진다.
3. `리전 장애 조치`를 고르면 `route53`이 **흐려지고** `nlbb`가 선명하다.
4. `Global Accelerator`와 `리전 장애 조치`가 **서로 다른 캡션**을 낸다.
5. 경계: 모든 `rect`가 `boxesOutsideViewBox(boxes, [0, 0, 280, 높이])`에서 빈 배열.
6. 글자 넘침: 모든 노드에서 `estimateTextWidth(라벨, 10) + 12 <= 노드 폭`.
7. `viewBox` 폭이 `280`이다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
```

## 금지사항

- **`DiagramFrame.tsx`·`svg-bounds.ts`를 고치지 마라.**
- **`registry.ts`에 두 줄 이상 더하지 마라.**
- **리전 A와 리전 B를 가로로 나란히 두지 마라.** 280 폭에서 무너진다.
- **아래를 이 도식에 넣지 마라**: 서명된 URL·쿠키, 지리적 제한, 필드 수준 암호화,
  가격 등급, Lambda@Edge, CloudFront Functions, WAF. 전부 이 주제의 개념이지만
  **경로가 아니라 경로 위에서 벌어지는 일**이라 한 장에 담으면 도식이 무너진다.
- **없는 사실을 그리지 마라.** 위 표에 근거 개념 id가 없는 노드·경로를 더하지 마라.
- **`src/data/` 아래 JSON을 고치지 마라.**
- **개념 본문 문장을 캡션에 그대로 옮기지 마라.**
- 기존 테스트를 깨뜨리지 마라.
