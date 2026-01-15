# Render 백엔드 배포 설정 가이드

## Render Web Service 설정

### 1. 기본 설정

- **Name**: `order-app-api`
- **Environment**: `Node`
- **Region**: 데이터베이스와 동일한 지역 (예: Oregon)
- **Branch**: `main`
- **Root Directory**: `server` ⚠️ **반드시 설정!**

### 2. 빌드 및 시작 명령어

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 3. 환경 변수 설정

**⚠️ 중요: 따옴표 없이 입력하세요!**

Environment Variables 섹션에 다음을 추가:

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

**주의사항:**
- 값에 따옴표(`"` 또는 `'`)를 넣지 마세요
- 공백이 없도록 주의하세요
- DB_PASSWORD는 복사할 때 앞뒤 공백이 없는지 확인하세요

### 4. 일반적인 오류와 해결

#### 오류: "Cannot connect to database"
**원인**: 
- 환경 변수에 따옴표가 포함됨
- DB_HOST 값이 잘못됨
- SSL 연결 설정 누락

**해결**:
- 환경 변수에서 따옴표 제거
- 코드에 SSL 설정 추가됨 (이미 반영됨)

#### 오류: "Module not found"
**원인**: Root Directory가 잘못 설정됨

**해결**: Root Directory를 `server`로 설정

#### 오류: "Port already in use"
**원인**: PORT 환경 변수 충돌

**해결**: PORT=10000 설정 또는 Render가 자동 설정하도록 둠

### 5. 배포 후 확인

배포가 완료되면:
1. 서비스 URL 확인 (예: `https://order-app-api.onrender.com`)
2. `https://<your-url>/api/menus` 접속하여 API 동작 확인
3. 로그에서 데이터베이스 연결 성공 메시지 확인
