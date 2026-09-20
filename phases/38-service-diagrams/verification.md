# Phase 38 도식 검증 보고서

## 1. 한 줄 요약

도식 다섯의 좌표·라벨 관문과 AC 여섯 명령이 Node 18.17.1에서 통과했다. 문항 732개·개념 618개·커버리지 100%를 유지하며, ADR-036과 지정 문서에 도식 내부의 두 색 예외를 기록했다.

## 2. 도식 목록과 측정 근거

2026-09-21에 현재 `registry.ts`를 Vite의 `ssrLoadModule`로 읽고, 각 컴포넌트를 `renderToStaticMarkup`으로 렌더한 뒤 jsdom에서 SVG 속성·노드·버튼을 읽었다. 이는 **렌더된 마크업의 좌표 검사이며 브라우저 표시 크기를 새로 잰 것이 아니다.**

**앵커 개념 id·노드 수·시나리오 수·최종 `viewBox`는 [measurements.md의 「도식별」 표](measurements.md#도식별)를 단일 목록으로 삼는다.** 다섯 장 모두 현재 렌더 결과와 그 표가 일치한다. 같은 표를 이 보고서에 복제하지 않고, 컴포넌트 파일을 그 행에 대응시킨다.

| 실측표의 도식 | 컴포넌트 파일 |
|---|---|
| VPC 통신 경로 | [VpcPathsDiagram.tsx](../../src/components/diagrams/VpcPathsDiagram.tsx) |
| 온프레미스 연결 경로 | [HybridPathsDiagram.tsx](../../src/components/diagrams/HybridPathsDiagram.tsx) |
| 엣지에서 오리진까지 | [EdgeToOriginDiagram.tsx](../../src/components/diagrams/EdgeToOriginDiagram.tsx) |
| S3 스토리지 클래스 분류 | [S3ClassMapDiagram.tsx](../../src/components/diagrams/S3ClassMapDiagram.tsx) |
| 보안 그룹과 네트워크 ACL 경계 | [SgNaclBoundaryDiagram.tsx](../../src/components/diagrams/SgNaclBoundaryDiagram.tsx) |

시나리오 수는 `전체` 버튼을 제외한 수다. S3는 버튼 자체가 없다. 앵커는 [registry.ts](../../src/components/diagrams/registry.ts)에서 읽었고, 각 도식의 기존 테스트도 `ConceptList`에서 해당 개념 본문 뒤에만 도식이 나오는지 확인한다.

브라우저 표시 폭·배율·표시 글자 크기·가로 넘침·버튼 높이는 [measurements.md](measurements.md)의 2026-09-20 기록만 사용했다. `index.json`의 step 0~5·7 요약은 당시 작업 기록이고, 거기에 남은 브라우저 미측정 문구를 현재도 미측정이라는 뜻으로 옮기지 않았다. UI_GUIDE에는 step 7 보정 뒤 수치를 반영했다.

## 3. 좌표·라벨 관문 검사

`boxesOutsideViewBox`에 노드와 그룹의 모든 `rect`를 넘겼다. 라벨 넘침은 각 노드에서 `estimateTextWidth(라벨, 10) + 12 > 노드 폭`인 경우를 센 것이다. 기존 도식 테스트와 별도의 마크업 실측에서 같은 결과를 얻었다.

| 컴포넌트 | 검사한 rect 수 | boxesOutsideViewBox 결과 | 라벨 넘침 | viewBox 폭 |
|---|---:|---|---:|---:|
| VpcPathsDiagram | 19 | `[]` | 0 | 280 |
| HybridPathsDiagram | 15 | `[]` | 0 | 280 |
| EdgeToOriginDiagram | 13 | `[]` | 0 | 280 |
| S3ClassMapDiagram | 13 | `[]` | 0 | 280 |
| SgNaclBoundaryDiagram | 10 | `[]` | 0 | 280 |

가장 긴 라벨은 글자 수가 아니라 **`estimateTextWidth(라벨, 10)`가 가장 큰 노드 라벨**이다. 아래 폭은 viewBox 단위의 어림값이지 실제 글꼴의 픽셀 폭이 아니다.

| 컴포넌트 | 가장 긴 노드 라벨 | estimateTextWidth(라벨, 10) | 노드 폭 |
|---|---|---:|---:|
| VpcPathsDiagram | S3 게이트웨이 엔드포인트 | 122 | 232 |
| HybridPathsDiagram | 가상 프라이빗 게이트웨이 (VPC A) / 가상 프라이빗 게이트웨이 (VPC B) | 각각 165 | 각각 232 |
| EdgeToOriginDiagram | Global Accelerator 고정 IP | 141 | 172 |
| S3ClassMapDiagram | S3 Glacier Flexible Retrieval | 159.5 | 240 |
| SgNaclBoundaryDiagram | 보안 그룹 아웃바운드 | 101 | 128 |

실제 실행한 읽기 전용 명령의 핵심은 다음과 같다. 의존성 설치나 소스 파일 생성 없이 현재 컴포넌트와 검사 함수를 그대로 사용한다.

```bash
node --input-type=module <<'NODE'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import assert from 'node:assert/strict'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { diagramsByConceptId } = await server.ssrLoadModule('/src/components/diagrams/registry.ts')
  const { boxesOutsideViewBox, estimateTextWidth } = await server.ssrLoadModule('/src/lib/svg-bounds.ts')
  for (const [anchor, Component] of Object.entries(diagramsByConceptId)) {
    const doc = new JSDOM(renderToStaticMarkup(React.createElement(Component))).window.document
    const svg = doc.querySelector('svg')
    const viewBox = svg.getAttribute('viewBox').split(' ').map(Number)
    const boxes = [...svg.querySelectorAll('rect')].map((r, i) => ({
      id: r.parentElement.getAttribute('data-node') ?? r.getAttribute('data-group') ?? String(i),
      ...Object.fromEntries(['x', 'y', 'width', 'height'].map(a => [a, Number(r.getAttribute(a))])),
    }))
    const labels = [...svg.querySelectorAll('[data-node]')].map(n => ({
      label: n.querySelector('text').textContent,
      estimated: estimateTextWidth(n.querySelector('text').textContent, 10),
      nodeWidth: Number(n.querySelector('rect').getAttribute('width')),
    }))
    const outside = boxesOutsideViewBox(boxes, viewBox)
    const overflow = labels.filter(n => n.estimated + 12 > n.nodeWidth)
    assert.deepEqual(outside, [])
    assert.deepEqual(overflow, [])
    assert.equal(viewBox[2], 280)
    console.log({ component: Component.name, anchor, nodes: labels.length,
      scenarios: Math.max(0, doc.querySelectorAll('button').length - 1), viewBox,
      rects: boxes.length, outside, labelOverflow: overflow.length,
      longest: labels.filter(n => n.estimated === Math.max(...labels.map(x => x.estimated))) })
  }
} finally { await server.close() }
NODE
```

## 4. 데이터 불변 조건

현재 JSON을 직접 읽은 결과는 주제 39개·개념 618개·문항 732개다. `node scripts/coverage.mjs`는 다음을 출력했다.

```text
전체: 개념 618개 중 618개 덮임 (100%) — 남은 개념 0개, 문항 732개
문항이 하나도 없는 주제는 없다
```

`npm test`의 `src/data/data.test.ts`는 **270개 전부 통과**했다. 구조 검사도 개념 id·name·주제 메타데이터·개념 개수와 순서·문항 파일이 기준과 같음을 확인했다.

개수만 같고 내용이 바뀐 경우를 구분하려고 파일 원문 SHA-256도 다시 계산했다. 두 값 모두 [phase 37 검증 보고](../37-question-relink/verification.md#3-불변-조건-실측)에 기록된 값과 같다. `topics.json`은 `relink.json.baseline.topicsSha256`, `questions.json`은 현재 `scripts/topics-baseline.json.questionsSha256`과도 단언으로 대조했다.

| 파일 | 현재 SHA-256 | 대조 |
|---|---|---|
| `src/data/topics.json` | `5a227aea172ca391ee1110d9228f933b9f8e728f8b8bf04e8da952e4def74e7a` | phase 37 종료 값과 일치 |
| `src/data/questions.json` | `6b59d6992fdba56d0f934ced16216476b057557c70df722c48d526586f6d0106` | phase 37 종료 값과 일치 |

## 5. 검증 명령과 결과

실행 환경은 `node --version` → `v18.17.1`, `npm --version` → `10.2.1`이다. 명세의 코드 블록에 적힌 AC는 여섯 명령이며, **여섯 모두 exit 0**이다.

| 명령 | 직접 실행한 결과 |
|---|---|
| `npm run build` | TypeScript 검사·Vite 5.4.21 빌드 성공, `✓ built in 1.42s` |
| `npm run lint` | ESLint 성공, 오류·경고 없음 |
| `npm test` | 33개 파일·647개 테스트 통과 |
| `node scripts/check-structure.mjs` | `✓ 구조 이상 없음 — 개념 id·name, 주제 메타데이터, 개념 개수·순서, 문항 파일 모두 기준과 같다` |
| `node scripts/coverage.mjs` | 618/618(100%), 미커버 개념 0개, 문항 732개 |
| `node phases/38-service-diagrams/tools/check-path-crossings.mjs` | `✓ 교차 없음 — 노드 43개, 경로 42개를 검사했고 상자 내부를 지나는 선분이 없다` |

다섯 도식의 테스트는 VPC 26개·온프레미스 26개·엣지 28개·S3 15개·보안 그룹/NACL 17개가 통과했다. 공통 틀 7개·레지스트리 1개·ConceptList 3개·svg-bounds 12개도 통과했다.

빌드는 minification 뒤 청크가 500 kB를 넘는다는 경고를 출력했다. 테스트는 React Router future flag 안내와 `act(...)` 경고를 출력했지만 실패한 테스트는 없다. 문서 step의 범위 밖이므로 코드는 수정하지 않았다.

### 경로 교차 검사 범위

[검사기](tools/check-path-crossings.mjs)는 소스의 `const nodes` 배열과 정수 좌표 `M/H/V` 경로를 읽어, 높이 32인 노드 상자끼리의 겹침과 경로 선분의 상자 **내부** 통과를 검사한다. 상자 경계 접촉은 연결 지점이므로 교차로 세지 않는다. 현재 파싱 대상은 경로가 있는 네 도식의 노드 43개·경로 42개다.

**S3의 `storageClasses` 배열은 이 검사기가 읽지 않는다.** 경로가 없는 정적 도식이며, 그 여덟 노드의 viewBox·라벨 검사는 위 3절과 단위 테스트가 담당한다. 검사기는 실제 글자·그룹 라벨·화살표 마커·선 두께·선끼리의 겹침이나 경로의 AWS 의미를 검증하지 않는다. 소스 표기와 높이를 가정하므로 다른 배열명·곡선·소수 좌표를 도입하면 검사가 조용히 빠질 수 있다. 브라우저 검수의 대체가 아니다.

## 6. 변경 범위 확인

**작업 규칙 6의 Git 명령 금지에 따라 `git diff --stat`을 실행하지 않았다.** 따라서 Git 기준의 phase 전체 변경 파일·추가/삭제 행 수는 확인하지 못했다. 아래 phase 목록은 step 명세와 현재 파일을 대조한 산출물 목록이며 Git diff 결과라고 주장하지 않는다.

```text
src/components/ConceptList.tsx
src/components/ConceptList.test.tsx
src/components/diagrams/DiagramFrame.tsx
src/components/diagrams/DiagramFrame.test.tsx
src/components/diagrams/registry.ts
src/components/diagrams/registry.test.tsx
src/components/diagrams/VpcPathsDiagram.tsx
src/components/diagrams/VpcPathsDiagram.test.tsx
src/components/diagrams/HybridPathsDiagram.tsx
src/components/diagrams/HybridPathsDiagram.test.tsx
src/components/diagrams/EdgeToOriginDiagram.tsx
src/components/diagrams/EdgeToOriginDiagram.test.tsx
src/components/diagrams/S3ClassMapDiagram.tsx
src/components/diagrams/S3ClassMapDiagram.test.tsx
src/components/diagrams/SgNaclBoundaryDiagram.tsx
src/components/diagrams/SgNaclBoundaryDiagram.test.tsx
src/lib/svg-bounds.ts
src/lib/svg-bounds.test.ts
tailwind.config.js
docs/PRD.md
docs/ADR.md
docs/UI_GUIDE.md
docs/ARCHITECTURE.md
phases/38-service-diagrams/index.json
phases/38-service-diagrams/step0.md
phases/38-service-diagrams/step1.md
phases/38-service-diagrams/step2.md
phases/38-service-diagrams/step3.md
phases/38-service-diagrams/step4.md
phases/38-service-diagrams/step5.md
phases/38-service-diagrams/step6.md
phases/38-service-diagrams/step7.md
phases/38-service-diagrams/measurements.md
phases/38-service-diagrams/tools/check-path-crossings.mjs
phases/38-service-diagrams/verification.md
```

step 6의 변경은 다음 여섯 파일뿐이다.

| 파일 | 변경 |
|---|---|
| `docs/PRD.md` | 「디자인」의 색 규칙 한 줄에 ADR-036 예외 명시 |
| `docs/ADR.md` | ADR-035 다음에 ADR-036 추가 |
| `docs/UI_GUIDE.md` | 「색상」의 예외·토큰 표와 「도식」 절 추가 |
| `docs/ARCHITECTURE.md` | 디렉토리 구조 한 줄·테스트 경계 한 행 추가 |
| `phases/38-service-diagrams/verification.md` | 이 보고서 생성 |
| `phases/38-service-diagrams/index.json` | step 6을 `completed`로 바꾸고 산출물 요약 기록 |

시작 시점에 파일별 SHA-256을 `/tmp/p38-step6-before.json`에 저장하고 종료 전에 다시 계산해 대조했다(`.git`·`node_modules`·`dist`·Python 캐시 제외). `src/`의 73개 파일은 바이트 변경·추가·삭제 모두 0이며, `tailwind.config.js`·`phases/NEXT.md`도 불변이다. 이 대조는 **step 6 중 변경만** 증명하며 phase 시작 전 Git 상태를 복원하지 않는다.

ADR 제목 목록을 `rg '^### ADR-0' docs/ADR.md`로 확인했을 때 추가 전 마지막은 ADR-035였다. PRD·UI_GUIDE의 새 참조는 ADR-036이고, 이전 ADR 본문은 변경하지 않았다. 지정된 자리 밖 문서 본문도 원문 대조로 확인했다.

## 7. 남은 것

사람이 이어서 확인할 시나리오와 실제 글꼴 폭의 한계는 [measurements.md의 「남은 한계」](measurements.md#남은-한계)를 따른다. step 명세가 부른 「아직 눈으로 보지 않은 것」에 해당하는 현재 절 이름이 「남은 한계」다. 기존 기록을 복제하지 않고, 이번 대조에서 발견한 항목만 더한다.

- `measurements.md`에는 시나리오별 **캡션 줄 수** 실측이 없다. 특히 긴 엣지·보안 그룹/NACL 캡션에서 줄바꿈과 시나리오 전환 시 본문 이동을 사람이 확인해야 한다. `min-h-24`는 최소 높이일 뿐 최대 네 줄을 보장하지 않는다. UI_GUIDE에 미측정 줄 수를 적지 않았다.
- 회색으로 바꿔도 계층을 읽을 수 있는지에 대한 별도 시각 검수 기록은 없다. 새 규약의 색 보조 채널 원칙을 사람의 검수로 확인할 필요가 있다.
- 실측 기록의 엣지 도식 설명은 장애 조치에서 「리전 A가 통째로 흐려진다」고 표현하지만, 현재 코드와 테스트에서 **그룹 박스는 그대로이고 그 안 노드만 흐려진다.** UI_GUIDE는 구현과 step 1 규약대로 적었다. 실측 원본은 이 step의 수정 대상이 아니므로 남겼다.
- UI_GUIDE 「디자인 원칙」의 「색이 붙었다는 건 정답/오답/중요도 중 하나」라는 문장은 새 도식 예외를 아직 언급하지 않는다. 이번 허용 범위인 「색상」·「도식」에서 예외를 명시했고, 범위 밖 원칙 문장은 고치지 않았다.
- ARCHITECTURE 「데이터 흐름」은 `concepts-raw.md`를 「커밋됨」이라 적어 ADR-009와 어긋난다. 「헤더」의 라우터 훅 설명과 UI_GUIDE 「검색 화면」의 「개념 위치로 점프하지 않는 대신」도 뒤에 나오는 앵커 이동 계약보다 오래된 표현이다. 지정된 절 밖이므로 수정하지 않았다.
- Git 기준 phase 전체 diff 목록은 하네스나 사람이 확인해야 한다. 이 step에서는 Git 명령·커밋·병합·push를 실행하지 않았다.
