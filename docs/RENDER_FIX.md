# Render 배포 오류 해결

## 문제: Start Command 오류

### ❌ 잘못된 설정
```
Start Command: node index.js
```

### ✅ 올바른 설정

**방법 1 (권장):**
```
Start Command: npm start
```

**방법 2:**
```
Start Command: node server.js
```

## 이유

프로젝트의 진입점(entry point)은 `server.js`입니다.
- `package.json`의 `main` 필드: `"server.js"`
- `package.json`의 `start` 스크립트: `"node server.js"`

`index.js`는 `routes/index.js`로, 라우트 파일이지 서버 진입점이 아닙니다.

## Render 설정 요약

### 필수 설정
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start` 또는 `node server.js` ⚠️ **중요!**

### 환경 변수
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

**주의**: 따옴표 없이 입력하세요!
