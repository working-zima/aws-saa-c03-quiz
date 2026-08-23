# UI 디자인 가이드

## 디자인 원칙

1. **읽는 앱이다.** 본문 가독성이 다른 모든 것보다 우선한다. 장식이 읽기를 방해하면 장식을 뺀다.
2. **색은 의미일 때만.** 무채색이 기본이고, 색이 붙었다는 건 정답/오답/중요도 중 하나라는 뜻이다.
3. **도구처럼 보여야 한다.** 랜딩 페이지가 아니라 매일 여는 학습 도구다. 히어로 섹션·마케팅 카피를 만들지 않는다.

## AI 슬롭 안티패턴 — 하지 마라

| 금지 사항 | 이유 |
|-----------|------|
| backdrop-filter: blur() | glass morphism은 AI 템플릿의 가장 흔한 징후 |
| gradient-text (배경 그라데이션 텍스트) | AI가 만든 SaaS 랜딩의 1번 특징 |
| "Powered by AI" 배지 | 기능이 아니라 장식. 사용자에게 가치 없음 |
| box-shadow 글로우 애니메이션 | 네온 글로우 = AI 슬롭 |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰 |
| 모든 카드에 동일한 rounded-2xl | 균일한 둥근 모서리는 템플릿 느낌 |
| 배경 gradient orb (blur-3xl 원형) | 모든 AI 랜딩 페이지에 있는 장식 |
| 이모지 아이콘 (📚 ✅ 🚀) | 원본 PDF에는 있지만 UI에서는 쓰지 않는다 |

## 색상

다크모드 고정. `<html class="dark">` 같은 토글을 만들지 않는다.

### 배경
| 용도 | 값 |
|------|------|
| 페이지 | `#0a0a0a` |
| 카드 · 패널 | `#141414` |
| 선택된 보기 | `#1f1f1f` |
| 경계선 | `#262626` (neutral-800) |

### 텍스트
| 용도 | 값 |
|------|------|
| 제목 | `#fafafa` (neutral-50) |
| 본문 | `#d4d4d4` (neutral-300) |
| 보조 | `#a3a3a3` (neutral-400) |
| 비활성 | `#737373` (neutral-500) |

### 시맨틱 색상
| 용도 | 값 | 쓰는 곳 |
|------|------|------|
| 정답 | `#22c55e` | 정답 보기 테두리·아이콘, 정답 해설 |
| 오답 | `#ef4444` | 내가 고른 오답 보기 |
| 중요도 ★★★ | `#f59e0b` | 주제 목록의 별 표시 |
| 중요도 ★★☆ | `#a16207` | 주제 목록의 별 표시 |

이 네 가지 외에 새 색을 도입하지 마라.

## 컴포넌트

### 카드 (주제 목록 항목)
```
rounded-lg bg-[#141414] border border-neutral-800 p-5 hover:border-neutral-700
```

### 보기 버튼 (확인 문제)
```
기본:   w-full text-left rounded-md border border-neutral-800 bg-[#141414] px-4 py-3
선택:   border-neutral-600 bg-[#1f1f1f]
정답:   border-green-500/60 bg-green-500/5
오답:   border-red-500/60 bg-red-500/5
```
정답 공개 후에는 모든 보기를 비활성화한다. 다시 고를 수 없다.

### 버튼
```
Primary: rounded-md bg-neutral-100 text-neutral-900 px-4 py-2 hover:bg-white
Ghost:   rounded-md text-neutral-400 px-4 py-2 hover:text-neutral-100
```

### 진행률 표시
막대 하나. 퍼센트 숫자를 옆에 둔다.
```
h-1 rounded-full bg-neutral-800  /  내부: bg-neutral-300
```
원형 게이지·애니메이션 카운터를 만들지 마라.

## 레이아웃

- 주제 목록: `max-w-3xl`
- 개념 본문: `max-w-2xl` — 한 줄이 길어지면 읽기가 무너진다. 이 값을 넘기지 마라.
- 확인 문제: `max-w-2xl`
- 정렬: 좌측 정렬 기본. 본문을 중앙 정렬하지 마라.
- 간격: 요소 간 `gap-3`, 섹션 간 `space-y-8`

## 타이포그래피

| 용도 | 스타일 |
|------|--------|
| 페이지 제목 | `text-2xl font-semibold text-neutral-50` |
| 주제 제목 | `text-lg font-medium text-neutral-100` |
| 개념 이름 | `text-base font-medium text-neutral-100` |
| 한 줄 요약 | `text-sm text-neutral-400` |
| 본문 | `text-[15px] text-neutral-300 leading-7` |
| 라벨·메타 | `text-xs text-neutral-500` |

한글 본문에는 `break-keep`을 적용한다. 이유: 기본 줄바꿈은 한글 단어를 중간에서 끊는다.

## 애니메이션

- 정답 공개 시 해설 영역 fade-in (0.2s) — 이것 하나만 허용한다.
- `transition-colors` (150ms)는 hover에 한해 허용한다.
- 그 외 모든 애니메이션 금지. 페이지 전환 애니메이션을 만들지 마라.

## 아이콘

- SVG 인라인, `strokeWidth 1.5`, 크기 16px 또는 20px.
- 아이콘 라이브러리를 설치하지 마라. 필요한 몇 개만 직접 그린다.
- 아이콘을 둥근 배경 박스로 감싸지 않는다.
- 이모지를 아이콘으로 쓰지 않는다.
