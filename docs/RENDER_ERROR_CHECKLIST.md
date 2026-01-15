# Render 배포 오류 체크리스트

## Render에서 오류가 발생할 때 확인할 사항

### 1. Build Command 확인
```
Build Command: npm install
```

### 2. Start Command 확인
```
Start Command: npm start
```
또는
```
Start Command: node server.js
```

### 3. Root Directory 확인
```
Root Directory: server
```
⚠️ **반드시 `server`로 설정해야 합니다!**

### 4. Environment 확인
```
Environment: Node
```

### 5. 환경 변수 확인 (따옴표 없이!)

다음 변수들을 모두 추가했는지 확인:

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
- 앞뒤 공백이 없어야 합니다
- DB_PASSWORD 복사 시 공백이 포함되지 않았는지 확인

### 6. Render 로그 확인

Render 대시보드에서:
1. 서비스 선택
2. "Logs" 탭 클릭
3. 오류 메시지 확인

### 7. 일반적인 오류와 해결 방법

#### "Cannot find module"
**원인**: Root Directory가 잘못 설정됨
**해결**: Root Directory를 `server`로 설정

#### "Cannot connect to database"
**원인**: 
- 환경 변수에 따옴표가 포함됨
- DB_HOST 값이 잘못됨
- SSL 연결 문제

**해결**:
- 환경 변수에서 따옴표 제거
- 코드에 SSL 설정이 추가되어 있음 (확인됨)

#### "Port already in use"
**원인**: PORT 환경 변수 충돌
**해결**: PORT=10000 설정 또는 제거 (Render가 자동 설정)

#### "Build failed"
**원인**: 
- package.json이 잘못된 위치
- 의존성 설치 실패

**해결**: 
- Root Directory가 `server`인지 확인
- Build Command가 `npm install`인지 확인

#### "Application failed to respond"
**원인**: 
- Start Command가 잘못됨
- 서버가 제대로 시작되지 않음

**해결**: 
- Start Command를 `npm start` 또는 `node server.js`로 설정
- 로그에서 서버 시작 메시지 확인

### 8. 디버깅 방법

1. **로그 확인**: Render 대시보드 → 서비스 → Logs
2. **환경 변수 확인**: Settings → Environment
3. **빌드 로그 확인**: Deploys 탭 → 최신 배포 → Build Logs
4. **런타임 로그 확인**: Deploys 탭 → 최신 배포 → Runtime Logs

### 9. 단계별 확인

1. ✅ GitHub에 코드가 푸시되었는지 확인
2. ✅ Root Directory가 `server`로 설정되었는지 확인
3. ✅ Build Command가 `npm install`인지 확인
4. ✅ Start Command가 `npm start` 또는 `node server.js`인지 확인
5. ✅ 모든 환경 변수가 올바르게 설정되었는지 확인
6. ✅ 환경 변수 값에 따옴표가 없는지 확인
7. ✅ 로그에서 구체적인 오류 메시지 확인

### 10. 오류 메시지 공유

위의 모든 항목을 확인했는데도 오류가 발생한다면:
- Render 로그의 전체 오류 메시지를 복사
- 어떤 단계에서 실패했는지 (Build / Deploy / Runtime)
- 오류 메시지의 정확한 내용

이 정보를 공유해주시면 더 정확한 해결책을 제시할 수 있습니다.
