# Render 배포 문제 해결 가이드

## Render 백엔드 배포 시 확인사항

### 1. 환경 변수 설정 (중요!)

Render의 Environment Variables 섹션에서 다음을 설정하세요:

**⚠️ 주의: 따옴표 없이 입력하세요!**

```
PORT=10000
NODE_ENV=production

DB_HOST=dpg-d5jv0bp4tr6s73b482s0-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_tgfj
DB_USER=order_app_db_tgfj_user
DB_PASSWORD=w9SiH8bX4wmJDIlOSAW41lZLBx8sV7Mi

CORS_ORIGIN=*
```

**❌ 잘못된 예:**
```
DB_HOST="dpg-d5jv0bp4tr6s73b482s0-a.oregon-postgres.render.com"  # 따옴표 제거!
DB_PASSWORD="w9SiH8bX4wmJDIlOSAW41lZLBx8sV7Mi"  # 따옴표 제거!
```

**✅ 올바른 예:**
```
DB_HOST=dpg-d5jv0bp4tr6s73b482s0-a.oregon-postgres.render.com
DB_PASSWORD=w9SiH8bX4wmJDIlOSAW41lZLBx8sV7Mi
```

### 2. Render Web Service 설정

- **Name**: `order-app-api` (원하는 이름)
- **Environment**: `Node`
- **Region**: 데이터베이스와 같은 지역
- **Branch**: `main`
- **Root Directory**: `server` ⚠️ 중요!
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 3. 데이터베이스 연결 문제

Render PostgreSQL은 SSL 연결이 필요합니다. 
현재 코드는 SSL 설정이 없을 수 있으니 확인이 필요합니다.

### 4. 일반적인 오류 메시지와 해결 방법

#### "Cannot connect to database"
- DB_HOST, DB_NAME, DB_USER, DB_PASSWORD 확인
- 따옴표 제거 확인
- Internal Database URL 사용 권장

#### "Port already in use"
- PORT 환경 변수를 제거하거나 Render가 자동 설정하도록 둠
- 또는 `PORT=10000` 설정

#### "Module not found"
- Root Directory가 `server`로 설정되었는지 확인
- package.json이 올바른 위치에 있는지 확인

#### "Build failed"
- Build Command가 `npm install`인지 확인
- Node.js 버전 호환성 확인
