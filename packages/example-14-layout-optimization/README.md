# 예제 14: 레이아웃 최적화 (Layout Optimization)

## 목적

브라우저 **레이아웃(Layout) 단계 최적화**를 독립적으로 학습하기 위한 예제입니다.
현재는 문서만 제공하며, 실습 코드는 추후 추가될 예정입니다.

---

## 구조

아래는 구현 예정 구조입니다.

- **Before 모드**

  - Layout Thrashing 발생 (읽기/쓰기 섞임)
  - 많은 DOM 요소에서 연쇄 리플로우 발생
  - 레이아웃 이동(CLS) 발생
  - 스크롤/애니메이션 중 끊김

- **After 모드**

  - DOM 읽기/쓰기를 분리해 레이아웃 계산 최소화
  - `transform` 중심으로 애니메이션 처리
  - `content-visibility`, `contain` 등으로 레이아웃 범위 제한
  - CLS 최소화를 위한 공간 예약

- **레이아웃**

  - Before/After 모드를 나란히 비교
  - 카드 리스트/그리드 레이아웃 변경 시 지연 체감
  - 레이아웃 이동과 스크롤 성능 비교

---

## 📚 이론: 레이아웃 최적화 원리와 전략

## 1. 개요 (Overview)

브라우저 렌더링 파이프라인에서 **Layout(레이아웃)**은
각 요소의 크기와 위치를 계산하는 단계입니다.
Layout은 비용이 크며, **불필요한 Layout 연산**이 성능 병목으로 이어집니다.

핵심 개념:

- **Reflow(Layout)**: 요소의 크기/위치 계산
- **Layout Thrashing**: 읽기/쓰기가 섞여 연쇄 레이아웃 발생
- **CLS (Cumulative Layout Shift)**: 레이아웃 이동으로 인한 UX 저하
- **Containment**: 레이아웃/페인트 범위를 제한

---

## 2. 레이아웃 최적화와 성능의 관계

### 2.1 Layout Thrashing 방지

- **Before**: DOM 읽기/쓰기가 섞여 연쇄 레이아웃 발생
- **After**: 읽기/쓰기 분리로 레이아웃 계산 최소화
- **효과**: 프레임 드랍 감소, 스크롤 부드러움 증가

### 2.2 CLS 감소

- **Before**: 이미지/폰트 로딩으로 레이아웃 이동
- **After**: 공간 예약, 고정 높이로 이동 방지
- **효과**: UX 안정성 향상, Core Web Vitals 개선

### 2.3 애니메이션 성능 개선

- **Before**: width/height 변경 애니메이션 → Layout 재계산
- **After**: transform/opacity 중심 애니메이션
- **효과**: 레이아웃 계산 감소, GPU 가속 활용

---

## 3. 문제 상황: Layout Thrashing

### ❌ Bad Case

```tsx
function resizeCards(cards) {
  cards.forEach((card) => {
    // 읽기
    const width = card.offsetWidth;
    // 쓰기
    card.style.width = `${width + 10}px`;
    // 다시 읽기
    const height = card.offsetHeight;
    // 다시 쓰기
    card.style.height = `${height + 10}px`;
  });
}
```

### 문제점

- 읽기/쓰기가 섞여 레이아웃 계산이 반복됨
- 많은 요소에서 연쇄 레이아웃이 발생
- 스크롤/애니메이션 끊김

---

## 4. 레이아웃 최적화 전략

### 4.1 읽기/쓰기 분리 (Measure → Mutate)

```tsx
function resizeCards(cards) {
  const sizes = cards.map((card) => ({
    width: card.offsetWidth,
    height: card.offsetHeight,
  }));

  cards.forEach((card, i) => {
    card.style.width = `${sizes[i].width + 10}px`;
    card.style.height = `${sizes[i].height + 10}px`;
  });
}
```

**장점:**

- 레이아웃 계산 횟수 최소화
- Layout Thrashing 방지

### 4.2 rAF로 배치 (Frame 단위로 묶기)

```tsx
function animate(cards) {
  requestAnimationFrame(() => {
    // 읽기
    const rects = cards.map((card) => card.getBoundingClientRect());
    // 쓰기
    cards.forEach((card, i) => {
      card.style.transform = `translateY(${rects[i].top * 0.1}px)`;
    });
  });
}
```

### 4.3 레이아웃 범위 제한 (contain, content-visibility)

```css
.card-list {
  contain: layout paint;
  content-visibility: auto;
}
```

- 레이아웃 범위를 컴포넌트 내부로 제한
- 화면 밖 요소는 렌더링 스킵

### 4.4 CLS 방지 (공간 예약)

```html
<img src="/banner.jpg" width="1200" height="400" alt="banner" />
```

```css
.media {
  aspect-ratio: 3 / 1;
}
```

---

## 5. 애니메이션 최적화

### ❌ Bad Case: 레이아웃 변경

```css
.box {
  transition: width 300ms ease;
}
```

### ✅ Good Case: transform 사용

```css
.box {
  transition: transform 300ms ease;
  will-change: transform;
}
```

**주의사항:**

- `will-change`는 남발하지 않기
- GPU 레이어가 과도하게 늘어나면 메모리 증가

---

## 6. 주의사항

- 레이아웃 최적화는 **레거시 DOM 구조와 CSS에 강하게 의존**
- `offsetWidth`, `getBoundingClientRect`는 **강제 동기 레이아웃** 유발 가능
- 레이아웃 변경이 잦은 컴포넌트는 **가상화/메모이제이션**도 병행 고려

---

## 7. 실전 적용 체크리스트

- DOM 읽기/쓰기가 섞여 있는가? → 분리
- 레이아웃 이동(CLS)이 발생하는가? → 공간 예약
- 애니메이션에 width/height/top/left를 쓰는가? → transform/opacity로 변경
- 긴 리스트가 있는가? → `content-visibility`/가상화 고려
- layout scope가 넓은가? → `contain` 적용

---

## 실행 방법

현재 예제 코드는 준비 중입니다. 코드가 추가되면 실행 방법을 업데이트하겠습니다.

---

## 측정 방법

### 1. Performance 패널

- Chrome DevTools > Performance > Record
- Layout 이벤트와 메인 스레드 점유 시간 확인

### 2. Layout Shift 확인

- Chrome DevTools > Performance Insights 또는 Lighthouse
- CLS 점수 및 이동 원인 요소 확인

### 3. 스크롤 체감

- 카드 리스트/그리드 레이아웃 변경 시 프레임 드랍 비교
- 애니메이션 중 UI 끊김 여부 확인

---

## 핵심 요약

- 레이아웃은 비용이 큰 단계이므로 **읽기/쓰기 분리**가 핵심
- **transform 중심 애니메이션**으로 Layout 재계산을 피함
- `contain`, `content-visibility`로 레이아웃 범위를 제한
- CLS는 공간 예약과 고정 비율로 예방

---

## 📚 참고 자료 (References)

**Layout 최적화**

- [Web.dev: Avoid Layout Thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)
- [Web.dev: CLS](https://web.dev/cls/)
- [MDN: contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
- [MDN: content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

**렌더링 파이프라인**

- [Web.dev: Rendering Performance](https://web.dev/rendering-performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
