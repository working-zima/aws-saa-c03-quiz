# Step 1: crossing-checker-wide

## 배경

가로형 도식(ADR-047)은 한 파일 안에 좌표를 두 벌 갖는다. 세로형은 지금처럼 `const nodes = [`·`const paths… = {`이고, 가로형은
`const wideNodes = [`·`const widePaths… = {`다. 경로·노드 교차 검사기는 지금 **파일 전체**에서 `'id': 'M…'` 경로를 긁어 `nodes`와만
대 본다. 이대로 가로형이 들어오면 가로형 경로를 세로형 노드에 대 보는 엉뚱한 검사가 되고, 가로형 노드는 검사하지 않는다.

이 step은 검사기가 **두 짝을 따로** 검사하게 고친다. 아직 어느 도식도 가로형 좌표가 없으므로 실제 도식 결과는 지금과 같아야 한다.

## 읽어야 할 파일

- `docs/ADR.md`의 **ADR-047**
- `docs/UI_GUIDE.md`의 「도식」 중 넘침 검사 문단과 **「넓은 화면의 가로형 (ADR-047)」**
- `phases/38-service-diagrams/tools/check-path-crossings.mjs`: 고칠 파일이다. 머리 주석의 원리(직교 경로, 경계 접촉은 교차 아님,
  디렉터리 인자로 음성 시험)를 유지한다.
- `src/components/diagrams/SnsFanoutDiagram.tsx`: `const nodes`·`const paths` 블록의 실제 모양
- `phases/60-wide-diagrams/index.json`의 step 0 `summary`

## 작업

### 블록 단위로 읽는다

- 세로형 짝: `const nodes = [` … 줄머리 `]` 블록의 노드, `const paths` … `= {` … 줄머리 `}` 블록 **안의** 경로.
- 가로형 짝: `const wideNodes = [` 블록의 노드, `const widePaths` … `= {` 블록 안의 경로.
- 노드 줄 형식과 경로 줄 형식은 지금 정규식 그대로다(`{ id: '…'`… `x: N, y: N, width: N`, `'id': 'M…'`). 노드 높이는 지금처럼 32로 본다.
- **경로를 파일 전체에서 긁지 마라.** 세로형 경로는 세로형 노드에만, 가로형 경로는 가로형 노드에만 대 본다.
- 블록이 없는 짝은 빈 목록이다. `wideNodes`만 있고 `widePaths`가 없는 파일(경로 없는 도식)도 노드 겹침은 검사한다.
- 짝마다 지금과 같은 두 검사를 한다 — 노드끼리 겹침, 경로 선분의 노드 내부 통과.

지금 저장소의 23개 도식은 모두 경로를 `const paths` 블록 하나에 두므로, 블록 단위로 읽어도 세로형 경로 수는 177개로 같다.
설계 때 확인한 값이다. 달라지면 정규식이 블록을 잘못 자른 것이다.

### 출력

- 위반 줄 앞에 배치를 밝힌다. 형식: `` `${file} [세로]: …` ``, `` `${file} [가로]: …` ``. 뒤의 문구는 지금과 같다.
- 통과 줄은 정확히 이 형식이다.

```text
✓ 교차 없음 — 세로 노드 {N}개·경로 {M}개, 가로 노드 {N}개·경로 {M}개를 검사했고 상자 내부를 지나는 선분이 없다
```

- 위반이 있으면 지금처럼 `✗ 경로·노드 교차 {n}건`과 목록을 stderr로 내고 exit 1이다.
- 머리 주석에 가로형 짝(ADR-047)을 한두 줄로 더한다.

## Acceptance Criteria

```bash
npm run build
npm run lint
npm test
node scripts/check-structure.mjs
node phases/38-service-diagrams/tools/check-path-crossings.mjs | grep -F '세로 노드 208개·경로 177개, 가로 노드 0개·경로 0개'
```

음성 시험 — 아래를 그대로 실행한다. 마지막 줄이 `negative ok`여야 한다.

```bash
CHECK=phases/38-service-diagrams/tools/check-path-crossings.mjs
T=$(mktemp -d); mkdir "$T/a" "$T/b" "$T/c"
# a: 가로형 경로가 가로형 노드 c를 뚫는다 → 실패해야 하고, 위반 줄이 [가로]다
cat > "$T/a/FixtureADiagram.tsx" <<'TSX'
const nodes = [
  { id: 'a', x: 0, y: 0, width: 40 },
  { id: 'b', x: 0, y: 100, width: 40 },
]
const paths: Record<string, string> = {
  'a-b': 'M20 32 V100',
}
const wideNodes = [
  { id: 'a', x: 0, y: 0, width: 40 },
  { id: 'b', x: 100, y: 0, width: 40 },
  { id: 'c', x: 50, y: 0, width: 20 },
]
const widePaths: Record<string, string> = {
  'a-b': 'M40 16 H100',
}
TSX
# b: 가로형 경로가 세로형 노드 c의 자리를 지나지만 가로형에는 거기 노드가 없다 → 통과해야 한다
cat > "$T/b/FixtureBDiagram.tsx" <<'TSX'
const nodes = [
  { id: 'a', x: 0, y: 0, width: 40 },
  { id: 'b', x: 100, y: 0, width: 40 },
  { id: 'c', x: 0, y: 100, width: 40 },
]
const paths: Record<string, string> = {
  'a-b': 'M40 16 H100',
}
const wideNodes = [
  { id: 'a', x: 0, y: 0, width: 40 },
  { id: 'b', x: 0, y: 200, width: 40 },
  { id: 'c', x: 200, y: 0, width: 40 },
]
const widePaths: Record<string, string> = {
  'a-b': 'M20 32 V200',
}
TSX
# c: 세로형 경로가 세로형 노드 c를 뚫는다 → 실패해야 하고, 위반 줄이 [세로]다
cat > "$T/c/FixtureCDiagram.tsx" <<'TSX'
const nodes = [
  { id: 'a', x: 0, y: 0, width: 40 },
  { id: 'b', x: 100, y: 0, width: 40 },
  { id: 'c', x: 50, y: 0, width: 20 },
]
const paths: Record<string, string> = {
  'a-b': 'M40 16 H100',
}
TSX
node "$CHECK" "$T/a" > "$T/a.out" 2>&1 && echo "a should fail" && exit 1
grep -F '[가로]' "$T/a.out" | grep -F "'c'" > /dev/null || { echo "a: [가로] 위반 줄 없음"; cat "$T/a.out"; exit 1; }
node "$CHECK" "$T/b" || { echo "b should pass"; exit 1; }
node "$CHECK" "$T/c" > "$T/c.out" 2>&1 && echo "c should fail" && exit 1
grep -F '[세로]' "$T/c.out" > /dev/null || { echo "c: [세로] 위반 줄 없음"; cat "$T/c.out"; exit 1; }
echo "negative ok"
```

**음성 시험의 픽스처를 저장소에 커밋하지 마라.** 임시 디렉터리에만 만든다.

## 검증 절차

1. AC를 실행한다. 음성 시험은 고치기 **전**의 검사기로도 한 번 돌려, b가 실패하는 것(지금 검사기가 가로형 경로를 세로형 노드에 대 보는 것)을
   확인한 뒤 고친다.
2. 다음을 확인한다.
   - 바뀐 파일이 `check-path-crossings.mjs` 하나와 `phases/60-wide-diagrams/index.json`뿐인가.
   - 실제 도식에 대한 결과가 세로 노드 208개·경로 177개인가.
3. `phases/60-wide-diagrams/index.json`의 step 1을 갱신한다.
   - 성공 → `"summary"`에 바꾼 읽기 방식, 통과 줄 원문, 음성 시험 a·b·c 결과(고치기 전 b가 실패했는지 포함)를 적는다.
   - 3회 실패 → `"status": "error"`.

## 금지사항

- **노드 높이 32, 경계 접촉은 교차가 아니라는 판정, 직교 경로만 읽는 방식을 바꾸지 마라.** 이유: phase 38 이후 177개 경로가 이 판정으로
  통과했다. 판정을 느슨하게 하면 지난 도식의 검사가 함께 느슨해진다.
- **도식 컴포넌트를 고치지 마라.** 이유: 가로형 좌표는 step 2~4가 넣는다.
- **검사기를 다른 위치로 옮기거나 이름을 바꾸지 마라.** 이유: UI_GUIDE와 지난 phase의 step 문서가 이 경로를 가리킨다.
- 기존 테스트를 깨뜨리지 마라.
