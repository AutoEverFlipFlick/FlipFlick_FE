# FlipFlick-FE (본 README는 아직 완성되지 않았습니다)

## 프로젝트 개요

FlipFlick-FE는 React와 TypeScript를 기반으로 한 프론트엔드 프로젝트입니다. Vite를 사용하여 빠른 개발 환경을 제공하며, 모던 웹 개발을 위한 다양한 도구와 라이브러리를 포함하고 있습니다.

## 기술 스택

### 핵심 기술

- **React 19**: 최신 버전의 React를 사용하여 UI 구성
- **TypeScript**: 타입 안정성을 제공하는 JavaScript 슈퍼셋
- **Vite**: 빠른 개발 서버와 최적화된 빌드를 제공하는 프론트엔드 도구

### 라우팅 및 상태 관리

- **React Router DOM**: 클라이언트 사이드 라우팅
- **Context API**: React 내장 상태 관리 (필요에 따라 확장 가능)

### 스타일링

- **Styled Components**: CSS-in-JS 라이브러리
- **CLSX**: 조건부 클래스 이름 관리

### 유틸리티

- **Axios**: HTTP 클라이언트
- **Dayjs**: 날짜 및 시간 처리
- **React-Toastify**: 알림 메시지 표시

### 개발 도구

- **Storybook**: UI 컴포넌트 개발 및 문서화
- **ESLint**: 코드 품질 및 스타일 검사
- **Prettier**: 코드 포맷팅
- **Vitest**: 테스트 프레임워크
- **Husky & Commitlint**: Git 훅 및 커밋 메시지 검증
- **Unplugin-Auto-Import**: 자동 임포트 기능
- **Unplugin-Icons**: 아이콘 자동 임포트

## 프로젝트 구조

```
src/
├── assets/         # 이미지, 폰트 등 정적 자산
├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── common/     # 공통 컴포넌트
│   └── feature/    # 기능별 컴포넌트
├── constants/      # 상수 정의
├── context/        # React Context 정의
├── domains/        # 도메인 모델 및 로직
├── hooks/          # 커스텀 React 훅
├── pages/          # 페이지 컴포넌트
├── router/         # 라우팅 설정
├── services/       # API 서비스 및 외부 통신
├── stories/        # Storybook 스토리
├── styles/         # 전역 스타일 및 테마
├── types/          # TypeScript 타입 정의
├── App.tsx         # 애플리케이션 루트 컴포넌트
└── main.tsx        # 애플리케이션 진입점
```

## 설치 및 설정

### 필수 조건

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/your-username/flipflick-fe.git
cd flipflick-fe

# 의존성 설치
npm install
# 또는
yarn install
```

## 사용 가능한 스크립트

```bash
# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 린트 검사
npm run lint

# 린트 오류 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# Storybook 실행 (http://localhost:6006)
npm run storybook

# Storybook 빌드
npm run build-storybook

# 테스트 실행
npm run test
```

## 개발 가이드라인

### 코드 스타일

- ESLint와 Prettier 설정을 따릅니다.
- 커밋 전에 `npm run lint` 및 `npm run format`을 실행하여 코드 품질을 유지합니다.

### 컴포넌트 개발

- 모든 UI 컴포넌트는 Storybook에 문서화합니다.
- 공통 컴포넌트는 `components/common` 디렉토리에 배치합니다.
- 특정 기능에 관련된 컴포넌트는 `components/feature` 디렉토리에 배치합니다.

### 타입 정의

- 모든 코드에 TypeScript 타입을 명시적으로 정의합니다.
- 공통 타입은 `types` 디렉토리에 정의합니다.

### 커밋 메시지

- Conventional Commits 형식을 따릅니다:
  - `feat:` 새로운 기능
  - `fix:` 버그 수정
  - `docs:` 문서 변경
  - `style:` 코드 스타일 변경 (기능 변경 없음)
  - `refactor:` 리팩토링 (기능 변경 없음)
  - `test:` 테스트 추가 또는 수정
  - `chore:` 빌드 프로세스 또는 도구 변경

## 테스트 (선택)

Vitest를 사용하여 단위 테스트 및 통합 테스트를 작성합니다. 테스트 파일은 관련 컴포넌트나 기능 근처에 `.test.ts` 또는 `.test.tsx` 확장자로 배치합니다.

```bash
# 모든 테스트 실행
npm run test

# 특정 테스트 파일 실행
npm run test -- path/to/test/file.test.ts
```

## 배포

프로젝트 배포 방법에 대한 지침을 추가하세요. 예:

```bash
# 프로덕션 빌드 생성
npm run build

# 빌드 결과물은 dist/ 디렉토리에 생성됩니다
```

## 기여 방법

1. 이슈를 생성하여 기능 요청 또는 버그 수정을 제안합니다.
2. 생성한 이슈 종류와 이슈 번호로 새 브랜치를 생성합니다:

- 기능 추가: `git checkout -b feat/#00`
- 버그 수정: `git checkout -b fix/#00`

3. 변경사항을 커밋합니다: Convertional Commits을 사용하거나 해당 규칙을 따릅니다.

- 예: `git commit -m "feat: 새로운 기능 추가 #00"`

4. 브랜치를 푸시합니다: `git push origin feature/amazing-feature`
5. GitHub에서 Pull Request를 생성합니다.

- 제목은 `[FEAT] 기능 설명` 또는 `[FIX] 기능 설명` 형식을 따릅니다.
- PR 설명에 변경사항과 관련된 이슈 번호를 명시합니다.
- 예: `이 PR은 #00 이슈를 해결합니다.`
- PR 템플릿을 사용하여 필요한 정보를 작성합니다.
- PR 제출자를 본인으로 지정하고 리뷰어를 지정합니다.
- PR이 승인되면 `main` 브랜치에 병합합니다.

현재 디렉토리 구조는 **도메인 중심 + 아토믹 구조**가 혼합된 **React + TypeScript + Vite** 프로젝트입니다. 각 디렉토리의 용도에 따라 **기능 추가, 리팩토링, 버그 수정 시 새 파일의
위치**는 다음 기준에 따릅니다:

---

## 상위 디렉토리 설명 및 파일 추가 위치 가이드

| 디렉토리                          | 용도                               | 언제/무엇을 추가하나?                                                                                              |
|-------------------------------|----------------------------------|-----------------------------------------------------------------------------------------------------------|
| `src/App.tsx`, `src/main.tsx` | 앱 진입점                            | 글로벌 레이아웃, 최상위 라우팅, Provider 주입 등 전역 설정 시 수정                                                               |
| `src/assets`                  | 정적 자산 (이미지 등)                    | **아이콘, 이미지, 폰트, 배경 등** 추가할 때 사용 <br> - `react.svg`는 예시 <br> - `styles/`는 CSS, 글로벌 스타일 또는 폰트 등 가능          |
| `src/components/common`       | 재사용 가능한 **UI 컴포넌트**              | 버튼, 모달, 토스트, 탭 등 **범용적 UI** 추가                                                                            |
| `src/components/feature`      | 특정 **도메인 종속 UI** 컴포넌트            | 유저 카드, 펫 뷰어, 게시판 등 특정 기능 전용 컴포넌트 추가                                                                       |
| `src/constants`               | 상수 정의                            | 정적 enum, URL, 메시지, 정규식, 마법 숫자/문자 제거용                                                                      |
| `src/context`                 | 전역 상태 관리 (React Context)         | 새로운 전역 상태 추가 시: `xxxContext.tsx` 작성 <br> ex) AuthContext, ThemeContext 등                                  |
| `src/domains`                 | 도메인 모델, 유즈케이스, 핵심 비즈니스 로직        | `user`, `pet`, `problem` 등 도메인 별로 하위 디렉토리 생성 후 entity, service, repository 작성 <br> → 핵심 로직 분리 및 테스트 가능 구조 |
| `src/hooks`                   | 커스텀 훅                            | `useModal.ts`, `useUserInfo.ts`, `useFetch.ts` 등 재사용 가능한 로직 작성                                            |
| `src/pages`                   | 라우트 단위 페이지 컴포넌트                  | 새로운 라우트 생성 시 이 디렉토리에 `Page` 단위 컴포넌트 작성 <br> ex) `HomePage.tsx`, `MyPage.tsx` 등                            |
| `src/router`                  | 라우팅 설정                           | 페이지 추가/변경 시 라우트도 여기에 정의 또는 갱신                                                                             |
| `src/services`                | 외부 API 호출 (Axios 등)              | `api/user.ts`, `api/problem.ts` 등 REST API 연결 서비스 작성                                                      |
| `src/stories`                 | Storybook 관련                     | 각 컴포넌트 스토리 및 데모용 예시 파일 작성                                                                                 |
| `src/styles`                  | 글로벌 CSS/Styled-component theme 등 | 테마, 공통 스타일, reset.css 등 작성                                                                                |
| `src/types`                   | 전역 타입 정의                         | 전역 공통 타입, 유틸 타입, API 응답 타입 등을 정의                                                                          |
| `src/auto-imports.d.ts`       | `unplugin-auto-import` 자동 생성 파일  | 건드리지 않아도 됨 (자동 관리)                                                                                        |

---

## 시나리오별 파일 추가 위치 예시

| 목적                              | 추가 위치                                                          |
|---------------------------------|----------------------------------------------------------------|
| 새로운 페이지 생성                      | `src/pages/SomePage.tsx`                                       |
| 페이지 라우팅 추가                      | `src/router/index.ts`                                          |
| 새로운 도메인 개념 도입 (예: Notification) | `src/domains/notification/` 내에 `model.ts`, `service.ts` 등      |
| 상태 관리 Context 추가                | `src/context/SomeContext.tsx`                                  |
| 공통 버튼/입력창 컴포넌트 추가               | `src/components/common/MyButton.tsx`                           |
| 도메인 특화 UI 컴포넌트 추가               | `src/components/feature/` 내에 `UserCard.tsx`, `PetViewer.tsx` 등 |
| REST API 연결                     | `src/services/xxxService.ts`                                   |
| 커스텀 훅 생성                        | `src/hooks/useXxx.ts`                                          |
| 정적 상수/enum                      | `src/constants/xxx.ts`                                         |
| 글로벌 스타일                         | `src/styles/global.css` 또는 styled-component theme 설정 등         |
| 이미지, 아이콘                        | `src/assets/` 또는 `src/assets/icons/` 등에 사용 도메인 위치의 폴더 구조 생성    |
| **라우트 정의**                      | `src/router/index.tsx`의 `<Routes>` 내부에 `<Route>` 정의            |
| **라우터 적용**                      | `src/App.tsx`          `<BrowserRouter>`로 감싸기                  |
| **페이지 컴포넌트**                    | `src/pages/`          각각의 URL에 대응되는 UI 컴포넌트                    |

---

## 기능추가/리팩토링/버그픽스 시 파일 위치 판단 기준

1. **재사용 목적 여부**
   → 재사용 가능하면 `common` 또는 `hooks`, 도메인 특화면 `feature`로

2. **관심사의 분리**
   → API 로직은 `services`, 상태 로직은 `context`, 핵심 비즈니스는 `domains`

3. **라우트 단위 or 컴포넌트 단위**
   → 라우팅 UI면 `pages`, 조립 UI면 `components`

4. **정적 vs 동적 자산**
   → `.svg`, `.png` 등은 `assets/`, 컴포넌트는 `components/`

---

## 라우팅 및 레이아웃, 페이지 구성 예시

- React Router v6 이상에서 권장되는 레이아웃 및 페이지 구성 방식으로 
  **공용 레이아웃과 개별 페이지 및 개별 레이아웃을 분리**하여 관리합니다.

```
<Routes>
  {/* 공용 레이아웃 적용 그룹 */}
  <Route element={<BaseLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/mypage" element={<MyPage />} />
    <Route path="/about" element={<AboutPage />} />
  </Route>

{/* 공용 레이아웃을 사용하지 않는 개별 페이지 및 별도 레이아웃 존재 시*/}
<Route element={<AuthLayout />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
</Route>
<Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## 기타

* **컴포넌트 단위는 Storybook을 만들면 `src/stories`에 작성하여 컴포넌트 단위로 랜더링 및 확인할 수 있음** 
* (자동 문서화 및 테스트 용이)
* `unplugin-auto-import`를 사용 중이므로 `import React from 'react'` 등은 생략 가능 (자동)
