# Render.com 배포 가이드

이 문서는 커피 주문 앱을 Render.com에 배포하는 방법을 설명합니다.

## 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 (API 서버) 배포**
3. **프런트엔드 (React 앱) 배포**

---

## 1단계: PostgreSQL 데이터베이스 생성

### 1.1 Render 대시보드에서 PostgreSQL 생성

1. Render.com에 로그인
2. 대시보드에서 "New +" 클릭 → "PostgreSQL" 선택
3. 설정 입력:
   - **Name**: `order-app-db` (원하는 이름)
   - **Database**: `order_app` (또는 기본값)
   - **User**: 자동 생성
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전 (14 이상 권장)
   - **Plan**: Free (또는 원하는 플랜)

4. "Create Database" 클릭

### 1.2 데이터베이스 연결 정보 확인

생성 후 다음 정보를 복사해두세요:
- **Host** (Internal Database URL에서)
- **Port**: 5432
- **Database**: `order_app` (또는 설정한 이름)
- **User**
- **Password** (자동 생성된 비밀번호)

또는 **Internal Database URL** 전체를 복사해두세요.

### 1.3 데이터베이스 스키마 실행

로컬에서 스키마를 실행하거나, Render PostgreSQL 콘솔에서 실행:

1. Render 대시보드에서 PostgreSQL 인스턴스 선택
2. "Connect" 탭 → "psql" 선택
3. 연결 후 `server/schema.sql` 파일의 내용을 실행

또는 로컬에서:
```bash
# 환경 변수 설정 후
psql "postgresql://user:password@host:5432/database" -f server/schema.sql
```

---

## 2단계: 백엔드 (API 서버) 배포

### 2.1 GitHub 저장소 준비

프로젝트를 GitHub에 푸시했는지 확인:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Render에서 Web Service 생성

1. Render 대시보드에서 "New +" → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정 입력:
   - **Project (Optional)**: `No` 또는 `None` (단일 서비스인 경우) / 또는 새 프로젝트 생성
   - **Name**: `order-app-api` (원하는 이름)
   - **Environment**: `Node`
   - **Region**: 데이터베이스와 같은 지역
   - **Branch**: `main` (또는 사용하는 브랜치)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Environment Variables** 섹션에서 다음 변수 추가:

```
PORT=10000
NODE_ENV=production

DB_HOST=<PostgreSQL Host>
DB_PORT=5432
DB_NAME=<Database Name>
DB_USER=<Database User>
DB_PASSWORD=<Database Password>

CORS_ORIGIN=<프런트엔드 URL (다음 단계에서 설정)>
```

**참고**: 
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`는 1단계에서 복사한 정보
- `CORS_ORIGIN`은 프런트엔드 URL (예: `https://order-app.onrender.com`)
- 초기에는 `CORS_ORIGIN=*`로 설정 후 프런트엔드 배포 후 업데이트 가능

5. "Create Web Service" 클릭

### 2.3 백엔드 배포 확인

배포가 완료되면:
- 서비스 URL 확인 (예: `https://order-app-api.onrender.com`)
- `https://<your-api-url>/api/menus` 접속하여 API 동작 확인

---

## 3단계: 프런트엔드 (React 앱) 배포

### 3.1 Static Site로 배포 (권장)

1. Render 대시보드에서 "New +" → "Static Site" 선택
2. GitHub 저장소 연결
3. 설정 입력:
   - **Name**: `order-app` (원하는 이름)
   - **Branch**: `main`
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables** 섹션에서:

```
VITE_API_URL=https://<백엔드-URL>
```

예: `VITE_API_URL=https://order-app-api.onrender.com`

5. "Create Static Site" 클릭

### 3.2 Web Service로 배포 (대안)

Static Site 대신 Web Service로도 배포 가능:

1. "New +" → "Web Service" 선택
2. 설정:
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build && npm install -g serve`
   - **Start Command**: `serve -s dist -l 10000`
   - **Instance Type**: Free

3. Environment Variables는 Static Site와 동일

---

## 4단계: CORS 설정 업데이트

### 4.1 백엔드 CORS_ORIGIN 업데이트

프런트엔드 배포 후 실제 URL을 확인하여:

1. 백엔드 서비스 → "Environment" 탭
2. `CORS_ORIGIN` 값을 프런트엔드 실제 URL로 업데이트
   - 예: `https://order-app.onrender.com`
3. "Save Changes" 클릭
4. 서비스 재배포 (자동 또는 수동)

---

## 5단계: 데이터베이스 스키마 재실행 (필요 시)

로컬에서 실행하지 못했다면:

1. Render PostgreSQL → "Connect" → "psql"
2. `server/schema.sql` 파일 내용 복사하여 실행
3. 또는 로컬에서 Render 외부 접속 URL로 연결

---

## 환경 변수 요약

### 백엔드 (API 서버)
```
PORT=10000
NODE_ENV=production
DB_HOST=<PostgreSQL Host>
DB_PORT=5432
DB_NAME=<Database Name>
DB_USER=<Database User>
DB_PASSWORD=<Database Password>
CORS_ORIGIN=<프런트엔드 URL>
```

### 프런트엔드 (React 앱)
```
VITE_API_URL=<백엔드 API URL>
```

---

## 문제 해결

### 데이터베이스 연결 오류
- Internal Database URL 사용 확인
- 환경 변수 올바르게 설정되었는지 확인
- 방화벽 설정 확인

### CORS 오류
- `CORS_ORIGIN` 환경 변수가 프런트엔드 URL과 정확히 일치하는지 확인
- 개발 환경에서는 `*` 사용 가능하지만, 프로덕션에서는 정확한 URL 권장

### 빌드 오류
- `package.json`의 의존성이 올바른지 확인
- Node.js 버전 호환성 확인
- 빌드 로그 확인

### 이미지가 표시되지 않음
- `public` 폴더의 이미지가 GitHub에 푸시되었는지 확인
- 이미지 경로가 `/`로 시작하는지 확인

---

## 참고 사항

- Render Free 플랜은 일정 시간 비활성 시 슬립 모드로 전환됨
- 첫 요청 시 약간의 지연이 있을 수 있음
- 데이터베이스 연결은 Internal Database URL 사용 권장 (더 빠름)
- 프로덕션 환경에서는 HTTPS 사용
