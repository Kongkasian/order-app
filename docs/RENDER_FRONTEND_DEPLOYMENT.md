# Render 프런트엔드 배포 가이드

이 문서는 UI 폴더의 React + Vite 프런트엔드를 Render.com에 배포하는 방법을 설명합니다.

## 배포 전 준비사항

### 1. 백엔드 서비스 URL 확인
- Render 대시보드에서 백엔드 서비스 URL 확인
- 예: `https://order-app-backend.onrender.com`

### 2. 코드 확인
- API URL은 이미 환경 변수로 설정되어 있습니다 (`VITE_API_URL`)
- `ui/src/App.jsx`의 5번째 줄을 확인하세요:
  ```javascript
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  ```

## Render에 Static Site 배포

### 1. Render 대시보드 접속
- [Render Dashboard](https://dashboard.render.com)에 로그인

### 2. 새 Static Site 생성
- **"New +"** 버튼 클릭
- **"Static Site"** 선택

### 3. Git 저장소 연결
- **Connect GitHub** 또는 **Connect GitLab** 선택
- `order-app` 저장소 선택
- **Branch**: `main` 선택

### 4. 프로젝트 설정 입력

#### 기본 정보
- **Name**: `order-app-frontend` (원하는 이름)
- **Branch**: `main`

#### 빌드 설정
- **Root Directory**: `ui`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### 환경 변수 설정
- **Environment** 섹션에서 **"Add Environment Variable"** 클릭
- 다음 환경 변수 추가:

```
Key: VITE_API_URL
Value: https://order-app-backend.onrender.com
```

> ⚠️ **주의**: `Value`에는 Render 백엔드 서비스의 실제 URL을 입력하세요.

### 5. 배포 시작
- **"Create Static Site"** 버튼 클릭
- 배포가 자동으로 시작됩니다 (약 2-3분 소요)

## 배포 확인

### 1. 배포 완료 후
- Render 대시보드에서 배포 상태 확인
- **"Live"** 상태가 되면 배포 완료

### 2. 프런트엔드 URL 확인
- 배포된 사이트 URL 예: `https://order-app-frontend.onrender.com`
- 이 URL을 클릭하여 앱이 정상 작동하는지 확인

### 3. API 연결 확인
- 브라우저 개발자 도구 (F12) → Network 탭 열기
- 메뉴 로드 시 `/api/menus` 요청이 백엔드로 전송되는지 확인
- CORS 오류가 발생하지 않는지 확인

## 문제 해결

### 1. API 연결 오류 (CORS 오류)
**증상**: 브라우저 콘솔에 CORS 오류 메시지

**해결 방법**:
1. 백엔드 서비스의 `CORS_ORIGIN` 환경 변수 확인
2. Render 백엔드 서비스의 Environment 변수에 다음 추가:
   ```
   CORS_ORIGIN=https://order-app-frontend.onrender.com
   ```
3. 백엔드 서비스 재배포

### 2. 환경 변수가 적용되지 않음
**증상**: API 요청이 여전히 `localhost:3001`로 전송됨

**해결 방법**:
1. Render에서 `VITE_API_URL` 환경 변수가 올바르게 설정되었는지 확인
2. Static Site를 재배포 (환경 변수 변경 후 반드시 재배포 필요)
3. 빌드 로그에서 환경 변수가 제대로 전달되었는지 확인

### 3. 빌드 실패
**증상**: Render 배포 로그에 빌드 오류

**해결 방법**:
1. 로컬에서 빌드 테스트:
   ```bash
   cd ui
   npm install
   npm run build
   ```
2. 빌드 오류가 있으면 수정 후 커밋 & 푸시
3. `package.json`의 빌드 스크립트 확인: `"build": "vite build"`

### 4. 이미지가 표시되지 않음
**증상**: 메뉴 이미지가 로드되지 않음

**해결 방법**:
1. `public` 폴더의 이미지 파일들이 Git에 포함되어 있는지 확인
2. 이미지 경로가 상대 경로로 올바르게 설정되어 있는지 확인

## 추가 설정 (선택사항)

### 커스텀 도메인
- Render 대시보드 → Static Site → Settings → Custom Domains
- 도메인을 추가하고 DNS 설정을 따라하세요

### 자동 배포 설정
- 기본적으로 `main` 브랜치에 푸시할 때마다 자동 배포됩니다
- 특정 브랜치만 배포하려면 Settings → Build & Deploy에서 설정 변경

## 로컬 개발 시 환경 변수 사용

### 개발용 .env 파일 생성 (선택사항)
`ui/.env.local` 파일을 생성하고 다음 내용 추가:
```
VITE_API_URL=http://localhost:3001
```

> ⚠️ `.env.local` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다.

## 배포 후 확인 체크리스트

- [ ] 프런트엔드 사이트가 정상적으로 로드됨
- [ ] 메뉴 목록이 정상적으로 표시됨
- [ ] 주문 기능이 정상적으로 작동함
- [ ] 관리자 화면이 정상적으로 작동함
- [ ] 백엔드 API와 통신이 정상적으로 이루어짐 (Network 탭 확인)
- [ ] 브라우저 콘솔에 오류가 없음

## 유용한 명령어

```bash
# 로컬 빌드 테스트
cd ui
npm install
npm run build

# 빌드 결과 확인 (로컬)
npm run preview

# 환경 변수 확인 (빌드 시)
# .env 파일 또는 환경 변수가 빌드 타임에 주입됨
```

## 참고사항

- Vite의 환경 변수는 빌드 타임에 주입됩니다
- 런타임에 환경 변수를 변경하려면 코드 수정이 필요합니다
- 환경 변수는 `VITE_` 접두사로 시작해야 클라이언트 번들에 포함됩니다
- `import.meta.env.VITE_API_URL`로 접근합니다
