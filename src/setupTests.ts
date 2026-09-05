import '@testing-library/jest-dom'

// jsdom은 scrollIntoView를 구현하지 않는다. 스크롤을 검사하는 테스트가
// vi.spyOn을 걸 자리가 없으면 "scrollIntoView does not exist"로 죽는다.
// setupFiles는 모든 환경에서 도는데 src/lib은 `@vitest-environment node`라
// Element가 없다. DOM이 있을 때만 건다.
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {}
}
