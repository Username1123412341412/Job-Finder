# 숨은 강자 - 자동차 B2B 기업 탐험

자동차 산업 취업준비생이 일반인에게 덜 알려진 자동차 분야의 알짜 중견기업·대기업을 키워드 검색과 7대 분야별 카테고리로 발견하고 공급망 위치를 이해하도록 돕는 모바일 우선 읽기 전용 웹 애플리케이션입니다.

---

## 🌟 핵심 특징

1. **엄격한 사실 출처 검증 (No AI Hallucination)**
   - 생성형 AI 모델을 통한 기업 정보 생성·보충·해석을 전면 배제합니다.
   - 모든 사실 필드(티어, 제품, 고객사, 매출, 직원 수, 설립연도, 소재지, 규모 구분, 키워드)는 `source_url`과 `source_date(기준일)`가 완전히 갖추어진 경우에만 노출합니다.
   - 근거가 없는 필드는 그럴듯한 문구로 채우지 않고 **[확인된 정보 없음]**으로 정직하게 표기합니다.
   - 6개월 이상 경과한 출처 정보에는 **[오래된 정보]** 경고 배지를 자동 부착합니다.

2. **공급망 티어(Tier) 및 공급처 관계 투명성**
   - 1·2차 부품사 공급망 위치와 납품처는 `confirmed(확인됨)` / `estimated(추정)` 상태를 구분하며, 추정 정보에는 반드시 구체적인 근거 문구가 함께 표시됩니다.
   - 대기업/중견기업 규모 구분 근거가 불충분한 기업은 기본 목록에서 제외하고 **[검토 대기]** 탭에서만 분리 열람할 수 있습니다.

3. **순수 정적 GitHub 저장소 JSON 데이터 소스 연동**
   - 클라이언트에 일체의 비밀키나 API 토큰을 보관하지 않으며, 공개 GitHub 저장소의 정적 JSON을 호출합니다.
   - 비인증 요청 한도 보호 및 오프라인 대응을 위한 `localStorage` 지능형 캐시를 지원합니다.
   - Zod 스키마 검증을 통해 스키마에 맞지 않는 레코드는 자동 격리되어 **[데이터 오류 목록]**에서 확인할 수 있습니다.

4. **검수 및 기여 친화적 워크플로우**
   - **로컬 JSON 미리보기**: 로컬에서 작성 중인 `companies.json`을 업로드하여 배포 전 화면을 즉시 검수할 수 있습니다.
   - **정보 수정 제안**: 각 기업 상세 화면에서 GitHub Issues 템플릿으로 바로 이동하여 정정 및 출처 추가를 제안할 수 있습니다.

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Icons**: Lucide React
- **Schema Validation**: Zod
- **Build & Dev Tool**: Vite

---

## 🚀 로컬 개발 환경 실행 방법

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

---

## ⚙️ 저장소 연동 설정 (`src/config.ts`)

데이터를 제공할 공개 GitHub 저장소를 생성한 후 `src/config.ts` 파일의 TODO 항목을 수정합니다.

```typescript
// src/config.ts
export const GITHUB_CONFIG = {
  // 본인의 GitHub 사용자명 또는 조직명 입력
  OWNER: "your-github-username",

  // 데이터 파일이 위치한 저장소명 입력
  REPO: "automotive-b2b-data",

  // 브랜치명 (기본값: "main")
  BRANCH: "main",

  // JSON 파일이 위치한 폴더 경로 (기본값: "data")
  DATA_PATH: "data",
};
```

> **참고**: `OWNER`와 `REPO`가 비어있을 때는 앱이 안전 모드로 동작하여 내장된 가상 샘플 데이터 4건(`[샘플] 예시샤시공업 주식회사` 등)을 화면에 표시합니다.

---

## 📂 데이터 저장소 파일 구조

데이터 저장소에는 다음과 같은 3개의 JSON 파일이 포함되어야 합니다 (`data/` 디렉토리):

1. **`data/companies.json`**: 수록 기업 배열 (스키마: `src/schemas.ts` 참조)
2. **`data/keywords.json`**: 검색 키워드 사전 (대표어, 동의어, 관련 부품/기술어)
3. **`data/meta.json`**: 데이터 버전, 마지막 갱신일, 숨은 기업 선정 기준, 카테고리 정의, 공식 면책 고지

---

## 🌐 GitHub Pages 등 정적 호스팅 배포 방법

본 앱은 정적 웹 애플리케이션으로 빌드되므로 GitHub Pages, Vercel, Netlify, Cloudflare Pages 등 모든 정적 호스팅 환경에 손쉽게 배포할 수 있습니다.

### GitHub Pages 배포 예시:

1. `vite.config.ts`에 base 경로를 추가합니다 (저장소 이름이 `auto-b2b-explorer`인 경우):
   ```typescript
   export default defineConfig({
     base: '/auto-b2b-explorer/',
     // ...
   });
   ```

2. 프로덕션 빌드:
   ```bash
   npm run build
   ```

3. 빌드 결과물(`dist` 폴더)을 `gh-pages` 브랜치에 배포하거나 GitHub Actions 워크플로우를 이용합니다:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
   ```

---

## 📄 라이선스 및 고지사항

- **면책 고지**: 본 서비스는 공개된 사업보고서, 공시, 공식 보도자료를 사람이 검토하여 정리한 참고용 정보입니다. 티어 및 납품 관계는 추정치일 수 있으므로 최종 지원 및 투자 결정 전 각 기업의 공식 채널을 확인하시기 바랍니다.
- **채용 연계**: 본 서비스는 채용 공고를 직접 수집하거나 가공하지 않으며, 각 기업의 공식 채용 홈페이지 또는 공식 검색 링크로만 직접 연결합니다.
