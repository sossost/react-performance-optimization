# 예제 3: 리소스 최적화 (Resource Optimization)

## 목적

이미지, 폰트 등 정적 리소스의 로딩 성능을 최적화하는 기법을 학습합니다.

## 구조

Before와 After를 별도 프로젝트로 분리하여 초기 로딩 속도와 리소스 크기를 명확하게 비교할 수 있습니다.

- **`before/`**: 최적화 전 (원본 고용량 이미지, 시스템 폰트 혹은 비효율적 폰트 로딩)
- **`after/`**: 최적화 후 (WebP/AVIF, 폰트 서브셋, Lazy Loading, CLS 방지 적용)

---

## 📚 이론: 리소스 최적화 원리와 전략

### 1. 개요 (Overview)

웹 페이지 로딩 시간의 대부분은 HTML/JS 코드가 아닌 **이미지와 폰트 등 정적 리소스 다운로드**에 소요됩니다. 이를 최적화하면 **LCP(Largest Contentful Paint)** 점수를 획기적으로 개선할 수 있습니다.

### 2. 이미지 최적화

#### 2.1. 차세대 이미지 포맷 (Format)

| 포맷     | 특징        | 장점                        | 단점                            |
| :------- | :---------- | :-------------------------- | :------------------------------ |
| **JPEG** | 손실 압축   | 범용성 좋음                 | 투명도 미지원                   |
| **PNG**  | 무손실 압축 | 투명도 지원                 | 용량이 큼                       |
| **WebP** | 구글 개발   | JPEG 대비 **30% 이상 작음** | 구형 브라우저(IE) 미지원        |
| **AVIF** | 최신 코덱   | WebP 대비 **50% 더 작음**   | 인코딩 느림, 최신 브라우저 필요 |

**권장 전략 (`<picture>` 태그 활용):**

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="제품 이미지" />
</picture>
```

#### 2.2. 레이아웃 이동(CLS) 방지 [중요]

이미지 로드 전 공간을 확보하지 않으면, 로드 후 화면이 밀리는 **CLS(Cumulative Layout Shift)** 현상이 발생합니다.

**해결책:** 반드시 `width`와 `height` 속성을 명시하거나 CSS로 `aspect-ratio`를 설정해야 합니다.

```html
<img src="photo.webp" width="800" height="600" alt="사진" />
```

#### 2.3. Lazy Loading (지연 로딩)

화면에 보이지 않는 이미지는 나중에 로드하여 초기 로딩 속도를 높입니다.

**Native Lazy Loading:**

```html
<img src="image.jpg" loading="lazy" alt="..." />
```

**주의:** 페이지 최상단(LCP 대상) 이미지에는 `lazy`를 적용하면 안 됩니다! (`eager` 혹은 기본값 사용)

### 3. 폰트 최적화

#### 3.1. 폰트 포맷

- **WOFF2 (권장):** 압축률이 가장 높음 (Web Open Font Format 2)
- **WOFF:** WOFF2 미지원 브라우저용 Fallback
- **TTF/OTF:** 웹용으로는 용량이 커서 비권장

#### 3.2. FOIT vs FOUT 방지 (`font-display`)

폰트 다운로드 중에 텍스트를 어떻게 보여줄지 결정합니다.

```css
@font-face {
  font-family: "MyFont";
  src: url("font.woff2") format("woff2");
  /* swap: 폰트 로드 전에는 시스템 폰트로 글자를 보여줌 (빈 화면 방지) */
  font-display: swap;
}
```

#### 3.3. 서브셋(Subset) 폰트

한글 폰트는 용량이 큽니다(약 2~3MB). 실제로 사용하는 글자("갂", "갃" 같은 안 쓰는 글자 제외)만 남겨 용량을 줄입니다.

- **결과:** 3MB → 300KB (약 90% 감소)
- **도구:** `pyftsubset` 또는 웹 기반 `Transfonter` 등 사용

### 4. 네트워크 및 전송 최적화

#### 4.1. 압축 (Gzip / Brotli)

서버에서 텍스트 기반 리소스(HTML, CSS, JS)를 압축해서 보냅니다.

- **Gzip:** 표준, 호환성 좋음
- **Brotli (`br`):** Gzip보다 약 15~20% 더 압축률이 좋음 (HTTPS 필수)

#### 4.2. Preconnect & Preload

외부 도메인(CDN, Google Fonts) 연결을 미리 맺어둡니다.

```html
<link
  rel="preconnect"
  href="[https://fonts.googleapis.com](https://fonts.googleapis.com)"
/>
<link
  rel="preconnect"
  href="[https://fonts.gstatic.com](https://fonts.gstatic.com)"
  crossorigin
/>
```

---

## 실행 방법

> **참고:** 루트에서 `yarn install`을 수행해야 합니다.

### Before (최적화 전)

```bash
# 루트에서 실행
yarn dev:e3:before
# 접속: http://localhost:5173

```

- 고해상도 JPG 원본 로드 (총 약 13MB)
- 시스템 폰트 사용
- 모든 이미지가 한 번에 로드됨 (Lazy Loading 없음)
- width/height 미지정 (CLS 발생 가능)

### After (최적화 후)

```bash
# 루트에서 실행
yarn dev:e3:after
# 접속: http://localhost:5174

```

- WebP/AVIF 변환 이미지 로드 (총 약 2.9MB, 약 77% 용량 감소)
- 서브셋 WOFF2 폰트 로드
- `loading="lazy"` 및 `font-display: swap` 적용
- width/height 지정 및 aspectRatio 설정 (CLS 방지)

---

## 측정 방법

### 1. Network 탭 분석 (용량 비교)

1. 크롬 개발자 도구 > **Network** 탭 클릭
2. **"Disable cache"** 체크 (필수)
3. 필터를 **Img**로 설정 후 새로고침

**예상 결과:**

- **Before:** `hero.jpg` (약 3.3MB), `photo1.jpg` (약 1.7MB), `photo2.jpg` (약 6.3MB), `photo3.jpg` (약 1.8MB) 등 대용량 파일 전송 (총 약 13MB)
- **After:** `hero.avif` (약 222KB), `photo1.avif` (약 505KB), `photo2.avif` (약 1.7MB), `photo3.avif` (약 504KB) 등 용량 **약 77% 감소** 확인 (총 약 2.9MB)

**참고:** 로컬 개발 환경에서는 파일이 로컬 디스크에 있어 네트워크 지연이 거의 없어 로딩이 빠르게 보일 수 있습니다. 실제 서버 환경이나 느린 네트워크에서는 용량 차이가 더 명확하게 드러납니다.

### 2. Lighthouse 측정 (점수 비교)

1. 개발자 도구 > **Lighthouse** 탭
2. **Navigation** 모드 > **Analyze page load** 클릭

**주요 확인 지표:**

- **LCP (Largest Contentful Paint):** 이미지 용량 감소로 인해 시간이 단축되었는가?
- **CLS (Cumulative Layout Shift):** 이미지 `width/height` 지정으로 레이아웃 흔들림이 없는가?

**참고:** 로컬 개발 환경에서는 파일이 로컬 디스크에 있어 Before와 After의 성능 점수 차이가 크지 않을 수 있습니다. 프로덕션 빌드 후 preview에서 측정하거나, Network 탭에서 "Slow 3G"로 시뮬레이션하면 더 명확한 차이를 확인할 수 있습니다.

---

## 주요 코드 변경점

### 이미지 처리 (`components/ImageGallery.tsx`)

```tsx
// Before
<img src="/images/hero.jpg" alt="Hero 이미지" />
// width/height 미지정, Lazy Loading 없음

// After
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img
    src="/images/hero.jpg"
    alt="Hero 이미지"
    loading="eager" // LCP 이미지는 즉시 로드
    width={1200}
    height={800}
    style={{ aspectRatio: "1200/800" }} /* CLS 방지 */
  />
</picture>

// 화면 밖 이미지는 lazy loading 적용
<img
  src="/images/photo1.jpg"
  alt="사진 1"
  loading="lazy" // 화면 밖 이미지는 지연 로딩
  width={800}
  height={600}
  style={{ aspectRatio: "800/600" }}
/>
```

### 폰트 적용 (`index.css`)

```css
/* After */
@font-face {
  font-family: "Pretendard";
  src: url("/fonts/Pretendard-Subset.woff2") format("woff2");
  font-display: swap; /* 텍스트가 안 보이는 시간(FOIT) 제거 */
}
```

---

## 📚 참고 자료 (References)

- [Web.dev: Fast Load Times](https://web.dev/fast/) - 이미지 및 리소스 로딩 속도 최적화 가이드 (Google)
- [Web.dev: CLS (Cumulative Layout Shift)](https://web.dev/cls/) - 이미지 크기 미지정 시 발생하는 레이아웃 이동 문제와 해결책
- [MDN: Lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) - `loading="lazy"` 속성과 브라우저 호환성
- [MDN: font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) - 폰트 로딩 중 텍스트가 안 보이는 현상(FOIT) 방지법
- [Naver D2: 웹 폰트 로딩 최적화](https://d2.naver.com/helloworld/4969726) - 한글 폰트 서브셋(Subset)과 경량화 기법 상세 분석
- [Cloudflare: What is HTTP/2?](https://www.cloudflare.com/learning/performance/http2-vs-http1.1/) - HTTP/2 멀티플렉싱이 리소스 로딩에 미치는 영향
